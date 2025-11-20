declare class CacheService {
    private redis;
    private isConnected;
    /**
     * Initialize Redis connection
     */
    initialize(): Promise<void>;
    /**
     * Get value from cache
     */
    get<T>(key: string): Promise<T | null>;
    /**
     * Set value in cache
     */
    set(key: string, value: unknown, ttlSeconds?: number): Promise<void>;
    /**
     * Delete value from cache
     */
    delete(key: string): Promise<void>;
    /**
     * Delete multiple keys by pattern
     */
    deletePattern(pattern: string): Promise<void>;
    /**
     * Get or set cache value
     */
    getOrSet<T>(key: string, factory: () => Promise<T>, ttlSeconds?: number): Promise<T>;
    /**
     * Increment counter
     */
    increment(key: string, ttlSeconds?: number): Promise<number>;
    /**
     * Check if connected
     */
    isAvailable(): boolean;
    /**
     * Shutdown connection
     */
    shutdown(): Promise<void>;
}
export declare const cacheService: CacheService;
export declare const CacheKeys: {
    templates: () => string;
    template: (id: string) => string;
    aiModels: () => string;
    aiModelsByProvider: (provider: string) => string;
    userProjects: (userId: string) => string;
    project: (id: string) => string;
    rateLimit: (identifier: string, window: string) => string;
};
export declare const CacheTTL: {
    TEMPLATES: number;
    AI_MODELS: number;
    PROJECTS: number;
    RATE_LIMIT: number;
};
export {};
//# sourceMappingURL=cache-service.d.ts.map