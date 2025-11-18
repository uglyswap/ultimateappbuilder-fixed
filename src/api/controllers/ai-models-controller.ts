import { Request, Response } from 'express';
import { UniversalAIClient } from '@/utils/universal-ai-client';
import { logger } from '@/utils/logger';

/**
 * AI Models Controller
 * Browse and search through 200+ AI models
 */
export class AIModelsController {
  /**
   * GET /api/ai-models
   * Get all available AI models with optional search
   */
  async getAllModels(req: Request, res: Response) {
    try {
      const { search, provider, minContext } = req.query;

      let models = UniversalAIClient.getAllModels(search as string);

      // Filter by provider if specified
      if (provider) {
        models = models.filter((m) => m.provider === provider);
      }

      // Filter by minimum context window
      if (minContext) {
        const minContextNum = parseInt(minContext as string);
        models = models.filter((m) => m.contextWindow >= minContextNum);
      }

      logger.info('[AI Models] Retrieved models', {
        total: models.length,
        search,
        provider,
        minContext,
      });

      res.json({
        success: true,
        count: models.length,
        models,
      });
    } catch (error) {
      logger.error('[AI Models] Failed to get models', { error });
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve models',
      });
    }
  }

  /**
   * GET /api/ai-models/providers
   * Get list of all AI providers
   */
  async getProviders(req: Request, res: Response) {
    try {
      const allModels = UniversalAIClient.getAllModels();
      const providers = [...new Set(allModels.map((m) => m.provider))];

      const providerStats = providers.map((provider) => {
        const providerModels = allModels.filter((m) => m.provider === provider);
        return {
          name: provider,
          modelCount: providerModels.length,
          maxContextWindow: Math.max(...providerModels.map((m) => m.contextWindow)),
          models: providerModels.slice(0, 5).map((m) => ({
            id: m.id,
            name: m.name,
            contextWindow: m.contextWindow,
          })),
        };
      });

      res.json({
        success: true,
        count: providers.length,
        providers: providerStats,
      });
    } catch (error) {
      logger.error('[AI Models] Failed to get providers', { error });
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve providers',
      });
    }
  }

  /**
   * GET /api/ai-models/recommended
   * Get recommended models based on use case
   */
  async getRecommendedModels(req: Request, res: Response) {
    try {
      const { useCase } = req.query;

      const recommendations: Record<string, string[]> = {
        'code-generation': [
          'claude-3-5-sonnet-20241022',
          'gpt-4-turbo',
          'codestral-2405',
          'deepseek-coder',
        ],
        'chat': [
          'claude-3-5-sonnet-20241022',
          'gpt-4-turbo',
          'gemini-2.0-flash-exp',
          'llama-3.3-70b-instruct',
        ],
        'analysis': [
          'claude-3-opus-20240229',
          'gpt-4-turbo',
          'gemini-pro-1.5',
          'command-r-plus',
        ],
        'fast-responses': [
          'claude-3-5-haiku-20241022',
          'gpt-3.5-turbo',
          'gemini-2.0-flash-exp',
          'llama-3.1-8b-instruct',
        ],
        'long-context': [
          'gemini-exp-1206',
          'claude-3-5-sonnet-20241022',
          'gemini-pro-1.5',
          'gpt-4-turbo',
        ],
      };

      const modelIds = recommendations[useCase as string] || recommendations['code-generation'];
      const allModels = UniversalAIClient.getAllModels();
      const recommendedModels = allModels.filter((m) => modelIds.includes(m.id));

      res.json({
        success: true,
        useCase: useCase || 'code-generation',
        count: recommendedModels.length,
        models: recommendedModels,
      });
    } catch (error) {
      logger.error('[AI Models] Failed to get recommended models', { error });
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve recommended models',
      });
    }
  }
}

export const aiModelsController = new AIModelsController();
