import { Request, Response, NextFunction } from 'express';
interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
    keyPrefix?: string;
    skipPaths?: string[];
}
/**
 * Create distributed rate limiter middleware
 */
export declare function createRateLimiter(customConfig?: Partial<RateLimitConfig>): (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Stricter rate limiter for sensitive endpoints
 */
export declare const strictRateLimiter: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * API rate limiter for code generation
 */
export declare const generationRateLimiter: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const rateLimiter: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export {};
//# sourceMappingURL=redis-rate-limiter.d.ts.map