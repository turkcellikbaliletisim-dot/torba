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
  // In-memory fallback
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
  // In-memory fallback
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
