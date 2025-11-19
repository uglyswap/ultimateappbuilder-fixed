"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiClient = exports.AIClient = void 0;
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const config_1 = require("../config");
const logger_1 = require("./logger");
class AIClient {
    client;
    constructor() {
        this.client = new sdk_1.default({
            apiKey: config_1.config.ai.apiKey,
        });
    }
    async generateCode(prompt, agentType, systemPrompt) {
        try {
            logger_1.logger.info(`Generating code with ${agentType} agent`);
            const response = await this.client.messages.create({
                model: config_1.config.ai.model,
                max_tokens: config_1.config.ai.maxTokens,
                temperature: config_1.config.ai.temperature,
                system: systemPrompt || this.getSystemPrompt(agentType),
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            });
            const content = response.content[0];
            const text = content.type === 'text' ? content.text : '';
            logger_1.logger.info(`Code generation completed`, {
                agentType,
                tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
            });
            return {
                content: text,
                tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
            };
        }
        catch (error) {
            logger_1.logger.error(`AI generation failed for ${agentType}`, { error });
            throw new Error(`AI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async streamGeneration(prompt, agentType, onChunk) {
        try {
            logger_1.logger.info(`Streaming code generation with ${agentType} agent`);
            const stream = await this.client.messages.create({
                model: config_1.config.ai.model,
                max_tokens: config_1.config.ai.maxTokens,
                temperature: config_1.config.ai.temperature,
                system: this.getSystemPrompt(agentType),
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                stream: true,
            });
            let fullContent = '';
            let tokensUsed = 0;
            for await (const event of stream) {
                if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
                    const chunk = event.delta.text;
                    fullContent += chunk;
                    onChunk(chunk);
                }
                if (event.type === 'message_stop') {
                    // Estimate tokens (rough approximation)
                    tokensUsed = Math.ceil(fullContent.length / 4);
                }
            }
            logger_1.logger.info(`Streaming completed`, { agentType, tokensUsed });
            return { content: fullContent, tokensUsed };
        }
        catch (error) {
            logger_1.logger.error(`AI streaming failed for ${agentType}`, { error });
            throw new Error(`AI streaming failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    getSystemPrompt(agentType) {
        // Import world-class system prompts
        const { ORCHESTRATOR_SYSTEM_PROMPT, BACKEND_SYSTEM_PROMPT, FRONTEND_SYSTEM_PROMPT, DATABASE_SYSTEM_PROMPT, AUTH_SYSTEM_PROMPT, INTEGRATIONS_SYSTEM_PROMPT, DEVOPS_SYSTEM_PROMPT, } = require('../agents/prompts');
        const agentPrompts = {
            orchestrator: ORCHESTRATOR_SYSTEM_PROMPT,
            backend: BACKEND_SYSTEM_PROMPT,
            frontend: FRONTEND_SYSTEM_PROMPT,
            database: DATABASE_SYSTEM_PROMPT,
            auth: AUTH_SYSTEM_PROMPT,
            integrations: INTEGRATIONS_SYSTEM_PROMPT,
            devops: DEVOPS_SYSTEM_PROMPT,
            designer: FRONTEND_SYSTEM_PROMPT, // Designer uses frontend prompt
        };
        return agentPrompts[agentType] || BACKEND_SYSTEM_PROMPT;
    }
}
exports.AIClient = AIClient;
exports.aiClient = new AIClient();
//# sourceMappingURL=ai-client.js.map