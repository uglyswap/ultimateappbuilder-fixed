import { Router, Request, Response } from 'express';
import { logger } from '@/utils/logger';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

const router = Router();

type AIProvider = 'anthropic' | 'openai' | 'openrouter';

// In-memory conversation storage (for simplicity - in production use Redis/DB)
const conversationStore = new Map<string, Array<{ role: string; content: string }>>();

// Clean old conversations every hour
setInterval(() => {
  const oneHourAgo = Date.now() - 3600000;
  conversationStore.forEach((_, key) => {
    const timestamp = parseInt(key.split('_')[1] || '0');
    if (timestamp < oneHourAgo) {
      conversationStore.delete(key);
    }
  });
}, 3600000);

/**
 * Multi-provider code generation endpoint for chat interface
 * POST /api/generate
 * Body: { prompt: string, model: string, apiKey: string, provider: AIProvider, conversationId?: string }
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { prompt, model, apiKey, provider, conversationId, messages: clientMessages } = req.body;

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

    logger.info('Generating code from prompt with user-provided API key', { provider, model, conversationId });

    // Enhanced system prompt for better code generation
    const systemPrompt = `You are an expert full-stack developer and software architect. You specialize in building production-ready applications with modern best practices.

When generating code:
- Write clean, maintainable, and well-documented code
- Use TypeScript with strict typing when applicable
- Follow SOLID principles and design patterns
- Include proper error handling and validation
- Add helpful comments for complex logic
- Use modern frameworks and libraries (Next.js 14, React 18, Tailwind CSS, Prisma, etc.)
- Implement security best practices
- Make the code production-ready

Always provide COMPLETE code files - never truncate or use placeholders like "// rest of the code". If the code is long, structure it properly but include everything.`;

    let generatedCode = '';
    let tokensUsed = 0;

    // Handle conversation history
    let convId = conversationId || `conv_${Date.now()}`;
    let messageHistory = conversationStore.get(convId) || [];

    // If client sends message history, use it
    if (clientMessages && Array.isArray(clientMessages)) {
      messageHistory = clientMessages;
    }

    // Add the new user message
    messageHistory.push({ role: 'user', content: prompt });

    // Route to appropriate provider
    if (provider === 'anthropic') {
      const anthropic = new Anthropic({ apiKey });

      // Prepare messages for Anthropic
      const anthropicMessages = messageHistory.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }));

      const response = await anthropic.messages.create({
        model: model,
        max_tokens: 16000, // Increased to avoid truncation
        temperature: 0.7,
        system: systemPrompt,
        messages: anthropicMessages
      });

      generatedCode = response.content[0].type === 'text' ? response.content[0].text : '';
      tokensUsed = response.usage.input_tokens + response.usage.output_tokens;

    } else if (provider === 'openai') {
      const openai = new OpenAI({ apiKey });

      // Prepare messages for OpenAI
      const openaiMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        { role: 'system', content: systemPrompt },
        ...messageHistory.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content
        }))
      ];

      const response = await openai.chat.completions.create({
        model: model,
        max_tokens: 16000, // Increased to avoid truncation
        temperature: 0.7,
        messages: openaiMessages
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

      // Prepare messages for OpenRouter
      const openrouterMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        { role: 'system', content: systemPrompt },
        ...messageHistory.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content
        }))
      ];

      const response = await openai.chat.completions.create({
        model: model,
        max_tokens: 16000, // Increased to avoid truncation
        temperature: 0.7,
        messages: openrouterMessages
      });

      generatedCode = response.choices[0]?.message?.content || '';
      tokensUsed = response.usage?.total_tokens || 0;

    } else {
      return res.status(400).json({
        status: 'error',
        message: `Unsupported provider: ${provider}`,
      });
    }

    // Store assistant response in conversation history
    messageHistory.push({ role: 'assistant', content: generatedCode });
    conversationStore.set(convId, messageHistory);

    logger.info('Code generated successfully', {
      provider,
      model,
      tokensUsed,
      contentLength: generatedCode.length,
      conversationId: convId,
      messageCount: messageHistory.length,
    });

    return res.json({
      status: 'success',
      data: {
        code: generatedCode,
        tokensUsed,
        model,
        provider,
        conversationId: convId,
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
