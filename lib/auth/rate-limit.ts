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
    private readonly limit: number,
    private readonly windowSeconds: number,
  ) {
    if (!Number.isInteger(limit) || limit <= 0) throw new Error('Rate limit must be positive.');
    if (!Number.isInteger(windowSeconds) || windowSeconds <= 0) throw new Error('Rate limit window must be positive.');
  }

  consume(key: string, now = Date.now()): RateLimitDecision {
    const existing = this.buckets.get(key);
    const windowMs = this.windowSeconds * 1000;
    const bucket = !existing || existing.resetAt <= now
      ? { count: 0, resetAt: now + windowMs }
      : existing;

    bucket.count += 1;
    this.buckets.set(key, bucket);

    return {
      allowed: bucket.count <= this.limit,
      remaining: Math.max(0, this.limit - bucket.count),
      retryAfterSeconds: Math.max(0, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }
}
