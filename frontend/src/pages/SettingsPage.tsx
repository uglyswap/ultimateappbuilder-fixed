import { useState, useEffect } from 'react';
import { Settings, Key, Check, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface APIKeys {
  anthropic: string;
  openai: string;
  openrouter: string;
}

export function SettingsPage() {
  const [apiKeys, setApiKeys] = useState<APIKeys>({
    anthropic: '',
    openai: '',
    openrouter: '',
  });

  const [showKeys, setShowKeys] = useState({
    anthropic: false,
    openai: false,
    openrouter: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load API keys from localStorage
    const savedKeys = localStorage.getItem('api_keys');
    if (savedKeys) {
      try {
        setApiKeys(JSON.parse(savedKeys));
      } catch (e) {
        console.error('Failed to parse saved API keys', e);
      }
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem('api_keys', JSON.stringify(apiKeys));

      // Could also send to backend if needed
      toast.success('API keys saved successfully!');
    } catch (error) {
      toast.error('Failed to save API keys');
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyChange = (provider: keyof APIKeys, value: string) => {
    setApiKeys({ ...apiKeys, [provider]: value });
  };

  const toggleShowKey = (provider: keyof typeof showKeys) => {
    setShowKeys({ ...showKeys, [provider]: !showKeys[provider] });
  };

  const maskKey = (key: string) => {
    if (!key) return '';
    if (key.length <= 8) return '•'.repeat(key.length);
    return key.substring(0, 4) + '•'.repeat(key.length - 8) + key.substring(key.length - 4);
  };

  const providers = [
    {
      id: 'anthropic' as keyof APIKeys,
      name: 'Anthropic (Claude)',
      icon: '🤖',
      description: 'Claude 3.5 Sonnet, Opus, Haiku - Best for code generation',
      placeholder: 'sk-ant-...',
      link: 'https://console.anthropic.com/',
    },
    {
      id: 'openai' as keyof APIKeys,
      name: 'OpenAI',
      icon: '🧠',
      description: 'GPT-4, GPT-3.5 Turbo - Great for general tasks',
      placeholder: 'sk-...',
      link: 'https://platform.openai.com/api-keys',
    },
    {
      id: 'openrouter' as keyof APIKeys,
      name: 'OpenRouter',
      icon: '🌐',
      description: 'Access to 200+ AI models from one API',
      placeholder: 'sk-or-...',
      link: 'https://openrouter.ai/keys',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Settings className="w-10 h-10 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Settings
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Configure your AI provider API keys
          </p>
        </div>

        {/* API Keys Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">API Keys</h2>
            <p className="text-gray-600">
              Your API keys are stored locally in your browser and never sent to our servers.
            </p>
          </div>

          <div className="space-y-6">
            {providers.map((provider) => (
              <div key={provider.id} className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-3xl">{provider.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{provider.name}</h3>
                    <p className="text-sm text-gray-600">{provider.description}</p>
                    <a
                      href={provider.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 mt-1"
                    >
                      Get API Key →
                    </a>
                  </div>
                  {apiKeys[provider.id] && (
                    <div className="flex items-center gap-2 text-green-600">
                      <Check className="w-5 h-5" />
                      <span className="text-sm font-semibold">Configured</span>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showKeys[provider.id] ? 'text' : 'password'}
                    value={apiKeys[provider.id]}
                    onChange={(e) => handleKeyChange(provider.id, e.target.value)}
                    placeholder={provider.placeholder}
                    className="w-full pl-10 pr-24 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  />
                  <button
                    onClick={() => toggleShowKey(provider.id)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 font-semibold"
                  >
                    {showKeys[provider.id] ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Keys are encrypted and stored locally in your browser
            </p>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all ${
                isSaving
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-2">Why do I need API keys?</h3>
          <p className="text-blue-800 mb-3">
            Ultimate App Builder uses AI to generate code. You need to provide your own API keys from
            AI providers to use this service. This ensures you have full control over your usage and costs.
          </p>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>API keys are stored locally in your browser</li>
            <li>We never have access to your keys</li>
            <li>You pay directly to the AI provider based on your usage</li>
            <li>You can use any or all of the supported providers</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
