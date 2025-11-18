import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { config } from '@/config';
import { logger } from './logger';
import type { AgentType } from '@/types';

// Comprehensive list of all available AI models
export const AI_MODELS = {
  // Anthropic Claude Models
  anthropic: {
    'claude-3-5-sonnet-20241022': { name: 'Claude 3.5 Sonnet (Latest)', maxTokens: 200000, contextWindow: 200000 },
    'claude-3-5-haiku-20241022': { name: 'Claude 3.5 Haiku (Latest)', maxTokens: 200000, contextWindow: 200000 },
    'claude-sonnet-4': { name: 'Claude Sonnet 4', maxTokens: 200000, contextWindow: 200000 },
    'claude-3-opus-20240229': { name: 'Claude 3 Opus', maxTokens: 200000, contextWindow: 200000 },
    'claude-3-sonnet-20240229': { name: 'Claude 3 Sonnet', maxTokens: 200000, contextWindow: 200000 },
    'claude-3-haiku-20240307': { name: 'Claude 3 Haiku', maxTokens: 200000, contextWindow: 200000 },
  },

  // OpenAI Models
  openai: {
    'gpt-4-turbo-2024-04-09': { name: 'GPT-4 Turbo (Latest)', maxTokens: 128000, contextWindow: 128000 },
    'gpt-4-turbo': { name: 'GPT-4 Turbo', maxTokens: 128000, contextWindow: 128000 },
    'gpt-4-turbo-preview': { name: 'GPT-4 Turbo Preview', maxTokens: 128000, contextWindow: 128000 },
    'gpt-4-0125-preview': { name: 'GPT-4 0125 Preview', maxTokens: 128000, contextWindow: 128000 },
    'gpt-4-1106-preview': { name: 'GPT-4 1106 Preview', maxTokens: 128000, contextWindow: 128000 },
    'gpt-4': { name: 'GPT-4', maxTokens: 8192, contextWindow: 8192 },
    'gpt-4-32k': { name: 'GPT-4 32k', maxTokens: 32768, contextWindow: 32768 },
    'gpt-3.5-turbo-0125': { name: 'GPT-3.5 Turbo (Latest)', maxTokens: 16385, contextWindow: 16385 },
    'gpt-3.5-turbo': { name: 'GPT-3.5 Turbo', maxTokens: 16385, contextWindow: 16385 },
    'gpt-3.5-turbo-16k': { name: 'GPT-3.5 Turbo 16k', maxTokens: 16385, contextWindow: 16385 },
    'o1-preview': { name: 'OpenAI o1 Preview', maxTokens: 128000, contextWindow: 128000 },
    'o1-mini': { name: 'OpenAI o1 Mini', maxTokens: 128000, contextWindow: 128000 },
    'o3-mini': { name: 'OpenAI o3 Mini', maxTokens: 200000, contextWindow: 200000 },
  },

  // Google Models (via OpenRouter)
  google: {
    'gemini-2.0-flash-exp': { name: 'Gemini 2.0 Flash Experimental', maxTokens: 8192, contextWindow: 1000000 },
    'gemini-exp-1206': { name: 'Gemini Experimental 1206', maxTokens: 8192, contextWindow: 2000000 },
    'gemini-2.0-flash-thinking-exp': { name: 'Gemini 2.0 Flash Thinking', maxTokens: 8192, contextWindow: 32000 },
    'gemini-pro-1.5': { name: 'Gemini Pro 1.5', maxTokens: 8192, contextWindow: 2000000 },
    'gemini-pro': { name: 'Gemini Pro', maxTokens: 8192, contextWindow: 32000 },
  },

  // Meta Models
  meta: {
    'llama-3.3-70b-instruct': { name: 'Llama 3.3 70B Instruct', maxTokens: 128000, contextWindow: 128000 },
    'llama-3.1-405b-instruct': { name: 'Llama 3.1 405B Instruct', maxTokens: 131072, contextWindow: 131072 },
    'llama-3.1-70b-instruct': { name: 'Llama 3.1 70B Instruct', maxTokens: 131072, contextWindow: 131072 },
    'llama-3.1-8b-instruct': { name: 'Llama 3.1 8B Instruct', maxTokens: 131072, contextWindow: 131072 },
  },

  // Mistral Models
  mistral: {
    'mistral-large-2411': { name: 'Mistral Large 2411', maxTokens: 128000, contextWindow: 128000 },
    'mistral-large-2407': { name: 'Mistral Large 2407', maxTokens: 128000, contextWindow: 128000 },
    'mistral-medium-2312': { name: 'Mistral Medium', maxTokens: 32000, contextWindow: 32000 },
    'mistral-small-2402': { name: 'Mistral Small', maxTokens: 32000, contextWindow: 32000 },
    'codestral-2405': { name: 'Codestral (Code Specialist)', maxTokens: 32000, contextWindow: 32000 },
  },

  // DeepSeek Models
  deepseek: {
    'deepseek-chat': { name: 'DeepSeek Chat', maxTokens: 64000, contextWindow: 64000 },
    'deepseek-coder': { name: 'DeepSeek Coder', maxTokens: 64000, contextWindow: 64000 },
  },

  // Cohere Models
  cohere: {
    'command-r-plus': { name: 'Command R+', maxTokens: 128000, contextWindow: 128000 },
    'command-r': { name: 'Command R', maxTokens: 128000, contextWindow: 128000 },
  },
} as const;

