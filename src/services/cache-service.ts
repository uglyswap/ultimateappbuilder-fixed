import Redis from 'ioredis';
import { config } from '@/config';
import { logger } from '@/utils/logger';

class CacheService {
  private redis: Redis | null = null;
  private isConnected = false;

  /**
   * Initialize Redis connection
   */
  async initialize(): Promise<void> {
    try {
      this.redis = new Redis(config.redis.url, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          if (times > 3) return null;
          return Math.min(times * 100, 3000);
        },
      });

      this.redis.on('connect', () => {
        this.isConnected = true;
        logger.info('Redis cache connected');
      });

      this.redis.on('error', (error) => {
        logger.error('Redis cache error', { error: error.message });
        this.isConnected = false;
      });

      this.redis.on('close', () => {
        this.isConnected = false;
      });

      // Test connection
      await this.redis.ping();
    } catch (error) {
      logger.warn('Redis cache not available, falling back to no-cache mode', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      this.redis = null;
    }
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.redis || !this.isConnected) return null;

    try {
      const value = await this.redis.get(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error('Cache get error', { key, error });
      return null;
    }
  }

  /**
   * Set value in cache
   */
  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    if (!this.redis || !this.isConnected) return;

    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds) {
        await this.redis.setex(key, ttlSeconds, serialized);
      } else {
        await this.redis.set(key, serialized);
      }
    } catch (error) {
      logger.error('Cache set error', { key, error });
    }
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<void> {
    if (!this.redis || !this.isConnected) return;

    try {
      await this.redis.del(key);
    } catch (error) {
      logger.error('Cache delete error', { key, error });
    }
  }

  /**
   * Delete multiple keys by pattern
   */
  async deletePattern(pattern: string): Promise<void> {
    if (!this.redis || !this.isConnected) return;

    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      logger.error('Cache delete pattern error', { pattern, error });
    }
  }

  /**
   * Get or set cache value
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttlSeconds?: number
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    await this.set(key, value, ttlSeconds);
    return value;
  }

  /**
   * Increment counter
   */
  async increment(key: string, ttlSeconds?: number): Promise<number> {
    if (!this.redis || !this.isConnected) return 0;

    try {
      const value = await this.redis.incr(key);
      if (ttlSeconds && value === 1) {
        await this.redis.expire(key, ttlSeconds);
      }
      return value;
    } catch (error) {
      logger.error('Cache increment error', { key, error });
      return 0;
    }
  }

  /**
   * Check if connected
   */
  isAvailable(): boolean {
    return this.isConnected;
  }

  /**
   * Shutdown connection
   */
  async shutdown(): Promise<void> {
    if (this.redis) {
      await this.redis.quit();
      this.redis = null;
      this.isConnected = false;
    }
  }
}

export const cacheService = new CacheService();

// Cache key generators
export const CacheKeys = {
  templates: () => 'templates:all',
  template: (id: string) => `templates:${id}`,
  aiModels: () => 'ai-models:all',
  aiModelsByProvider: (provider: string) => `ai-models:provider:${provider}`,
  userProjects: (userId: string) => `user:${userId}:projects`,
  project: (id: string) => `project:${id}`,
  rateLimit: (identifier: string, window: string) => `ratelimit:${identifier}:${window}`,
};

// Cache TTL constants (in seconds)
export const CacheTTL = {
  TEMPLATES: 3600, // 1 hour
  AI_MODELS: 300, // 5 minutes
  PROJECTS: 60, // 1 minute
  RATE_LIMIT: 900, // 15 minutes
};
