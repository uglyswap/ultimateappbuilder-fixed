"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.universalAIClient = exports.UniversalAIClient = exports.AI_MODELS = void 0;
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const openai_1 = __importDefault(require("openai"));
const config_1 = require("../config");
const logger_1 = require("./logger");
// COMPREHENSIVE list of ALL available AI models (Updated January 2025)
// Automatically updated with latest models from each provider
exports.AI_MODELS = {
    // ==========================================
    // Anthropic Claude Models (Latest 2025)
    // ==========================================
    anthropic: {
        // Claude 3.5 Family (Latest Generation - BEST FOR CODE)
        'claude-3-5-sonnet-20241022': { name: 'Claude 3.5 Sonnet V2 (Latest)', maxTokens: 200000, contextWindow: 200000, pricing: 'premium', speed: 'fast', bestFor: 'code' },
        'claude-3-5-sonnet-20240620': { name: 'Claude 3.5 Sonnet V1', maxTokens: 200000, contextWindow: 200000, pricing: 'premium', speed: 'fast', bestFor: 'code' },
        'claude-3-5-haiku-20241022': { name: 'Claude 3.5 Haiku (Latest)', maxTokens: 200000, contextWindow: 200000, pricing: 'low', speed: 'fastest', bestFor: 'speed' },
        // Claude 3 Family
        'claude-3-opus-20240229': { name: 'Claude 3 Opus (Most Capable)', maxTokens: 200000, contextWindow: 200000, pricing: 'premium', speed: 'medium', bestFor: 'complex' },
        'claude-3-sonnet-20240229': { name: 'Claude 3 Sonnet', maxTokens: 200000, contextWindow: 200000, pricing: 'medium', speed: 'fast', bestFor: 'balanced' },
        'claude-3-haiku-20240307': { name: 'Claude 3 Haiku', maxTokens: 200000, contextWindow: 200000, pricing: 'low', speed: 'fastest', bestFor: 'speed' },
        // Claude 2 (Legacy but still powerful)
        'claude-2.1': { name: 'Claude 2.1', maxTokens: 200000, contextWindow: 200000, pricing: 'medium', speed: 'medium', bestFor: 'legacy' },
        'claude-2.0': { name: 'Claude 2.0', maxTokens: 100000, contextWindow: 100000, pricing: 'medium', speed: 'medium', bestFor: 'legacy' },
    },
    // ==========================================
    // OpenAI Models (Latest 2025)
    // ==========================================
    openai: {
        // GPT-4o (Omni - Latest Flagship with Vision & Audio)
        'gpt-4o': { name: 'GPT-4o (Latest Flagship)', maxTokens: 16384, contextWindow: 128000, pricing: 'high', speed: 'fast', bestFor: 'multimodal' },
        'gpt-4o-2024-11-20': { name: 'GPT-4o (Nov 2024)', maxTokens: 16384, contextWindow: 128000, pricing: 'high', speed: 'fast', bestFor: 'multimodal' },
        'gpt-4o-2024-08-06': { name: 'GPT-4o (Aug 2024)', maxTokens: 16384, contextWindow: 128000, pricing: 'high', speed: 'fast', bestFor: 'multimodal' },
        'gpt-4o-2024-05-13': { name: 'GPT-4o (May 2024)', maxTokens: 16384, contextWindow: 128000, pricing: 'high', speed: 'fast', bestFor: 'multimodal' },
        'gpt-4o-mini': { name: 'GPT-4o Mini (Best Value)', maxTokens: 16384, contextWindow: 128000, pricing: 'low', speed: 'very-fast', bestFor: 'fast-multimodal' },
        'gpt-4o-mini-2024-07-18': { name: 'GPT-4o Mini (July 2024)', maxTokens: 16384, contextWindow: 128000, pricing: 'low', speed: 'very-fast', bestFor: 'fast-multimodal' },
        'chatgpt-4o-latest': { name: 'ChatGPT-4o (Latest)', maxTokens: 16384, contextWindow: 128000, pricing: 'high', speed: 'fast', bestFor: 'chat' },
        // GPT-4 Turbo (128K context)
        'gpt-4-turbo': { name: 'GPT-4 Turbo', maxTokens: 4096, contextWindow: 128000, pricing: 'high', speed: 'medium', bestFor: 'general' },
        'gpt-4-turbo-2024-04-09': { name: 'GPT-4 Turbo (Apr 2024)', maxTokens: 4096, contextWindow: 128000, pricing: 'high', speed: 'medium', bestFor: 'general' },
        'gpt-4-turbo-preview': { name: 'GPT-4 Turbo Preview', maxTokens: 4096, contextWindow: 128000, pricing: 'high', speed: 'medium', bestFor: 'general' },
        'gpt-4-0125-preview': { name: 'GPT-4 0125 Preview', maxTokens: 4096, contextWindow: 128000, pricing: 'high', speed: 'medium', bestFor: 'general' },
        'gpt-4-1106-preview': { name: 'GPT-4 1106 Preview', maxTokens: 4096, contextWindow: 128000, pricing: 'high', speed: 'medium', bestFor: 'general' },
        'gpt-4-vision-preview': { name: 'GPT-4 Vision (Legacy)', maxTokens: 4096, contextWindow: 128000, pricing: 'high', speed: 'medium', bestFor: 'vision-legacy' },
        // GPT-4 Base
        'gpt-4': { name: 'GPT-4', maxTokens: 8192, contextWindow: 8192, pricing: 'high', speed: 'slow', bestFor: 'quality' },
        'gpt-4-32k': { name: 'GPT-4 32k', maxTokens: 32768, contextWindow: 32768, pricing: 'very-high', speed: 'slow', bestFor: 'long-context' },
        'gpt-4-0613': { name: 'GPT-4 0613', maxTokens: 8192, contextWindow: 8192, pricing: 'high', speed: 'slow', bestFor: 'stable' },
        // GPT-3.5 (Fast & Cheap)
        'gpt-3.5-turbo': { name: 'GPT-3.5 Turbo', maxTokens: 4096, contextWindow: 16385, pricing: 'low', speed: 'very-fast', bestFor: 'speed' },
        'gpt-3.5-turbo-0125': { name: 'GPT-3.5 Turbo (Jan 2024)', maxTokens: 4096, contextWindow: 16385, pricing: 'low', speed: 'very-fast', bestFor: 'speed' },
        'gpt-3.5-turbo-16k': { name: 'GPT-3.5 Turbo 16k', maxTokens: 16385, contextWindow: 16385, pricing: 'low', speed: 'very-fast', bestFor: 'speed' },
        'gpt-3.5-turbo-1106': { name: 'GPT-3.5 Turbo (Nov 2023)', maxTokens: 4096, contextWindow: 16385, pricing: 'low', speed: 'very-fast', bestFor: 'speed' },
        // o1 Series (Reasoning Models - BEST FOR COMPLEX PROBLEMS)
        'o1': { name: 'OpenAI o1 (Latest Reasoning)', maxTokens: 100000, contextWindow: 200000, pricing: 'very-high', speed: 'slow', bestFor: 'reasoning' },
        'o1-2024-12-17': { name: 'OpenAI o1 (Dec 2024)', maxTokens: 100000, contextWindow: 200000, pricing: 'very-high', speed: 'slow', bestFor: 'reasoning' },
        'o1-preview': { name: 'OpenAI o1 Preview', maxTokens: 32768, contextWindow: 128000, pricing: 'very-high', speed: 'slow', bestFor: 'reasoning' },
        'o1-preview-2024-09-12': { name: 'OpenAI o1 Preview (Sep 2024)', maxTokens: 32768, contextWindow: 128000, pricing: 'very-high', speed: 'slow', bestFor: 'reasoning' },
        'o1-mini': { name: 'OpenAI o1 Mini', maxTokens: 65536, contextWindow: 128000, pricing: 'high', speed: 'medium', bestFor: 'reasoning-fast' },
        'o1-mini-2024-09-12': { name: 'OpenAI o1 Mini (Sep 2024)', maxTokens: 65536, contextWindow: 128000, pricing: 'high', speed: 'medium', bestFor: 'reasoning-fast' },
        // o3 Series (Latest Reasoning Models - January 2025)
        'o3': { name: 'OpenAI o3 (Latest)', maxTokens: 100000, contextWindow: 200000, pricing: 'very-high', speed: 'medium', bestFor: 'reasoning' },
        'o3-mini': { name: 'OpenAI o3 Mini', maxTokens: 100000, contextWindow: 200000, pricing: 'high', speed: 'fast', bestFor: 'reasoning-fast' },
        'o3-mini-high': { name: 'OpenAI o3 Mini High', maxTokens: 100000, contextWindow: 200000, pricing: 'high', speed: 'fast', bestFor: 'reasoning-fast' },
    },
    // ==========================================
    // Google Gemini Models (Latest 2025)
    // ==========================================
    google: {
        // Gemini 2.0 (Latest - 1M-2M context!)
        'gemini-2.0-flash-exp': { name: 'Gemini 2.0 Flash Experimental', maxTokens: 8192, contextWindow: 1000000, pricing: 'low', speed: 'fastest', bestFor: 'speed' },
        'gemini-2.0-flash': { name: 'Gemini 2.0 Flash (Stable)', maxTokens: 8192, contextWindow: 1000000, pricing: 'low', speed: 'fastest', bestFor: 'speed' },
        'gemini-2.0-flash-thinking-exp': { name: 'Gemini 2.0 Flash Thinking', maxTokens: 8192, contextWindow: 1000000, pricing: 'medium', speed: 'fast', bestFor: 'reasoning' },
        'gemini-2.0-pro': { name: 'Gemini 2.0 Pro (2M Context)', maxTokens: 8192, contextWindow: 2000000, pricing: 'medium', speed: 'medium', bestFor: 'long-context' },
        // Gemini 1.5 Pro (Massive 2M context)
        'gemini-1.5-pro': { name: 'Gemini 1.5 Pro (2M Context)', maxTokens: 8192, contextWindow: 2000000, pricing: 'medium', speed: 'medium', bestFor: 'long-context' },
        'gemini-1.5-pro-002': { name: 'Gemini 1.5 Pro 002', maxTokens: 8192, contextWindow: 2000000, pricing: 'medium', speed: 'medium', bestFor: 'long-context' },
        'gemini-1.5-flash': { name: 'Gemini 1.5 Flash (1M Context)', maxTokens: 8192, contextWindow: 1000000, pricing: 'low', speed: 'very-fast', bestFor: 'speed' },
        'gemini-1.5-flash-002': { name: 'Gemini 1.5 Flash 002', maxTokens: 8192, contextWindow: 1000000, pricing: 'low', speed: 'very-fast', bestFor: 'speed' },
        'gemini-pro-1.5': { name: 'Gemini Pro 1.5', maxTokens: 8192, contextWindow: 2000000, pricing: 'medium', speed: 'medium', bestFor: 'long-context' },
        // Gemini Experimental
        'gemini-exp-1206': { name: 'Gemini Experimental 1206', maxTokens: 8192, contextWindow: 2000000, pricing: 'medium', speed: 'fast', bestFor: 'experimental' },
        'gemini-exp-1121': { name: 'Gemini Experimental 1121', maxTokens: 8192, contextWindow: 2000000, pricing: 'medium', speed: 'fast', bestFor: 'experimental' },
        // Gemini 1.0 (Legacy)
        'gemini-pro': { name: 'Gemini Pro', maxTokens: 8192, contextWindow: 32000, pricing: 'low', speed: 'fast', bestFor: 'balanced' },
        'gemini-ultra': { name: 'Gemini Ultra', maxTokens: 8192, contextWindow: 32000, pricing: 'high', speed: 'medium', bestFor: 'quality' },
    },
    // ==========================================
    // Meta Llama Models (Latest 2025 - FREE!)
    // ==========================================
    meta: {
        // Llama 3.3 (Latest - 70B)
        'llama-3.3-70b-instruct': { name: 'Llama 3.3 70B Instruct (Latest)', maxTokens: 128000, contextWindow: 128000, pricing: 'free', speed: 'fast', bestFor: 'free-large' },
        // Llama 3.2 (Vision Support!)
        'llama-3.2-90b-vision-instruct': { name: 'Llama 3.2 90B Vision', maxTokens: 128000, contextWindow: 128000, pricing: 'free', speed: 'medium', bestFor: 'vision' },
        'llama-3.2-11b-vision-instruct': { name: 'Llama 3.2 11B Vision', maxTokens: 128000, contextWindow: 128000, pricing: 'free', speed: 'fast', bestFor: 'vision' },
        'llama-3.2-3b-instruct': { name: 'Llama 3.2 3B Instruct', maxTokens: 128000, contextWindow: 128000, pricing: 'free', speed: 'very-fast', bestFor: 'lightweight' },
        'llama-3.2-1b-instruct': { name: 'Llama 3.2 1B Instruct', maxTokens: 128000, contextWindow: 128000, pricing: 'free', speed: 'very-fast', bestFor: 'ultra-light' },
        // Llama 3.1 (405B Flagship!)
        'llama-3.1-405b-instruct': { name: 'Llama 3.1 405B Instruct (Largest)', maxTokens: 131072, contextWindow: 131072, pricing: 'free', speed: 'slow', bestFor: 'quality-free' },
        'llama-3.1-70b-instruct': { name: 'Llama 3.1 70B Instruct', maxTokens: 131072, contextWindow: 131072, pricing: 'free', speed: 'fast', bestFor: 'balanced-free' },
        'llama-3.1-8b-instruct': { name: 'Llama 3.1 8B Instruct', maxTokens: 131072, contextWindow: 131072, pricing: 'free', speed: 'very-fast', bestFor: 'speed-free' },
        // Llama 3 (Base)
        'llama-3-70b-instruct': { name: 'Llama 3 70B Instruct', maxTokens: 8192, contextWindow: 8192, pricing: 'free', speed: 'fast', bestFor: 'free' },
        'llama-3-8b-instruct': { name: 'Llama 3 8B Instruct', maxTokens: 8192, contextWindow: 8192, pricing: 'free', speed: 'very-fast', bestFor: 'free' },
        // Llama 2 (Legacy)
        'llama-2-70b-chat': { name: 'Llama 2 70B Chat', maxTokens: 4096, contextWindow: 4096, pricing: 'free', speed: 'fast', bestFor: 'legacy-free' },
        'llama-2-13b-chat': { name: 'Llama 2 13B Chat', maxTokens: 4096, contextWindow: 4096, pricing: 'free', speed: 'very-fast', bestFor: 'legacy-free' },
    },
    // ==========================================
    // Mistral Models (Latest 2025)
    // ==========================================
    mistral: {
        // Mistral Large (Latest - Best Mistral)
        'mistral-large-2411': { name: 'Mistral Large 2411 (Latest)', maxTokens: 128000, contextWindow: 128000, pricing: 'high', speed: 'fast', bestFor: 'quality' },
        'mistral-large-2407': { name: 'Mistral Large 2407', maxTokens: 128000, contextWindow: 128000, pricing: 'high', speed: 'fast', bestFor: 'quality' },
        'mistral-large-latest': { name: 'Mistral Large (Auto-Latest)', maxTokens: 128000, contextWindow: 128000, pricing: 'high', speed: 'fast', bestFor: 'quality' },
        // Mistral Medium
        'mistral-medium-2312': { name: 'Mistral Medium', maxTokens: 32000, contextWindow: 32000, pricing: 'medium', speed: 'fast', bestFor: 'balanced' },
        'mistral-medium-latest': { name: 'Mistral Medium (Auto-Latest)', maxTokens: 32000, contextWindow: 32000, pricing: 'medium', speed: 'fast', bestFor: 'balanced' },
        // Mistral Small
        'mistral-small-2402': { name: 'Mistral Small 2402', maxTokens: 32000, contextWindow: 32000, pricing: 'low', speed: 'very-fast', bestFor: 'speed' },
        'mistral-small-latest': { name: 'Mistral Small (Auto-Latest)', maxTokens: 32000, contextWindow: 32000, pricing: 'low', speed: 'very-fast', bestFor: 'speed' },
        'mistral-small-2409': { name: 'Mistral Small 2409', maxTokens: 32000, contextWindow: 32000, pricing: 'low', speed: 'very-fast', bestFor: 'speed' },
        // Codestral (Code Specialist - BEST FOR CODE!)
        'codestral-2405': { name: 'Codestral 2405 (Code Expert)', maxTokens: 32000, contextWindow: 32000, pricing: 'medium', speed: 'fast', bestFor: 'code' },
        'codestral-latest': { name: 'Codestral (Auto-Latest)', maxTokens: 32000, contextWindow: 32000, pricing: 'medium', speed: 'fast', bestFor: 'code' },
        'codestral-mamba-latest': { name: 'Codestral Mamba', maxTokens: 256000, contextWindow: 256000, pricing: 'medium', speed: 'fast', bestFor: 'long-code' },
        // Mistral Nemo (7B - Fast)
        'mistral-nemo-2407': { name: 'Mistral Nemo 12B', maxTokens: 128000, contextWindow: 128000, pricing: 'low', speed: 'very-fast', bestFor: 'speed' },
        'open-mistral-nemo': { name: 'Open Mistral Nemo', maxTokens: 128000, contextWindow: 128000, pricing: 'free', speed: 'very-fast', bestFor: 'free' },
        // Mixtral (Mixture of Experts - FREE!)
        'mixtral-8x7b-instruct': { name: 'Mixtral 8x7B Instruct (MoE)', maxTokens: 32000, contextWindow: 32000, pricing: 'free', speed: 'fast', bestFor: 'free-quality' },
        'mixtral-8x22b-instruct': { name: 'Mixtral 8x22B Instruct (MoE)', maxTokens: 64000, contextWindow: 64000, pricing: 'free', speed: 'medium', bestFor: 'free-quality' },
        'open-mixtral-8x7b': { name: 'Open Mixtral 8x7B', maxTokens: 32000, contextWindow: 32000, pricing: 'free', speed: 'fast', bestFor: 'free' },
        'open-mixtral-8x22b': { name: 'Open Mixtral 8x22B', maxTokens: 64000, contextWindow: 64000, pricing: 'free', speed: 'medium', bestFor: 'free' },
        // Pixtral (Multimodal - Vision!)
        'pixtral-12b-2409': { name: 'Pixtral 12B (Vision)', maxTokens: 128000, contextWindow: 128000, pricing: 'low', speed: 'fast', bestFor: 'vision' },
    },
    // ==========================================
    // DeepSeek Models (Latest 2025 - ULTRA CHEAP!)
    // ==========================================
    deepseek: {
        // DeepSeek V3 (Latest - January 2025)
        'deepseek-chat-v3': { name: 'DeepSeek Chat V3 (Latest)', maxTokens: 64000, contextWindow: 64000, pricing: 'very-low', speed: 'very-fast', bestFor: 'cheap-quality' },
        'deepseek-coder-v3': { name: 'DeepSeek Coder V3 (Latest)', maxTokens: 64000, contextWindow: 64000, pricing: 'very-low', speed: 'very-fast', bestFor: 'cheap-code' },
        // DeepSeek V2.5
        'deepseek-chat-v2.5': { name: 'DeepSeek Chat V2.5', maxTokens: 64000, contextWindow: 64000, pricing: 'very-low', speed: 'very-fast', bestFor: 'cheap' },
        'deepseek-coder-v2.5': { name: 'DeepSeek Coder V2.5', maxTokens: 64000, contextWindow: 64000, pricing: 'very-low', speed: 'very-fast', bestFor: 'cheap-code' },
        // DeepSeek V2
        'deepseek-chat': { name: 'DeepSeek Chat', maxTokens: 64000, contextWindow: 64000, pricing: 'very-low', speed: 'very-fast', bestFor: 'cheap' },
        'deepseek-coder': { name: 'DeepSeek Coder', maxTokens: 64000, contextWindow: 64000, pricing: 'very-low', speed: 'very-fast', bestFor: 'cheap-code' },
        // DeepSeek R1 (Reasoning - AMAZING & CHEAP!)
        'deepseek-r1': { name: 'DeepSeek R1 (Reasoning)', maxTokens: 64000, contextWindow: 64000, pricing: 'low', speed: 'medium', bestFor: 'cheap-reasoning' },
        'deepseek-r1-distill-llama-70b': { name: 'DeepSeek R1 Distill 70B', maxTokens: 128000, contextWindow: 128000, pricing: 'very-low', speed: 'fast', bestFor: 'cheap-reasoning' },
    },
    // ==========================================
    // Cohere Models (Latest 2025)
    // ==========================================
    cohere: {
        // Command R+ (Best Cohere)
        'command-r-plus': { name: 'Command R+ (Latest)', maxTokens: 128000, contextWindow: 128000, pricing: 'medium', speed: 'fast', bestFor: 'rag' },
        'command-r-plus-08-2024': { name: 'Command R+ (Aug 2024)', maxTokens: 128000, contextWindow: 128000, pricing: 'medium', speed: 'fast', bestFor: 'rag' },
        'command-r-plus-04-2024': { name: 'Command R+ (Apr 2024)', maxTokens: 128000, contextWindow: 128000, pricing: 'medium', speed: 'fast', bestFor: 'rag' },
        // Command R
        'command-r': { name: 'Command R', maxTokens: 128000, contextWindow: 128000, pricing: 'low', speed: 'fast', bestFor: 'rag' },
        'command-r-08-2024': { name: 'Command R (Aug 2024)', maxTokens: 128000, contextWindow: 128000, pricing: 'low', speed: 'fast', bestFor: 'rag' },
        'command-r-03-2024': { name: 'Command R (Mar 2024)', maxTokens: 128000, contextWindow: 128000, pricing: 'low', speed: 'fast', bestFor: 'rag' },
        // Command (Base)
        'command': { name: 'Command', maxTokens: 4096, contextWindow: 4096, pricing: 'very-low', speed: 'very-fast', bestFor: 'simple' },
        'command-light': { name: 'Command Light', maxTokens: 4096, contextWindow: 4096, pricing: 'very-low', speed: 'very-fast', bestFor: 'simple' },
        'command-nightly': { name: 'Command Nightly', maxTokens: 128000, contextWindow: 128000, pricing: 'low', speed: 'fast', bestFor: 'experimental' },
    },
    // ==========================================
    // Qwen Models (Alibaba - FREE!)
    // ==========================================
    qwen: {
        'qwen-2.5-72b-instruct': { name: 'Qwen 2.5 72B Instruct', maxTokens: 32768, contextWindow: 32768, pricing: 'free', speed: 'fast', bestFor: 'free-quality' },
        'qwen-2.5-7b-instruct': { name: 'Qwen 2.5 7B Instruct', maxTokens: 32768, contextWindow: 32768, pricing: 'free', speed: 'very-fast', bestFor: 'free-speed' },
        'qwen-2-72b-instruct': { name: 'Qwen 2 72B Instruct', maxTokens: 32768, contextWindow: 32768, pricing: 'free', speed: 'fast', bestFor: 'free' },
        'qwen-2-7b-instruct': { name: 'Qwen 2 7B Instruct', maxTokens: 32768, contextWindow: 32768, pricing: 'free', speed: 'very-fast', bestFor: 'free' },
        'qwen-2-1.5b-instruct': { name: 'Qwen 2 1.5B Instruct', maxTokens: 32768, contextWindow: 32768, pricing: 'free', speed: 'very-fast', bestFor: 'ultra-light' },
        'qwq-32b-preview': { name: 'QwQ 32B Preview (Reasoning)', maxTokens: 32768, contextWindow: 32768, pricing: 'free', speed: 'medium', bestFor: 'free-reasoning' },
    },
    // ==========================================
    // X.AI Grok Models (Latest 2025)
    // ==========================================
    xai: {
        'grok-beta': { name: 'Grok Beta', maxTokens: 131072, contextWindow: 131072, pricing: 'high', speed: 'fast', bestFor: 'realtime' },
        'grok-2': { name: 'Grok 2 (Latest)', maxTokens: 131072, contextWindow: 131072, pricing: 'high', speed: 'fast', bestFor: 'realtime' },
        'grok-2-vision': { name: 'Grok 2 Vision', maxTokens: 131072, contextWindow: 131072, pricing: 'high', speed: 'fast', bestFor: 'vision' },
    },
    // ==========================================
    // Perplexity Models (Real-time Web Search)
    // ==========================================
    perplexity: {
        'perplexity-sonar-pro': { name: 'Sonar Pro (Latest + Web)', maxTokens: 127072, contextWindow: 127072, pricing: 'medium', speed: 'fast', bestFor: 'web-search' },
        'perplexity-sonar': { name: 'Sonar (Web Search)', maxTokens: 127072, contextWindow: 127072, pricing: 'low', speed: 'fast', bestFor: 'web-search' },
        'perplexity-sonar-reasoning': { name: 'Sonar Reasoning', maxTokens: 127072, contextWindow: 127072, pricing: 'medium', speed: 'medium', bestFor: 'web-reasoning' },
    },
    // ==========================================
    // Together AI Models
    // ==========================================
    together: {
        'meta-llama/llama-3.3-70b-instruct-turbo': { name: 'Llama 3.3 70B Turbo', maxTokens: 128000, contextWindow: 128000, pricing: 'low', speed: 'very-fast', bestFor: 'fast-free' },
        'meta-llama/llama-3.1-405b-instruct-turbo': { name: 'Llama 3.1 405B Turbo', maxTokens: 131072, contextWindow: 131072, pricing: 'medium', speed: 'fast', bestFor: 'quality-fast' },
        'mistralai/mixtral-8x22b-instruct': { name: 'Mixtral 8x22B Instruct', maxTokens: 65536, contextWindow: 65536, pricing: 'low', speed: 'fast', bestFor: 'moe' },
    },
    // ==========================================
    // Groq (Ultra-Fast Inference)
    // ==========================================
    groq: {
        'llama-3.3-70b-versatile': { name: 'Llama 3.3 70B (Groq)', maxTokens: 32768, contextWindow: 32768, pricing: 'free', speed: 'ultra-fast', bestFor: 'speed-free' },
        'llama-3.1-70b-versatile': { name: 'Llama 3.1 70B (Groq)', maxTokens: 131072, contextWindow: 131072, pricing: 'free', speed: 'ultra-fast', bestFor: 'speed-free' },
        'llama-3.1-8b-instant': { name: 'Llama 3.1 8B Instant (Groq)', maxTokens: 8192, contextWindow: 8192, pricing: 'free', speed: 'ultra-fast', bestFor: 'ultra-speed' },
        'mixtral-8x7b-32768': { name: 'Mixtral 8x7B (Groq)', maxTokens: 32768, contextWindow: 32768, pricing: 'free', speed: 'ultra-fast', bestFor: 'speed-free' },
    },
    // ==========================================
    // Other Notable Models
    // ==========================================
    other: {
        // 01.AI Yi
        'yi-large': { name: 'Yi Large (01.AI)', maxTokens: 32768, contextWindow: 32768, pricing: 'medium', speed: 'fast', bestFor: 'multilingual' },
        'yi-lightning': { name: 'Yi Lightning', maxTokens: 16384, contextWindow: 16384, pricing: 'low', speed: 'very-fast', bestFor: 'speed' },
        'yi-medium': { name: 'Yi Medium', maxTokens: 16384, contextWindow: 16384, pricing: 'low', speed: 'fast', bestFor: 'balanced' },
        // Nous Research
        'nous-hermes-2-mixtral-8x7b': { name: 'Nous Hermes 2 Mixtral', maxTokens: 32000, contextWindow: 32000, pricing: 'free', speed: 'fast', bestFor: 'free' },
        'nous-capybara-7b': { name: 'Nous Capybara 7B', maxTokens: 32000, contextWindow: 32000, pricing: 'free', speed: 'very-fast', bestFor: 'free' },
        'nous-hermes-2-yi-34b': { name: 'Nous Hermes 2 Yi 34B', maxTokens: 32768, contextWindow: 32768, pricing: 'free', speed: 'fast', bestFor: 'free-quality' },
        // Dolphin (Uncensored)
        'dolphin-mixtral-8x7b': { name: 'Dolphin Mixtral 8x7B', maxTokens: 32000, contextWindow: 32000, pricing: 'free', speed: 'fast', bestFor: 'uncensored' },
        'dolphin-2.6-mixtral-8x7b': { name: 'Dolphin 2.6 Mixtral', maxTokens: 32000, contextWindow: 32000, pricing: 'free', speed: 'fast', bestFor: 'uncensored' },
        'dolphin-llama-3.1-70b': { name: 'Dolphin Llama 3.1 70B', maxTokens: 131072, contextWindow: 131072, pricing: 'free', speed: 'fast', bestFor: 'uncensored' },
        // WizardLM
        'wizardlm-2-8x22b': { name: 'WizardLM 2 8x22B', maxTokens: 65536, contextWindow: 65536, pricing: 'free', speed: 'fast', bestFor: 'free-quality' },
        'wizardlm-2-7b': { name: 'WizardLM 2 7B', maxTokens: 32000, contextWindow: 32000, pricing: 'free', speed: 'very-fast', bestFor: 'free' },
        // Phind (Code Specialist)
        'phind-codellama-34b': { name: 'Phind CodeLlama 34B', maxTokens: 16384, contextWindow: 16384, pricing: 'free', speed: 'fast', bestFor: 'code-free' },
        // Creative Models
        'mythomax-l2-13b': { name: 'MythoMax L2 13B', maxTokens: 8192, contextWindow: 8192, pricing: 'free', speed: 'very-fast', bestFor: 'creative' },
        'toppy-m-7b': { name: 'Toppy M 7B', maxTokens: 32000, contextWindow: 32000, pricing: 'free', speed: 'very-fast', bestFor: 'free' },
    },
};
class UniversalAIClient {
    anthropicClient;
    openaiClient;
    openrouterClient;
    constructor() {
        // Initialize Anthropic if API key is available
        if (config_1.config.ai.apiKey) {
            this.anthropicClient = new sdk_1.default({
                apiKey: config_1.config.ai.apiKey,
            });
        }
        // Initialize OpenAI if API key is available
        if (config_1.config.openai?.apiKey) {
            this.openaiClient = new openai_1.default({
                apiKey: config_1.config.openai.apiKey,
            });
        }
        // Initialize OpenRouter if API key is available
        if (config_1.config.openrouter?.apiKey) {
            this.openrouterClient = new openai_1.default({
                apiKey: config_1.config.openrouter.apiKey,
                baseURL: 'https://openrouter.ai/api/v1',
            });
        }
    }
    /**
     * Generate code using the configured AI provider
     * AUTONOMOUS MODE: No interruptions, full automation
     */
    async generateCode(prompt, agentType, options = {}) {
        const provider = this.getProviderForModel(options.model || config_1.config.ai.model);
        const model = options.model || config_1.config.ai.model;
        logger_1.logger.info(`[AUTONOMOUS MODE] Generating code with ${agentType} agent using ${provider}/${model}`, {
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
        }
        catch (error) {
            logger_1.logger.error(`AI generation failed for ${agentType}`, { error, provider, model });
            throw new Error(`AI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Stream generation with real-time updates
     */
    async streamGeneration(prompt, agentType, onChunk, options = {}) {
        const provider = this.getProviderForModel(options.model || config_1.config.ai.model);
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
    static getAllModels(searchQuery) {
        const models = [];
        Object.entries(exports.AI_MODELS).forEach(([category, categoryModels]) => {
            Object.entries(categoryModels).forEach(([id, info]) => {
                const model = {
                    id,
                    name: info.name,
                    provider: category,
                    category,
                    maxTokens: info.maxTokens,
                    contextWindow: info.contextWindow,
                    pricing: info.pricing,
                    speed: info.speed,
                    bestFor: info.bestFor,
                };
                // Filter by search query if provided
                if (!searchQuery ||
                    model.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    model.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    model.bestFor?.toLowerCase().includes(searchQuery.toLowerCase())) {
                    models.push(model);
                }
            });
        });
        return models.sort((a, b) => b.contextWindow - a.contextWindow);
    }
    getProviderForModel(model) {
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
    async generateWithAnthropic(prompt, agentType, options) {
        if (!this.anthropicClient) {
            throw new Error('Anthropic client not initialized. Please set ANTHROPIC_API_KEY');
        }
        const response = await this.anthropicClient.messages.create({
            model: options.model || config_1.config.ai.model,
            max_tokens: options.maxTokens || config_1.config.ai.maxTokens,
            temperature: options.temperature || config_1.config.ai.temperature,
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
    async generateWithOpenAI(prompt, agentType, options) {
        if (!this.openaiClient) {
            throw new Error('OpenAI client not initialized. Please set OPENAI_API_KEY');
        }
        const response = await this.openaiClient.chat.completions.create({
            model: options.model || 'gpt-4-turbo',
            max_tokens: options.maxTokens || config_1.config.ai.maxTokens,
            temperature: options.temperature || config_1.config.ai.temperature,
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
    async generateWithOpenRouter(prompt, agentType, options) {
        if (!this.openrouterClient) {
            throw new Error('OpenRouter client not initialized. Please set OPENROUTER_API_KEY');
        }
        const response = await this.openrouterClient.chat.completions.create({
            model: options.model || 'anthropic/claude-3.5-sonnet',
            max_tokens: options.maxTokens || config_1.config.ai.maxTokens,
            temperature: options.temperature || config_1.config.ai.temperature,
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
    async streamWithAnthropic(prompt, agentType, onChunk, options) {
        if (!this.anthropicClient) {
            throw new Error('Anthropic client not initialized');
        }
        const stream = await this.anthropicClient.messages.create({
            model: options.model || config_1.config.ai.model,
            max_tokens: options.maxTokens || config_1.config.ai.maxTokens,
            temperature: options.temperature || config_1.config.ai.temperature,
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
    async streamWithOpenAI(prompt, agentType, onChunk, options) {
        if (!this.openaiClient) {
            throw new Error('OpenAI client not initialized');
        }
        const stream = await this.openaiClient.chat.completions.create({
            model: options.model || 'gpt-4-turbo',
            max_tokens: options.maxTokens || config_1.config.ai.maxTokens,
            temperature: options.temperature || config_1.config.ai.temperature,
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
    async streamWithOpenRouter(prompt, agentType, onChunk, options) {
        if (!this.openrouterClient) {
            throw new Error('OpenRouter client not initialized');
        }
        const stream = await this.openrouterClient.chat.completions.create({
            model: options.model || 'anthropic/claude-3.5-sonnet',
            max_tokens: options.maxTokens || config_1.config.ai.maxTokens,
            temperature: options.temperature || config_1.config.ai.temperature,
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
    getSystemPrompt(agentType) {
        const { ORCHESTRATOR_SYSTEM_PROMPT, BACKEND_SYSTEM_PROMPT, FRONTEND_SYSTEM_PROMPT, DATABASE_SYSTEM_PROMPT, AUTH_SYSTEM_PROMPT, INTEGRATIONS_SYSTEM_PROMPT, DEVOPS_SYSTEM_PROMPT, } = require('../agents/prompts');
        const agentPrompts = {
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
exports.UniversalAIClient = UniversalAIClient;
exports.universalAIClient = new UniversalAIClient();
//# sourceMappingURL=universal-ai-client.js.map