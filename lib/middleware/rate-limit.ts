import { setCache, getCache } from '@/lib/db/redis';

interface RateLimitRecord {
  timestamps: number[];
}

const memoryRateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Distributed Sliding Window Rate Limiter
 * @param identifier IP address, phone number, or User ID
 * @param limit Maximum allowed requests within the time window
 * @param windowSeconds Time window in seconds (default: 60 seconds)
 */
export async function checkRateLimitAsync(
  identifier: string,
  limit = 5,
  windowSeconds = 60
): Promise<{ allowed: boolean; remaining: number; resetSeconds: number }> {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const cutoff = now - windowMs;
  const redisKey = `ratelimit:${identifier}`;

  try {
    const cached = await getCache(redisKey);
    let timestamps: number[] = cached ? JSON.parse(cached) : [];

    // Filter out old timestamps
    timestamps = timestamps.filter((ts) => ts > cutoff);

    if (timestamps.length >= limit) {
      const oldest = timestamps[0];
      const resetMs = oldest + windowMs - now;
      return {
        allowed: false,
        remaining: 0,
        resetSeconds: Math.max(1, Math.ceil(resetMs / 1000)),
      };
    }

    timestamps.push(now);
    await setCache(redisKey, JSON.stringify(timestamps), windowSeconds);

    return {
      allowed: true,
      remaining: limit - timestamps.length,
      resetSeconds: windowSeconds,
    };
  } catch (e) {
    // In-memory fallback
    return checkRateLimitSync(identifier, limit, windowSeconds);
  }
}

export function checkRateLimitSync(
  identifier: string,
  limit = 5,
  windowSeconds = 60
): { allowed: boolean; remaining: number; resetSeconds: number } {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const cutoff = now - windowMs;

  let record = memoryRateLimitStore.get(identifier);
  if (!record) {
    record = { timestamps: [] };
    memoryRateLimitStore.set(identifier, record);
  }

  record.timestamps = record.timestamps.filter((ts) => ts > cutoff);

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0];
    const resetMs = oldest + windowMs - now;
    return {
      allowed: false,
      remaining: 0,
      resetSeconds: Math.max(1, Math.ceil(resetMs / 1000)),
    };
  }

  record.timestamps.push(now);
  return {
    allowed: true,
    remaining: limit - record.timestamps.length,
    resetSeconds: windowSeconds,
  };
}
