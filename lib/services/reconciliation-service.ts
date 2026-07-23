import { query } from '@/lib/db';

export interface ProviderReportItem {
  providerPaymentId: string;
  amountMinor: bigint;
  status: 'COMPLETED' | 'REFUNDED' | 'FAILED';
  settlementDate: string;
}

export interface DiscrepancyItem {
  id: string;
  providerPaymentId: string;
  localPaymentId?: string;
  type: 'AMOUNT_MISMATCH' | 'STATUS_MISMATCH' | 'MISSING_IN_LOCAL' | 'MISSING_IN_PROVIDER';
  expectedValue: string;
  actualValue: string;
  status: 'OPEN' | 'RESOLVED';
}

/**
 * Executes Daily Provider vs Local Ledger Reconciliation & Flags Discrepancies
 */
export async function runDailyReconciliation(providerItems: ProviderReportItem[]): Promise<{ totalChecked: number; discrepanciesFound: DiscrepancyItem[] }> {
  const discrepancies: DiscrepancyItem[] = [];

  for (const item of providerItems) {
    try {
      const res = await query(
        'SELECT id, amount_minor, status FROM payments WHERE provider_payment_id = $1 OR id = $1 LIMIT 1',
        [item.providerPaymentId]
      );

      if (!res || res.rows.length === 0) {
        discrepancies.push({
          id: `disc-missing-${Date.now()}-${Math.random()}`,
          providerPaymentId: item.providerPaymentId,
          type: 'MISSING_IN_LOCAL',
          expectedValue: `Payment ${item.providerPaymentId} exists in Local DB`,
          actualValue: 'Not found in Local DB',
          status: 'OPEN',
        });
        continue;
      }

      const localRow = res.rows[0];
      if (BigInt(localRow.amount_minor) !== item.amountMinor) {
        discrepancies.push({
          id: `disc-amt-${Date.now()}-${Math.random()}`,
          providerPaymentId: item.providerPaymentId,
          localPaymentId: localRow.id,
          type: 'AMOUNT_MISMATCH',
          expectedValue: item.amountMinor.toString(),
          actualValue: localRow.amount_minor.toString(),
          status: 'OPEN',
        });
      }

      if (localRow.status !== item.status) {
        discrepancies.push({
          id: `disc-stat-${Date.now()}-${Math.random()}`,
          providerPaymentId: item.providerPaymentId,
          localPaymentId: localRow.id,
          type: 'STATUS_MISMATCH',
          expectedValue: item.status,
          actualValue: localRow.status,
          status: 'OPEN',
        });
      }
    } catch (e) {
      // Non-blocking fallback
    }
  }

  // Persist Discrepancies to Operations Queue
  for (const disc of discrepancies) {
    try {
      await query(
        `INSERT INTO reconciliation_discrepancies (id, provider_payment_id, local_payment_id, discrepancy_type, expected_val, actual_val, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, 'OPEN', NOW())
         ON CONFLICT (id) DO NOTHING`,
        [disc.id, disc.providerPaymentId, disc.localPaymentId || null, disc.type, disc.expectedValue, disc.actualValue]
      );
    } catch (e) {}
  }

  return { totalChecked: providerItems.length, discrepanciesFound: discrepancies };
}
