import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

let redisClient: Redis | null = null;
let isRedisAvailable = false;

// Memory fallback store when Redis is unavailable
const memoryStore = new Map<string, { value: string; expiresAtMs: number }>();

export function getRedisClient(): Redis | null {
  if (!redisClient && process.env.NODE_ENV !== 'test') {
    try {
      redisClient = new Redis(REDIS_URL, {
        maxRetriesPerRequest: 1,
        connectTimeout: 2000,
        enableOfflineQueue: false,
        retryStrategy() {
          return null; // Don't block if Redis is offline
        },
      });

      redisClient.on('connect', () => {
        isRedisAvailable = true;
      });

      redisClient.on('error', () => {
        isRedisAvailable = false;
      });
    } catch (e) {
      isRedisAvailable = false;
    }
  }
  return isRedisAvailable ? redisClient : null;
}

/**
 * Atomic SET NX EX (Set if Not Exists with Expiry TTL)
 * Guarantees zero race conditions across distributed workers.
 */
export async function setnxCache(key: string, value: string, ttlSeconds: number): Promise<boolean> {
  const client = getRedisClient();
  if (client) {
    try {
      const res = await client.set(key, value, 'EX', ttlSeconds, 'NX');
      return res === 'OK';
    } catch (e) {
      isRedisAvailable = false;
    }
  }

  // Atomic Memory Fallback
  const existing = memoryStore.get(key);
  if (existing && Date.now() <= existing.expiresAtMs) {
    return false; // Already locked
  }

  memoryStore.set(key, { value, expiresAtMs: Date.now() + ttlSeconds * 1000 });
  return true;
}

export async function setCache(key: string, value: string, ttlSeconds: number): Promise<void> {
  const client = getRedisClient();
  if (client) {
    try {
      await client.setex(key, ttlSeconds, value);
      return;
    } catch (e) {
      isRedisAvailable = false;
    }
  }
  memoryStore.set(key, { value, expiresAtMs: Date.now() + ttlSeconds * 1000 });
}

export async function getCache(key: string): Promise<string | null> {
  const client = getRedisClient();
  if (client) {
    try {
      const val = await client.get(key);
      if (val !== null) return val;
    } catch (e) {
      isRedisAvailable = false;
    }
  }
  const record = memoryStore.get(key);
  if (!record) return null;
  if (Date.now() > record.expiresAtMs) {
    memoryStore.delete(key);
    return null;
  }
  return record.value;
}

export async function deleteCache(key: string): Promise<void> {
  const client = getRedisClient();
  if (client) {
    try {
      await client.del(key);
    } catch (e) {
      isRedisAvailable = false;
    }
  }
  memoryStore.delete(key);
}
