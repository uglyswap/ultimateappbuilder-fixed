import { Router, Request, Response } from 'express';
import { universalAIClient } from '@/utils/universal-ai-client';
import { logger } from '@/utils/logger';
import Anthropic from '@anthropic-ai/sdk';

const router = Router();

/**
 * Simple code generation endpoint for chat interface
 * POST /api/generate
 * Body: { prompt: string, model?: string }
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { prompt, model, apiKey } = req.body;

    if (!prompt) {
      return res.status(400).json({
        status: 'error',
        message: 'Prompt is required',
      });
    }

    if (!apiKey) {
      return res.status(400).json({
        status: 'error',
        message: 'API key is required. Please provide your Anthropic API key.',
      });
    }

    logger.info('Generating code from prompt with user-provided API key');

    // Create an Anthropic client with user's API key
    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    // Generate code using Claude
    const response = await anthropic.messages.create({
      model: model || 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: `You are an expert full-stack developer. Generate clean, production-ready code based on the following request:\n\n${prompt}\n\nProvide only the code without explanations.`
      }]
    });

    const generatedCode = response.content[0].type === 'text' ? response.content[0].text : '';
    const tokensUsed = response.usage.input_tokens + response.usage.output_tokens;

    logger.info('Code generated successfully', {
      tokensUsed,
      contentLength: generatedCode.length,
    });

    return res.json({
      status: 'success',
      data: {
        code: generatedCode,
        tokensUsed,
        model: model || 'claude-3-5-sonnet-20241022',
      },
    });
  } catch (error) {
    logger.error('Code generation failed', { error });

    return res.status(500).json({
      status: 'error',
      message: error instanceof Error ? `AI generation failed: ${error.message}` : 'Code generation failed',
    });
  }
});

export default router;
