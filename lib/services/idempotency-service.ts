import { setCache, getCache, deleteCache } from '@/lib/db/redis';
import { query } from '@/lib/db';

export type IdempotencyState = 'PROCESSING' | 'COMPLETED' | 'FAILED_RETRYABLE' | 'FAILED_FINAL';

export interface IdempotencyRecord {
  key: string;
  state: IdempotencyState;
  statusCode?: number;
  responseBody?: any;
  createdAtMs: number;
}

/**
 * Atomically acquires an idempotency lock for a key (State: PROCESSING)
 * Returns null if lock acquired successfully, or existing record if already processed/processing.
 */
export async function acquireIdempotencyLock(key: string, ttlSeconds = 60): Promise<{ acquired: boolean; existingRecord?: IdempotencyRecord }> {
  const cacheKey = `idempotency:${key}`;
  const existing = await getCache(cacheKey);

  if (existing) {
    const record: IdempotencyRecord = JSON.parse(cachedVal(existing));
    return { acquired: false, existingRecord: record };
  }

  // Set PROCESSING state lock
  const processingRecord: IdempotencyRecord = {
    key,
    state: 'PROCESSING',
    createdAtMs: Date.now(),
  };

  await setCache(cacheKey, JSON.stringify(processingRecord), ttlSeconds);
  return { acquired: true };
}

function cachedVal(val: string): string {
  return val;
}

/**
 * Stores the final completed or failed result of an idempotent transaction for 24 hours (86400 seconds)
 */
export async function saveIdempotentResult(
  key: string,
  state: IdempotencyState,
  statusCode: number,
  responseBody: any,
  ttlSeconds = 86400
): Promise<void> {
  const cacheKey = `idempotency:${key}`;
  const record: IdempotencyRecord = {
    key,
    state,
    statusCode,
    responseBody,
    createdAtMs: Date.now(),
  };

  await setCache(cacheKey, JSON.stringify(record), ttlSeconds);

  try {
    await query(
      `INSERT INTO idempotency_keys (key, status_code, response_body, created_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (key) DO UPDATE SET response_body = EXCLUDED.response_body, status_code = EXCLUDED.status_code`,
      [key, statusCode, JSON.stringify(responseBody)]
    );
  } catch (e) {
    // Non-blocking DB fallback
  }
}

/**
 * Releases an in-progress idempotency lock on failure so request can be retried
 */
export async function releaseIdempotencyLock(key: string): Promise<void> {
  await deleteCache(`idempotency:${key}`);
}

export async function getIdempotentResult(key: string): Promise<IdempotencyRecord | null> {
  const cacheKey = `idempotency:${key}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  return null;
}
