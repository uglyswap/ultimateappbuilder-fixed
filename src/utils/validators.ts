import { z } from 'zod';
import type {  ValidationResult } from '@/types';

// Project Configuration Schema
export const projectConfigSchema = z.object({
  name: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/i, 'Project name must be alphanumeric with hyphens'),
  description: z.string().min(10).max(500).optional(),
  template: z.enum(['SAAS', 'ECOMMERCE', 'BLOG', 'API', 'CUSTOM']),
  features: z.array(z.object({
    id: z.string(),
    name: z.string(),
    enabled: z.boolean(),
    config: z.record(z.unknown()).optional(),
  })),
  database: z.object({
    type: z.enum(['postgresql', 'mysql', 'mongodb', 'sqlite']),
    host: z.string().optional(),
    port: z.number().optional(),
    database: z.string(),
    schema: z.string().optional(),
  }).optional(),
  auth: z.object({
    providers: z.array(z.enum(['email', 'google', 'github', 'facebook'])),
    jwtSecret: z.string().optional(),
    sessionDuration: z.string().optional(),
    enableMFA: z.boolean().optional(),
  }).optional(),
  integrations: z.array(z.object({
    type: z.enum(['stripe', 'sendgrid', 'aws', 'github', 'slack', 'custom']),
    credentials: z.record(z.string()),
    config: z.record(z.unknown()).optional(),
  })).optional(),
  deployment: z.object({
    provider: z.enum(['vercel', 'netlify', 'aws', 'docker', 'custom']),
    region: z.string().optional(),
    environment: z.enum(['development', 'staging', 'production']),
    customDomain: z.string().optional(),
  }).optional(),
});

export function validateProjectConfig(config: unknown): ValidationResult {
  try {
    projectConfigSchema.parse(config);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        })),
      };
    }
    return {
      valid: false,
      errors: [{
        field: 'unknown',
        message: 'Unknown validation error',
        code: 'UNKNOWN_ERROR',
      }],
    };
  }
}

// Email validation
export const emailSchema = z.string().email();

export function validateEmail(email: string): boolean {
  return emailSchema.safeParse(email).success;
}

// Password validation
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export function validatePassword(password: string): ValidationResult {
  const result = passwordSchema.safeParse(password);
  if (result.success) {
    return { valid: true };
  }
  return {
    valid: false,
    errors: result.error.errors.map(err => ({
      field: 'password',
      message: err.message,
      code: err.code,
    })),
  };
}

// API Key validation
export function validateApiKey(key: string): boolean {
  return /^[a-zA-Z0-9_-]{32,}$/.test(key);
}

// URL validation
export const urlSchema = z.string().url();

export function validateUrl(url: string): boolean {
  return urlSchema.safeParse(url).success;
}
