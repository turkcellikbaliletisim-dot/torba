import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth/guard';
import { getDbPool } from '@/lib/db';
import { defaultPaymentProvider } from '@/lib/services/payment-provider-adapter';
import { logAuditEvent } from '@/lib/services/audit-service';
import { requestDualApproval } from '@/lib/services/approval-service';

export async function POST(request: NextRequest) {
  const pool = getDbPool();
  let client;

  try {
    // 1. Enforce Granular Permission-Based Auth Guard (Section 4.9)
    const auth = await requirePermission(request, 'refund.create');
    if (!auth.isAuthenticated || !auth.user) {
      return auth.errorResponse || NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 401 });
    }

    const { paymentId, refundAmountMinor, reason, idempotencyKey } = await request.json();

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
      client.release();
      return NextResponse.json({ success: false, error: 'İade edilecek ödeme kaydı bulunamadı.' }, { status: 404 });
    }

    const dbPayment = paymentRes.rows[0];

    // 3. Merchant Ownership Check (Section 4.7)
    if (auth.user.role === 'MERCHANT' && auth.user.merchantId && auth.user.merchantId !== dbPayment.merchant_id) {
      await client.query('ROLLBACK');
      client.release();
      return NextResponse.json({ success: false, error: 'Erişim Engellendi: Yalnızca kendi işletmenize ait ödemeleri iade edebilirsiniz.' }, { status: 403 });
    }

    if (dbPayment.status !== 'COMPLETED' && dbPayment.status !== 'PARTIALLY_REFUNDED') {
      await client.query('ROLLBACK');
      client.release();
      return NextResponse.json({ success: false, error: 'Yalnızca COMPLETED veya PARTIALLY_REFUNDED ödemeler iade edilebilir.' }, { status: 422 });
    }

    // 4. Cumulative Partial Refund Tracker Check (Section 4.5)
    let priorRefundedTotal = 0n;
    try {
      const refundSumRes = await client.query(
        'SELECT COALESCE(SUM(amount_minor), 0) AS total_refunded FROM refunds WHERE payment_id = $1 AND status = $2',
        [paymentId, 'COMPLETED']
      );
      if (refundSumRes.rows.length > 0) {
        priorRefundedTotal = BigInt(refundSumRes.rows[0].total_refunded);
      }
    } catch (e) {}

    const remainingRefundable = BigInt(dbPayment.amount_minor) - priorRefundedTotal;
    const requestedRefund = BigInt(refundAmountMinor);

    if (requestedRefund > remainingRefundable) {
      await client.query('ROLLBACK');
      client.release();
      return NextResponse.json(
        {
          success: false,
          error: `Kümülatif iade sınırı aşıldı. Kalan iade edilebilir tutar: ${remainingRefundable} minor units.`,
        },
        { status: 422 }
      );
    }

    // 5. 4-Eye Approval (Çift Onay) Enforcement for High-Value Refunds (Section 4.8)
    const dualAppr = await requestDualApproval({
      actionType: 'HIGH_VALUE_REFUND',
      requestedByUserId: auth.user.userId,
      amountMinor: requestedRefund,
      payload: { paymentId, refundAmountMinor, reason, idempotencyKey },
    });

    if (dualAppr.requiresSecondApproval) {
      await client.query('COMMIT');
      client.release();

      await logAuditEvent({
        actorId: auth.user.userId,
        action: 'REFUND_PENDING_SECOND_APPROVAL',
        resourceType: 'APPROVAL',
        resourceId: dualAppr.approvalRecord.id,
        metadata: { paymentId, refundAmountMinor, reason },
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Yüksek tutarlı iade talebi oluşturuldu. İşlemin tamamlanması için 2. bir yöneticinin onayı gerekmektedir (Çift Onay Prensibi).',
          data: {
            approvalId: dualAppr.approvalRecord.id,
            status: 'PENDING_SECOND_APPROVAL',
          },
        },
        { status: 202 }
      );
    }

    // 6. Call Payment Provider Refund API
    const refundResult = await defaultPaymentProvider.processRefund({
      providerPaymentId: dbPayment.id,
      refundAmountMinor: requestedRefund,
      currency: 'TRY',
      reason: reason || 'Müşteri talebi iadesi',
      requestedByUserId: auth.user.userId,
    });

    if (!refundResult.success) {
      await client.query('ROLLBACK');
      client.release();
      return NextResponse.json({ success: false, error: 'Ödeme kuruluşu iade işlemini reddetti.' }, { status: 502 });
    }

    const totalRefundedAfter = priorRefundedTotal + requestedRefund;
    const isFullRefund = totalRefundedAfter >= BigInt(dbPayment.amount_minor);
    const newPaymentStatus = isFullRefund ? 'REFUNDED' : 'PARTIALLY_REFUNDED';

    // 7. Insert Dedicated Refund Record into DB Table (Section 4.5)
    await client.query(
      `INSERT INTO refunds (id, payment_id, amount_minor, reason, status, created_at)
       VALUES ($1, $2, $3, $4, 'COMPLETED', NOW())
       ON CONFLICT (id) DO NOTHING`,
      [refundResult.refundId, paymentId, requestedRefund.toString(), reason || 'Müşteri iadesi']
    );

    // 8. Update Payment Status in DB
    await client.query('UPDATE payments SET status = $1, updated_at = NOW() WHERE id = $2', [newPaymentStatus, dbPayment.id]);

    // 9. Platform Fee Proportional Reversal Ledger Entries (Section 4.6)
    // 3% Commission = (requestedRefund * 300) / 10000
    const commissionReversal = (requestedRefund * 300n) / 10000n;
    const merchantDebit = requestedRefund - commissionReversal;

    const txnId = `txn-ref-${refundResult.refundId}`;
    await client.query(
      `INSERT INTO ledger_transactions (id, idempotency_key, description, created_at)
       VALUES ($1, $2, 'İade ve Komisyon Ters Ledger Kaydı', NOW())
       ON CONFLICT (id) DO NOTHING`,
      [txnId, `ref-${refundResult.refundId}`]
    );

    // Reversal Ledger:
    // Entry 1: Credit User Wallet (Full Refund Amount)
    // Entry 2: Debit Merchant Wallet (Net Payout Amount)
    // Entry 3: Debit Platform Fee Wallet (Commission Amount)
    await client.query(
      `INSERT INTO ledger_entries (id, transaction_id, wallet_id, direction, amount_minor, created_at)
       VALUES 
         ($1, $2, $3, 'CREDIT', $4, NOW()),
         ($5, $2, $6, 'DEBIT', $7, NOW()),
         ($8, $2, 'w-platform-fees', 'DEBIT', $9, NOW())
       ON CONFLICT DO NOTHING`,
      [
        `entry-user-cr-${txnId}`,
        txnId,
        `w-user-${dbPayment.user_id}`,
        requestedRefund.toString(),

        `entry-merch-dr-${txnId}`,
        `w-merchant-${dbPayment.merchant_id}`,
        merchantDebit.toString(),

        `entry-fee-dr-${txnId}`,
        commissionReversal.toString(),
      ]
    );

    // Write Transaction-Safe Audit Log
    await logAuditEvent(
      {
        actorId: auth.user.userId,
        action: 'PAYMENT_REFUND_PROCESSED_ATOMIC',
        resourceType: 'REFUND',
        resourceId: refundResult.refundId,
        metadata: { paymentId, requestedRefund: requestedRefund.toString(), isFullRefund, reason },
      },
      client
    );

    await client.query('COMMIT');
    client.release();

    return NextResponse.json({
      success: true,
      message: 'İade işlemi ve komisyon ters ledger kaydı başarıyla gerçekleşti.',
      data: {
        refundId: refundResult.refundId,
        status: newPaymentStatus,
        refundAmountMinor: requestedRefund.toString(),
        totalRefundedAfter: totalRefundedAfter.toString(),
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
