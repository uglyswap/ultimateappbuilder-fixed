"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = exports.generationRateLimiter = exports.strictRateLimiter = void 0;
exports.createRateLimiter = createRateLimiter;
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = require("../../config");
const logger_1 = require("../../utils/logger");
let redis = null;
// Initialize Redis for rate limiting
async function getRedis() {
    if (redis)
        return redis;
    try {
        redis = new ioredis_1.default(config_1.config.redis.url, {
            maxRetriesPerRequest: 1,
            retryStrategy: () => null, // Don't retry for rate limiting
        });
        await redis.ping();
        return redis;
    }
    catch (error) {
        logger_1.logger.warn('Redis not available for rate limiting, using in-memory fallback');
        return null;
    }
}
// In-memory fallback store
const memoryStore = new Map();
// Clean up old entries every hour
setInterval(() => {
    const now = Date.now();
    memoryStore.forEach((value, key) => {
        if (value.resetTime < now) {
            memoryStore.delete(key);
        }
    });
}, 3600000);
/**
 * Create distributed rate limiter middleware
 */
function createRateLimiter(customConfig) {
    const rateLimitConfig = {
        windowMs: config_1.config.rateLimit.windowMs,
        maxRequests: config_1.config.rateLimit.maxRequests,
        keyPrefix: 'ratelimit',
        skipPaths: ['/health', '/api-docs'],
        ...customConfig,
    };
    return async (req, res, next) => {
        // Skip rate limiting for certain paths
        if (rateLimitConfig.skipPaths?.some(path => req.path.startsWith(path))) {
            return next();
        }
        const identifier = req.ip || 'unknown';
        const windowKey = Math.floor(Date.now() / rateLimitConfig.windowMs);
        const key = `${rateLimitConfig.keyPrefix}:${identifier}:${windowKey}`;
        try {
            const redisClient = await getRedis();
            let currentCount;
            let resetTime;
            if (redisClient) {
                // Use Redis for distributed rate limiting
                const multi = redisClient.multi();
                multi.incr(key);
                multi.pttl(key);
                const results = await multi.exec();
                if (!results) {
                    return next();
                }
                currentCount = results[0][1];
                const ttl = results[1][1];
                // Set expiry on first request in window
                if (currentCount === 1) {
                    await redisClient.pexpire(key, rateLimitConfig.windowMs);
                    resetTime = Date.now() + rateLimitConfig.windowMs;
                }
                else {
                    resetTime = Date.now() + (ttl > 0 ? ttl : rateLimitConfig.windowMs);
                }
            }
            else {
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
                }
                else {
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
                logger_1.logger.warn('Rate limit exceeded', {
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
        }
        catch (error) {
            // On error, allow request through
            logger_1.logger.error('Rate limiter error', { error });
            next();
        }
    };
}
/**
 * Stricter rate limiter for sensitive endpoints
 */
exports.strictRateLimiter = createRateLimiter({
    windowMs: 60000, // 1 minute
    maxRequests: 5,
    keyPrefix: 'ratelimit:strict',
});
/**
 * API rate limiter for code generation
 */
exports.generationRateLimiter = createRateLimiter({
    windowMs: 60000, // 1 minute
    maxRequests: 10,
    keyPrefix: 'ratelimit:generation',
});
// Default rate limiter
exports.rateLimiter = createRateLimiter();
//# sourceMappingURL=redis-rate-limiter.js.map