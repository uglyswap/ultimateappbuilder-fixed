import { Router, Request, Response } from 'express';
import { logger } from '@/utils/logger';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { verifyAndCleanCode } from '@/utils/code-verifier';

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

    // Enhanced system prompt for professional code generation
    const systemPrompt = `You are an elite full-stack developer and software architect. You build production-ready applications.

## CRITICAL OUTPUT FORMAT:
- Output ONLY code - no explanations, no markdown, no prose
- For multiple files, use this format:
  // File: path/to/file.tsx
  <code content>

  // File: path/to/another-file.ts
  <code content>

- NEVER use markdown code blocks (\`\`\`)
- NEVER add explanations before or after code
- NEVER use placeholders like "// rest of code" or "// ..."

## CODE QUALITY:
- Write production-ready, complete code
- Use TypeScript with strict types
- Include all imports and exports
- Proper error handling
- Modern stack: Next.js 14, React 18, TailwindCSS, Prisma, Shadcn/ui

## MULTI-FILE GENERATION:
When building apps, generate ALL necessary files:
- React components (tsx)
- API routes
- Database schema (Prisma)
- Types/interfaces
- Utils/hooks
- Config files
- package.json with all dependencies

Generate complete, runnable code. The user expects a full project they can immediately run.`;

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
        max_tokens: 64000, // Maximum for professional use - no truncation
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
        max_tokens: 128000, // Maximum for professional use
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
        max_tokens: 128000, // Maximum for professional use
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

    // Verify and clean the generated code
    const verifiedCode = verifyAndCleanCode(generatedCode);

    // Store assistant response in conversation history (use cleaned version)
    messageHistory.push({ role: 'assistant', content: verifiedCode.content });
    conversationStore.set(convId, messageHistory);

    logger.info('Code generated and verified', {
      provider,
      model,
      tokensUsed,
      contentLength: verifiedCode.content.length,
      filesCount: verifiedCode.files.length,
      isValid: verifiedCode.isValid,
      conversationId: convId,
      messageCount: messageHistory.length,
    });

    // Log any validation errors
    if (!verifiedCode.isValid) {
      logger.warn('Code verification found issues', { errors: verifiedCode.errors });
    }

    return res.json({
      status: 'success',
      data: {
        code: verifiedCode.content,
        files: verifiedCode.files,
        tokensUsed,
        model,
        provider,
        conversationId: convId,
        validation: {
          isValid: verifiedCode.isValid,
          errors: verifiedCode.errors,
        },
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
