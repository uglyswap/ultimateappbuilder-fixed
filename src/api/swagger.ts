import swaggerJsdoc from 'swagger-jsdoc';
import { config } from '@/config';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ultimate App Builder API',
      version: '1.0.0',
      description: 'Multi-agent AI system to generate production-ready applications',
      contact: {
        name: 'Ultimate App Builder Team',
        url: 'https://ultimateappbuilder.dev',
        email: 'support@ultimateappbuilder.dev',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: config.app.url,
        description: 'Development server',
      },
      {
        url: 'https://api.ultimateappbuilder.dev',
        description: 'Production server',
      },
    ],
    components: {
      schemas: {
        Project: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'proj_abc123' },
            name: { type: 'string', example: 'my-saas-app' },
            description: { type: 'string', example: 'A modern SaaS application' },
            template: {
              type: 'string',
              enum: ['SAAS', 'ECOMMERCE', 'BLOG', 'API', 'CUSTOM'],
              example: 'SAAS',
            },
            status: {
              type: 'string',
              enum: ['DRAFT', 'GENERATING', 'READY', 'DEPLOYING', 'DEPLOYED', 'ERROR'],
              example: 'DRAFT',
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateProject: {
          type: 'object',
          required: ['name', 'template', 'features'],
          properties: {
            name: {
              type: 'string',
              example: 'my-saas-app',
              minLength: 1,
              maxLength: 100,
            },
            description: {
              type: 'string',
              example: 'A modern SaaS application',
              maxLength: 500,
            },
            template: {
              type: 'string',
              enum: ['SAAS', 'ECOMMERCE', 'BLOG', 'API', 'CUSTOM'],
              example: 'SAAS',
            },
            features: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  enabled: { type: 'boolean' },
                },
              },
            },
            database: {
              type: 'object',
              properties: {
                type: {
                  type: 'string',
                  enum: ['postgresql', 'mysql', 'mongodb', 'sqlite'],
                },
                database: { type: 'string' },
              },
            },
            auth: {
              type: 'object',
              properties: {
                providers: {
                  type: 'array',
                  items: {
                    type: 'string',
                    enum: ['email', 'google', 'github', 'facebook'],
                  },
                },
              },
            },
          },
        },
        Generation: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            projectId: { type: 'string' },
            agentType: {
              type: 'string',
              enum: [
                'ORCHESTRATOR',
                'BACKEND',
                'FRONTEND',
                'DATABASE',
                'AUTH',
                'INTEGRATIONS',
                'DEVOPS',
              ],
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED'],
            },
            tokensUsed: { type: 'integer' },
            durationMs: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Template: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            category: { type: 'string' },
            version: { type: 'string' },
            downloads: { type: 'integer' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string', example: 'Error description' },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/api/routes/*.ts', './src/api/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
