"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const universal_ai_client_1 = require("../../utils/universal-ai-client");
const logger_1 = require("../../utils/logger");
const router = (0, express_1.Router)();
/**
 * Simple code generation endpoint for chat interface
 * POST /api/generate
 * Body: { prompt: string, model?: string }
 */
router.post('/', async (req, res) => {
    try {
        const { prompt, model } = req.body;
        if (!prompt) {
            return res.status(400).json({
                status: 'error',
                message: 'Prompt is required',
            });
        }
        logger_1.logger.info('Generating code from prompt', { prompt, model });
        // Use the universal AI client to generate code
        const result = await universal_ai_client_1.universalAIClient.generateCode(prompt, 'frontend', // Use frontend agent for UI generation
        {
            model: model || undefined, // Use provided model or default
            temperature: 0.7,
            maxTokens: 4000,
        });
        logger_1.logger.info('Code generated successfully', {
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
    }
    catch (error) {
        logger_1.logger.error('Code generation failed', { error });
        return res.status(500).json({
            status: 'error',
            message: error instanceof Error ? error.message : 'Code generation failed',
        });
    }
});
exports.default = router;
//# sourceMappingURL=simple-generate.routes.js.map