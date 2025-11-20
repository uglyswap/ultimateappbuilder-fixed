import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { config } from '@/config';
import { logger } from '@/utils/logger';

const prisma = new PrismaClient();

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface UserResponse {
  id: string;
  email: string;
  name: string | null;
  role: string;
  subscriptionTier: string;
  createdAt: Date;
}

class AuthService {
  private readonly saltRounds = 12;
  private readonly accessTokenExpiry = '15m';
  private readonly refreshTokenExpiry = '7d';

  /**
   * Register a new user
   */
  async register(email: string, password: string, name?: string): Promise<{ user: UserResponse; tokens: AuthTokens }> {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, this.saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
      },
    });

    logger.info('User registered', { userId: user.id, email });

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
  async login(email: string, password: string): Promise<{ user: UserResponse; tokens: AuthTokens }> {
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    logger.info('User logged in', { userId: user.id, email });

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
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = jwt.verify(refreshToken, config.auth.jwtSecret) as TokenPayload & { type: string };

      if (payload.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      // Verify user still exists
      const user = await prisma.user.findUnique({ where: { id: payload.userId } });
      if (!user) {
        throw new Error('User not found');
      }

      return this.generateTokens(user.id, user.email, user.role);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Verify access token
   */
  verifyAccessToken(token: string): TokenPayload {
    try {
      const payload = jwt.verify(token, config.auth.jwtSecret) as TokenPayload & { type: string };

      if (payload.type !== 'access') {
        throw new Error('Invalid token type');
      }

      return {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      };
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<UserResponse | null> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user ? this.formatUser(user) : null;
  }

  /**
   * Change password
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    const passwordHash = await bcrypt.hash(newPassword, this.saltRounds);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    logger.info('Password changed', { userId });
  }

  /**
   * Generate access and refresh tokens
   */
  private generateTokens(userId: string, email: string, role: string): AuthTokens {
    const accessToken = jwt.sign(
      { userId, email, role, type: 'access' },
      config.auth.jwtSecret,
      { expiresIn: this.accessTokenExpiry }
    );

    const refreshToken = jwt.sign(
      { userId, email, role, type: 'refresh' },
      config.auth.jwtSecret,
      { expiresIn: this.refreshTokenExpiry }
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
    };
  }

  /**
   * Format user for response
   */
  private formatUser(user: any): UserResponse {
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

export const authService = new AuthService();