export type AIProvider = 'anthropic' | 'openai' | 'openrouter';
export type AIModelCategory = keyof typeof AI_MODELS;
export type AIModelId = string;

export interface AIGenerationOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
  streamCallback?: (chunk: string) => void;
  autonomousMode?: boolean; // YOLO mode - no confirmations
}

export class UniversalAIClient {
  private anthropicClient?: Anthropic;
  private openaiClient?: OpenAI;
  private openrouterClient?: OpenAI;

  constructor() {
    // Initialize Anthropic if API key is available
    if (config.ai.apiKey) {
      this.anthropicClient = new Anthropic({
        apiKey: config.ai.apiKey,
      });
    }

    // Initialize OpenAI if API key is available
    if (config.openai?.apiKey) {
      this.openaiClient = new OpenAI({
        apiKey: config.openai.apiKey,
      });
    }

    // Initialize OpenRouter if API key is available
    if (config.openrouter?.apiKey) {
      this.openrouterClient = new OpenAI({
        apiKey: config.openrouter.apiKey,
        baseURL: 'https://openrouter.ai/api/v1',
      });
    }
  }

  /**
   * Generate code using the configured AI provider
   * AUTONOMOUS MODE: No interruptions, full automation
   */
  async generateCode(
    prompt: string,
    agentType: AgentType,
    options: AIGenerationOptions = {}
  ): Promise<{ content: string; tokensUsed: number }> {
    const provider = this.getProviderForModel(options.model || config.ai.model);
    const model = options.model || config.ai.model;

    logger.info(`[AUTONOMOUS MODE] Generating code with ${agentType} agent using ${provider}/${model}`, {
      autonomousMode: options.autonomousMode ?? true,
    });

    try {
      switch (provider) {
        case 'anthropic':
          return await this.generateWithAnthropic(prompt, agentType, options);
        case 'openai':
          return await this.generateWithOpenAI(prompt, agentType, options);
        case 'openrouter':
          return await this.generateWithOpenRouter(prompt, agentType, options);
        default:
          throw new Error(`Unsupported AI provider: ${provider}`);
      }
    } catch (error) {
      logger.error(`AI generation failed for ${agentType}`, { error, provider, model });
      throw new Error(`AI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Stream generation with real-time updates
   */
  async streamGeneration(
    prompt: string,
    agentType: AgentType,
    onChunk: (chunk: string) => void,
    options: AIGenerationOptions = {}
  ): Promise<{ content: string; tokensUsed: number }> {
    const provider = this.getProviderForModel(options.model || config.ai.model);

    switch (provider) {
      case 'anthropic':
        return await this.streamWithAnthropic(prompt, agentType, onChunk, options);
      case 'openai':
        return await this.streamWithOpenAI(prompt, agentType, onChunk, options);
      case 'openrouter':
        return await this.streamWithOpenRouter(prompt, agentType, onChunk, options);
      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  }

  /**
   * Get all available models with search and filtering
   */
  static getAllModels(searchQuery?: string): Array<{
    id: string;
    name: string;
    provider: string;
    category: string;
    maxTokens: number;
    contextWindow: number;
  }> {
    const models: Array<{
      id: string;
      name: string;
      provider: string;
      category: string;
      maxTokens: number;
      contextWindow: number;
    }> = [];

    Object.entries(AI_MODELS).forEach(([category, categoryModels]) => {
      Object.entries(categoryModels).forEach(([id, info]) => {
        const model = {
          id,
          name: info.name,
          provider: category,
          category,
          maxTokens: info.maxTokens,
          contextWindow: info.contextWindow,
        };

        // Filter by search query if provided
        if (!searchQuery ||
            model.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            model.provider.toLowerCase().includes(searchQuery.toLowerCase())) {
          models.push(model);
        }
      });
    });

    return models.sort((a, b) => b.contextWindow - a.contextWindow);
  }

  private getProviderForModel(model: string): AIProvider {
    // Check if it's an Anthropic model
    if (model.includes('claude')) {
      return 'anthropic';
    }
    // Check if it's an OpenAI model
    if (model.includes('gpt') || model.includes('o1') || model.includes('o3')) {
      return 'openai';
    }
    // Everything else goes through OpenRouter
    return 'openrouter';
  }

  private async generateWithAnthropic(
    prompt: string,
    agentType: AgentType,
    options: AIGenerationOptions
  ): Promise<{ content: string; tokensUsed: number }> {
    if (!this.anthropicClient) {
      throw new Error('Anthropic client not initialized. Please set ANTHROPIC_API_KEY');
    }

    const response = await this.anthropicClient.messages.create({
      model: options.model || config.ai.model,
      max_tokens: options.maxTokens || config.ai.maxTokens,
      temperature: options.temperature || config.ai.temperature,
      system: options.systemPrompt || this.getSystemPrompt(agentType),
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.content[0];
    const text = content.type === 'text' ? content.text : '';

    return {
      content: text,
      tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
    };
  }

  private async generateWithOpenAI(
    prompt: string,
    agentType: AgentType,
    options: AIGenerationOptions
  ): Promise<{ content: string; tokensUsed: number }> {
    if (!this.openaiClient) {
      throw new Error('OpenAI client not initialized. Please set OPENAI_API_KEY');
    }

    const response = await this.openaiClient.chat.completions.create({
      model: options.model || 'gpt-4-turbo',
      max_tokens: options.maxTokens || config.ai.maxTokens,
      temperature: options.temperature || config.ai.temperature,
      messages: [
        {
          role: 'system',
          content: options.systemPrompt || this.getSystemPrompt(agentType),
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return {
      content: response.choices[0]?.message?.content || '',
      tokensUsed: response.usage?.total_tokens || 0,
    };
  }

  private async generateWithOpenRouter(
    prompt: string,
    agentType: AgentType,
    options: AIGenerationOptions
  ): Promise<{ content: string; tokensUsed: number }> {
    if (!this.openrouterClient) {
      throw new Error('OpenRouter client not initialized. Please set OPENROUTER_API_KEY');
    }

    const response = await this.openrouterClient.chat.completions.create({
      model: options.model || 'anthropic/claude-3.5-sonnet',
      max_tokens: options.maxTokens || config.ai.maxTokens,
      temperature: options.temperature || config.ai.temperature,
      messages: [
        {
          role: 'system',
          content: options.systemPrompt || this.getSystemPrompt(agentType),
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return {
      content: response.choices[0]?.message?.content || '',
      tokensUsed: response.usage?.total_tokens || 0,
    };
  }

  private async streamWithAnthropic(
    prompt: string,
    agentType: AgentType,
    onChunk: (chunk: string) => void,
    options: AIGenerationOptions
  ): Promise<{ content: string; tokensUsed: number }> {
    if (!this.anthropicClient) {
      throw new Error('Anthropic client not initialized');
    }

    const stream = await this.anthropicClient.messages.create({
      model: options.model || config.ai.model,
      max_tokens: options.maxTokens || config.ai.maxTokens,
      temperature: options.temperature || config.ai.temperature,
      system: options.systemPrompt || this.getSystemPrompt(agentType),
      messages: [{ role: 'user', content: prompt }],
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
        tokensUsed = Math.ceil(fullContent.length / 4);
      }
    }

    return { content: fullContent, tokensUsed };
  }

  private async streamWithOpenAI(
    prompt: string,
    agentType: AgentType,
    onChunk: (chunk: string) => void,
    options: AIGenerationOptions
  ): Promise<{ content: string; tokensUsed: number }> {
    if (!this.openaiClient) {
      throw new Error('OpenAI client not initialized');
    }

    const stream = await this.openaiClient.chat.completions.create({
      model: options.model || 'gpt-4-turbo',
      max_tokens: options.maxTokens || config.ai.maxTokens,
      temperature: options.temperature || config.ai.temperature,
      messages: [
        { role: 'system', content: options.systemPrompt || this.getSystemPrompt(agentType) },
        { role: 'user', content: prompt },
      ],
      stream: true,
    });

    let fullContent = '';
    let tokensUsed = 0;

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || '';
      if (text) {
        fullContent += text;
        onChunk(text);
      }
    }

    tokensUsed = Math.ceil(fullContent.length / 4);
    return { content: fullContent, tokensUsed };
  }

  private async streamWithOpenRouter(
    prompt: string,
    agentType: AgentType,
    onChunk: (chunk: string) => void,
    options: AIGenerationOptions
  ): Promise<{ content: string; tokensUsed: number }> {
    if (!this.openrouterClient) {
      throw new Error('OpenRouter client not initialized');
    }

    const stream = await this.openrouterClient.chat.completions.create({
      model: options.model || 'anthropic/claude-3.5-sonnet',
      max_tokens: options.maxTokens || config.ai.maxTokens,
      temperature: options.temperature || config.ai.temperature,
      messages: [
        { role: 'system', content: options.systemPrompt || this.getSystemPrompt(agentType) },
        { role: 'user', content: prompt },
      ],
      stream: true,
    });

    let fullContent = '';
    let tokensUsed = 0;

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || '';
      if (text) {
        fullContent += text;
        onChunk(text);
      }
    }

    tokensUsed = Math.ceil(fullContent.length / 4);
    return { content: fullContent, tokensUsed };
  }

  private getSystemPrompt(agentType: AgentType): string {
    const {
      ORCHESTRATOR_SYSTEM_PROMPT,
      BACKEND_SYSTEM_PROMPT,
      FRONTEND_SYSTEM_PROMPT,
      DATABASE_SYSTEM_PROMPT,
      AUTH_SYSTEM_PROMPT,
      INTEGRATIONS_SYSTEM_PROMPT,
      DEVOPS_SYSTEM_PROMPT,
    } = require('@/agents/prompts');

    const agentPrompts: Record<AgentType, string> = {
      orchestrator: ORCHESTRATOR_SYSTEM_PROMPT,
      backend: BACKEND_SYSTEM_PROMPT,
      frontend: FRONTEND_SYSTEM_PROMPT,
      database: DATABASE_SYSTEM_PROMPT,
      auth: AUTH_SYSTEM_PROMPT,
      integrations: INTEGRATIONS_SYSTEM_PROMPT,
      devops: DEVOPS_SYSTEM_PROMPT,
      designer: FRONTEND_SYSTEM_PROMPT,
    };

    return agentPrompts[agentType] || BACKEND_SYSTEM_PROMPT;
  }
}

export const universalAIClient = new UniversalAIClient();
