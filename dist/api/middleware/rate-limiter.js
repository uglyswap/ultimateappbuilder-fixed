"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = rateLimiter;
const config_1 = require("../../config");
const logger_1 = require("../../utils/logger");
const store = {};
// Clean up old entries every hour
setInterval(() => {
    const now = Date.now();
    Object.keys(store).forEach(key => {
        if (store[key].resetTime < now) {
            delete store[key];
        }
    });
}, 3600000);
function rateLimiter(req, res, next) {
    // Skip rate limiting for health check
    if (req.path === '/health') {
        return next();
    }
    const identifier = req.ip || 'unknown';
    const now = Date.now();
    const windowMs = config_1.config.rateLimit.windowMs;
    const maxRequests = config_1.config.rateLimit.maxRequests;
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
        logger_1.logger.warn('Rate limit exceeded', {
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
//# sourceMappingURL=rate-limiter.js.map