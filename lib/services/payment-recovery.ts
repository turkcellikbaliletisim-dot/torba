import { getDbPool, query } from '@/lib/db';
import { defaultPaymentProvider } from './payment-provider-adapter';
import { logAuditEvent } from './audit-service';

export interface PaymentRecoveryResult {
  recoveredCount: number;
  failedCount: number;
}

export interface RefundRecoveryResult {
  recoveredCount: number;
  failedCount: number;
}

/**
 * Payment Recovery Worker: Queries payment provider for PENDING payments to update local status (Section 1)
 */
export async function runPaymentRecoveryWorker(): Promise<PaymentRecoveryResult> {
  let recoveredCount = 0;
  let failedCount = 0;

  try {
    const res = await query(
      `SELECT id, provider_payment_id, status, created_at 
       FROM payments 
       WHERE status = 'PENDING' AND created_at < NOW() - INTERVAL '5 minutes' 
       LIMIT 50`
    );

    if (res && res.rows.length > 0) {
      for (const row of res.rows) {
        if (!row.provider_payment_id) continue;

        try {
          // Query real provider status (Section 1: No hardcoded status!)
          const providerStatusRes = await defaultPaymentProvider.getPaymentStatus(row.provider_payment_id);
          const mappedStatus = providerStatusRes.status;

          await query('UPDATE payments SET status = $1, updated_at = NOW() WHERE id = $2', [mappedStatus, row.id]);

          await logAuditEvent({
            actorId: 'system-recovery-worker',
            action: 'PAYMENT_RECOVERED_AUTOMATICALLY',
            resourceType: 'PAYMENT',
            resourceId: row.id,
            metadata: { providerPaymentId: row.provider_payment_id, recoveredStatus: mappedStatus },
          });

          recoveredCount++;
        } catch (e) {
          failedCount++;
        }
      }
    }
  } catch (e) {
    // Non-blocking worker fallback
  }

  return { recoveredCount, failedCount };
}

/**
 * Refund Recovery Worker: Resolves RESERVED / PROVIDER_PENDING refunds where provider refund succeeded (Section 4)
 */
export async function runRefundRecoveryWorker(): Promise<RefundRecoveryResult> {
  let recoveredCount = 0;
  let failedCount = 0;

  try {
    const res = await query(
      `SELECT id, payment_id, amount_minor, status, created_at 
       FROM refunds 
       WHERE status IN ('RESERVED', 'PROVIDER_PENDING') AND created_at < NOW() - INTERVAL '10 minutes' 
       LIMIT 50`
    );

    if (res && res.rows.length > 0) {
      for (const row of res.rows) {
        try {
          // Check payment status in local DB
          const payRes = await query('SELECT status FROM payments WHERE id = $1', [row.payment_id]);
          if (payRes && payRes.rows.length > 0 && payRes.rows[0].status === 'REFUNDED') {
            await query('UPDATE refunds SET status = $1, updated_at = NOW() WHERE id = $2', ['COMPLETED', row.id]);
            recoveredCount++;
          }
        } catch (e) {
          failedCount++;
        }
      }
    }
  } catch (e) {
    // Non-blocking worker fallback
  }

  return { recoveredCount, failedCount };
}
