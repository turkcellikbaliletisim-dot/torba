import crypto from 'crypto';
import { setCache, getCache, deleteCache, setnxCache } from '@/lib/db/redis';
import { query } from '@/lib/db';

export type IdempotencyState = 'PROCESSING' | 'COMPLETED' | 'FAILED_RETRYABLE' | 'FAILED_FINAL';

export interface IdempotencyRecord {
  key: string;
  payloadHash: string;
  state: IdempotencyState;
  statusCode?: number;
  responseBody?: any;
  createdAtMs: number;
}

export function computePayloadHash(payload: any): string {
  const str = typeof payload === 'string' ? payload : JSON.stringify(payload || {});
  return crypto.createHash('sha256').update(str).digest('hex');
}

/**
 * True Atomic Idempotency Lock Acquisition via Redis SET NX EX / DB Lock (Item 4.2)
 */
export async function acquireIdempotencyLock(
  key: string,
  payload: any,
  ttlSeconds = 60
): Promise<{ acquired: boolean; conflict?: boolean; existingRecord?: IdempotencyRecord }> {
  const cacheKey = `idempotency:${key}`;
  const incomingHash = computePayloadHash(payload);

  const processingRecord: IdempotencyRecord = {
    key,
    payloadHash: incomingHash,
    state: 'PROCESSING',
    createdAtMs: Date.now(),
  };

  // Try True Atomic SET NX EX
  const isAcquired = await setnxCache(cacheKey, JSON.stringify(processingRecord), ttlSeconds);

  if (isAcquired) {
    return { acquired: true };
  }

  // If atomic lock failed, fetch existing record for conflict check or cached response
  const existing = await getCache(cacheKey);
  if (existing) {
    const record: IdempotencyRecord = JSON.parse(existing);

    // Payload Hash Conflict Check (Item 4.2)
    if (record.payloadHash && record.payloadHash !== incomingHash) {
      return { acquired: false, conflict: true, existingRecord: record };
    }

    return { acquired: false, conflict: false, existingRecord: record };
  }

  return { acquired: false };
}

export async function saveIdempotentResult(
  key: string,
  payload: any,
  state: IdempotencyState,
  statusCode: number,
  responseBody: any,
  ttlSeconds = 86400
): Promise<void> {
  const cacheKey = `idempotency:${key}`;
  const payloadHash = computePayloadHash(payload);
  const record: IdempotencyRecord = {
    key,
    payloadHash,
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
