"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const config_1 = require("../config");
const logger_1 = require("../utils/logger");
const prisma = new client_1.PrismaClient();
class AuthService {
    saltRounds = 12;
    accessTokenExpiry = '15m';
    refreshTokenExpiry = '7d';
    /**
     * Register a new user
     */
    async register(email, password, name) {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error('Email already registered');
        }
        // Hash password
        const passwordHash = await bcrypt_1.default.hash(password, this.saltRounds);
        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                name,
            },
        });
        logger_1.logger.info('User registered', { userId: user.id, email });
        // Generate tokens
        const tokens = this.generateTokens(user.id, user.email, user.role);
        return {
            user: this.formatUser(user),
            tokens,
        };
    }
    /**
     * Login user
     */
    async login(email, password) {
        // Find user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new Error('Invalid email or password');
        }
        // Verify password
        const isValidPassword = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!isValidPassword) {
            throw new Error('Invalid email or password');
        }
        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        logger_1.logger.info('User logged in', { userId: user.id, email });
        // Generate tokens
        const tokens = this.generateTokens(user.id, user.email, user.role);
        return {
            user: this.formatUser(user),
            tokens,
        };
    }
    /**
     * Refresh access token
     */
    async refreshToken(refreshToken) {
        try {
            const payload = jsonwebtoken_1.default.verify(refreshToken, config_1.config.auth.jwtSecret);
            if (payload.type !== 'refresh') {
                throw new Error('Invalid token type');
            }
            // Verify user still exists
            const user = await prisma.user.findUnique({ where: { id: payload.userId } });
            if (!user) {
                throw new Error('User not found');
            }
            return this.generateTokens(user.id, user.email, user.role);
        }
        catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
    /**
     * Verify access token
     */
    verifyAccessToken(token) {
        try {
            const payload = jsonwebtoken_1.default.verify(token, config_1.config.auth.jwtSecret);
            if (payload.type !== 'access') {
                throw new Error('Invalid token type');
            }
            return {
                userId: payload.userId,
                email: payload.email,
                role: payload.role,
            };
        }
        catch (error) {
            throw new Error('Invalid access token');
        }
    }
    /**
     * Get user by ID
     */
    async getUserById(userId) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        return user ? this.formatUser(user) : null;
    }
    /**
     * Change password
     */
    async changePassword(userId, currentPassword, newPassword) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }
        const isValidPassword = await bcrypt_1.default.compare(currentPassword, user.passwordHash);
        if (!isValidPassword) {
            throw new Error('Current password is incorrect');
        }
        const passwordHash = await bcrypt_1.default.hash(newPassword, this.saltRounds);
        await prisma.user.update({
            where: { id: userId },
            data: { passwordHash },
        });
        logger_1.logger.info('Password changed', { userId });
    }
    /**
     * Generate access and refresh tokens
     */
    generateTokens(userId, email, role) {
        const accessToken = jsonwebtoken_1.default.sign({ userId, email, role, type: 'access' }, config_1.config.auth.jwtSecret, { expiresIn: this.accessTokenExpiry });
        const refreshToken = jsonwebtoken_1.default.sign({ userId, email, role, type: 'refresh' }, config_1.config.auth.jwtSecret, { expiresIn: this.refreshTokenExpiry });
        return {
            accessToken,
            refreshToken,
            expiresIn: 900, // 15 minutes in seconds
        };
    }
    /**
     * Format user for response
     */
    formatUser(user) {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            subscriptionTier: user.subscriptionTier,
            createdAt: user.createdAt,
        };
    }
}
exports.authService = new AuthService();
//# sourceMappingURL=auth-service.js.map