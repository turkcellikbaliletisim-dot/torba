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
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
}

/**
 * Executes Bi-Directional Reconciliation (Provider ➔ Local AND Local ➔ Provider) with Deterministic Discrepancy Keys (Section 12)
 */
export async function runDailyReconciliation(providerItems: ProviderReportItem[]): Promise<{ totalChecked: number; discrepanciesFound: DiscrepancyItem[] }> {
  const discrepancies: DiscrepancyItem[] = [];

  // Direction 1: Provider ➔ Local DB Scan
  for (const item of providerItems) {
    try {
      const res = await query(
        'SELECT id, amount_minor, status FROM payments WHERE provider_payment_id = $1 OR id = $1 LIMIT 1',
        [item.providerPaymentId]
      );

      if (!res || res.rows.length === 0) {
        discrepancies.push({
          id: `disc-${item.providerPaymentId}-missing_local`,
          providerPaymentId: item.providerPaymentId,
          type: 'MISSING_IN_LOCAL',
          expectedValue: `Payment ${item.providerPaymentId} exists in Provider`,
          actualValue: 'Not found in Local DB',
          status: 'OPEN',
        });
        continue;
      }

      const localRow = res.rows[0];
      if (BigInt(localRow.amount_minor) !== item.amountMinor) {
        discrepancies.push({
          id: `disc-${item.providerPaymentId}-amt_mismatch`,
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
          id: `disc-${item.providerPaymentId}-stat_mismatch`,
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

  // Direction 2: Local DB ➔ Provider Scan (Section 12 Bi-Directional)
  try {
    const providerIdsSet = new Set(providerItems.map((p) => p.providerPaymentId));
    const localCompletedRes = await query(
      "SELECT id, provider_payment_id FROM payments WHERE status = 'COMPLETED' AND created_at > NOW() - INTERVAL '24 hours' LIMIT 100"
    );

    if (localCompletedRes && localCompletedRes.rows.length > 0) {
      for (const localRow of localCompletedRes.rows) {
        if (localRow.provider_payment_id && !providerIdsSet.has(localRow.provider_payment_id)) {
          discrepancies.push({
            id: `disc-${localRow.id}-missing_provider`,
            providerPaymentId: localRow.provider_payment_id,
            localPaymentId: localRow.id,
            type: 'MISSING_IN_PROVIDER',
            expectedValue: `Payment ${localRow.provider_payment_id} exists in Local DB`,
            actualValue: 'Missing in Provider Report',
            status: 'OPEN',
          });
        }
      }
    }
  } catch (e) {}

  // Persist Discrepancies with Deterministic Conflict Update
  for (const disc of discrepancies) {
    try {
      await query(
        `INSERT INTO reconciliation_discrepancies (id, provider_payment_id, local_payment_id, discrepancy_type, expected_val, actual_val, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, 'OPEN', NOW())
         ON CONFLICT (id) DO UPDATE SET updated_at = NOW(), actual_val = EXCLUDED.actual_val`,
        [disc.id, disc.providerPaymentId, disc.localPaymentId || null, disc.type, disc.expectedValue, disc.actualValue]
      );
    } catch (e) {}
  }

  return { totalChecked: providerItems.length, discrepanciesFound: discrepancies };
}
