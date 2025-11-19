import { Router, Request, Response } from 'express';
import { logger } from '@/utils/logger';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

const router = Router();

type AIProvider = 'anthropic' | 'openai' | 'openrouter';

/**
 * Multi-provider code generation endpoint for chat interface
 * POST /api/generate
 * Body: { prompt: string, model: string, apiKey: string, provider: AIProvider }
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { prompt, model, apiKey, provider } = req.body;

    if (!prompt) {
      return res.status(400).json({
        status: 'error',
        message: 'Prompt is required',
      });
    }

    if (!apiKey) {
      return res.status(400).json({
        status: 'error',
        message: 'API key is required. Please provide your AI provider API key.',
      });
    }

    if (!provider) {
      return res.status(400).json({
        status: 'error',
        message: 'Provider is required. Please select an AI provider.',
      });
    }

    if (!model) {
      return res.status(400).json({
        status: 'error',
        message: 'Model is required. Please select a model.',
      });
    }

    logger.info('Generating code from prompt with user-provided API key', { provider, model });

    const systemPrompt = 'You are an expert full-stack developer. Generate clean, production-ready code based on the following request. Provide only the code without explanations.';
    let generatedCode = '';
    let tokensUsed = 0;

    // Route to appropriate provider
    if (provider === 'anthropic') {
      const anthropic = new Anthropic({ apiKey });

      const response = await anthropic.messages.create({
        model: model,
        max_tokens: 4000,
        temperature: 0.7,
        messages: [{
          role: 'user',
          content: `${systemPrompt}\n\n${prompt}`
        }]
      });

      generatedCode = response.content[0].type === 'text' ? response.content[0].text : '';
      tokensUsed = response.usage.input_tokens + response.usage.output_tokens;

    } else if (provider === 'openai') {
      const openai = new OpenAI({ apiKey });

      const response = await openai.chat.completions.create({
        model: model,
        max_tokens: 4000,
        temperature: 0.7,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ]
      });

      generatedCode = response.choices[0]?.message?.content || '';
      tokensUsed = response.usage?.total_tokens || 0;

    } else if (provider === 'openrouter') {
      const openai = new OpenAI({
        apiKey,
        baseURL: 'https://openrouter.ai/api/v1',
        defaultHeaders: {
          'HTTP-Referer': 'https://ultimateappbuilder.ai',
          'X-Title': 'Ultimate App Builder'
        }
      });

      const response = await openai.chat.completions.create({
        model: model,
        max_tokens: 4000,
        temperature: 0.7,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ]
      });

      generatedCode = response.choices[0]?.message?.content || '';
      tokensUsed = response.usage?.total_tokens || 0;

    } else {
      return res.status(400).json({
        status: 'error',
        message: `Unsupported provider: ${provider}`,
      });
    }

    logger.info('Code generated successfully', {
      provider,
      model,
      tokensUsed,
      contentLength: generatedCode.length,
    });

    return res.json({
      status: 'success',
      data: {
        code: generatedCode,
        tokensUsed,
        model,
        provider,
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
