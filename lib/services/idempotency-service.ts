import { setCache, getCache } from '@/lib/db/redis';
import { query } from '@/lib/db';

export interface IdempotencyRecord {
  key: string;
  statusCode: number;
  responseBody: any;
  createdAtMs: number;
}

/**
 * Checks if an idempotency key has already been processed within the 24-hour window.
 */
export async function getIdempotentResult(key: string): Promise<IdempotencyRecord | null> {
  const cacheKey = `idempotency:${key}`;
  const cached = await getCache(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  // Fallback DB Query
  try {
    const res = await query('SELECT key, status_code, response_body, created_at FROM idempotency_keys WHERE key = $1 LIMIT 1', [key]);
    if (res && res.rows.length > 0) {
      const row = res.rows[0];
      return {
        key: row.key,
        statusCode: row.status_code,
        responseBody: row.response_body,
        createdAtMs: new Date(row.created_at).getTime(),
      };
    }
  } catch (e) {
    // Non-blocking fallback
  }

  return null;
}

/**
 * Stores the result of an idempotent transaction for 24 hours.
 */
export async function saveIdempotentResult(key: string, statusCode: number, responseBody: any): Promise<void> {
  const cacheKey = `idempotency:${key}`;
  const record: IdempotencyRecord = {
    key,
    statusCode,
    responseBody,
    createdAtMs: Date.now(),
  };

  const ttlSeconds = 86400; // 24 hours
  await setCache(cacheKey, JSON.stringify(record), ttlSeconds);

  try {
    await query(
      `INSERT INTO idempotency_keys (key, status_code, response_body, created_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (key) DO NOTHING`,
      [key, statusCode, JSON.stringify(responseBody)]
    );
  } catch (e) {
    // Non-blocking DB fallback
  }
}
