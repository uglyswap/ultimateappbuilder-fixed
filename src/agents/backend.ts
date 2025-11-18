import { aiClient } from '@/utils/ai-client';
import { logger } from '@/utils/logger';
import type { OrchestratorContext, GeneratedFile } from '@/types';

export class BackendAgent {
  async generate(context: OrchestratorContext): Promise<{ files: GeneratedFile[] }> {
    logger.info('Backend Agent: Generating API structure');

    const files: GeneratedFile[] = [];

    // Generate Express server
    files.push(await this.generateExpressServer(context));

    // Generate API routes
    files.push(...await this.generateApiRoutes(context));

    // Generate middleware
    files.push(...await this.generateMiddleware(context));

    // Generate controllers
    files.push(...await this.generateControllers(context));

    // Generate services
    files.push(...await this.generateServices(context));

    return { files };
  }

  private async generateExpressServer(context: OrchestratorContext): Promise<GeneratedFile> {
    const content = `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/error-handler';
import apiRouter from './routes';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.app.corsOrigins,
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(\`\${req.method} \${req.path}\`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', apiRouter);

// Error handling
app.use(errorHandler);

const PORT = config.app.port || 3000;

app.listen(PORT, () => {
  logger.info(\`🚀 Server running on port \${PORT}\`);
});

export default app;
`;

    return {
      path: 'backend/src/index.ts',
      content,
      language: 'typescript',
      description: 'Express server entry point',
    };
  }

  private async generateApiRoutes(context: OrchestratorContext): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    // Main router
    files.push({
      path: 'backend/src/routes/index.ts',
      content: `import { Router } from 'express';
import usersRouter from './users';
${context.config.auth ? "import authRouter from './auth';" : ''}

const router = Router();

router.use('/users', usersRouter);
${context.config.auth ? "router.use('/auth', authRouter);" : ''}

export default router;
`,
      language: 'typescript',
      description: 'API routes index',
    });

    // Users router
    files.push({
      path: 'backend/src/routes/users.ts',
      content: `import { Router } from 'express';
import { UserController } from '../controllers/user-controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const userController = new UserController();

router.get('/', authenticate, userController.list);
router.get('/:id', authenticate, userController.get);
router.put('/:id', authenticate, userController.update);
router.delete('/:id', authenticate, userController.delete);

export default router;
`,
      language: 'typescript',
      description: 'Users API routes',
    });

    return files;
  }

  private async generateMiddleware(context: OrchestratorContext): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    // Error handler
    files.push({
      path: 'backend/src/middleware/error-handler.ts',
      content: `import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    logger.error('Application error', { error: err.message, stack: err.stack });
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  logger.error('Unexpected error', { error: err.message, stack: err.stack });
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
}
`,
      language: 'typescript',
      description: 'Error handling middleware',
    });

    // Validation middleware
    files.push({
      path: 'backend/src/middleware/validate.ts',
      content: `import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import { AppError } from './error-handler';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AppError(400, error.errors[0].message);
      }
      next(error);
    }
  };
}
`,
      language: 'typescript',
      description: 'Validation middleware',
    });

    return files;
  }

  private async generateControllers(context: OrchestratorContext): Promise<GeneratedFile[]> {
    return [{
      path: 'backend/src/controllers/user-controller.ts',
      content: `import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user-service';
import { AppError } from '../middleware/error-handler';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.findAll();
      res.json({ data: users });
    } catch (error) {
      next(error);
    }
  };

  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.findById(req.params.id);
      if (!user) {
        throw new AppError(404, 'User not found');
      }
      res.json({ data: user });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.update(req.params.id, req.body);
      res.json({ data: user });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.userService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
`,
      language: 'typescript',
      description: 'User controller',
    }];
  }

  private async generateServices(context: OrchestratorContext): Promise<GeneratedFile[]> {
    return [{
      path: 'backend/src/services/user-service.ts',
      content: `import { prisma } from '../lib/prisma';

export class UserService {
  async findAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
  }

  async update(id: string, data: { name?: string; email?: string }) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        updatedAt: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }
}
`,
      language: 'typescript',
      description: 'User service',
    }];
  }
}
