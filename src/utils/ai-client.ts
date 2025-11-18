import Anthropic from '@anthropic-ai/sdk';
import { config } from '@/config';
import { logger } from './logger';
import type { AgentType } from '@/types';

export class AIClient {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: config.ai.apiKey,
    });
  }

  async generateCode(
    prompt: string,
    agentType: AgentType,
    systemPrompt?: string
  ): Promise<{ content: string; tokensUsed: number }> {
    try {
      logger.info(`Generating code with ${agentType} agent`);

      const response = await this.client.messages.create({
        model: config.ai.model,
        max_tokens: config.ai.maxTokens,
        temperature: config.ai.temperature,
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

      logger.info(`Code generation completed`, {
        agentType,
        tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
      });

      return {
        content: text,
        tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
      };
    } catch (error) {
      logger.error(`AI generation failed for ${agentType}`, { error });
      throw new Error(`AI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async streamGeneration(
    prompt: string,
    agentType: AgentType,
    onChunk: (chunk: string) => void
  ): Promise<{ content: string; tokensUsed: number }> {
    try {
      logger.info(`Streaming code generation with ${agentType} agent`);

      const stream = await this.client.messages.create({
        model: config.ai.model,
        max_tokens: config.ai.maxTokens,
        temperature: config.ai.temperature,
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

      logger.info(`Streaming completed`, { agentType, tokensUsed });

      return { content: fullContent, tokensUsed };
    } catch (error) {
      logger.error(`AI streaming failed for ${agentType}`, { error });
      throw new Error(`AI streaming failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private getSystemPrompt(agentType: AgentType): string {
    const basePrompt = `You are an expert software engineer working as part of the Ultimate App Builder system.
Your role is to generate production-ready, well-documented, and maintainable code.
Always follow best practices, use TypeScript, and include proper error handling.`;

    const agentPrompts: Record<AgentType, string> = {
      orchestrator: `${basePrompt}\n\nAs the Orchestrator, you coordinate all other agents and ensure the project structure is coherent.`,

      backend: `${basePrompt}\n\nAs the Backend Agent, you create robust APIs using Express.js, with proper validation, error handling, and database integration.`,

      frontend: `${basePrompt}\n\nAs the Frontend Agent, you build modern React applications with TypeScript, using best practices for state management and component architecture.`,

      database: `${basePrompt}\n\nAs the Database Agent, you design efficient database schemas using Prisma ORM, with proper relationships and indexes.`,

      auth: `${basePrompt}\n\nAs the Auth Agent, you implement secure authentication systems with JWT, bcrypt, and proper session management.`,

      integrations: `${basePrompt}\n\nAs the Integrations Agent, you create reliable third-party integrations (Stripe, SendGrid, etc.) with proper error handling.`,

      devops: `${basePrompt}\n\nAs the DevOps Agent, you create deployment configurations, Docker setups, and CI/CD pipelines.`,

      designer: `${basePrompt}\n\nAs the Designer Agent, you create beautiful, accessible UI components with Tailwind CSS and modern design principles.`,
    };

    return agentPrompts[agentType] || basePrompt;
  }
}

export const aiClient = new AIClient();
