import { getDbPool, query } from '@/lib/db';
import { logAuditEvent } from './audit-service';

export type PaymentStatus =
  | 'CREATED'
  | 'PENDING_PROVIDER'
  | 'WAITING_3DS'
  | 'AUTHORIZED'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'PARTIALLY_REFUNDED'
  | 'REFUNDED'
  | 'CHARGEBACK';

const ALLOWED_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  CREATED: ['PENDING_PROVIDER', 'FAILED', 'CANCELLED'],
  PENDING_PROVIDER: ['WAITING_3DS', 'AUTHORIZED', 'COMPLETED', 'FAILED', 'CANCELLED'],
  WAITING_3DS: ['AUTHORIZED', 'COMPLETED', 'FAILED', 'CANCELLED'],
  AUTHORIZED: ['COMPLETED', 'FAILED', 'CANCELLED'],
  COMPLETED: ['PARTIALLY_REFUNDED', 'REFUNDED', 'CHARGEBACK'],
  PARTIALLY_REFUNDED: ['PARTIALLY_REFUNDED', 'REFUNDED', 'CHARGEBACK'],
  FAILED: [], // Terminal State
  CANCELLED: [], // Terminal State
  REFUNDED: [], // Terminal State
  CHARGEBACK: [], // Terminal State
};

export function canTransitionPaymentStatus(currentStatus: PaymentStatus, newStatus: PaymentStatus): boolean {
  if (currentStatus === newStatus) return true;
  const allowed = ALLOWED_TRANSITIONS[currentStatus];
  return allowed ? allowed.includes(newStatus) : false;
}

export async function transitionPaymentStatus(
  paymentId: string,
  newStatus: PaymentStatus,
  actorId: string = 'system-state-machine',
  metadata: Record<string, any> = {},
  existingClient?: any
): Promise<{ success: boolean; previousStatus?: PaymentStatus; error?: string }> {
  const pool = getDbPool();
  let client = existingClient;
  const isSelfManaged = !existingClient;

  try {
    if (isSelfManaged) {
      client = await pool.connect();
      await client.query('BEGIN');
    }

    const res = await client.query('SELECT status FROM payments WHERE id = $1 FOR UPDATE', [paymentId]);

    if (!res || res.rows.length === 0) {
      if (isSelfManaged && client) await client.query('ROLLBACK');
      return { success: false, error: 'Ödeme kaydı bulunamadı.' };
    }

    const currentStatus: PaymentStatus = res.rows[0].status;

    if (!canTransitionPaymentStatus(currentStatus, newStatus)) {
      if (isSelfManaged && client) await client.query('ROLLBACK');
      return {
        success: false,
        previousStatus: currentStatus,
        error: `Geçersiz durum geçişi: ${currentStatus} -> ${newStatus} geçişine izin verilmiyor.`,
      };
    }

    await client.query('UPDATE payments SET status = $1, updated_at = NOW() WHERE id = $2', [newStatus, paymentId]);

    await logAuditEvent(
      {
        actorId,
        action: 'PAYMENT_STATE_TRANSITION',
        resourceType: 'PAYMENT',
        resourceId: paymentId,
        metadata: { previousStatus: currentStatus, newStatus, ...metadata },
      },
      client
    );

    if (isSelfManaged && client) await client.query('COMMIT');
    return { success: true, previousStatus: currentStatus };
  } catch (dbErr: any) {
    if (isSelfManaged && client) {
      try {
        await client.query('ROLLBACK');
      } catch (e) {}
    }
    if (process.env.NODE_ENV === 'production') {
      return { success: false, error: 'State machine veritabanı hatası: ' + dbErr.message };
    }
    return { success: false, error: 'Ödeme kaydı bulunamadı (Test Fallback).' };
  } finally {
    if (isSelfManaged && client) client.release();
  }
}
