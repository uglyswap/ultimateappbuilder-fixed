import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { logger } from '@/utils/logger';

const prisma = new PrismaClient();

// Simple encryption for API keys (in production, use a proper KMS)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'change-this-encryption-key-32chars!!';
const ALGORITHM = 'aes-256-cbc';

export class SystemConfigService {
  private static instance: SystemConfigService;
  private configCache: Map<string, string> = new Map();

  private constructor() {}

  static getInstance(): SystemConfigService {
    if (!SystemConfigService.instance) {
      SystemConfigService.instance = new SystemConfigService();
    }
    return SystemConfigService.instance;
  }

  // Encrypt sensitive data
  private encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      ALGORITHM,
      Buffer.from(ENCRYPTION_KEY.slice(0, 32)),
      iv
    );
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  // Decrypt sensitive data
  private decrypt(text: string): string {
    const parts = text.split(':');
    const iv = Buffer.from(parts.shift()!, 'hex');
    const encryptedText = parts.join(':');
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      Buffer.from(ENCRYPTION_KEY.slice(0, 32)),
      iv
    );
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  // Get configuration value
  async getConfig(key: string): Promise<string | null> {
    try {
      // Check cache first
      if (this.configCache.has(key)) {
        return this.configCache.get(key)!;
      }

      // Fetch from database
      const config = await prisma.systemConfig.findUnique({
        where: { key },
      });

      if (!config) {
        return null;
      }

      const value = config.isEncrypted ? this.decrypt(config.value) : config.value;

      // Cache the value
      this.configCache.set(key, value);

      return value;
    } catch (error) {
      logger.error(`Error getting config for key: ${key}`, { error });
      return null;
    }
  }

  // Set configuration value
  async setConfig(
    key: string,
    value: string,
    category: string = 'general',
    description?: string,
    isEncrypted: boolean = true
  ): Promise<void> {
    try {
      const encryptedValue = isEncrypted ? this.encrypt(value) : value;

      await prisma.systemConfig.upsert({
        where: { key },
        update: {
          value: encryptedValue,
          category,
          description,
          isEncrypted,
          updatedAt: new Date(),
        },
        create: {
          key,
          value: encryptedValue,
          category,
          description,
          isEncrypted,
        },
      });

      // Update cache
      this.configCache.set(key, value);

      logger.info(`Configuration updated: ${key}`);
    } catch (error) {
      logger.error(`Error setting config for key: ${key}`, { error });
      throw error;
    }
  }

  // Get all configurations by category
  async getConfigsByCategory(category: string): Promise<Record<string, any>> {
    try {
      const configs = await prisma.systemConfig.findMany({
        where: { category },
      });

      const result: Record<string, any> = {};
      for (const config of configs) {
        result[config.key] = {
          value: config.isEncrypted ? this.decrypt(config.value) : config.value,
          description: config.description,
          isRequired: config.isRequired,
        };
      }

      return result;
    } catch (error) {
      logger.error(`Error getting configs for category: ${category}`, { error });
      return {};
    }
  }

  // Check if system is configured
  async isSystemConfigured(): Promise<boolean> {
    try {
      const requiredConfigs = await prisma.systemConfig.findMany({
        where: {
          isRequired: true,
        },
      });

      return requiredConfigs.length > 0;
    } catch (error) {
      logger.error('Error checking system configuration', { error });
      return false;
    }
  }

  // Get setup status
  async getSetupStatus(): Promise<{
    isConfigured: boolean;
    hasAiKey: boolean;
    hasJwtSecret: boolean;
    missingConfigs: string[];
  }> {
    try {
      const aiKey = await this.getConfig('ANTHROPIC_API_KEY') ||
                    await this.getConfig('OPENAI_API_KEY') ||
                    await this.getConfig('OPENROUTER_API_KEY');
      const jwtSecret = await this.getConfig('JWT_SECRET');

      const missingConfigs: string[] = [];
      if (!aiKey) missingConfigs.push('AI API Key (Anthropic/OpenAI/OpenRouter)');
      if (!jwtSecret) missingConfigs.push('JWT Secret');

      return {
        isConfigured: missingConfigs.length === 0,
        hasAiKey: !!aiKey,
        hasJwtSecret: !!jwtSecret,
        missingConfigs,
      };
    } catch (error) {
      logger.error('Error getting setup status', { error });
      return {
        isConfigured: false,
        hasAiKey: false,
        hasJwtSecret: false,
        missingConfigs: ['Error checking configuration'],
      };
    }
  }

  // Initialize default configurations
  async initializeDefaults(): Promise<void> {
    try {
      // Set default JWT secret if not exists
      const jwtSecret = await this.getConfig('JWT_SECRET');
      if (!jwtSecret) {
        const defaultSecret = crypto.randomBytes(32).toString('hex');
        await this.setConfig(
          'JWT_SECRET',
          defaultSecret,
          'auth',
          'JWT secret for authentication',
          true
        );
        logger.info('✅ Generated default JWT secret');
      }

      logger.info('✅ Default configurations initialized');
    } catch (error) {
      logger.error('Error initializing default configurations', { error });
    }
  }

  // Clear cache
  clearCache(): void {
    this.configCache.clear();
  }
}

export const systemConfigService = SystemConfigService.getInstance();
