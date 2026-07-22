import type { SqlDatabase, SqlTransactionClient } from '@/lib/db/sql';
import { withSqlTransaction } from '@/lib/db/sql';

export interface TransactionContext {
  client: SqlTransactionClient;
}

export class SqlUnitOfWork {
  constructor(private readonly database: SqlDatabase) {}

  run<T>(work: (context: TransactionContext) => Promise<T>): Promise<T> {
    return withSqlTransaction(this.database, (client) => work({ client }));
  }
}
