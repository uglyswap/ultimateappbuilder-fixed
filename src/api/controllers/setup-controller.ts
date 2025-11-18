import { Request, Response } from 'express';
import { systemConfigService } from '@/services/system-config-service';
import { logger } from '@/utils/logger';
import crypto from 'crypto';

export class SetupController {
  // Get setup status
  async getStatus(req: Request, res: Response): Promise<void> {
    try {
      const status = await systemConfigService.getSetupStatus();

      res.json({
        success: true,
        data: status,
      });
    } catch (error) {
      logger.error('Error getting setup status', { error });
      res.status(500).json({
        success: false,
        message: 'Failed to get setup status',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Complete initial setup
  async completeSetup(req: Request, res: Response): Promise<void> {
    try {
      const {
        aiProvider,
        anthropicApiKey,
        openaiApiKey,
        openrouterApiKey,
        jwtSecret,
        smtpHost,
        smtpPort,
        smtpUser,
        smtpPass,
        stripeSecretKey,
        githubToken,
      } = req.body;

      // Validate at least one AI provider is configured
      if (!anthropicApiKey && !openaiApiKey && !openrouterApiKey) {
        res.status(400).json({
          success: false,
          message: 'At least one AI provider API key is required',
        });
        return;
      }

      // Save AI provider keys
      if (anthropicApiKey) {
        await systemConfigService.setConfig(
          'ANTHROPIC_API_KEY',
          anthropicApiKey,
          'ai',
          'Anthropic API Key for Claude models',
          true
        );
      }

      if (openaiApiKey) {
        await systemConfigService.setConfig(
          'OPENAI_API_KEY',
          openaiApiKey,
          'ai',
          'OpenAI API Key for GPT models',
          true
        );
      }

      if (openrouterApiKey) {
        await systemConfigService.setConfig(
          'OPENROUTER_API_KEY',
          openrouterApiKey,
          'ai',
          'OpenRouter API Key for 200+ models',
          true
        );
      }

      if (aiProvider) {
        await systemConfigService.setConfig(
          'AI_PROVIDER',
          aiProvider,
          'ai',
          'Default AI provider',
          false
        );
      }

      // Save JWT secret (or generate if not provided)
      const finalJwtSecret = jwtSecret || crypto.randomBytes(32).toString('hex');
      await systemConfigService.setConfig(
        'JWT_SECRET',
        finalJwtSecret,
        'auth',
        'JWT secret for authentication',
        true
      );

      // Save optional integrations
      if (smtpHost && smtpUser) {
        await systemConfigService.setConfig('SMTP_HOST', smtpHost, 'email', 'SMTP host', false);
        await systemConfigService.setConfig('SMTP_PORT', smtpPort || '587', 'email', 'SMTP port', false);
        await systemConfigService.setConfig('SMTP_USER', smtpUser, 'email', 'SMTP user', true);
        if (smtpPass) {
          await systemConfigService.setConfig('SMTP_PASS', smtpPass, 'email', 'SMTP password', true);
        }
      }

      if (stripeSecretKey) {
        await systemConfigService.setConfig(
          'STRIPE_SECRET_KEY',
          stripeSecretKey,
          'integration',
          'Stripe secret key',
          true
        );
      }

      if (githubToken) {
        await systemConfigService.setConfig(
          'GITHUB_TOKEN',
          githubToken,
          'integration',
          'GitHub personal access token',
          true
        );
      }

      logger.info('✅ System setup completed successfully');

      res.json({
        success: true,
        message: 'Setup completed successfully! Your Ultimate App Builder is ready to use.',
        data: {
          configured: true,
          aiProvider: aiProvider || 'anthropic',
        },
      });
    } catch (error) {
      logger.error('Error completing setup', { error });
      res.status(500).json({
        success: false,
        message: 'Failed to complete setup',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Update specific configuration
  async updateConfig(req: Request, res: Response): Promise<void> {
    try {
      const { key, value, category, description } = req.body;

      if (!key || !value) {
        res.status(400).json({
          success: false,
          message: 'Key and value are required',
        });
        return;
      }

      // Determine if this should be encrypted (API keys, secrets, passwords)
      const sensitiveKeys = [
        'API_KEY', 'SECRET', 'PASSWORD', 'TOKEN', 'PRIVATE',
      ];
      const isEncrypted = sensitiveKeys.some(sensitive =>
        key.toUpperCase().includes(sensitive)
      );

      await systemConfigService.setConfig(
        key,
        value,
        category || 'general',
        description,
        isEncrypted
      );

      res.json({
        success: true,
        message: `Configuration '${key}' updated successfully`,
      });
    } catch (error) {
      logger.error('Error updating configuration', { error });
      res.status(500).json({
        success: false,
        message: 'Failed to update configuration',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Get configuration by category
  async getConfigsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.params;

      const configs = await systemConfigService.getConfigsByCategory(category);

      res.json({
        success: true,
        data: configs,
      });
    } catch (error) {
      logger.error('Error getting configurations', { error });
      res.status(500).json({
        success: false,
        message: 'Failed to get configurations',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Test AI connection
  async testAiConnection(req: Request, res: Response): Promise<void> {
    try {
      const { provider, apiKey } = req.body;

      if (!provider || !apiKey) {
        res.status(400).json({
          success: false,
          message: 'Provider and API key are required',
        });
        return;
      }

      // Simple test based on provider
      let testResult = false;
      let message = '';

      if (provider === 'anthropic') {
        // Test Anthropic API
        const { Anthropic } = await import('@anthropic-ai/sdk');
        const client = new Anthropic({ apiKey });

        try {
          await client.messages.create({
            model: 'claude-3-haiku-20240307',
            max_tokens: 10,
            messages: [{ role: 'user', content: 'Hi' }],
          });
          testResult = true;
          message = 'Anthropic API connection successful!';
        } catch (error) {
          message = `Anthropic API error: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
      } else if (provider === 'openai') {
        // Test OpenAI API
        const { OpenAI } = await import('openai');
        const client = new OpenAI({ apiKey });

        try {
          await client.chat.completions.create({
            model: 'gpt-3.5-turbo',
            max_tokens: 10,
            messages: [{ role: 'user', content: 'Hi' }],
          });
          testResult = true;
          message = 'OpenAI API connection successful!';
        } catch (error) {
          message = `OpenAI API error: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
      } else if (provider === 'openrouter') {
        // Test OpenRouter API
        const { OpenAI } = await import('openai');
        const client = new OpenAI({
          apiKey,
          baseURL: 'https://openrouter.ai/api/v1',
        });

        try {
          await client.chat.completions.create({
            model: 'anthropic/claude-3-haiku',
            max_tokens: 10,
            messages: [{ role: 'user', content: 'Hi' }],
          });
          testResult = true;
          message = 'OpenRouter API connection successful!';
        } catch (error) {
          message = `OpenRouter API error: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
      }

      res.json({
        success: testResult,
        message,
      });
    } catch (error) {
      logger.error('Error testing AI connection', { error });
      res.status(500).json({
        success: false,
        message: 'Failed to test AI connection',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export const setupController = new SetupController();
