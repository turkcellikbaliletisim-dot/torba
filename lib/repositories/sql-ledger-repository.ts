import type { SqlClient } from '@/lib/db/sql';
import { validateBalancedEntries } from '@/lib/domain/ledger';
import type {
  LedgerEntryRecord,
  LedgerRepository,
  LedgerTransactionInput,
  LedgerTransactionRecord,
} from '@/lib/repositories/contracts';

interface LedgerTransactionRow {
  id: string;
  transaction_type: string;
  external_reference: string | null;
  idempotency_key: string;
  status: string;
  occurred_at: string | Date;
  reversed_transaction_id: string | null;
}

interface LedgerEntryRow {
  id: string;
  ledger_transaction_id: string;
  wallet_id: string;
  direction: 'DEBIT' | 'CREDIT';
  amount_minor: string | number | bigint;
}

function mapTransaction(row: LedgerTransactionRow): LedgerTransactionRecord {
  return {
    id: row.id,
    transactionType: row.transaction_type,
    ...(row.external_reference ? { externalReference: row.external_reference } : {}),
    idempotencyKey: row.idempotency_key,
    status: row.status,
    occurredAt: new Date(row.occurred_at),
    ...(row.reversed_transaction_id
      ? { reversedTransactionId: row.reversed_transaction_id }
      : {}),
  };
}

export class SqlLedgerRepository implements LedgerRepository {
  constructor(private readonly client: SqlClient) {}

  async findTransactionById(id: string): Promise<LedgerTransactionRecord | null> {
    const result = await this.client.query<LedgerTransactionRow>(
      `SELECT id, transaction_type, external_reference, idempotency_key, status,
              occurred_at, reversed_transaction_id
       FROM ledger_transactions
       WHERE id = $1`,
      [id],
    );

    return result.rows[0] ? mapTransaction(result.rows[0]) : null;
  }

  async findTransactionByIdempotencyKey(
    key: string,
  ): Promise<LedgerTransactionRecord | null> {
    const result = await this.client.query<LedgerTransactionRow>(
      `SELECT id, transaction_type, external_reference, idempotency_key, status,
              occurred_at, reversed_transaction_id
       FROM ledger_transactions
       WHERE idempotency_key = $1`,
      [key],
    );

    return result.rows[0] ? mapTransaction(result.rows[0]) : null;
  }

  async listEntries(transactionId: string): Promise<LedgerEntryRecord[]> {
    const result = await this.client.query<LedgerEntryRow>(
      `SELECT id, ledger_transaction_id, wallet_id, direction, amount_minor
       FROM ledger_entries
       WHERE ledger_transaction_id = $1
       ORDER BY created_at, id`,
      [transactionId],
    );

    return result.rows.map((row) => ({
      id: row.id,
      ledgerTransactionId: row.ledger_transaction_id,
      walletId: row.wallet_id,
      direction: row.direction,
      amountMinor: BigInt(row.amount_minor),
    }));
  }

  async create(input: LedgerTransactionInput): Promise<LedgerTransactionRecord> {
    validateBalancedEntries(input.entries);

    const existing = await this.findTransactionByIdempotencyKey(input.idempotencyKey);
    if (existing) return existing;

    const result = await this.client.query<LedgerTransactionRow>(
      `INSERT INTO ledger_transactions
         (transaction_type, external_reference, idempotency_key, status, occurred_at, reversed_transaction_id)
       VALUES ($1, $2, $3, 'POSTED', COALESCE($4, NOW()), $5)
       RETURNING id, transaction_type, external_reference, idempotency_key, status,
                 occurred_at, reversed_transaction_id`,
      [
        input.transactionType,
        input.externalReference ?? null,
        input.idempotencyKey,
        input.occurredAt ?? null,
        input.reversedTransactionId ?? null,
      ],
    );

    const transaction = result.rows[0];
    if (!transaction) throw new Error('Ledger transaction could not be created.');

    for (const entry of input.entries) {
      await this.client.query(
        `INSERT INTO ledger_entries
           (ledger_transaction_id, wallet_id, direction, amount_minor)
         VALUES ($1, $2, $3, $4)`,
        [transaction.id, entry.walletId, entry.direction, entry.amountMinor.toString()],
      );
    }

    return mapTransaction(transaction);
  }
}
