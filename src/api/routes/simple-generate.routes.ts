import { Router, Request, Response } from 'express';
import { universalAIClient } from '@/utils/universal-ai-client';
import { logger } from '@/utils/logger';

const router = Router();

/**
 * Simple code generation endpoint for chat interface
 * POST /api/generate
 * Body: { prompt: string, model?: string }
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { prompt, model } = req.body;

    if (!prompt) {
      return res.status(400).json({
        status: 'error',
        message: 'Prompt is required',
      });
    }

    logger.info('Generating code from prompt', { prompt, model });

    // Use the universal AI client to generate code
    const result = await universalAIClient.generateCode(
      prompt,
      'frontend', // Use frontend agent for UI generation
      {
        model: model || undefined, // Use provided model or default
        temperature: 0.7,
        maxTokens: 4000,
      }
    );

    logger.info('Code generated successfully', {
      tokensUsed: result.tokensUsed,
      contentLength: result.content.length,
    });

    return res.json({
      status: 'success',
      data: {
        code: result.content,
        tokensUsed: result.tokensUsed,
        model: model || 'default',
      },
    });
  } catch (error) {
    logger.error('Code generation failed', { error });

    return res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Code generation failed',
    });
  }
});

export default router;
