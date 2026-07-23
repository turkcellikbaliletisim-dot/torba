import { Pool, QueryResult, QueryResultRow } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://torbaa_user:torbaa_password_2026@localhost:5432/torbaa_db';

let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected PostgreSQL Pool Error:', err);
    });
  }
  return pool;
}

export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const p = getDbPool();
  return p.query<T>(text, params);
}
