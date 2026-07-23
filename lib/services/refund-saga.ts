import { query } from '@/lib/db';
import { defaultPaymentProvider } from './payment-provider-adapter';
import { logAuditEvent } from './audit-service';

export type SagaStatus =
  | 'REQUESTED'
  | 'RESERVED'
  | 'PROVIDER_PENDING'
  | 'PROVIDER_COMPLETED_LOCAL_PENDING'
  | 'COMPLETED'
  | 'FAILED_RETRYABLE'
  | 'FAILED_FINAL'
  | 'COMPENSATION_REQUIRED';

export interface RefundSagaRecord {
  id: string;
  refundId: string;
  paymentId: string;
  providerPaymentId: string;
  providerRefundId?: string;
  amountMinor: bigint;
  status: SagaStatus;
  retryCount: number;
  maxRetries: number;
  lastError?: string;
  nextRetryMs?: number;
}

/**
 * Creates or updates Refund Saga State Record bound to specific refundId (Section 7 & Item 3)
 */
export async function createRefundSaga(
  refundId: string,
  paymentId: string,
  providerPaymentId: string,
  amountMinor: bigint,
  providerRefundId?: string
): Promise<RefundSagaRecord> {
  const sagaId = `saga-${refundId}`;
  const record: RefundSagaRecord = {
    id: sagaId,
    refundId,
    paymentId,
    providerPaymentId,
    providerRefundId,
    amountMinor,
    status: 'REQUESTED',
    retryCount: 0,
    maxRetries: 5,
  };

  try {
    await query(
      `INSERT INTO refund_sagas (id, refund_id, payment_id, provider_payment_id, provider_refund_id, amount_minor, status, retry_count, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'REQUESTED', 0, NOW())
       ON CONFLICT (id) DO NOTHING`,
      [sagaId, refundId, paymentId, providerPaymentId, providerRefundId || null, amountMinor.toString()]
    );
  } catch (e) {}

  return record;
}

/**
 * Refund Saga Worker: Queries provider status for stuck PROVIDER_COMPLETED_LOCAL_PENDING sagas (Section 7 & Item 3)
 */
export async function runRefundSagaWorker(): Promise<{ recoveredCount: number; failedCount: number }> {
  let recoveredCount = 0;
  let failedCount = 0;

  try {
    const res = await query(
      `SELECT id, refund_id, payment_id, provider_payment_id, provider_refund_id, amount_minor, status, retry_count 
       FROM refund_sagas 
       WHERE status IN ('PROVIDER_COMPLETED_LOCAL_PENDING', 'FAILED_RETRYABLE') AND retry_count < 5 
       LIMIT 50`
    );

    if (res && res.rows.length > 0) {
      for (const row of res.rows) {
        try {
          // Query real provider refund status using providerRefundId or providerPaymentId (Item 3)
          const targetRefundId = row.provider_refund_id || row.provider_payment_id;
          const providerStatusRes = await defaultPaymentProvider.getRefundStatus(targetRefundId);

          if (providerStatusRes.success && providerStatusRes.status === 'COMPLETED') {
            await query('UPDATE refunds SET status = $1, updated_at = NOW() WHERE id = $2', ['COMPLETED', row.refund_id]);
            await query('UPDATE refund_sagas SET status = $1, updated_at = NOW() WHERE id = $2', ['COMPLETED', row.id]);

            await logAuditEvent({
              actorId: 'refund-saga-worker',
              action: 'REFUND_SAGA_RECOVERED_SUCCESSFULLY',
              resourceType: 'REFUND_SAGA',
              resourceId: row.id,
              metadata: { refundId: row.refund_id, paymentId: row.payment_id, providerRefundId: targetRefundId },
            });

            recoveredCount++;
          } else {
            await query('UPDATE refund_sagas SET retry_count = retry_count + 1, updated_at = NOW() WHERE id = $1', [row.id]);
            failedCount++;
          }
        } catch (e) {
          failedCount++;
        }
      }
    }
  } catch (e) {}

  return { recoveredCount, failedCount };
}
