import { NextRequest, NextResponse } from 'next/server';
import { PaymentIntentSchema } from '@/lib/validation/schemas';
import { initPayment } from '@/lib/services/payment-gateway';
import { logAuditEvent } from '@/lib/services/audit-service';
import { requireAuth } from '@/lib/auth/guard';
import { getIdempotentResult, saveIdempotentResult } from '@/lib/services/idempotency-service';

export async function POST(request: NextRequest) {
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

    // 3. Check Idempotency Key Lock (24h TTL)
    const existingResult = await getIdempotentResult(idempotencyKey);
    if (existingResult && existingResult.responseBody) {
      return NextResponse.json(existingResult.responseBody, { status: existingResult.statusCode || 200 });
    }

    // 4. Execute Payment Gateway Initialization
    const paymentResult = await initPayment({
      merchantId,
      orderId: `ord-${Date.now()}`,
      amountMinor: BigInt(amountMinor),
      currency: 'TRY',
      idempotencyKey,
    });

    const responseData = {
      success: true,
      message: 'Ödeme başlatıldı.',
      data: {
        paymentId: paymentResult.paymentId,
        status: paymentResult.status,
        amountMinor,
        idempotencyKey,
      },
    };

    // Save Idempotency Result with 'COMPLETED' state
    await saveIdempotentResult(idempotencyKey, 'COMPLETED', 200, responseData);

    // Audit Log
    await logAuditEvent({
      actorId: auth.user.userId,
      action: 'PAYMENT_INTENT_CREATED',
      resourceType: 'PAYMENT',
      resourceId: paymentResult.paymentId,
      metadata: { merchantId, amountMinor, paymentType, idempotencyKey },
    });

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Ödeme başlatılamadı.' },
      { status: 500 }
    );
  }
}
