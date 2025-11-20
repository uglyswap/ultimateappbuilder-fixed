"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheTTL = exports.CacheKeys = exports.cacheService = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = require("../config");
const logger_1 = require("../utils/logger");
class CacheService {
    redis = null;
    isConnected = false;
    /**
     * Initialize Redis connection
     */
    async initialize() {
        try {
            this.redis = new ioredis_1.default(config_1.config.redis.url, {
                maxRetriesPerRequest: 3,
                retryStrategy: (times) => {
                    if (times > 3)
                        return null;
                    return Math.min(times * 100, 3000);
                },
            });
            this.redis.on('connect', () => {
                this.isConnected = true;
                logger_1.logger.info('Redis cache connected');
            });
            this.redis.on('error', (error) => {
                logger_1.logger.error('Redis cache error', { error: error.message });
                this.isConnected = false;
            });
            this.redis.on('close', () => {
                this.isConnected = false;
            });
            // Test connection
            await this.redis.ping();
        }
        catch (error) {
            logger_1.logger.warn('Redis cache not available, falling back to no-cache mode', {
                error: error instanceof Error ? error.message : 'Unknown error',
            });
            this.redis = null;
        }
    }
    /**
     * Get value from cache
     */
    async get(key) {
        if (!this.redis || !this.isConnected)
            return null;
        try {
            const value = await this.redis.get(key);
            if (!value)
                return null;
            return JSON.parse(value);
        }
        catch (error) {
            logger_1.logger.error('Cache get error', { key, error });
            return null;
        }
    }
    /**
     * Set value in cache
     */
    async set(key, value, ttlSeconds) {
        if (!this.redis || !this.isConnected)
            return;
        try {
            const serialized = JSON.stringify(value);
            if (ttlSeconds) {
                await this.redis.setex(key, ttlSeconds, serialized);
            }
            else {
                await this.redis.set(key, serialized);
            }
        }
        catch (error) {
            logger_1.logger.error('Cache set error', { key, error });
        }
    }
    /**
     * Delete value from cache
     */
    async delete(key) {
        if (!this.redis || !this.isConnected)
            return;
        try {
            await this.redis.del(key);
        }
        catch (error) {
            logger_1.logger.error('Cache delete error', { key, error });
        }
    }
    /**
     * Delete multiple keys by pattern
     */
    async deletePattern(pattern) {
        if (!this.redis || !this.isConnected)
            return;
        try {
            const keys = await this.redis.keys(pattern);
            if (keys.length > 0) {
                await this.redis.del(...keys);
            }
        }
        catch (error) {
            logger_1.logger.error('Cache delete pattern error', { pattern, error });
        }
    }
    /**
     * Get or set cache value
     */
    async getOrSet(key, factory, ttlSeconds) {
        const cached = await this.get(key);
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
    async increment(key, ttlSeconds) {
        if (!this.redis || !this.isConnected)
            return 0;
        try {
            const value = await this.redis.incr(key);
            if (ttlSeconds && value === 1) {
                await this.redis.expire(key, ttlSeconds);
            }
            return value;
        }
        catch (error) {
            logger_1.logger.error('Cache increment error', { key, error });
            return 0;
        }
    }
    /**
     * Check if connected
     */
    isAvailable() {
        return this.isConnected;
    }
    /**
     * Shutdown connection
     */
    async shutdown() {
        if (this.redis) {
            await this.redis.quit();
            this.redis = null;
            this.isConnected = false;
        }
    }
}
exports.cacheService = new CacheService();
// Cache key generators
exports.CacheKeys = {
    templates: () => 'templates:all',
    template: (id) => `templates:${id}`,
    aiModels: () => 'ai-models:all',
    aiModelsByProvider: (provider) => `ai-models:provider:${provider}`,
    userProjects: (userId) => `user:${userId}:projects`,
    project: (id) => `project:${id}`,
    rateLimit: (identifier, window) => `ratelimit:${identifier}:${window}`,
};
// Cache TTL constants (in seconds)
exports.CacheTTL = {
    TEMPLATES: 3600, // 1 hour
    AI_MODELS: 300, // 5 minutes
    PROJECTS: 60, // 1 minute
    RATE_LIMIT: 900, // 15 minutes
};
//# sourceMappingURL=cache-service.js.map