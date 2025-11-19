import type { AgentType } from '../types';
export declare const AI_MODELS: {
    readonly anthropic: {
        readonly 'claude-3-5-sonnet-20241022': {
            readonly name: "Claude 3.5 Sonnet V2 (Latest)";
            readonly maxTokens: 200000;
            readonly contextWindow: 200000;
            readonly pricing: "premium";
            readonly speed: "fast";
            readonly bestFor: "code";
        };
        readonly 'claude-3-5-sonnet-20240620': {
            readonly name: "Claude 3.5 Sonnet V1";
            readonly maxTokens: 200000;
            readonly contextWindow: 200000;
            readonly pricing: "premium";
            readonly speed: "fast";
            readonly bestFor: "code";
        };
        readonly 'claude-3-5-haiku-20241022': {
            readonly name: "Claude 3.5 Haiku (Latest)";
            readonly maxTokens: 200000;
            readonly contextWindow: 200000;
            readonly pricing: "low";
            readonly speed: "fastest";
            readonly bestFor: "speed";
        };
        readonly 'claude-3-opus-20240229': {
            readonly name: "Claude 3 Opus (Most Capable)";
            readonly maxTokens: 200000;
            readonly contextWindow: 200000;
            readonly pricing: "premium";
            readonly speed: "medium";
            readonly bestFor: "complex";
        };
        readonly 'claude-3-sonnet-20240229': {
            readonly name: "Claude 3 Sonnet";
            readonly maxTokens: 200000;
            readonly contextWindow: 200000;
            readonly pricing: "medium";
            readonly speed: "fast";
            readonly bestFor: "balanced";
        };
        readonly 'claude-3-haiku-20240307': {
            readonly name: "Claude 3 Haiku";
            readonly maxTokens: 200000;
            readonly contextWindow: 200000;
            readonly pricing: "low";
            readonly speed: "fastest";
            readonly bestFor: "speed";
        };
        readonly 'claude-2.1': {
            readonly name: "Claude 2.1";
            readonly maxTokens: 200000;
            readonly contextWindow: 200000;
            readonly pricing: "medium";
            readonly speed: "medium";
            readonly bestFor: "legacy";
        };
        readonly 'claude-2.0': {
            readonly name: "Claude 2.0";
            readonly maxTokens: 100000;
            readonly contextWindow: 100000;
            readonly pricing: "medium";
            readonly speed: "medium";
            readonly bestFor: "legacy";
        };
    };
    readonly openai: {
        readonly 'gpt-4o': {
            readonly name: "GPT-4o (Latest Flagship)";
            readonly maxTokens: 16384;
            readonly contextWindow: 128000;
            readonly pricing: "high";
            readonly speed: "fast";
            readonly bestFor: "multimodal";
        };
        readonly 'gpt-4o-2024-11-20': {
            readonly name: "GPT-4o (Nov 2024)";
            readonly maxTokens: 16384;
            readonly contextWindow: 128000;
            readonly pricing: "high";
            readonly speed: "fast";
            readonly bestFor: "multimodal";
        };
        readonly 'gpt-4o-2024-08-06': {
            readonly name: "GPT-4o (Aug 2024)";
            readonly maxTokens: 16384;
            readonly contextWindow: 128000;
            readonly pricing: "high";
            readonly speed: "fast";
            readonly bestFor: "multimodal";
        };
        readonly 'gpt-4o-2024-05-13': {
            readonly name: "GPT-4o (May 2024)";
            readonly maxTokens: 16384;
            readonly contextWindow: 128000;
            readonly pricing: "high";
            readonly speed: "fast";
            readonly bestFor: "multimodal";
        };
        readonly 'gpt-4o-mini': {
            readonly name: "GPT-4o Mini (Best Value)";
            readonly maxTokens: 16384;
            readonly contextWindow: 128000;
            readonly pricing: "low";
            readonly speed: "very-fast";
            readonly bestFor: "fast-multimodal";
        };
        readonly 'gpt-4o-mini-2024-07-18': {
            readonly name: "GPT-4o Mini (July 2024)";
            readonly maxTokens: 16384;
            readonly contextWindow: 128000;
            readonly pricing: "low";
            readonly speed: "very-fast";
            readonly bestFor: "fast-multimodal";
        };
        readonly 'chatgpt-4o-latest': {
            readonly name: "ChatGPT-4o (Latest)";
            readonly maxTokens: 16384;
            readonly contextWindow: 128000;
            readonly pricing: "high";
            readonly speed: "fast";
            readonly bestFor: "chat";
        };
        readonly 'gpt-4-turbo': {
            readonly name: "GPT-4 Turbo";
            readonly maxTokens: 4096;
            readonly contextWindow: 128000;
            readonly pricing: "high";
            readonly speed: "medium";
            readonly bestFor: "general";
        };
        readonly 'gpt-4-turbo-2024-04-09': {
            readonly name: "GPT-4 Turbo (Apr 2024)";
            readonly maxTokens: 4096;
            readonly contextWindow: 128000;
            readonly pricing: "high";
            readonly speed: "medium";
            readonly bestFor: "general";
        };
        readonly 'gpt-4-turbo-preview': {
            readonly name: "GPT-4 Turbo Preview";
            readonly maxTokens: 4096;
            readonly contextWindow: 128000;
            readonly pricing: "high";
            readonly speed: "medium";
            readonly bestFor: "general";
        };
        readonly 'gpt-4-0125-preview': {
            readonly name: "GPT-4 0125 Preview";
            readonly maxTokens: 4096;
            readonly contextWindow: 128000;
            readonly pricing: "high";
            readonly speed: "medium";
            readonly bestFor: "general";
        };
        readonly 'gpt-4-1106-preview': {
            readonly name: "GPT-4 1106 Preview";
            readonly maxTokens: 4096;
            readonly contextWindow: 128000;
            readonly pricing: "high";
            readonly speed: "medium";
            readonly bestFor: "general";
        };
        readonly 'gpt-4-vision-preview': {
            readonly name: "GPT-4 Vision (Legacy)";
            readonly maxTokens: 4096;
            readonly contextWindow: 128000;
            readonly pricing: "high";
            readonly speed: "medium";
            readonly bestFor: "vision-legacy";
        };
        readonly 'gpt-4': {
            readonly name: "GPT-4";
            readonly maxTokens: 8192;
            readonly contextWindow: 8192;
            readonly pricing: "high";
            readonly speed: "slow";
            readonly bestFor: "quality";
        };
        readonly 'gpt-4-32k': {
            readonly name: "GPT-4 32k";
            readonly maxTokens: 32768;
            readonly contextWindow: 32768;
            readonly pricing: "very-high";
            readonly speed: "slow";
            readonly bestFor: "long-context";
        };
        readonly 'gpt-4-0613': {
            readonly name: "GPT-4 0613";
            readonly maxTokens: 8192;
            readonly contextWindow: 8192;
            readonly pricing: "high";
            readonly speed: "slow";
            readonly bestFor: "stable";
        };
        readonly 'gpt-3.5-turbo': {
            readonly name: "GPT-3.5 Turbo";
            readonly maxTokens: 4096;
            readonly contextWindow: 16385;
            readonly pricing: "low";
            readonly speed: "very-fast";
            readonly bestFor: "speed";
        };
        readonly 'gpt-3.5-turbo-0125': {
            readonly name: "GPT-3.5 Turbo (Jan 2024)";
            readonly maxTokens: 4096;
            readonly contextWindow: 16385;
            readonly pricing: "low";
            readonly speed: "very-fast";
            readonly bestFor: "speed";
        };
        readonly 'gpt-3.5-turbo-16k': {
            readonly name: "GPT-3.5 Turbo 16k";
            readonly maxTokens: 16385;
            readonly contextWindow: 16385;
            readonly pricing: "low";
            readonly speed: "very-fast";
            readonly bestFor: "speed";
        };
        readonly 'gpt-3.5-turbo-1106': {
            readonly name: "GPT-3.5 Turbo (Nov 2023)";
            readonly maxTokens: 4096;
            readonly contextWindow: 16385;
            readonly pricing: "low";
            readonly speed: "very-fast";
            readonly bestFor: "speed";
        };
        readonly o1: {
            readonly name: "OpenAI o1 (Latest Reasoning)";
            readonly maxTokens: 100000;
            readonly contextWindow: 200000;
            readonly pricing: "very-high";
            readonly speed: "slow";
            readonly bestFor: "reasoning";
        };
        readonly 'o1-2024-12-17': {
            readonly name: "OpenAI o1 (Dec 2024)";
            readonly maxTokens: 100000;
            readonly contextWindow: 200000;
            readonly pricing: "very-high";
            readonly speed: "slow";
            readonly bestFor: "reasoning";
        };
        readonly 'o1-preview': {
            readonly name: "OpenAI o1 Preview";
            readonly maxTokens: 32768;
            readonly contextWindow: 128000;
            readonly pricing: "very-high";
            readonly speed: "slow";
            readonly bestFor: "reasoning";
        };
        readonly 'o1-preview-2024-09-12': {
            readonly name: "OpenAI o1 Preview (Sep 2024)";
            readonly maxTokens: 32768;
            readonly contextWindow: 128000;
            readonly pricing: "very-high";
            readonly speed: "slow";
            readonly bestFor: "reasoning";
        };
        readonly 'o1-mini': {
            readonly name: "OpenAI o1 Mini";
            readonly maxTokens: 65536;
            readonly contextWindow: 128000;
            readonly pricing: "high";
            readonly speed: "medium";
            readonly bestFor: "reasoning-fast";
        };
        readonly 'o1-mini-2024-09-12': {
            readonly name: "OpenAI o1 Mini (Sep 2024)";
            readonly maxTokens: 65536;
            readonly contextWindow: 128000;
            readonly pricing: "high";
            readonly speed: "medium";
            readonly bestFor: "reasoning-fast";
        };
        readonly o3: {
            readonly name: "OpenAI o3 (Latest)";
            readonly maxTokens: 100000;
            readonly contextWindow: 200000;
            readonly pricing: "very-high";
            readonly speed: "medium";
            readonly bestFor: "reasoning";
        };
        readonly 'o3-mini': {
            readonly name: "OpenAI o3 Mini";
            readonly maxTokens: 100000;
            readonly contextWindow: 200000;
            readonly pricing: "high";
            readonly speed: "fast";
            readonly bestFor: "reasoning-fast";
        };
        readonly 'o3-mini-high': {
            readonly name: "OpenAI o3 Mini High";
            readonly maxTokens: 100000;
            readonly contextWindow: 200000;
            readonly pricing: "high";
            readonly speed: "fast";
            readonly bestFor: "reasoning-fast";
        };
    };
    readonly google: {
        readonly 'gemini-2.0-flash-exp': {
            readonly name: "Gemini 2.0 Flash Experimental";
            readonly maxTokens: 8192;
            readonly contextWindow: 1000000;
            readonly pricing: "low";
            readonly speed: "fastest";
            readonly bestFor: "speed";
        };
        readonly 'gemini-2.0-flash': {
            readonly name: "Gemini 2.0 Flash (Stable)";
            readonly maxTokens: 8192;
            readonly contextWindow: 1000000;
            readonly pricing: "low";
            readonly speed: "fastest";
            readonly bestFor: "speed";
        };
        readonly 'gemini-2.0-flash-thinking-exp': {
            readonly name: "Gemini 2.0 Flash Thinking";
            readonly maxTokens: 8192;
            readonly contextWindow: 1000000;
            readonly pricing: "medium";
            readonly speed: "fast";
            readonly bestFor: "reasoning";
        };
        readonly 'gemini-2.0-pro': {
            readonly name: "Gemini 2.0 Pro (2M Context)";
            readonly maxTokens: 8192;
            readonly contextWindow: 2000000;
            readonly pricing: "medium";
            readonly speed: "medium";
            readonly bestFor: "long-context";
        };
        readonly 'gemini-1.5-pro': {
            readonly name: "Gemini 1.5 Pro (2M Context)";
            readonly maxTokens: 8192;
            readonly contextWindow: 2000000;
            readonly pricing: "medium";
            readonly speed: "medium";
            readonly bestFor: "long-context";
        };
        readonly 'gemini-1.5-pro-002': {
            readonly name: "Gemini 1.5 Pro 002";
            readonly maxTokens: 8192;
            readonly contextWindow: 2000000;
            readonly pricing: "medium";
            readonly speed: "medium";
            readonly bestFor: "long-context";
        };
        readonly 'gemini-1.5-flash': {
            readonly name: "Gemini 1.5 Flash (1M Context)";
            readonly maxTokens: 8192;
            readonly contextWindow: 1000000;
            readonly pricing: "low";
            readonly speed: "very-fast";
            readonly bestFor: "speed";
        };
        readonly 'gemini-1.5-flash-002': {
            readonly name: "Gemini 1.5 Flash 002";
            readonly maxTokens: 8192;
            readonly contextWindow: 1000000;
            readonly pricing: "low";
            readonly speed: "very-fast";
            readonly bestFor: "speed";
        };
        readonly 'gemini-pro-1.5': {
            readonly name: "Gemini Pro 1.5";
            readonly maxTokens: 8192;
            readonly contextWindow: 2000000;
            readonly pricing: "medium";
            readonly speed: "medium";
            readonly bestFor: "long-context";
        };
        readonly 'gemini-exp-1206': {
            readonly name: "Gemini Experimental 1206";
            readonly maxTokens: 8192;
            readonly contextWindow: 2000000;
            readonly pricing: "medium";
            readonly speed: "fast";
            readonly bestFor: "experimental";
        };
        readonly 'gemini-exp-1121': {
            readonly name: "Gemini Experimental 1121";
            readonly maxTokens: 8192;
            readonly contextWindow: 2000000;
            readonly pricing: "medium";
            readonly speed: "fast";
            readonly bestFor: "experimental";
        };
        readonly 'gemini-pro': {
            readonly name: "Gemini Pro";
            readonly maxTokens: 8192;
            readonly contextWindow: 32000;
            readonly pricing: "low";
            readonly speed: "fast";
            readonly bestFor: "balanced";
        };
        readonly 'gemini-ultra': {
            readonly name: "Gemini Ultra";
            readonly maxTokens: 8192;
            readonly contextWindow: 32000;
            readonly pricing: "high";
            readonly speed: "medium";
            readonly bestFor: "quality";
        };
    };
    readonly meta: {
        readonly 'llama-3.3-70b-instruct': {
            readonly name: "Llama 3.3 70B Instruct (Latest)";
            readonly maxTokens: 128000;
            readonly contextWindow: 128000;
            readonly pricing: "free";
            readonly speed: "fast";
            readonly bestFor: "free-large";
        };
        readonly 'llama-3.2-90b-vision-instruct': {
            readonly name: "Llama 3.2 90B Vision";
            readonly maxTokens: 128000;
            readonly contextWindow: 128000;
            readonly pricing: "free";
            readonly speed: "medium";
            readonly bestFor: "vision";
        };
        readonly 'llama-3.2-11b-vision-instruct': {
            readonly name: "Llama 3.2 11B Vision";
            readonly maxTokens: 128000;
            readonly contextWindow: 128000;
            readonly pricing: "free";
            readonly speed: "fast";
            readonly bestFor: "vision";
        };
        readonly 'llama-3.2-3b-instruct': {
            readonly name: "Llama 3.2 3B Instruct";
            readonly maxTokens: 128000;
            readonly contextWindow: 128000;
            readonly pricing: "free";
            readonly speed: "very-fast";
            readonly bestFor: "lightweight";
        };
        readonly 'llama-3.2-1b-instruct': {
            readonly name: "Llama 3.2 1B Instruct";
            readonly maxTokens: 128000;
            readonly contextWindow: 128000;
            readonly pricing: "free";
            readonly speed: "very-fast";
            readonly bestFor: "ultra-light";
        };
        readonly 'llama-3.1-405b-instruct': {
            readonly name: "Llama 3.1 405B Instruct (Largest)";
            readonly maxTokens: 131072;
            readonly contextWindow: 131072;
            readonly pricing: "free";
            readonly speed: "slow";
            readonly bestFor: "quality-free";
        };
        readonly 'llama-3.1-70b-instruct': {
            readonly name: "Llama 3.1 70B Instruct";
            readonly maxTokens: 131072;
            readonly contextWindow: 131072;
            readonly pricing: "free";
            readonly speed: "fast";
            readonly bestFor: "balanced-free";
        };
        readonly 'llama-3.1-8b-instruct': {
            readonly name: "Llama 3.1 8B Instruct";
            readonly maxTokens: 131072;
            readonly contextWindow: 131072;
            readonly pricing: "free";
            readonly speed: "very-fast";
            readonly bestFor: "speed-free";
        };
        readonly 'llama-3-70b-instruct': {
            readonly name: "Llama 3 70B Instruct";
            readonly maxTokens: 8192;
            readonly contextWindow: 8192;
            readonly pricing: "free";
            readonly speed: "fast";
            readonly bestFor: "free";
        };
        readonly 'llama-3-8b-instruct': {
            readonly name: "Llama 3 8B Instruct";
            readonly maxTokens: 8192;
            readonly contextWindow: 8192;
            readonly pricing: "free";
            readonly speed: "very-fast";
            readonly bestFor: "free";
        };
        readonly 'llama-2-70b-chat': {
            readonly name: "Llama 2 70B Chat";
            readonly maxTokens: 4096;
            readonly contextWindow: 4096;
            readonly pricing: "free";
            readonly speed: "fast";
            readonly bestFor: "legacy-free";
        };
        readonly 'llama-2-13b-chat': {
            readonly name: "Llama 2 13B Chat";
            readonly maxTokens: 4096;
            readonly contextWindow: 4096;
            readonly pricing: "free";
            readonly speed: "very-fast";
            readonly bestFor: "legacy-free";
        };
    };
    readonly mistral: {
        readonly 'mistral-large-2411': {
            readonly name: "Mistral Large 2411 (Latest)";
            readonly maxTokens: 128000;
            readonly contextWindow: 128000;
            readonly pricing: "high";
            readonly speed: "fast";
            readonly bestFor: "quality";
        };
        readonly 'mistral-large-2407': {
            readonly name: "Mistral Large 2407";
            readonly maxTokens: 128000;
            readonly contextWindow: 128000;
            readonly pricing: "high";
            readonly speed: "fast";
            readonly bestFor: "quality";
        };
        readonly 'mistral-large-latest': {
            readonly name: "Mistral Large (Auto-Latest)";
            readonly maxTokens: 128000;
            readonly contextWindow: 128000;
            readonly pricing: "high";
            readonly speed: "fast";
            readonly bestFor: "quality";
        };
        readonly 'mistral-medium-2312': {
            readonly name: "Mistral Medium";
            readonly maxTokens: 32000;
            readonly contextWindow: 32000;
            readonly pricing: "medium";
            readonly speed: "fast";
            readonly bestFor: "balanced";
        };
        readonly 'mistral-medium-latest': {
            readonly name: "Mistral Medium (Auto-Latest)";
            readonly maxTokens: 32000;
            readonly contextWindow: 32000;
            readonly pricing: "medium";
            readonly speed: "fast";
            readonly bestFor: "balanced";
        };
        readonly 'mistral-small-2402': {
            readonly name: "Mistral Small 2402";
            readonly maxTokens: 32000;
            readonly contextWindow: 32000;
            readonly pricing: "low";
            readonly speed: "very-fast";
            readonly bestFor: "speed";
        };
        readonly 'mistral-small-latest': {
            readonly name: "Mistral Small (Auto-Latest)";
            readonly maxTokens: 32000;
            readonly contextWindow: 32000;
            readonly pricing: "low";
            readonly speed: "very-fast";
            readonly bestFor: "speed";
        };
        readonly 'mistral-small-2409': {
            readonly name: "Mistral Small 2409";
            readonly maxTokens: 32000;
            readonly contextWindow: 32000;
            readonly pricing: "low";
            readonly speed: "very-fast";
            readonly bestFor: "speed";
        };
        readonly 'codestral-2405': {
            readonly name: "Codestral 2405 (Code Expert)";
            readonly maxTokens: 32000;
            readonly contextWindow: 32000;
            readonly pricing: "medium";
            readonly speed: "fast";
            readonly bestFor: "code";
        };
        readonly 'codestral-latest': {
            readonly name: "Codestral (Auto-Latest)";
            readonly maxTokens: 32000;
            readonly contextWindow: 32000;
            readonly pricing: "medium";
            readonly speed: "fast";
            readonly bestFor: "code";
        };
        readonly 'codestral-mamba-latest': {
            readonly name: "Codestral Mamba";
            readonly maxTokens: 256000;
            readonly contextWindow: 256000;
            readonly pricing: "medium";
            readonly speed: "fast";
            readonly bestFor: "long-code";
        };
        readonly 'mistral-nemo-2407': {
            readonly name: "Mistral Nemo 12B";
            readonly maxTokens: 128000;
            readonly contextWindow: 128000;
            readonly pricing: "low";
            readonly speed: "very-fast";
            readonly bestFor: "speed";
        };
        readonly 'open-mistral-nemo': {
            readonly name: "Open Mistral Nemo";
            readonly maxTokens: 128000;
            readonly contextWindow: 128000;
            readonly pricing: "free";
            readonly speed: "very-fast";
            readonly bestFor: "free";
        };
        readonly 'mixtral-8x7b-instruct': {
            readonly name: "Mixtral 8x7B Instruct (MoE)";
            readonly maxTokens: 32000;
            readonly contextWindow: 32000;
            readonly pricing: "free";
            readonly speed: "fast";
            readonly bestFor: "free-quality";
        };
        readonly 'mixtral-8x22b-instruct': {
            readonly name: "Mixtral 8x22B Instruct (MoE)";
            readonly maxTokens: 64000;
            readonly contextWindow: 64000;
            readonly pricing: "free";
            readonly speed: "medium";
            readonly bestFor: "free-quality";
        };
        readonly 'open-mixtral-8x7b': {
            readonly name: "Open Mixtral 8x7B";
            readonly maxTokens: 32000;
            readonly contextWindow: 32000;
            readonly pricing: "free";
            readonly speed: "fast";
            readonly bestFor: "free";
        };
        readonly 'open-mixtral-8x22b': {
            readonly name: "Open Mixtral 8x22B";
            readonly maxTokens: 64000;
            readonly contextWindow: 64000;
            readonly pricing: "free";
            readonly speed: "medium";
            readonly bestFor: "free";
        };
        readonly 'pixtral-12b-2409': {
            readonly name: "Pixtral 12B (Vision)";
            readonly maxTokens: 128000;
            readonly contextWindow: 128000;
            readonly pricing: "low";
            readonly speed: "fast";
            readonly bestFor: "vision";
        };
    };
    readonly deepseek: {
        readonly 'deepseek-chat-v3': {
            readonly name: "DeepSeek Chat V3 (Latest)";
            readonly maxTokens: 64000;
            readonly contextWindow: 64000;
            readonly pricing: "very-low";
            readonly speed: "very-fast";
            readonly bestFor: "cheap-quality";
        };
        readonly 'deepseek-coder-v3': {
            readonly name: "DeepSeek Coder V3 (Latest)";
            readonly maxTokens: 64000;
            readonly contextWindow: 64000;
            readonly pricing: "very-low";
            readonly speed: "very-fast";
            readonly bestFor: "cheap-code";
        };
        readonly 'deepseek-chat-v2.5': {
            readonly name: "DeepSeek Chat V2.5";
            readonly maxTokens: 64000;
            readonly contextWindow: 64000;
            readonly pricing: "very-low";
            readonly speed: "very-fast";
            readonly bestFor: "cheap";
        };
        readonly 'deepseek-coder-v2.5': {
            readonly name: "DeepSeek Coder V2.5";
            readonly maxTokens: 64000;
            readonly contextWindow: 64000;
            readonly pricing: "very-low";
            readonly speed: "very-fast";
            readonly bestFor: "cheap-code";
        };
        readonly 'deepseek-chat': {
            readonly name: "DeepSeek Chat";
            readonly maxTokens: 64000;
            readonly contextWindow: 64000;
            readonly pricing: "very-low";
            readonly speed: "very-fast";
            readonly bestFor: "cheap";
        };
        readonly 'deepseek-coder': {
            readonly name: "DeepSeek Coder";
            readonly maxTokens: 64000;
            readonly contextWindow: 64000;
            readonly pricing: "very-low";
            readonly speed: "very-fast";
            readonly bestFor: "cheap-code";
        };
        readonly 'deepseek-r1': {
            readonly name: "DeepSeek R1 (Reasoning)";
            readonly maxTokens: 64000;
            readonly contextWindow: 64000;
            readonly pricing: "low";
            readonly speed: "medium";
            readonly bestFor: "cheap-reasoning";
        };
        readonly 'deepseek-r1-distill-llama-70b': {
            readonly name: "DeepSeek R1 Distill 70B";
            readonly maxTokens: 128000;
            readonly contextWindow: 128000;
            readonly pricing: "very-low";
            readonly speed: "fast";
            readonly bestFor: "cheap-reasoning";
        };
    };
    readonly cohere: {
        readonly 'command-r-plus': {
            readonly name: "Command R+ (Latest)";
            readonly maxTokens: 128000;
            readonly contextWindow: 128000;
            readonly pricing: "medium";
            readonly speed: "fast";
            readonly bestFor: "rag";
        };
        readonly 'command-r-plus-08-2024': {
            readonly name: "Command R+ (Aug 2024)";
            readonly maxTokens: 128000;
            readonly contextWindow: 128000;
            readonly pricing: "medium";
            readonly speed: "fast";
            readonly bestFor: "rag";
        };
        readonly 'command-r-plus-04-2024': {
            readonly name: "Command R+ (Apr 2024)";
            readonly maxTokens: 128000;
            readonly contextWindow: 128000;
            readonly pricing: "medium";
            readonly speed: "fast";
            readonly bestFor: "rag";
        };
        readonly 'command-r': {
            readonly name: "Command R";
            readonly maxTokens: 128000;
            readonly contextWindow: 128000;
            readonly pricing: "low";
            readonly speed: "fast";
            readonly bestFor: "rag";
        };
        readonly 'command-r-08-2024': {
            readonly name: "Command R (Aug 2024)";
            readonly maxTokens: 128000;
            readonly contextWindow: 128000;
            readonly pricing: "low";
            readonly speed: "fast";
            readonly bestFor: "rag";
        };
        readonly 'command-r-03-2024': {
            readonly name: "Command R (Mar 2024)";
            readonly maxTokens: 128000;
            readonly contextWindow: 128000;
            readonly pricing: "low";
            readonly speed: "fast";
            readonly bestFor: "rag";
        };
        readonly command: {
            readonly name: "Command";
            readonly maxTokens: 4096;
            readonly contextWindow: 4096;
            readonly pricing: "very-low";
            readonly speed: "very-fast";
            readonly bestFor: "simple";
        };
        readonly 'command-light': {
            readonly name: "Command Light";
            readonly maxTokens: 4096;
            readonly contextWindow: 4096;
            readonly pricing: "very-low";
            readonly speed: "very-fast";
            readonly bestFor: "simple";
        };
        readonly 'command-nightly': {
            readonly name: "Command Nightly";
            readonly maxTokens: 128000;
            readonly contextWindow: 128000;
            readonly pricing: "low";
            readonly speed: "fast";
            readonly bestFor: "experimental";
        };
    };
    readonly qwen: {
        readonly 'qwen-2.5-72b-instruct': {
            readonly name: "Qwen 2.5 72B Instruct";
            readonly maxTokens: 32768;
            readonly contextWindow: 32768;
            readonly pricing: "free";
            readonly speed: "fast";
            readonly bestFor: "free-quality";
        };
        readonly 'qwen-2.5-7b-instruct': {
            readonly name: "Qwen 2.5 7B Instruct";
            readonly maxTokens: 32768;
            readonly contextWindow: 32768;
            readonly pricing: "free";
            readonly speed: "very-fast";
            readonly bestFor: "free-speed";
        };
        readonly 'qwen-2-72b-instruct': {
            readonly name: "Qwen 2 72B Instruct";
            readonly maxTokens: 32768;
            readonly contextWindow: 32768;
            readonly pricing: "free";
            readonly speed: "fast";
            readonly bestFor: "free";
        };
        readonly 'qwen-2-7b-instruct': {
            readonly name: "Qwen 2 7B Instruct";
            readonly maxTokens: 32768;
            readonly contextWindow: 32768;
            readonly pricing: "free";
            readonly speed: "very-fast";
            readonly bestFor: "free";
        };
        readonly 'qwen-2-1.5b-instruct': {
            readonly name: "Qwen 2 1.5B Instruct";
            readonly maxTokens: 32768;
            readonly contextWindow: 32768;
            readonly pricing: "free";
            readonly speed: "very-fast";
            readonly bestFor: "ultra-light";
        };
        readonly 'qwq-32b-preview': {
            readonly name: "QwQ 32B Preview (Reasoning)";
            readonly maxTokens: 32768;
            readonly contextWindow: 32768;
            readonly pricing: "free";
            readonly speed: "medium";
            readonly bestFor: "free-reasoning";
        };
    };
    readonly xai: {
        readonly 'grok-beta': {
            readonly name: "Grok Beta";
            readonly maxTokens: 131072;
            readonly contextWindow: 131072;
            readonly pricing: "high";
            readonly speed: "fast";
            readonly bestFor: "realtime";
        };
        readonly 'grok-2': {
            readonly name: "Grok 2 (Latest)";
            readonly maxTokens: 131072;
            readonly contextWindow: 131072;
            readonly pricing: "high";
            readonly speed: "fast";
            readonly bestFor: "realtime";
        };
        readonly 'grok-2-vision': {
            readonly name: "Grok 2 Vision";
            readonly maxTokens: 131072;
            readonly contextWindow: 131072;
            readonly pricing: "high";
            readonly speed: "fast";
            readonly bestFor: "vision";
        };
    };
    readonly perplexity: {
        readonly 'perplexity-sonar-pro': {
            readonly name: "Sonar Pro (Latest + Web)";
            readonly maxTokens: 127072;
            readonly contextWindow: 127072;
            readonly pricing: "medium";
            readonly speed: "fast";
            readonly bestFor: "web-search";
        };
        readonly 'perplexity-sonar': {
            readonly name: "Sonar (Web Search)";
            readonly maxTokens: 127072;
            readonly contextWindow: 127072;
            readonly pricing: "low";
            readonly speed: "fast";
            readonly bestFor: "web-search";
        };
        readonly 'perplexity-sonar-reasoning': {
            readonly name: "Sonar Reasoning";
            readonly maxTokens: 127072;
            readonly contextWindow: 127072;
            readonly pricing: "medium";
            readonly speed: "medium";
            readonly bestFor: "web-reasoning";
        };
    };
    readonly together: {
        readonly 'meta-llama/llama-3.3-70b-instruct-turbo': {
            readonly name: "Llama 3.3 70B Turbo";
            readonly maxTokens: 128000;
            readonly contextWindow: 128000;
            readonly pricing: "low";
            readonly speed: "very-fast";
            readonly bestFor: "fast-free";
        };
        readonly 'meta-llama/llama-3.1-405b-instruct-turbo': {
            readonly name: "Llama 3.1 405B Turbo";
            readonly maxTokens: 131072;
            readonly contextWindow: 131072;
            readonly pricing: "medium";
            readonly speed: "fast";
            readonly bestFor: "quality-fast";
        };
        readonly 'mistralai/mixtral-8x22b-instruct': {
            readonly name: "Mixtral 8x22B Instruct";
            readonly maxTokens: 65536;
            readonly contextWindow: 65536;
            readonly pricing: "low";
            readonly speed: "fast";
            readonly bestFor: "moe";
        };
    };
    readonly groq: {
        readonly 'llama-3.3-70b-versatile': {
            readonly name: "Llama 3.3 70B (Groq)";
            readonly maxTokens: 32768;
            readonly contextWindow: 32768;
            readonly pricing: "free";
            readonly speed: "ultra-fast";
            readonly bestFor: "speed-free";
        };
        readonly 'llama-3.1-70b-versatile': {
            readonly name: "Llama 3.1 70B (Groq)";
            readonly maxTokens: 131072;
            readonly contextWindow: 131072;
            readonly pricing: "free";
            readonly speed: "ultra-fast";
            readonly bestFor: "speed-free";
        };
        readonly 'llama-3.1-8b-instant': {
            readonly name: "Llama 3.1 8B Instant (Groq)";
            readonly maxTokens: 8192;
            readonly contextWindow: 8192;
            readonly pricing: "free";
            readonly speed: "ultra-fast";
            readonly bestFor: "ultra-speed";
        };
        readonly 'mixtral-8x7b-32768': {
            readonly name: "Mixtral 8x7B (Groq)";
            readonly maxTokens: 32768;
            readonly contextWindow: 32768;
            readonly pricing: "free";
            readonly speed: "ultra-fast";
            readonly bestFor: "speed-free";
        };
    };
    readonly other: {
        readonly 'yi-large': {
            readonly name: "Yi Large (01.AI)";
            readonly maxTokens: 32768;
            readonly contextWindow: 32768;
            readonly pricing: "medium";
            readonly speed: "fast";
            readonly bestFor: "multilingual";
        };
        readonly 'yi-lightning': {
            readonly name: "Yi Lightning";
            readonly maxTokens: 16384;
            readonly contextWindow: 16384;
            readonly pricing: "low";
            readonly speed: "very-fast";
            readonly bestFor: "speed";
        };
        readonly 'yi-medium': {
            readonly name: "Yi Medium";
            readonly maxTokens: 16384;
            readonly contextWindow: 16384;
            readonly pricing: "low";
            readonly speed: "fast";
            readonly bestFor: "balanced";
        };
        readonly 'nous-hermes-2-mixtral-8x7b': {
            readonly name: "Nous Hermes 2 Mixtral";
            readonly maxTokens: 32000;
            readonly contextWindow: 32000;
            readonly pricing: "free";
            readonly speed: "fast";
            readonly bestFor: "free";
        };
        readonly 'nous-capybara-7b': {
            readonly name: "Nous Capybara 7B";
            readonly maxTokens: 32000;
            readonly contextWindow: 32000;
            readonly pricing: "free";
            readonly speed: "very-fast";
            readonly bestFor: "free";
        };
        readonly 'nous-hermes-2-yi-34b': {
            readonly name: "Nous Hermes 2 Yi 34B";
            readonly maxTokens: 32768;
            readonly contextWindow: 32768;
            readonly pricing: "free";
            readonly speed: "fast";
            readonly bestFor: "free-quality";
        };
        readonly 'dolphin-mixtral-8x7b': {
            readonly name: "Dolphin Mixtral 8x7B";
            readonly maxTokens: 32000;
            readonly contextWindow: 32000;
            readonly pricing: "free";
            readonly speed: "fast";
            readonly bestFor: "uncensored";
        };
        readonly 'dolphin-2.6-mixtral-8x7b': {
            readonly name: "Dolphin 2.6 Mixtral";
            readonly maxTokens: 32000;
            readonly contextWindow: 32000;
            readonly pricing: "free";
            readonly speed: "fast";
            readonly bestFor: "uncensored";
        };
        readonly 'dolphin-llama-3.1-70b': {
            readonly name: "Dolphin Llama 3.1 70B";
            readonly maxTokens: 131072;
            readonly contextWindow: 131072;
            readonly pricing: "free";
            readonly speed: "fast";
            readonly bestFor: "uncensored";
        };
        readonly 'wizardlm-2-8x22b': {
            readonly name: "WizardLM 2 8x22B";
            readonly maxTokens: 65536;
            readonly contextWindow: 65536;
            readonly pricing: "free";
            readonly speed: "fast";
            readonly bestFor: "free-quality";
        };
        readonly 'wizardlm-2-7b': {
            readonly name: "WizardLM 2 7B";
            readonly maxTokens: 32000;
            readonly contextWindow: 32000;
            readonly pricing: "free";
            readonly speed: "very-fast";
            readonly bestFor: "free";
        };
        readonly 'phind-codellama-34b': {
            readonly name: "Phind CodeLlama 34B";
            readonly maxTokens: 16384;
            readonly contextWindow: 16384;
            readonly pricing: "free";
            readonly speed: "fast";
            readonly bestFor: "code-free";
        };
        readonly 'mythomax-l2-13b': {
            readonly name: "MythoMax L2 13B";
            readonly maxTokens: 8192;
            readonly contextWindow: 8192;
            readonly pricing: "free";
            readonly speed: "very-fast";
            readonly bestFor: "creative";
        };
        readonly 'toppy-m-7b': {
            readonly name: "Toppy M 7B";
            readonly maxTokens: 32000;
            readonly contextWindow: 32000;
            readonly pricing: "free";
            readonly speed: "very-fast";
            readonly bestFor: "free";
        };
    };
};
export type AIProvider = 'anthropic' | 'openai' | 'openrouter';
export type AIModelCategory = keyof typeof AI_MODELS;
export type AIModelId = string;
export interface AIGenerationOptions {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    systemPrompt?: string;
    streamCallback?: (chunk: string) => void;
    autonomousMode?: boolean;
}
export declare class UniversalAIClient {
    private anthropicClient?;
    private openaiClient?;
    private openrouterClient?;
    constructor();
    /**
     * Generate code using the configured AI provider
     * AUTONOMOUS MODE: No interruptions, full automation
     */
    generateCode(prompt: string, agentType: AgentType, options?: AIGenerationOptions): Promise<{
        content: string;
        tokensUsed: number;
    }>;
    /**
     * Stream generation with real-time updates
     */
    streamGeneration(prompt: string, agentType: AgentType, onChunk: (chunk: string) => void, options?: AIGenerationOptions): Promise<{
        content: string;
        tokensUsed: number;
    }>;
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
        pricing?: string;
        speed?: string;
        bestFor?: string;
    }>;
    private getProviderForModel;
    private generateWithAnthropic;
    private generateWithOpenAI;
    private generateWithOpenRouter;
    private streamWithAnthropic;
    private streamWithOpenAI;
    private streamWithOpenRouter;
    private getSystemPrompt;
}
export declare const universalAIClient: UniversalAIClient;
//# sourceMappingURL=universal-ai-client.d.ts.map