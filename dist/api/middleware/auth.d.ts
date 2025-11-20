import { Request, Response, NextFunction } from 'express';
export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
        role: string;
    };
}
/**
 * Authentication middleware - requires valid JWT
 */
export declare function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void;
/**
 * Optional authentication - attaches user if token present
 */
export declare function optionalAuth(req: AuthRequest, res: Response, next: NextFunction): void;
/**
 * Role-based authorization middleware
 */
export declare function requireRole(...roles: string[]): (req: AuthRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map