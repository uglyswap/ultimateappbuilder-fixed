"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logger_1 = require("../../utils/logger");
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const openai_1 = __importDefault(require("openai"));
const code_verifier_1 = require("../../utils/code-verifier");
const validate_request_1 = require("../../api/middleware/validate-request");
const redis_rate_limiter_1 = require("../../api/middleware/redis-rate-limiter");
const router = (0, express_1.Router)();
/**
 * Streaming code generation endpoint
 * POST /api/generate/stream
 */
router.post('/stream', redis_rate_limiter_1.generationRateLimiter, (0, validate_request_1.validateRequest)({ body: validate_request_1.commonSchemas.generateCode }), async (req, res) => {
    const { prompt, model, apiKey, provider, conversationId, messages: clientMessages } = req.body;
    logger_1.logger.info('Starting streaming generation', { provider, model, conversationId });
    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    // System prompt
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
- Modern stack: Next.js 14, React 18, TailwindCSS, Prisma, Shadcn/ui`;
    // Build conversation history
    const messageHistory = clientMessages || [];
    messageHistory.push({ role: 'user', content: prompt });
    let fullContent = '';
    try {
        if (provider === 'anthropic') {
            const anthropic = new sdk_1.default({ apiKey });
            const stream = await anthropic.messages.stream({
                model,
                max_tokens: 64000,
                temperature: 0.7,
                system: systemPrompt,
                messages: messageHistory.map((m) => ({
                    role: m.role,
                    content: m.content,
                })),
            });
            for await (const event of stream) {
                if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
                    const text = event.delta.text;
                    fullContent += text;
                    // Send chunk to client
                    res.write(`data: ${JSON.stringify({ type: 'chunk', content: text })}\n\n`);
                }
            }
            const finalMessage = await stream.finalMessage();
            const tokensUsed = finalMessage.usage.input_tokens + finalMessage.usage.output_tokens;
            // Verify and clean the generated code
            const verifiedCode = (0, code_verifier_1.verifyAndCleanCode)(fullContent);
            // Send completion event
            res.write(`data: ${JSON.stringify({
                type: 'complete',
                code: verifiedCode.content,
                files: verifiedCode.files,
                tokensUsed,
                validation: {
                    isValid: verifiedCode.isValid,
                    errors: verifiedCode.errors,
                },
            })}\n\n`);
        }
        else if (provider === 'openai' || provider === 'openrouter') {
            const openai = new openai_1.default({
                apiKey,
                baseURL: provider === 'openrouter' ? 'https://openrouter.ai/api/v1' : undefined,
                defaultHeaders: provider === 'openrouter' ? {
                    'HTTP-Referer': 'https://ultimateappbuilder.ai',
                    'X-Title': 'Ultimate App Builder',
                } : undefined,
            });
            const stream = await openai.chat.completions.create({
                model,
                max_tokens: 128000,
                temperature: 0.7,
                stream: true,
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messageHistory.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                ],
            });
            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content;
                if (content) {
                    fullContent += content;
                    res.write(`data: ${JSON.stringify({ type: 'chunk', content })}\n\n`);
                }
            }
            // Verify and clean the generated code
            const verifiedCode = (0, code_verifier_1.verifyAndCleanCode)(fullContent);
            // Send completion event
            res.write(`data: ${JSON.stringify({
                type: 'complete',
                code: verifiedCode.content,
                files: verifiedCode.files,
                tokensUsed: 0, // OpenAI streaming doesn't provide usage
                validation: {
                    isValid: verifiedCode.isValid,
                    errors: verifiedCode.errors,
                },
            })}\n\n`);
        }
        res.write('data: [DONE]\n\n');
        res.end();
        logger_1.logger.info('Streaming generation completed', {
            provider,
            model,
            contentLength: fullContent.length,
        });
    }
    catch (error) {
        logger_1.logger.error('Streaming generation failed', { error });
        const errorMessage = error instanceof Error ? error.message : 'Generation failed';
        res.write(`data: ${JSON.stringify({ type: 'error', message: errorMessage })}\n\n`);
        res.end();
    }
});
exports.default = router;
//# sourceMappingURL=stream-generate.routes.js.map