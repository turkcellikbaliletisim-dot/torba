import { reverseEntries, validateBalancedEntries, type LedgerEntryInput } from './ledger';

export interface LedgerTestCase {
  name: string;
  run: () => void;
}

function expectThrows(run: () => void, expectedMessage: string): void {
  try {
    run();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes(expectedMessage)) {
      throw new Error(`Expected error containing "${expectedMessage}", received "${message}".`);
    }
    return;
  }
  throw new Error(`Expected an error containing "${expectedMessage}".`);
}

const balancedEntries: LedgerEntryInput[] = [
  { walletId: 'wallet-user', direction: 'DEBIT', amountMinor: 1_000n },
  { walletId: 'wallet-merchant', direction: 'CREDIT', amountMinor: 1_000n },
];

export const ledgerTestCases: LedgerTestCase[] = [
  {
    name: 'accepts balanced entries',
    run: () => validateBalancedEntries(balancedEntries),
  },
  {
    name: 'rejects a single entry',
    run: () => expectThrows(
      () => validateBalancedEntries([balancedEntries[0]]),
      'at least two entries',
    ),
  },
  {
    name: 'rejects zero or negative amounts',
    run: () => expectThrows(
      () => validateBalancedEntries([
        { walletId: 'a', direction: 'DEBIT', amountMinor: 0n },
        { walletId: 'b', direction: 'CREDIT', amountMinor: 0n },
      ]),
      'greater than zero',
    ),
  },
  {
    name: 'rejects unbalanced entries',
    run: () => expectThrows(
      () => validateBalancedEntries([
        { walletId: 'a', direction: 'DEBIT', amountMinor: 1_000n },
        { walletId: 'b', direction: 'CREDIT', amountMinor: 900n },
      ]),
      'not balanced',
    ),
  },
  {
    name: 'reverses debit and credit directions',
    run: () => {
      const reversed = reverseEntries(balancedEntries);
      if (reversed[0].direction !== 'CREDIT' || reversed[1].direction !== 'DEBIT') {
        throw new Error('Ledger entries were not reversed correctly.');
      }
      validateBalancedEntries(reversed);
    },
  },
];
