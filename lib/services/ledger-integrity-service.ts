import { query } from '@/lib/db';
import { logAuditEvent } from './audit-service';

export interface LedgerAuditResult {
  totalTransactionsAudited: number;
  unbalancedCount: number;
  isBalanced: boolean;
  unbalancedTransactionIds: string[];
}

/**
 * Audits Double-Entry Ledger Invariants: SUM(DEBIT) === SUM(CREDIT) for all transactions (Item 4: Fail-Closed Guard)
 */
export async function runLedgerIntegrityAudit(): Promise<LedgerAuditResult> {
  const unbalancedIds: string[] = [];
  let totalAudited = 0;

  try {
    const res = await query(
      `SELECT transaction_id,
              SUM(CASE WHEN direction = 'DEBIT' THEN amount_minor ELSE 0 END) AS total_debit,
              SUM(CASE WHEN direction = 'CREDIT' THEN amount_minor ELSE 0 END) AS total_credit
       FROM ledger_entries
       GROUP BY transaction_id
       HAVING SUM(CASE WHEN direction = 'DEBIT' THEN amount_minor ELSE 0 END) != SUM(CASE WHEN direction = 'CREDIT' THEN amount_minor ELSE 0 END)`
    );

    if (res && res.rows.length > 0) {
      for (const row of res.rows) {
        unbalancedIds.push(row.transaction_id);
      }
    }

    const countRes = await query('SELECT COUNT(DISTINCT transaction_id) AS cnt FROM ledger_entries');
    if (countRes && countRes.rows.length > 0) {
      totalAudited = parseInt(countRes.rows[0].cnt, 10);
    }
  } catch (e: any) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Ledger denetimi veritabanı sorgusu başarısız: ' + e.message);
    }
  }

  const isBalanced = unbalancedIds.length === 0;

  if (!isBalanced) {
    await logAuditEvent({
      actorId: 'ledger-integrity-service',
      action: 'LEDGER_INVARIANT_VIOLATION_DETECTED',
      resourceType: 'LEDGER',
      resourceId: 'global-ledger',
      metadata: { unbalancedTransactionIds: unbalancedIds },
    });

    if (process.env.NODE_ENV === 'production') {
      // Fail-Closed in Production (Item 4)
      throw new Error(`Kritik Muhasebe İhlali: ${unbalancedIds.length} adet borç/alacak uyuşmazlığı tespit edildi.`);
    }
  }

  return {
    totalTransactionsAudited: totalAudited,
    unbalancedCount: unbalancedIds.length,
    isBalanced,
    unbalancedTransactionIds: unbalancedIds,
  };
}
