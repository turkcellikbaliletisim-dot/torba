import { NextRequest, NextResponse } from 'next/server';
import { PaymentIntentSchema } from '@/lib/validation/schemas';
import { defaultPaymentProvider } from '@/lib/services/payment-provider-adapter';
import { logAuditEvent } from '@/lib/services/audit-service';
import { requireAuth } from '@/lib/auth/guard';
import { acquireIdempotencyLock, saveIdempotentResult, releaseIdempotencyLock } from '@/lib/services/idempotency-service';
import { getDbPool } from '@/lib/db';

export async function POST(request: NextRequest) {
  const pool = getDbPool();
  let client;

  try {
    // 1. Enforce Authentication Guard
    const auth = await requireAuth(request);
    if (!auth.isAuthenticated || !auth.user) {
      return auth.errorResponse || NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 401 });
    }

    const rawBody = await request.json();

    // 2. Zod Schema Validation
    const validation = PaymentIntentSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { merchantId, branchId, amountMinor, paymentType, idempotencyKey } = validation.data;

    // 3. Acquire Atomic Idempotency Lock via Redis SET NX EX (Item 4.2)
    const lockResult = await acquireIdempotencyLock(idempotencyKey, rawBody, 60);

    if (lockResult.conflict) {
      return NextResponse.json(
        { success: false, error: '409 Conflict: Aynı Idempotency Key farklı bir istek içeriği ile kullanılamaz.' },
        { status: 409 }
      );
    }

    if (!lockResult.acquired && lockResult.existingRecord) {
      if (lockResult.existingRecord.state === 'PROCESSING') {
        return NextResponse.json(
          { success: false, error: 'İşleminiz şu anda işleniyor. Lütfen bekleyin.' },
          { status: 425 }
        );
      }
      return NextResponse.json(
        lockResult.existingRecord.responseBody,
        { status: lockResult.existingRecord.statusCode || 200 }
      );
    }

    const orderId = `ord-${Date.now()}`;
    const localPaymentId = `pay-${orderId}`;

    // Calculate Commission Snapshot (300 basis points = 3%)
    const commissionBasisPoints = 300;
    const grossAmount = BigInt(amountMinor);
    const commissionAmount = (grossAmount * BigInt(commissionBasisPoints)) / 10000n;
    const netPayoutAmount = grossAmount - commissionAmount;

    // 4. Fail-Closed Local PENDING Payment DB Insert with Commission Snapshot (Section 1 & 7)
    let isDbCreated = false;
    try {
      client = await pool.connect();
      await client.query(
        `INSERT INTO payments (id, merchant_id, user_id, amount_minor, commission_basis_points, commission_amount_minor, net_payout_minor, currency, status, idempotency_key, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'TRY', 'PENDING', $8, NOW())
         ON CONFLICT (id) DO NOTHING`,
        [
          localPaymentId,
          merchantId,
          auth.user.userId,
          amountMinor.toString(),
          commissionBasisPoints,
          commissionAmount.toString(),
          netPayoutAmount.toString(),
          idempotencyKey,
        ]
      );
      isDbCreated = true;
    } catch (dbErr) {
      // Fail-Closed: DO NOT call payment provider if DB insert fails! (Item 4.3)
      await releaseIdempotencyLock(idempotencyKey);
      return NextResponse.json(
        { success: false, error: 'Veritabanı erişim hatası nedeniyle ödeme başlatılamadı (Fail-Closed Guard).' },
        { status: 503 }
      );
    } finally {
      if (client) client.release();
    }

    // 5. Execute Payment Provider Call
    const correlationId = `corr-${Date.now()}`;
    const providerResult = await defaultPaymentProvider.createPayment({
      orderId,
      amountMinor: BigInt(amountMinor),
      currency: 'TRY',
      buyerIp: request.headers.get('x-forwarded-for') || '127.0.0.1',
      correlationId,
    });

    if (!providerResult.success) {
      if (isDbCreated) {
        try {
          await pool.query('UPDATE payments SET status = $1 WHERE id = $2', ['FAILED', localPaymentId]);
        } catch (e) {}
      }

      const failResponse = { success: false, error: providerResult.errorMessage || 'Ödeme kuruluşu reddetti.' };
      await saveIdempotentResult(idempotencyKey, rawBody, 'FAILED_FINAL', 502, failResponse);
      return NextResponse.json(failResponse, { status: 502 });
    }

    // Update status to WAITING_3DS / PENDING in DB with provider payment ID
    if (isDbCreated) {
      try {
        await pool.query(
          'UPDATE payments SET status = $1, provider_payment_id = $2 WHERE id = $3',
          [providerResult.status, providerResult.providerPaymentId, localPaymentId]
        );
      } catch (e) {}
    }

    const responseData = {
      success: true,
      message: 'Ödeme başlatıldı.',
      data: {
        paymentId: localPaymentId,
        providerPaymentId: providerResult.providerPaymentId,
        status: providerResult.status,
        amountMinor,
        branchId,
        commissionBasisPoints,
        idempotencyKey,
        correlationId,
      },
    };

    // Save Completed Idempotency Result
    await saveIdempotentResult(idempotencyKey, rawBody, 'COMPLETED', 200, responseData);

    // Audit Log
    await logAuditEvent({
      actorId: auth.user.userId,
      action: 'PAYMENT_INTENT_CREATED',
      resourceType: 'PAYMENT',
      resourceId: localPaymentId,
      metadata: { merchantId, branchId, amountMinor, commissionBasisPoints, paymentType, idempotencyKey, correlationId },
    });

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Ödeme başlatılamadı.' },
      { status: 500 }
    );
  }
}
