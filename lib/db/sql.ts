export interface SqlQueryResult<Row> {
  rows: Row[];
  rowCount: number;
}

export interface SqlClient {
  query<Row = Record<string, unknown>>(
    text: string,
    values?: readonly unknown[],
  ): Promise<SqlQueryResult<Row>>;
}

export interface SqlTransactionClient extends SqlClient {
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

export interface SqlDatabase extends SqlClient {
  beginTransaction(): Promise<SqlTransactionClient>;
}

export async function withSqlTransaction<T>(
  database: SqlDatabase,
  work: (client: SqlTransactionClient) => Promise<T>,
): Promise<T> {
  const client = await database.beginTransaction();

  try {
    const result = await work(client);
    await client.commit();
    return result;
  } catch (error) {
    await client.rollback();
    throw error;
  }
}
