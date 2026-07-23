export interface RateLimitDecision {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

export class InMemoryRateLimiter {
  private readonly buckets = new Map<string, Bucket>();

  constructor(
    private readonly limit = 10,
    private readonly windowSeconds = 15 * 60,
  ) {
    if (!Number.isInteger(limit) || limit <= 0) throw new Error('Rate limit must be positive.');
    if (!Number.isInteger(windowSeconds) || windowSeconds <= 0) throw new Error('Rate limit window must be positive.');
  }

  consume(key: string, now = Date.now()): RateLimitDecision {
    return this.consumeWithPolicy(key, this.limit, this.windowSeconds * 1000, now);
  }

  allow(key: string, limit: number, windowMs: number, now = Date.now()): boolean {
    return this.consumeWithPolicy(key, limit, windowMs, now).allowed;
  }

  private consumeWithPolicy(
    key: string,
    limit: number,
    windowMs: number,
    now: number,
  ): RateLimitDecision {
    if (!Number.isInteger(limit) || limit <= 0) throw new Error('Rate limit must be positive.');
    if (!Number.isInteger(windowMs) || windowMs <= 0) throw new Error('Rate limit window must be positive.');

    const bucketKey = `${limit}:${windowMs}:${key}`;
    const existing = this.buckets.get(bucketKey);
    const bucket = !existing || existing.resetAt <= now
      ? { count: 0, resetAt: now + windowMs }
      : existing;

    bucket.count += 1;
    this.buckets.set(bucketKey, bucket);

    return {
      allowed: bucket.count <= limit,
      remaining: Math.max(0, limit - bucket.count),
      retryAfterSeconds: Math.max(0, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }
}
