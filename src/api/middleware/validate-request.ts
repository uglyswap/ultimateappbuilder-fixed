import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import { logger } from '@/utils/logger';

interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

/**
 * Middleware to validate request body, query, and params
 */
export function validateRequest(schemas: ValidationSchemas) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }

      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        logger.warn('Request validation failed', {
          path: req.path,
          errors: formattedErrors,
        });

        res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: formattedErrors,
        });
        return;
      }

      next(error);
    }
  };
}

/**
 * Common validation schemas
 */
export const commonSchemas = {
  // Pagination
  pagination: z.object({
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(100).default(20),
  }),

  // ID parameter
  idParam: z.object({
    id: z.string().min(1),
  }),

  // Project creation
  createProject: z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    template: z.enum(['SAAS', 'ECOMMERCE', 'BLOG', 'API', 'CUSTOM']),
    features: z.array(z.object({
      name: z.string(),
      enabled: z.boolean(),
      config: z.record(z.unknown()).optional(),
    })).default([]),
  }),

  // Code generation
  generateCode: z.object({
    prompt: z.string().min(1).max(10000),
    model: z.string().min(1),
    apiKey: z.string().min(1),
    provider: z.enum(['anthropic', 'openai', 'openrouter']),
    conversationId: z.string().optional(),
    messages: z.array(z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })).optional(),
  }),

  // GitHub repo
  githubRepo: z.object({
    repoUrl: z.string().url().refine(url => url.includes('github.com'), {
      message: 'Must be a GitHub URL',
    }),
    token: z.string().optional(),
    branch: z.string().optional(),
  }),

  // Deployment
  deployment: z.object({
    projectId: z.string().min(1),
    platform: z.enum(['vercel', 'netlify', 'railway', 'aws', 'docker', 'github']),
    config: z.record(z.unknown()).optional(),
  }),
};

/**
 * Sanitize string to prevent XSS
 */
export function sanitizeString(str: string): string {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Middleware to sanitize request body strings
 */
export function sanitizeRequest(req: Request, _res: Response, next: NextFunction) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  next();
}

function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      // Don't sanitize code content
      if (key === 'content' || key === 'code' || key === 'prompt') {
        sanitized[key] = value;
      } else {
        sanitized[key] = sanitizeString(value);
      }
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item =>
        typeof item === 'object' && item !== null
          ? sanitizeObject(item as Record<string, unknown>)
          : item
      );
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
