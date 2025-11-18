import dotenv from 'dotenv';
import { AIConfig } from '@/types';

// Load environment variables
dotenv.config();

export const config = {
  // Application
  app: {
    name: 'Ultimate App Builder',
    version: '1.0.0',
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    url: process.env.APP_URL || 'http://localhost:3000',
  },

  // Database
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ultimate_app_builder',
  },

  // Redis
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  // AI Configuration
  ai: {
    provider: (process.env.AI_PROVIDER || 'anthropic') as 'anthropic' | 'openai' | 'openrouter',
    model: process.env.AI_MODEL || 'claude-3-5-sonnet-20241022',
    maxTokens: parseInt(process.env.AI_MAX_TOKENS || '8000', 10),
    temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
    apiKey: process.env.ANTHROPIC_API_KEY || '',
  } as AIConfig,

  // OpenAI
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
  },

  // OpenRouter (access to 200+ models)
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY || '',
  },

  // Autonomous Mode Settings
  autonomous: {
    enabled: process.env.AUTONOMOUS_MODE === 'true' || true, // Default ON for best UX
    autoFix: process.env.AUTO_FIX_ERRORS === 'true' || true,
    autoOptimize: process.env.AUTO_OPTIMIZE === 'true' || true,
    autoTest: process.env.AUTO_TEST === 'true' || true,
    autoDeploy: process.env.AUTO_DEPLOY === 'true' || false, // Keep deploy manual by default
  },

  // Authentication
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'change-this-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  // Integrations
  integrations: {
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY || '',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    },
    github: {
      token: process.env.GITHUB_TOKEN || '',
    },
    aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      region: process.env.AWS_REGION || 'us-east-1',
    },
  },

  // Email
  email: {
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  },

  // Storage
  storage: {
    type: (process.env.STORAGE_TYPE || 'local') as 'local' | 's3',
    path: process.env.STORAGE_PATH || './storage',
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  // Feature Flags
  features: {
    analytics: process.env.ENABLE_ANALYTICS === 'true',
    telemetry: process.env.ENABLE_TELEMETRY === 'true',
    debugMode: process.env.ENABLE_DEBUG_MODE === 'true',
  },
} as const;

// Validate required configuration (OPTIONAL MODE for easy deployment)
export function validateConfig(): void {
  const required = {
    'Database URL': config.database.url,
  };

  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Missing required configuration: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure DATABASE_URL is set.'
    );
  }

  // Warn about missing optional configuration but don't fail
  const optional = {
    'AI API Key': config.ai.apiKey,
    'JWT Secret': config.auth.jwtSecret,
  };

  const missingOptional = Object.entries(optional)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingOptional.length > 0) {
    console.warn(
      `⚠️  Missing optional configuration: ${missingOptional.join(', ')}\n` +
      '   You can configure these settings via the Setup Wizard at: http://localhost:3000/api/setup\n' +
      '   The application will start but some features may be limited.'
    );
  }
}

// Check if system is configured
export function isSystemConfigured(): boolean {
  return !!(config.ai.apiKey && config.auth.jwtSecret);
}
