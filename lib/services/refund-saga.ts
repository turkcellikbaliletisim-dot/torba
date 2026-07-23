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
 * Creates or updates Refund Saga State Record (Section 7)
 */
export async function createRefundSaga(
  paymentId: string,
  providerPaymentId: string,
  amountMinor: bigint
): Promise<RefundSagaRecord> {
  const sagaId = `saga-ref-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const record: RefundSagaRecord = {
    id: sagaId,
    paymentId,
    providerPaymentId,
    amountMinor,
    status: 'REQUESTED',
    retryCount: 0,
    maxRetries: 5,
  };

  try {
    await query(
      `INSERT INTO refund_sagas (id, payment_id, provider_payment_id, amount_minor, status, retry_count, created_at)
       VALUES ($1, $2, $3, $4, 'REQUESTED', 0, NOW())
       ON CONFLICT (id) DO NOTHING`,
      [sagaId, paymentId, providerPaymentId, amountMinor.toString()]
    );
  } catch (e) {}

  return record;
}

/**
 * Refund Saga Worker: Queries provider status for stuck PROVIDER_COMPLETED_LOCAL_PENDING sagas (Section 7)
 */
export async function runRefundSagaWorker(): Promise<{ recoveredCount: number; failedCount: number }> {
  let recoveredCount = 0;
  let failedCount = 0;

  try {
    const res = await query(
      `SELECT id, payment_id, provider_payment_id, provider_refund_id, amount_minor, status, retry_count 
       FROM refund_sagas 
       WHERE status IN ('PROVIDER_COMPLETED_LOCAL_PENDING', 'FAILED_RETRYABLE') AND retry_count < 5 
       LIMIT 50`
    );

    if (res && res.rows.length > 0) {
      for (const row of res.rows) {
        try {
          // Check provider status
          const providerStatusRes = await defaultPaymentProvider.getPaymentStatus(row.provider_payment_id);

          if (providerStatusRes.success && providerStatusRes.status === 'COMPLETED') {
            await query('UPDATE refunds SET status = $1, updated_at = NOW() WHERE payment_id = $2', ['COMPLETED', row.payment_id]);
            await query('UPDATE refund_sagas SET status = $1, updated_at = NOW() WHERE id = $2', ['COMPLETED', row.id]);

            await logAuditEvent({
              actorId: 'refund-saga-worker',
              action: 'REFUND_SAGA_RECOVERED_SUCCESSFULLY',
              resourceType: 'REFUND_SAGA',
              resourceId: row.id,
              metadata: { paymentId: row.payment_id, providerPaymentId: row.provider_payment_id },
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
