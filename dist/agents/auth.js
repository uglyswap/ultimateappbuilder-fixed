"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthAgent = void 0;
const logger_1 = require("../utils/logger");
class AuthAgent {
    async generate(context) {
        logger_1.logger.info('Auth Agent: Generating authentication system');
        const files = [];
        // Generate auth routes
        files.push(this.generateAuthRoutes(context));
        // Generate auth controller
        files.push(this.generateAuthController());
        // Generate auth service
        files.push(this.generateAuthService());
        // Generate auth middleware
        files.push(this.generateAuthMiddleware());
        // Generate JWT utilities
        files.push(this.generateJwtUtils());
        return { files };
    }
    generateAuthRoutes(context) {
        const providers = context.config.auth?.providers || ['email'];
        return {
            path: 'backend/src/routes/auth.ts',
            content: `import { Router } from 'express';
import { AuthController } from '../controllers/auth-controller';
import { validate } from '../middleware/validate';
import { loginSchema, registerSchema } from '../schemas/auth-schemas';

const router = Router();
const authController = new AuthController();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

${providers.includes('google') ? "router.get('/google', authController.googleAuth);\nrouter.get('/google/callback', authController.googleCallback);" : ''}
${providers.includes('github') ? "router.get('/github', authController.githubAuth);\nrouter.get('/github/callback', authController.githubCallback);" : ''}

export default router;
`,
            language: 'typescript',
            description: 'Authentication routes',
        };
    }
    generateAuthController() {
        return {
            path: 'backend/src/controllers/auth-controller.ts',
            content: `import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth-service';
import { AppError } from '../middleware/error-handler';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, name } = req.body;
      const result = await this.authService.register({ email, password, name });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Invalidate token (implement token blacklist if needed)
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      const result = await this.authService.refreshToken(refreshToken);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      await this.authService.forgotPassword(email);
      res.json({ message: 'Password reset email sent' });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, password } = req.body;
      await this.authService.resetPassword(token, password);
      res.json({ message: 'Password reset successful' });
    } catch (error) {
      next(error);
    }
  };
}
`,
            language: 'typescript',
            description: 'Authentication controller',
        };
    }
    generateAuthService() {
        return {
            path: 'backend/src/services/auth-service.ts',
            content: `import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';
import { generateToken, verifyToken } from '../utils/jwt';
import { AppError } from '../middleware/error-handler';

interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

export class AuthService {
  async register({ email, password, name }: RegisterInput) {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError(400, 'User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    // Generate tokens
    const token = generateToken({ userId: user.id, email: user.email });

    return {
      user,
      token,
    };
  }

  async login(email: string, password: string) {
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new AppError(401, 'Invalid credentials');
    }

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = verifyToken(refreshToken);
      const token = generateToken({ userId: decoded.userId, email: decoded.email });
      return { token };
    } catch (error) {
      throw new AppError(401, 'Invalid refresh token');
    }
  }

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal if user exists
      return;
    }

    // Generate reset token
    const resetToken = generateToken({ userId: user.id }, '1h');

    // TODO: Send email with reset link
    console.log('Reset token:', resetToken);
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const decoded = verifyToken(token);
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: decoded.userId },
        data: { password: hashedPassword },
      });
    } catch (error) {
      throw new AppError(400, 'Invalid or expired reset token');
    }
  }
}
`,
            language: 'typescript',
            description: 'Authentication service',
        };
    }
    generateAuthMiddleware() {
        return {
            path: 'backend/src/middleware/auth.ts',
            content: `import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AppError } from './error-handler';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError(401, 'No token provided');
  }

  const token = authHeader.substring(7);

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    throw new AppError(401, 'Invalid token');
  }
}

export function authorize(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(401, 'Not authenticated');
    }

    // TODO: Check user role from database
    next();
  };
}
`,
            language: 'typescript',
            description: 'Authentication middleware',
        };
    }
    generateJwtUtils() {
        return {
            path: 'backend/src/utils/jwt.ts',
            content: `import jwt from 'jsonwebtoken';
import { config } from '../config';

interface TokenPayload {
  userId: string;
  email: string;
}

export function generateToken(payload: TokenPayload, expiresIn = '7d'): string {
  return jwt.sign(payload, config.auth.jwtSecret, { expiresIn });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, config.auth.jwtSecret) as TokenPayload;
}
`,
            language: 'typescript',
            description: 'JWT utilities',
        };
    }
}
exports.AuthAgent = AuthAgent;
//# sourceMappingURL=auth.js.map