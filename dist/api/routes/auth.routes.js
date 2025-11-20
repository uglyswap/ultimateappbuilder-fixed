"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const auth_service_1 = require("../../services/auth-service");
const auth_1 = require("../../api/middleware/auth");
const validate_request_1 = require("../../api/middleware/validate-request");
const logger_1 = require("../../utils/logger");
const router = (0, express_1.Router)();
// Validation schemas
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8).max(100),
    name: zod_1.z.string().min(1).max(100).optional(),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
const refreshSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1),
});
const changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1),
    newPassword: zod_1.z.string().min(8).max(100),
});
/**
 * Register new user
 * POST /api/auth/register
 */
router.post('/register', (0, validate_request_1.validateRequest)({ body: registerSchema }), async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const result = await auth_service_1.authService.register(email, password, name);
        res.status(201).json({
            status: 'success',
            data: result,
        });
    }
    catch (error) {
        logger_1.logger.error('Registration failed', { error });
        const message = error instanceof Error ? error.message : 'Registration failed';
        const status = message.includes('already registered') ? 409 : 500;
        res.status(status).json({
            status: 'error',
            message,
        });
    }
});
/**
 * Login user
 * POST /api/auth/login
 */
router.post('/login', (0, validate_request_1.validateRequest)({ body: loginSchema }), async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await auth_service_1.authService.login(email, password);
        res.json({
            status: 'success',
            data: result,
        });
    }
    catch (error) {
        logger_1.logger.warn('Login failed', { error, email: req.body.email });
        res.status(401).json({
            status: 'error',
            message: 'Invalid email or password',
        });
    }
});
/**
 * Refresh access token
 * POST /api/auth/refresh
 */
router.post('/refresh', (0, validate_request_1.validateRequest)({ body: refreshSchema }), async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const tokens = await auth_service_1.authService.refreshToken(refreshToken);
        res.json({
            status: 'success',
            data: { tokens },
        });
    }
    catch (error) {
        res.status(401).json({
            status: 'error',
            message: 'Invalid refresh token',
        });
    }
});
/**
 * Get current user
 * GET /api/auth/me
 */
router.get('/me', auth_1.authMiddleware, async (req, res) => {
    try {
        const user = await auth_service_1.authService.getUserById(req.user.userId);
        if (!user) {
            res.status(404).json({
                status: 'error',
                message: 'User not found',
            });
            return;
        }
        res.json({
            status: 'success',
            data: { user },
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to get user',
        });
    }
});
/**
 * Change password
 * POST /api/auth/change-password
 */
router.post('/change-password', auth_1.authMiddleware, (0, validate_request_1.validateRequest)({ body: changePasswordSchema }), async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        await auth_service_1.authService.changePassword(req.user.userId, currentPassword, newPassword);
        res.json({
            status: 'success',
            message: 'Password changed successfully',
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to change password';
        const status = message.includes('incorrect') ? 400 : 500;
        res.status(status).json({
            status: 'error',
            message,
        });
    }
});
/**
 * Logout (client-side token deletion, just acknowledge)
 * POST /api/auth/logout
 */
router.post('/logout', auth_1.authMiddleware, async (req, res) => {
    logger_1.logger.info('User logged out', { userId: req.user.userId });
    res.json({
        status: 'success',
        message: 'Logged out successfully',
    });
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map