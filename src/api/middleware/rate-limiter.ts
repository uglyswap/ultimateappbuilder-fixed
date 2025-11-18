import { Request, Response, NextFunction } from 'express';
import { config } from '@/config';
import { logger } from '@/utils/logger';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Clean up old entries every hour
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 3600000);

export function rateLimiter(req: Request, res: Response, next: NextFunction): void {
  // Skip rate limiting for health check
  if (req.path === '/health') {
    return next();
  }

  const identifier = req.ip || 'unknown';
  const now = Date.now();
  const windowMs = config.rateLimit.windowMs;
  const maxRequests = config.rateLimit.maxRequests;

  if (!store[identifier] || store[identifier].resetTime < now) {
    // Initialize or reset
    store[identifier] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return next();
  }

  store[identifier].count++;

  // Set rate limit headers
  const remaining = Math.max(0, maxRequests - store[identifier].count);
  const resetTime = Math.ceil(store[identifier].resetTime / 1000);

  res.setHeader('X-RateLimit-Limit', maxRequests.toString());
  res.setHeader('X-RateLimit-Remaining', remaining.toString());
  res.setHeader('X-RateLimit-Reset', resetTime.toString());

  if (store[identifier].count > maxRequests) {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      count: store[identifier].count,
    });

    res.status(429).json({
      status: 'error',
      message: 'Too many requests, please try again later.',
      retryAfter: Math.ceil((store[identifier].resetTime - now) / 1000),
    });
    return;
  }

  next();
}
