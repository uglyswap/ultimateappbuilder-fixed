"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.optionalAuth = optionalAuth;
exports.requireRole = requireRole;
const auth_service_1 = require("../../services/auth-service");
const logger_1 = require("../../utils/logger");
/**
 * Authentication middleware - requires valid JWT
 */
function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                status: 'error',
                message: 'Authentication required',
            });
            return;
        }
        const token = authHeader.substring(7);
        const payload = auth_service_1.authService.verifyAccessToken(token);
        req.user = payload;
        next();
    }
    catch (error) {
        logger_1.logger.warn('Authentication failed', {
            error: error instanceof Error ? error.message : 'Unknown error',
            path: req.path,
        });
        res.status(401).json({
            status: 'error',
            message: 'Invalid or expired token',
        });
    }
}
/**
 * Optional authentication - attaches user if token present
 */
function optionalAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const payload = auth_service_1.authService.verifyAccessToken(token);
            req.user = payload;
        }
    }
    catch {
        // Ignore errors for optional auth
    }
    next();
}
/**
 * Role-based authorization middleware
 */
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                status: 'error',
                message: 'Authentication required',
            });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                status: 'error',
                message: 'Insufficient permissions',
            });
            return;
        }
        next();
    };
}
//# sourceMappingURL=auth.js.map