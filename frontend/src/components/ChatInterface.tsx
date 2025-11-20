import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Code, Eye, Key, ChevronDown, RefreshCw } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  code?: string;
}

interface ChatInterfaceProps {
  projectId?: string;
  onCodeGenerated?: (code: string) => void;
}

type AIProvider = 'anthropic' | 'openai' | 'openrouter';

interface ModelOption {
  value: string;
  label: string;
}

const PROVIDER_LABELS: Record<AIProvider, string> = {
  anthropic: 'Anthropic (Claude)',
  openai: 'OpenAI (GPT)',
  openrouter: 'OpenRouter (Multi-Model)',
};

// API endpoints for fetching models
const MODEL_API_ENDPOINTS: Record<AIProvider, string> = {
  anthropic: 'https://api.anthropic.com/v1/models',
  openai: 'https://api.openai.com/v1/models',
  openrouter: 'https://openrouter.ai/api/v1/models',
};

export function ChatInterface({ projectId, onCodeGenerated }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m here to help you build your application. Describe what you want to create, and I\'ll generate the code for you.\n\nExamples:\n• "Create a todo list app with React and TypeScript"\n• "Build a blog with authentication and comments"\n• "Make an e-commerce store with Stripe integration"\n\n✨ Choose your AI provider (Anthropic, OpenAI, or OpenRouter), enter your API key, and click the refresh button to load available models!',
      timestamp: new Date(),
    },
  ]);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const [input, setInput] = useState('');
  const [provider, setProvider] = useState<AIProvider>(() => {
    return (localStorage.getItem('ai-provider') as AIProvider) || 'anthropic';
  });
  const [model, setModel] = useState(() => {
    return localStorage.getItem('ai-model') || '';
  });
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('ai-api-key') || '';
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [models, setModels] = useState<ModelOption[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelsError, setModelsError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('ai-provider', provider);
  }, [provider]);

  useEffect(() => {
    localStorage.setItem('ai-model', model);
  }, [model]);

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('ai-api-key', apiKey);
    }
  }, [apiKey]);

  // Reset model when provider changes
  useEffect(() => {
    setModel('');
    setModels([]);
    setModelsError(null);
  }, [provider]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch models from provider API
  const fetchModels = async () => {
    if (!apiKey.trim()) {
      setModelsError('Please enter your API key first');
      return;
    }

    setIsLoadingModels(true);
    setModelsError(null);
    setModels([]);

    try {
      let fetchedModels: ModelOption[] = [];

      if (provider === 'anthropic') {
        // Anthropic API - fetch models
        const response = await fetch(MODEL_API_ENDPOINTS.anthropic, {
          method: 'GET',
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error?.message || `Anthropic API error: ${response.status}`);
        }

        const data = await response.json();
        fetchedModels = data.data
          .filter((m: any) => m.type === 'model')
          .map((m: any) => ({
            value: m.id,
            label: m.display_name || m.id,
          }))
          .sort((a: ModelOption, b: ModelOption) => a.label.localeCompare(b.label));

      } else if (provider === 'openai') {
        // OpenAI API - fetch models
        const response = await fetch(MODEL_API_ENDPOINTS.openai, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error?.message || `OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        // Filter to show only chat/completion models and sort by name
        fetchedModels = data.data
          .filter((m: any) => {
            const id = m.id.toLowerCase();
            return (
              id.includes('gpt') ||
              id.includes('o1') ||
              id.includes('chatgpt') ||
              id.includes('davinci') ||
              id.includes('turbo')
            );
          })
          .map((m: any) => ({
            value: m.id,
            label: m.id,
          }))
          .sort((a: ModelOption, b: ModelOption) => {
            // Sort GPT-4 models first, then GPT-3.5, then others
            const aScore = a.value.includes('gpt-4') ? 0 : a.value.includes('gpt-3.5') ? 1 : 2;
            const bScore = b.value.includes('gpt-4') ? 0 : b.value.includes('gpt-3.5') ? 1 : 2;
            if (aScore !== bScore) return aScore - bScore;
            return b.value.localeCompare(a.value); // Newer models first
          });

      } else if (provider === 'openrouter') {
        // OpenRouter API - fetch models
        const response = await fetch(MODEL_API_ENDPOINTS.openrouter, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'Ultimate App Builder',
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error?.message || `OpenRouter API error: ${response.status}`);
        }

        const data = await response.json();
        fetchedModels = data.data
          .map((m: any) => ({
            value: m.id,
            label: m.name || m.id,
          }))
          .sort((a: ModelOption, b: ModelOption) => a.label.localeCompare(b.label));
      }

      setModels(fetchedModels);

      // Auto-select first model if none selected
      if (fetchedModels.length > 0 && !model) {
        setModel(fetchedModels[0].value);
      }

    } catch (error) {
      console.error('Error fetching models:', error);
      setModelsError(error instanceof Error ? error.message : 'Failed to fetch models');
    } finally {
      setIsLoadingModels(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!apiKey.trim()) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Please provide your AI provider API key in the field above to use this service.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    if (!model) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Please select a model first. Click the refresh button next to the model dropdown to load available models.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history for context (exclude the welcome message)
      const conversationHistory = messages
        .filter((m, i) => i > 0) // Skip welcome message
        .map(m => ({
          role: m.role,
          content: m.code ? `${m.content}\n\nCode:\n${m.code}` : m.content,
        }));

      // Create abort controller for timeout (5 minutes for code generation)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userMessage.content,
          model,
          apiKey,
          provider,
          conversationId,
          messages: conversationHistory,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Store conversation ID for context continuity
      if (result.data.conversationId && !conversationId) {
        setConversationId(result.data.conversationId);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I've generated the code for: "${userMessage.content}". Here's what I created using ${PROVIDER_LABELS[provider]} - ${model}:`,
        timestamp: new Date(),
        code: result.data.code,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (assistantMessage.code && onCodeGenerated) {
        onCodeGenerated(assistantMessage.code);
      }
    } catch (error) {
      let errorText = 'Unknown error occurred';

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorText = 'Request timed out. The AI is taking too long to respond. Please try a simpler prompt or check if the API is working.';
        } else if (error.message.includes('Failed to fetch')) {
          errorText = 'Network error. Please check your internet connection and make sure the backend server is running.';
        } else {
          errorText = error.message;
        }
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorText}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg border border-gray-200">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Bot className="w-8 h-8 text-purple-600" />
            <div>
              <h3 className="font-bold text-gray-900">AI Assistant</h3>
              <p className="text-sm text-gray-500">Dynamic model loading from API</p>
            </div>
          </div>
          <button
            onClick={() => setShowCode(!showCode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              showCode
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {showCode ? (
              <>
                <Eye className="w-4 h-4" />
                Chat
              </>
            ) : (
              <>
                <Code className="w-4 h-4" />
                Code
              </>
            )}
          </button>
        </div>

        {/* Provider Selection */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            AI Provider
          </label>
          <div className="relative">
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as AIProvider)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white pr-8"
            >
              {Object.entries(PROVIDER_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* API Key Input */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            API Key
          </label>
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-gray-400" />
            <div className="flex-1 flex gap-2">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={`Enter your ${PROVIDER_LABELS[provider]} API key...`}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                title={showApiKey ? 'Hide API key' : 'Show API key'}
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Model Selection with Fetch Button */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Model ({models.length} available)
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                disabled={models.length === 0}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white pr-8 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                {models.length === 0 ? (
                  <option value="">Click refresh to load models...</option>
                ) : (
                  models.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))
                )}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <button
              onClick={fetchModels}
              disabled={isLoadingModels || !apiKey.trim()}
              className={`px-3 py-2 rounded-lg border transition-all ${
                isLoadingModels || !apiKey.trim()
                  ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                  : 'bg-purple-50 text-purple-600 border-purple-300 hover:bg-purple-100'
              }`}
              title="Load models from API"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingModels ? 'animate-spin' : ''}`} />
            </button>
          </div>
          {modelsError && (
            <p className="text-xs text-red-500 mt-1">{modelsError}</p>
          )}
          {models.length > 0 && (
            <p className="text-xs text-green-600 mt-1">
              {models.length} models loaded successfully
            </p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-purple-600 text-white'
              }`}
            >
              {message.role === 'user' ? (
                <User className="w-5 h-5" />
              ) : (
                <Bot className="w-5 h-5" />
              )}
            </div>

            <div
              className={`flex-1 max-w-2xl ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block px-4 py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>

              {message.code && showCode && (
                <div className="mt-2 bg-gray-900 rounded-xl p-4 text-left">
                  <pre className="text-sm text-green-400 overflow-x-auto">
                    <code>{message.code}</code>
                  </pre>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="inline-block px-4 py-3 rounded-2xl bg-gray-100">
                <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="px-6 py-4 border-t border-gray-200">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want to build..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
              !input.trim() || isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
            }`}
          >
            <Send className="w-5 h-5" />
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
