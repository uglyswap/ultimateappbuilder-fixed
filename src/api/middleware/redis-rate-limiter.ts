import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { config } from '@/config';
import { logger } from '@/utils/logger';

let redis: Redis | null = null;

// Initialize Redis for rate limiting
async function getRedis(): Promise<Redis | null> {
  if (redis) return redis;

  try {
    redis = new Redis(config.redis.url, {
      maxRetriesPerRequest: 1,
      retryStrategy: () => null, // Don't retry for rate limiting
    });

    await redis.ping();
    return redis;
  } catch (error) {
    logger.warn('Redis not available for rate limiting, using in-memory fallback');
    return null;
  }
}

// In-memory fallback store
const memoryStore: Map<string, { count: number; resetTime: number }> = new Map();

// Clean up old entries every hour
setInterval(() => {
  const now = Date.now();
  memoryStore.forEach((value, key) => {
    if (value.resetTime < now) {
      memoryStore.delete(key);
    }
  });
}, 3600000);

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyPrefix?: string;
  skipPaths?: string[];
}

/**
 * Create distributed rate limiter middleware
 */
export function createRateLimiter(customConfig?: Partial<RateLimitConfig>) {
  const rateLimitConfig: RateLimitConfig = {
    windowMs: config.rateLimit.windowMs,
    maxRequests: config.rateLimit.maxRequests,
    keyPrefix: 'ratelimit',
    skipPaths: ['/health', '/api-docs'],
    ...customConfig,
  };

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Skip rate limiting for certain paths
    if (rateLimitConfig.skipPaths?.some(path => req.path.startsWith(path))) {
      return next();
    }

    const identifier = req.ip || 'unknown';
    const windowKey = Math.floor(Date.now() / rateLimitConfig.windowMs);
    const key = `${rateLimitConfig.keyPrefix}:${identifier}:${windowKey}`;

    try {
      const redisClient = await getRedis();

      let currentCount: number;
      let resetTime: number;

      if (redisClient) {
        // Use Redis for distributed rate limiting
        const multi = redisClient.multi();
        multi.incr(key);
        multi.pttl(key);

        const results = await multi.exec();

        if (!results) {
          return next();
        }

        currentCount = results[0][1] as number;
        const ttl = results[1][1] as number;

        // Set expiry on first request in window
        if (currentCount === 1) {
          await redisClient.pexpire(key, rateLimitConfig.windowMs);
          resetTime = Date.now() + rateLimitConfig.windowMs;
        } else {
          resetTime = Date.now() + (ttl > 0 ? ttl : rateLimitConfig.windowMs);
        }
      } else {
        // Fallback to in-memory
        const now = Date.now();
        const stored = memoryStore.get(key);

        if (!stored || stored.resetTime < now) {
          memoryStore.set(key, {
            count: 1,
            resetTime: now + rateLimitConfig.windowMs,
          });
          currentCount = 1;
          resetTime = now + rateLimitConfig.windowMs;
        } else {
          stored.count++;
          currentCount = stored.count;
          resetTime = stored.resetTime;
        }
      }

      // Set rate limit headers
      const remaining = Math.max(0, rateLimitConfig.maxRequests - currentCount);
      res.setHeader('X-RateLimit-Limit', rateLimitConfig.maxRequests.toString());
      res.setHeader('X-RateLimit-Remaining', remaining.toString());
      res.setHeader('X-RateLimit-Reset', Math.ceil(resetTime / 1000).toString());

      // Check if rate limit exceeded
      if (currentCount > rateLimitConfig.maxRequests) {
        logger.warn('Rate limit exceeded', {
          ip: req.ip,
          path: req.path,
          count: currentCount,
        });

        res.status(429).json({
          status: 'error',
          message: 'Too many requests, please try again later.',
          retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
        });
        return;
      }

      next();
    } catch (error) {
      // On error, allow request through
      logger.error('Rate limiter error', { error });
      next();
    }
  };
}

/**
 * Stricter rate limiter for sensitive endpoints
 */
export const strictRateLimiter = createRateLimiter({
  windowMs: 60000, // 1 minute
  maxRequests: 5,
  keyPrefix: 'ratelimit:strict',
});

/**
 * API rate limiter for code generation
 */
export const generationRateLimiter = createRateLimiter({
  windowMs: 60000, // 1 minute
  maxRequests: 10,
  keyPrefix: 'ratelimit:generation',
});

// Default rate limiter
export const rateLimiter = createRateLimiter();
