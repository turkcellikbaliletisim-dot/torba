export interface DatabaseConfig {
  connectionString: string;
  applicationName: string;
  statementTimeoutMs: number;
  idleTransactionTimeoutMs: number;
  ssl: boolean;
}

function parsePositiveInteger(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    throw new Error(`Expected a positive integer, received: ${value}`);
  }
  return parsed;
}

export function getDatabaseConfig(env: NodeJS.ProcessEnv = process.env): DatabaseConfig {
  const connectionString = env.DATABASE_URL?.trim();
  if (!connectionString) {
    throw new Error('DATABASE_URL is required.');
  }

  return {
    connectionString,
    applicationName: env.DATABASE_APPLICATION_NAME?.trim() || 'torbaa-web',
    statementTimeoutMs: parsePositiveInteger(env.DATABASE_STATEMENT_TIMEOUT_MS, 10_000),
    idleTransactionTimeoutMs: parsePositiveInteger(
      env.DATABASE_IDLE_TRANSACTION_TIMEOUT_MS,
      15_000,
    ),
    ssl: env.DATABASE_SSL === 'true',
  };
}
