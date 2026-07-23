import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth/guard';
import { getDbPool } from '@/lib/db';
import { defaultPaymentProvider } from '@/lib/services/payment-provider-adapter';
import { logAuditEvent } from '@/lib/services/audit-service';
import { requestDualApproval } from '@/lib/services/approval-service';
import { acquireIdempotencyLock, saveIdempotentResult } from '@/lib/services/idempotency-service';

export async function POST(request: NextRequest) {
  const pool = getDbPool();
  let client;

  try {
    // 1. Enforce Granular Permission Guard (refund.create)
    const auth = await requirePermission(request, 'refund.create');
    if (!auth.isAuthenticated || !auth.user) {
      return auth.errorResponse || NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 401 });
    }

    const rawBody = await request.json();
    const { paymentId, refundAmountMinor, reason, idempotencyKey } = rawBody;

    if (!paymentId || !refundAmountMinor || BigInt(refundAmountMinor) <= 0n) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz ödeme ID veya iade tutarı.' },
        { status: 400 }
      );
    }

    // 2. Refund Idempotency Lock Enforcement (Item 4.6)
    const refundIk = idempotencyKey || `ref-ik-${paymentId}-${refundAmountMinor}`;
    const lockResult = await acquireIdempotencyLock(`refund:${refundIk}`, rawBody, 60);

    if (lockResult.conflict) {
      return NextResponse.json(
        { success: false, error: '409 Conflict: Aynı İade Idempotency Key farklı veri ile kullanılamaz.' },
        { status: 409 }
      );
    }

    if (!lockResult.acquired && lockResult.existingRecord) {
      return NextResponse.json(lockResult.existingRecord.responseBody, { status: lockResult.existingRecord.statusCode || 200 });
    }

    // 3. First Short DB Txn: Validate Payment, Merchant Ownership, Cumulative Limit, and Create PENDING_PROVIDER Refund Record
    client = await pool.connect();
    let dbPayment;
    let priorRefundedTotal = 0n;
    const requestedRefund = BigInt(refundAmountMinor);

    try {
      await client.query('BEGIN');

      const paymentRes = await client.query(
        'SELECT id, merchant_id, user_id, amount_minor, currency, status FROM payments WHERE id = $1 FOR UPDATE',
        [paymentId]
      );

      if (paymentRes.rows.length === 0) {
        await client.query('ROLLBACK');
        client.release();
        return NextResponse.json({ success: false, error: 'İade edilecek ödeme kaydı bulunamadı.' }, { status: 404 });
      }

      dbPayment = paymentRes.rows[0];

      // Merchant Ownership Check (Item 4.11)
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

      // Cumulative Partial Refund Fail-Closed Total Check (Item 4.7)
      const refundSumRes = await client.query(
        'SELECT COALESCE(SUM(amount_minor), 0) AS total_refunded FROM refunds WHERE payment_id = $1 AND status = $2',
        [paymentId, 'COMPLETED']
      );
      if (refundSumRes.rows.length > 0) {
        priorRefundedTotal = BigInt(refundSumRes.rows[0].total_refunded);
      }

      const remainingRefundable = BigInt(dbPayment.amount_minor) - priorRefundedTotal;

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

      // 4-Eye Approval Check (Item 4.9)
      const dualAppr = await requestDualApproval({
        actionType: 'HIGH_VALUE_REFUND',
        requestedByUserId: auth.user.userId,
        amountMinor: requestedRefund,
        payload: { paymentId, refundAmountMinor, reason, idempotencyKey: refundIk },
      });

      if (dualAppr.requiresSecondApproval) {
        await client.query('COMMIT');
        client.release();

        const pendingApprResponse = {
          success: true,
          message: 'Yüksek tutarlı iade talebi oluşturuldu. İşlemin tamamlanması için 2. bir yöneticinin onayı gerekmektedir (Çift Onay Prensibi).',
          data: { approvalId: dualAppr.approvalRecord.id, status: 'PENDING_SECOND_APPROVAL' },
        };
        await saveIdempotentResult(`refund:${refundIk}`, rawBody, 'COMPLETED', 202, pendingApprResponse);

        return NextResponse.json(pendingApprResponse, { status: 202 });
      }

      await client.query('COMMIT');
    } catch (dbErr: any) {
      if (client) {
        try {
          await client.query('ROLLBACK');
        } catch (e) {}
        client.release();
      }
      return NextResponse.json({ success: false, error: 'İade ön doğrulaması başarısız: ' + dbErr.message }, { status: 500 });
    } finally {
      if (client) client.release();
    }

    // 4. Outbound Provider Refund Call OUTSIDE Open DB Transaction Lock (Saga Pattern - Item 4.8)
    const refundResult = await defaultPaymentProvider.processRefund({
      providerPaymentId: dbPayment.id,
      refundAmountMinor: requestedRefund,
      currency: 'TRY',
      reason: reason || 'Müşteri talebi iadesi',
      requestedByUserId: auth.user.userId,
    });

    if (!refundResult.success) {
      const failResponse = { success: false, error: 'Ödeme kuruluşu iade işlemini reddetti.' };
      await saveIdempotentResult(`refund:${refundIk}`, rawBody, 'FAILED_FINAL', 502, failResponse);
      return NextResponse.json(failResponse, { status: 502 });
    }

    // 5. Second Short DB Txn: Commit Reversal Ledger Entries and Update State
    const totalRefundedAfter = priorRefundedTotal + requestedRefund;
    const isFullRefund = totalRefundedAfter >= BigInt(dbPayment.amount_minor);
    const newPaymentStatus = isFullRefund ? 'REFUNDED' : 'PARTIALLY_REFUNDED';

    client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insert Refund Record
      await client.query(
        `INSERT INTO refunds (id, payment_id, amount_minor, reason, status, created_at)
         VALUES ($1, $2, $3, $4, 'COMPLETED', NOW())
         ON CONFLICT (id) DO NOTHING`,
        [refundResult.refundId, paymentId, requestedRefund.toString(), reason || 'Müşteri iadesi']
      );

      // Update Payment Status
      await client.query('UPDATE payments SET status = $1, updated_at = NOW() WHERE id = $2', [newPaymentStatus, dbPayment.id]);

      // Proportional Commission Reversal Ledger Entries
      const commissionReversal = (requestedRefund * 300n) / 10000n;
      const merchantDebit = requestedRefund - commissionReversal;

      const txnId = `txn-ref-${refundResult.refundId}`;
      await client.query(
        `INSERT INTO ledger_transactions (id, idempotency_key, description, created_at)
         VALUES ($1, $2, 'İade ve Komisyon Ters Ledger Kaydı', NOW())
         ON CONFLICT (id) DO NOTHING`,
        [txnId, `ref-${refundResult.refundId}`]
      );

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

      await logAuditEvent(
        {
          actorId: auth.user.userId,
          action: 'PAYMENT_REFUND_PROCESSED_SAGA',
          resourceType: 'REFUND',
          resourceId: refundResult.refundId,
          metadata: { paymentId, requestedRefund: requestedRefund.toString(), isFullRefund, reason },
        },
        client
      );

      await client.query('COMMIT');
    } catch (dbErr: any) {
      if (client) await client.query('ROLLBACK');
      throw dbErr;
    } finally {
      if (client) client.release();
    }

    const successResponse = {
      success: true,
      message: 'İade işlemi ve komisyon ters ledger kaydı başarıyla gerçekleşti.',
      data: {
        refundId: refundResult.refundId,
        status: newPaymentStatus,
        refundAmountMinor: requestedRefund.toString(),
        totalRefundedAfter: totalRefundedAfter.toString(),
      },
    };

    await saveIdempotentResult(`refund:${refundIk}`, rawBody, 'COMPLETED', 200, successResponse);
    return NextResponse.json(successResponse, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'İade işlemi hatası: ' + error.message }, { status: 500 });
  }
}
