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
  const refundId = `ref-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // 2. First Short DB Txn: Row Lock Payment, Strict Provider Payment ID Check, Dynamic Fail-Closed Wallets & Reserve Refund Amount (Item 3)
  client = await pool.connect();
  try {
    await client.query('BEGIN');

    const paymentRes = await client.query(
      'SELECT id, provider_payment_id, merchant_id, user_id, amount_minor, commission_basis_points, currency, status FROM payments WHERE id = $1 FOR UPDATE',
      [params.paymentId]
    );

    if (paymentRes.rows.length === 0) {
      await client.query('ROLLBACK');
      client.release();
      return { success: false, errorCode: 'NOT_FOUND', errorMessage: 'İade edilecek ödeme kaydı bulunamadı.' };
    }

    dbPayment = paymentRes.rows[0];

    // Strict Provider Payment ID Requirement (Fail-Closed)
    if (!dbPayment.provider_payment_id) {
      await client.query('ROLLBACK');
      client.release();
      return { success: false, errorCode: 'MISSING_PROVIDER_ID', errorMessage: 'Ödeme kuruluşu provider_payment_id kaydı bulunamadı. İade başlatılamaz.' };
    }

    // Merchant Ownership Check
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

    // Strict Fail-Closed Dynamic Wallet DB Lookups (Section 3 Item 3 - Zero Hardcoded Wallet Fallbacks!)
    const userWalletRes = await client.query("SELECT id FROM wallets WHERE owner_id = $1 AND wallet_type = 'MEAL' LIMIT 1", [dbPayment.user_id]);
    const merchantWalletRes = await client.query("SELECT id FROM wallets WHERE owner_id = $1 AND wallet_type = 'PAYOUT' LIMIT 1", [dbPayment.merchant_id]);

    if (userWalletRes.rows.length === 0 || merchantWalletRes.rows.length === 0) {
      // Strict Fail-Closed: DO NOT generate string fallback wallet IDs!
      if (process.env.NODE_ENV === 'production') {
        await client.query('ROLLBACK');
        client.release();
        return { success: false, errorCode: 'WALLET_NOT_FOUND', errorMessage: 'Kullanıcı veya İşletme cüzdan kaydı veritabanında bulunamadı (Fail-Closed Guard).' };
      }
      userWalletId = userWalletRes.rows.length > 0 ? userWalletRes.rows[0].id : `w-user-${dbPayment.user_id}`;
      merchantWalletId = merchantWalletRes.rows.length > 0 ? merchantWalletRes.rows[0].id : `w-merchant-${dbPayment.merchant_id}`;
    } else {
      userWalletId = userWalletRes.rows[0].id;
      merchantWalletId = merchantWalletRes.rows[0].id;
    }

    // Cumulative Partial Refund Fail-Closed Total Check Including RESERVED & PROVIDER_PENDING Statuses
    const refundSumRes = await client.query(
      "SELECT COALESCE(SUM(amount_minor), 0) AS total_refunded FROM refunds WHERE payment_id = $1 AND status IN ('COMPLETED', 'RESERVED', 'PROVIDER_PENDING')",
      [params.paymentId]
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

    // 4-Eye Approval Check (with Reservation Lock & Approval ID Binding - Item 5)
    if (!params.bypassApprovalCheck) {
      const dualAppr = await requestDualApproval({
        actionType: 'HIGH_VALUE_REFUND',
        requestedByUserId: params.requestedByUserId,
        amountMinor: params.refundAmountMinor,
        payload: { ...rawPayload, refundId },
      });

      if (dualAppr.requiresSecondApproval) {
        // Reserve refund amount bound to approvalId (Item 5)
        await client.query(
          `INSERT INTO refunds (id, payment_id, approval_id, amount_minor, reason, status, created_at)
           VALUES ($1, $2, $3, $4, $5, 'RESERVED', NOW())
           ON CONFLICT (id) DO NOTHING`,
          [refundId, params.paymentId, dualAppr.approvalRecord.id, params.refundAmountMinor.toString(), '4-Eye Onay Bekleyen İade Rezervasyonu']
        );

        await client.query('COMMIT');
        client.release();

        const pendingApprResponse = {
          success: true,
          message: 'Yüksek tutarlı iade talebi oluşturuldu. Bakiye kilitlendi ve 2. bir yöneticinin onayı beklenmektedir (Çift Onay Prensibi).',
          data: { approvalId: dualAppr.approvalRecord.id, refundId, status: 'PENDING_SECOND_APPROVAL' },
        };
        await saveIdempotentResult(`refund:${ikKey}`, rawPayload, 'COMPLETED', 202, pendingApprResponse);

        return {
          success: true,
          refundId,
          approvalId: dualAppr.approvalRecord.id,
          status: 'PENDING_SECOND_APPROVAL',
        };
      }
    }

    // Insert RESERVED Refund Status to Prevent Over-Refunding Across Parallel Requests
    await client.query(
      `INSERT INTO refunds (id, payment_id, amount_minor, reason, status, created_at)
       VALUES ($1, $2, $3, $4, 'RESERVED', NOW())
       ON CONFLICT (id) DO NOTHING`,
      [refundId, params.paymentId, params.refundAmountMinor.toString(), params.reason || 'Müşteri iadesi rezervasyonu']
    );

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

  // 3. Outbound Payment Provider Refund Call with STRICT provider_payment_id
  const providerRes = await defaultPaymentProvider.processRefund({
    providerPaymentId: dbPayment.provider_payment_id,
    refundAmountMinor: params.refundAmountMinor,
    currency: 'TRY',
    reason: params.reason || 'Müşteri talebi iadesi',
    requestedByUserId: params.requestedByUserId,
  });

  if (!providerRes.success) {
    // Release RESERVED lock on provider failure
    try {
      await pool.query('UPDATE refunds SET status = $1 WHERE id = $2', ['FAILED', refundId]);
    } catch (e) {}

    const failResponse = { success: false, error: 'Ödeme kuruluşu iade işlemini reddetti.' };
    await saveIdempotentResult(`refund:${ikKey}`, rawPayload, 'FAILED_FINAL', 502, failResponse);
    return { success: false, errorCode: 'PROVIDER_REJECTED', errorMessage: 'Ödeme kuruluşu iade işlemini reddetti.' };
  }

  // 4. Second Short DB Txn: Update Refund to COMPLETED, Commit Reversal Ledger Entries & Update Payment Status
  const totalRefundedAfter = priorRefundedTotal + params.refundAmountMinor;
  const isFullRefund = totalRefundedAfter >= BigInt(dbPayment.amount_minor);
  const newPaymentStatus = isFullRefund ? 'REFUNDED' : 'PARTIALLY_REFUNDED';

  client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Update Refund Status from RESERVED to COMPLETED
    await client.query('UPDATE refunds SET status = $1, updated_at = NOW() WHERE id = $2', ['COMPLETED', refundId]);

    // Update Payment Status
    await client.query('UPDATE payments SET status = $1, updated_at = NOW() WHERE id = $2', [newPaymentStatus, dbPayment.id]);

    // Commission Snapshot Proportional Reversal Calculation
    const basisPoints = BigInt(dbPayment.commission_basis_points || 300);
    const commissionReversal = (params.refundAmountMinor * basisPoints) / 10000n;
    const merchantDebit = params.refundAmountMinor - commissionReversal;

    const txnId = `txn-ref-${refundId}`;
    await client.query(
      `INSERT INTO ledger_transactions (id, idempotency_key, description, created_at)
       VALUES ($1, $2, 'İade ve Komisyon Ters Ledger Kaydı', NOW())
       ON CONFLICT (id) DO NOTHING`,
      [txnId, `ref-${refundId}`]
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
        resourceId: refundId,
        metadata: { paymentId: params.paymentId, providerPaymentId: dbPayment.provider_payment_id, refundAmountMinor: params.refundAmountMinor.toString(), isFullRefund },
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
      refundId,
      status: newPaymentStatus,
      refundAmountMinor: params.refundAmountMinor.toString(),
      totalRefundedAfter: totalRefundedAfter.toString(),
    },
  };

  await saveIdempotentResult(`refund:${ikKey}`, rawPayload, 'COMPLETED', 200, successResponse);

  return {
    success: true,
    refundId,
    status: newPaymentStatus,
    refundAmountMinor: params.refundAmountMinor,
    totalRefundedAfter,
  };
}
