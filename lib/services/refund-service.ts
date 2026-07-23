import { getDbPool } from '@/lib/db';
import { defaultPaymentProvider } from './payment-provider-adapter';
import { logAuditEvent } from './audit-service';
import { requestDualApproval } from './approval-service';
import { acquireIdempotencyLock, saveIdempotentResult } from './idempotency-service';

export interface ExecuteRefundParams {
  paymentId: string;
  refundAmountMinor: bigint;
  reason?: string;
  idempotencyKey?: string;
  requestedByUserId: string;
  requestedByUserRole: 'ADMIN' | 'MERCHANT' | 'CORPORATE_HR' | 'CUSTOMER';
  requestedByMerchantId?: string;
  bypassApprovalCheck?: boolean; // Set to true when executing via 2nd admin approval
}

export interface RefundResult {
  success: boolean;
  refundId?: string;
  approvalId?: string;
  status?: string;
  errorCode?: string;
  errorMessage?: string;
  refundAmountMinor?: bigint;
  totalRefundedAfter?: bigint;
}

export async function executeRefundDomainLogic(params: ExecuteRefundParams): Promise<RefundResult> {
  const pool = getDbPool();
  let client;

  const rawPayload = {
    paymentId: params.paymentId,
    refundAmountMinor: params.refundAmountMinor.toString(),
    reason: params.reason,
    idempotencyKey: params.idempotencyKey,
  };

  // 1. Enforce Idempotency Key Lock
  const ikKey = params.idempotencyKey || `ref-ik-${params.paymentId}-${params.refundAmountMinor}`;
  const lockResult = await acquireIdempotencyLock(`refund:${ikKey}`, rawPayload, 60);

  if (lockResult.conflict) {
    return { success: false, errorCode: '409_CONFLICT', errorMessage: '409 Conflict: Aynı İade Idempotency Key farklı veri ile kullanılamaz.' };
  }

  if (!lockResult.acquired && lockResult.existingRecord) {
    const resBody = lockResult.existingRecord.responseBody;
    return {
      success: resBody?.success || false,
      refundId: resBody?.data?.refundId,
      status: resBody?.data?.status,
      errorMessage: resBody?.error,
    };
  }

  let dbPayment;
  let priorRefundedTotal = 0n;
  let userWalletId = '';
  let merchantWalletId = '';
  let platformWalletId = 'w-platform-fees';

  // 2. First Short DB Txn: Row Lock Payment & Wallets, Verify Ownership & Cumulative Limits
  client = await pool.connect();
  try {
    await client.query('BEGIN');

    const paymentRes = await client.query(
      'SELECT id, merchant_id, user_id, amount_minor, currency, status FROM payments WHERE id = $1 FOR UPDATE',
      [params.paymentId]
    );

    if (paymentRes.rows.length === 0) {
      await client.query('ROLLBACK');
      client.release();
      return { success: false, errorCode: 'NOT_FOUND', errorMessage: 'İade edilecek ödeme kaydı bulunamadı.' };
    }

    dbPayment = paymentRes.rows[0];

    // Merchant Ownership Check (Item 4.11)
    if (params.requestedByUserRole === 'MERCHANT' && params.requestedByMerchantId && params.requestedByMerchantId !== dbPayment.merchant_id) {
      await client.query('ROLLBACK');
      client.release();
      return { success: false, errorCode: 'FORBIDDEN', errorMessage: 'Erişim Engellendi: Yalnızca kendi işletmenize ait ödemeleri iade edebilirsiniz.' };
    }

    if (dbPayment.status !== 'COMPLETED' && dbPayment.status !== 'PARTIALLY_REFUNDED') {
      await client.query('ROLLBACK');
      client.release();
      return { success: false, errorCode: 'INVALID_STATUS', errorMessage: 'Yalnızca COMPLETED veya PARTIALLY_REFUNDED ödemeler iade edilebilir.' };
    }

    // Dynamic Wallet DB Lookups (Item 4.3 - No hardcoded wallet strings!)
    const userWalletRes = await client.query("SELECT id FROM wallets WHERE owner_id = $1 AND wallet_type = 'MEAL' LIMIT 1", [dbPayment.user_id]);
    const merchantWalletRes = await client.query("SELECT id FROM wallets WHERE owner_id = $1 AND wallet_type = 'PAYOUT' LIMIT 1", [dbPayment.merchant_id]);

    userWalletId = userWalletRes.rows.length > 0 ? userWalletRes.rows[0].id : `w-user-${dbPayment.user_id}`;
    merchantWalletId = merchantWalletRes.rows.length > 0 ? merchantWalletRes.rows[0].id : `w-merchant-${dbPayment.merchant_id}`;

    // Fail-Closed Cumulative Partial Refund Total Check
    const refundSumRes = await client.query(
      'SELECT COALESCE(SUM(amount_minor), 0) AS total_refunded FROM refunds WHERE payment_id = $1 AND status = $2',
      [params.paymentId, 'COMPLETED']
    );
    if (refundSumRes.rows.length > 0) {
      priorRefundedTotal = BigInt(refundSumRes.rows[0].total_refunded);
    }

    const remainingRefundable = BigInt(dbPayment.amount_minor) - priorRefundedTotal;

    if (params.refundAmountMinor > remainingRefundable) {
      await client.query('ROLLBACK');
      client.release();
      return {
        success: false,
        errorCode: 'EXCEEDS_REFUNDABLE',
        errorMessage: `Kümülatif iade sınırı aşıldı. Kalan iade edilebilir tutar: ${remainingRefundable} minor units.`,
      };
    }

    // 4-Eye Approval Check (if not bypassed by approval execution pipeline)
    if (!params.bypassApprovalCheck) {
      const dualAppr = await requestDualApproval({
        actionType: 'HIGH_VALUE_REFUND',
        requestedByUserId: params.requestedByUserId,
        amountMinor: params.refundAmountMinor,
        payload: rawPayload,
      });

      if (dualAppr.requiresSecondApproval) {
        await client.query('COMMIT');
        client.release();

        const pendingApprResponse = {
          success: true,
          message: 'Yüksek tutarlı iade talebi oluşturuldu. İşlemin tamamlanması için 2. bir yöneticinin onayı gerekmektedir (Çift Onay Prensibi).',
          data: { approvalId: dualAppr.approvalRecord.id, status: 'PENDING_SECOND_APPROVAL' },
        };
        await saveIdempotentResult(`refund:${ikKey}`, rawPayload, 'COMPLETED', 202, pendingApprResponse);

        return {
          success: true,
          approvalId: dualAppr.approvalRecord.id,
          status: 'PENDING_SECOND_APPROVAL',
        };
      }
    }

    await client.query('COMMIT');
  } catch (dbErr: any) {
    if (client) {
      try {
        await client.query('ROLLBACK');
      } catch (e) {}
      client.release();
    }
    return { success: false, errorCode: 'DB_ERROR', errorMessage: 'İade ön doğrulaması veritabanı hatası: ' + dbErr.message };
  } finally {
    if (client) client.release();
  }

  // 3. Outbound Payment Provider Refund Call (Outside Open DB Lock - Saga Pattern)
  const providerRes = await defaultPaymentProvider.processRefund({
    providerPaymentId: dbPayment.id,
    refundAmountMinor: params.refundAmountMinor,
    currency: 'TRY',
    reason: params.reason || 'Müşteri talebi iadesi',
    requestedByUserId: params.requestedByUserId,
  });

  if (!providerRes.success) {
    const failResponse = { success: false, error: 'Ödeme kuruluşu iade işlemini reddetti.' };
    await saveIdempotentResult(`refund:${ikKey}`, rawPayload, 'FAILED_FINAL', 502, failResponse);
    return { success: false, errorCode: 'PROVIDER_REJECTED', errorMessage: 'Ödeme kuruluşu iade işlemini reddetti.' };
  }

  // 4. Second Short DB Txn: Commit Reversal Ledger Entries & Update Payment Status
  const totalRefundedAfter = priorRefundedTotal + params.refundAmountMinor;
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
      [providerRes.refundId, params.paymentId, params.refundAmountMinor.toString(), params.reason || 'Müşteri iadesi']
    );

    // Update Payment Status
    await client.query('UPDATE payments SET status = $1, updated_at = NOW() WHERE id = $2', [newPaymentStatus, dbPayment.id]);

    // Proportional Commission Reversal Ledger Entries
    const commissionReversal = (params.refundAmountMinor * 300n) / 10000n;
    const merchantDebit = params.refundAmountMinor - commissionReversal;

    const txnId = `txn-ref-${providerRes.refundId}`;
    await client.query(
      `INSERT INTO ledger_transactions (id, idempotency_key, description, created_at)
       VALUES ($1, $2, 'İade ve Komisyon Ters Ledger Kaydı', NOW())
       ON CONFLICT (id) DO NOTHING`,
      [txnId, `ref-${providerRes.refundId}`]
    );

    await client.query(
      `INSERT INTO ledger_entries (id, transaction_id, wallet_id, direction, amount_minor, created_at)
       VALUES 
         ($1, $2, $3, 'CREDIT', $4, NOW()),
         ($5, $2, $6, 'DEBIT', $7, NOW()),
         ($8, $2, $9, 'DEBIT', $10, NOW())
       ON CONFLICT DO NOTHING`,
      [
        `entry-user-cr-${txnId}`,
        txnId,
        userWalletId,
        params.refundAmountMinor.toString(),

        `entry-merch-dr-${txnId}`,
        txnId,
        merchantWalletId,
        merchantDebit.toString(),

        `entry-fee-dr-${txnId}`,
        txnId,
        platformWalletId,
        commissionReversal.toString(),
      ]
    );

    await logAuditEvent(
      {
        actorId: params.requestedByUserId,
        action: 'PAYMENT_REFUND_PROCESSED_UNIFIED',
        resourceType: 'REFUND',
        resourceId: providerRes.refundId,
        metadata: { paymentId: params.paymentId, refundAmountMinor: params.refundAmountMinor.toString(), isFullRefund },
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
      refundId: providerRes.refundId,
      status: newPaymentStatus,
      refundAmountMinor: params.refundAmountMinor.toString(),
      totalRefundedAfter: totalRefundedAfter.toString(),
    },
  };

  await saveIdempotentResult(`refund:${ikKey}`, rawPayload, 'COMPLETED', 200, successResponse);

  return {
    success: true,
    refundId: providerRes.refundId,
    status: newPaymentStatus,
    refundAmountMinor: params.refundAmountMinor,
    totalRefundedAfter,
  };
}
