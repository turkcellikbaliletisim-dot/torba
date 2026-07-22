import { normalizeIdempotencyKey } from '@/lib/domain/idempotency';
import type { LedgerEntryInput } from '@/lib/domain/ledger';
import { validateBalancedEntries } from '@/lib/domain/ledger';
import type { SqlDatabase } from '@/lib/db/sql';
import { SqlUnitOfWork } from '@/lib/db/unit-of-work';
import { SqlLedgerRepository } from '@/lib/repositories/sql-ledger-repository';
import { SqlWalletRepository } from '@/lib/repositories/sql-wallet-repository';

export interface PostFinancialTransactionInput {
  transactionType: string;
  idempotencyKey: string;
  externalReference?: string;
  entries: LedgerEntryInput[];
}

export class FinancialTransactionService {
  private readonly unitOfWork: SqlUnitOfWork;

  constructor(database: SqlDatabase) {
    this.unitOfWork = new SqlUnitOfWork(database);
  }

  async post(input: PostFinancialTransactionInput) {
    const idempotencyKey = normalizeIdempotencyKey(input.idempotencyKey);
    validateBalancedEntries(input.entries);

    return this.unitOfWork.run(async ({ client }) => {
      const walletRepository = new SqlWalletRepository(client);
      const ledgerRepository = new SqlLedgerRepository(client);

      const walletIds = [...new Set(input.entries.map((entry) => entry.walletId))].sort();
      for (const walletId of walletIds) {
        const wallet = await walletRepository.lockById(walletId);
        if (!wallet) {
          throw new Error(`Wallet ${walletId} was not found.`);
        }
        if (wallet.status !== 'ACTIVE') {
          throw new Error(`Wallet ${walletId} is not active.`);
        }
      }

      return ledgerRepository.create({
        transactionType: input.transactionType,
        idempotencyKey,
        externalReference: input.externalReference,
        entries: input.entries,
      });
    });
  }
}
