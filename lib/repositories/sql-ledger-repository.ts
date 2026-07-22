import type { SqlClient } from '@/lib/db/sql';
import { validateBalancedEntries } from '@/lib/domain/ledger';
import type {
  LedgerRecord,
  LedgerRepository,
  LedgerTransactionInput,
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

export class SqlLedgerRepository implements LedgerRepository {
  constructor(private readonly client: SqlClient) {}

  async findById(id: string): Promise<LedgerRecord | null> {
    const result = await this.client.query<LedgerTransactionRow>(
      `SELECT id, transaction_type, external_reference, idempotency_key, status,
              occurred_at, reversed_transaction_id
       FROM ledger_transactions
       WHERE id = $1`,
      [id],
    );

    const row = result.rows[0];
    if (!row) return null;

    return {
      id: row.id,
      transactionType: row.transaction_type,
      externalReference: row.external_reference,
      idempotencyKey: row.idempotency_key,
      status: row.status,
      occurredAt: new Date(row.occurred_at),
      reversedTransactionId: row.reversed_transaction_id,
    };
  }

  async findByIdempotencyKey(key: string): Promise<LedgerRecord | null> {
    const result = await this.client.query<LedgerTransactionRow>(
      `SELECT id, transaction_type, external_reference, idempotency_key, status,
              occurred_at, reversed_transaction_id
       FROM ledger_transactions
       WHERE idempotency_key = $1`,
      [key],
    );

    const row = result.rows[0];
    if (!row) return null;

    return {
      id: row.id,
      transactionType: row.transaction_type,
      externalReference: row.external_reference,
      idempotencyKey: row.idempotency_key,
      status: row.status,
      occurredAt: new Date(row.occurred_at),
      reversedTransactionId: row.reversed_transaction_id,
    };
  }

  async create(input: LedgerTransactionInput): Promise<LedgerRecord> {
    validateBalancedEntries(input.entries);

    const existing = await this.findByIdempotencyKey(input.idempotencyKey);
    if (existing) return existing;

    const transactionResult = await this.client.query<LedgerTransactionRow>(
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

    const transaction = transactionResult.rows[0];
    if (!transaction) throw new Error('Ledger transaction could not be created.');

    for (const entry of input.entries) {
      await this.client.query(
        `INSERT INTO ledger_entries
           (ledger_transaction_id, wallet_id, direction, amount_minor)
         VALUES ($1, $2, $3, $4)`,
        [transaction.id, entry.walletId, entry.direction, entry.amountMinor.toString()],
      );
    }

    return {
      id: transaction.id,
      transactionType: transaction.transaction_type,
      externalReference: transaction.external_reference,
      idempotencyKey: transaction.idempotency_key,
      status: transaction.status,
      occurredAt: new Date(transaction.occurred_at),
      reversedTransactionId: transaction.reversed_transaction_id,
    };
  }
}
