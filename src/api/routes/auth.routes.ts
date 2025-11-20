import { Router, Response } from 'express';
import { z } from 'zod';
import { authService } from '@/services/auth-service';
import { authMiddleware, AuthRequest } from '@/api/middleware/auth';
import { validateRequest } from '@/api/middleware/validate-request';
import { logger } from '@/utils/logger';

const router = Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  name: z.string().min(1).max(100).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(100),
});

/**
 * Register new user
 * POST /api/auth/register
 */
router.post('/register', validateRequest({ body: registerSchema }), async (req, res: Response) => {
  try {
    const { email, password, name } = req.body;

    const result = await authService.register(email, password, name);

    res.status(201).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    logger.error('Registration failed', { error });

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
router.post('/login', validateRequest({ body: loginSchema }), async (req, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    logger.warn('Login failed', { error, email: req.body.email });

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
router.post('/refresh', validateRequest({ body: refreshSchema }), async (req, res: Response) => {
  try {
    const { refreshToken } = req.body;

    const tokens = await authService.refreshToken(refreshToken);

    res.json({
      status: 'success',
      data: { tokens },
    });
  } catch (error) {
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
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await authService.getUserById(req.user!.userId);

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
  } catch (error) {
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
router.post('/change-password', authMiddleware, validateRequest({ body: changePasswordSchema }), async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    await authService.changePassword(req.user!.userId, currentPassword, newPassword);

    res.json({
      status: 'success',
      message: 'Password changed successfully',
    });
  } catch (error) {
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
router.post('/logout', authMiddleware, async (req: AuthRequest, res: Response) => {
  logger.info('User logged out', { userId: req.user!.userId });

  res.json({
    status: 'success',
    message: 'Logged out successfully',
  });
});

export default router;
