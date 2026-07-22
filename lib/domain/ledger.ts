export type LedgerDirection = 'DEBIT' | 'CREDIT';

export interface LedgerEntryInput {
  walletId: string;
  direction: LedgerDirection;
  amountMinor: bigint;
}

export function validateBalancedEntries(entries: LedgerEntryInput[]): void {
  if (entries.length < 2) {
    throw new Error('A ledger transaction must contain at least two entries.');
  }

  let debitTotal = 0n;
  let creditTotal = 0n;

  for (const entry of entries) {
    if (!entry.walletId) {
      throw new Error('Ledger entry walletId is required.');
    }

    if (entry.amountMinor <= 0n) {
      throw new Error('Ledger entry amount must be greater than zero.');
    }

    if (entry.direction === 'DEBIT') {
      debitTotal += entry.amountMinor;
    } else {
      creditTotal += entry.amountMinor;
    }
  }

  if (debitTotal !== creditTotal) {
    throw new Error(
      `Ledger transaction is not balanced. Debits: ${debitTotal}, credits: ${creditTotal}.`,
    );
  }
}

export function reverseEntries(entries: LedgerEntryInput[]): LedgerEntryInput[] {
  validateBalancedEntries(entries);

  return entries.map((entry) => ({
    ...entry,
    direction: entry.direction === 'DEBIT' ? 'CREDIT' : 'DEBIT',
  }));
}
