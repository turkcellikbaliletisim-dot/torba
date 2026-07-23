import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/guard';
import { getDbPool } from '@/lib/db';
import { defaultPaymentProvider } from '@/lib/services/payment-provider-adapter';
import { logAuditEvent } from '@/lib/services/audit-service';

export async function POST(request: NextRequest) {
  const pool = getDbPool();
  let client;

  try {
    // 1. Enforce Authentication & Admin/Merchant Role Check
    const auth = await requireAuth(request, ['ADMIN', 'MERCHANT']);
    if (!auth.isAuthenticated || !auth.user) {
      return auth.errorResponse || NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 401 });
    }

    const { paymentId, refundAmountMinor, reason } = await request.json();

    if (!paymentId || !refundAmountMinor || BigInt(refundAmountMinor) <= 0n) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz ödeme ID veya iade tutarı.' },
        { status: 400 }
      );
    }

    client = await pool.connect();
    await client.query('BEGIN');

    // 2. Fetch and Lock Payment Record in DB (FOR UPDATE)
    const paymentRes = await client.query(
      'SELECT id, merchant_id, user_id, amount_minor, currency, status FROM payments WHERE id = $1 FOR UPDATE',
      [paymentId]
    );

    if (paymentRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'İade edilecek ödeme kaydı bulunamadı.' }, { status: 404 });
    }

    const dbPayment = paymentRes.rows[0];

    if (dbPayment.status !== 'COMPLETED') {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'Yalnızca tamamlanmış (COMPLETED) ödemeler iade edilebilir.' }, { status: 422 });
    }

    if (BigInt(refundAmountMinor) > BigInt(dbPayment.amount_minor)) {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'İade tutarı orijinal ödeme tutarından büyük olamaz.' }, { status: 422 });
    }

    // 3. Call Payment Provider Refund API
    const refundResult = await defaultPaymentProvider.processRefund({
      providerPaymentId: dbPayment.id,
      refundAmountMinor: BigInt(refundAmountMinor),
      currency: 'TRY',
      reason: reason || 'Müşteri talebi iadesi',
      requestedByUserId: auth.user.userId,
    });

    if (!refundResult.success) {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'Ödeme kuruluşu iade işlemini reddetti.' }, { status: 502 });
    }

    const isFullRefund = BigInt(refundAmountMinor) === BigInt(dbPayment.amount_minor);
    const newStatus = isFullRefund ? 'REFUNDED' : 'PARTIALLY_REFUNDED';

    // 4. Update Payment Status in DB
    await client.query('UPDATE payments SET status = $1, updated_at = NOW() WHERE id = $2', [newStatus, dbPayment.id]);

    // 5. Insert Reversal Double-Entry Ledger Transaction (Reversing debit/credit)
    const txnId = `txn-ref-${refundResult.refundId}`;
    await client.query(
      `INSERT INTO ledger_transactions (id, idempotency_key, description, created_at)
       VALUES ($1, $2, 'İade Ters Ledger Kaydı', NOW())
       ON CONFLICT (id) DO NOTHING`,
      [txnId, `ref-${refundResult.refundId}`]
    );

    // Reversal: Credit User Wallet, Debit Merchant Wallet
    await client.query(
      `INSERT INTO ledger_entries (id, transaction_id, wallet_id, direction, amount_minor, created_at)
       VALUES 
         ($1, $2, $3, 'CREDIT', $4, NOW()),
         ($5, $2, $6, 'DEBIT', $4, NOW())
       ON CONFLICT DO NOTHING`,
      [
        `entry-ref-cr-${txnId}`,
        txnId,
        `w-user-${dbPayment.user_id}`,
        refundAmountMinor.toString(),

        `entry-ref-dr-${txnId}`,
        `w-merchant-${dbPayment.merchant_id}`,
        refundAmountMinor.toString(),
      ]
    );

    await client.query('COMMIT');
    client.release();

    // 6. Audit Log
    await logAuditEvent({
      actorId: auth.user.userId,
      action: 'PAYMENT_REFUND_PROCESSED',
      resourceType: 'REFUND',
      resourceId: refundResult.refundId,
      metadata: { paymentId, refundAmountMinor, isFullRefund, reason },
    });

    return NextResponse.json({
      success: true,
      message: 'İade işlemi başarıyla gerçekleşti ve ters ledger kaydedildi.',
      data: {
        refundId: refundResult.refundId,
        status: newStatus,
        refundAmountMinor,
      },
    });
  } catch (error: any) {
    if (client) {
      try {
        await client.query('ROLLBACK');
      } catch (e) {}
      client.release();
    }
    return NextResponse.json({ success: false, error: 'İade işlemi hatası: ' + error.message }, { status: 500 });
  }
}
