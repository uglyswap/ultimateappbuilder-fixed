import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
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
  }).optional(),
  auth: z.object({
    providers: z.array(z.enum(['email', 'google', 'github', 'facebook'])),
    enableMFA: z.boolean().optional(),
  }).optional(),
  integrations: z.array(z.object({
    type: z.enum(['stripe', 'sendgrid', 'aws', 'github', 'slack', 'custom']),
    credentials: z.record(z.string()),
  })).optional(),
  deployment: z.object({
    provider: z.enum(['vercel', 'netlify', 'aws', 'docker', 'custom']),
    region: z.string().optional(),
    environment: z.enum(['development', 'staging', 'production']),
  }).optional(),
});
