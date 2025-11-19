import { useState } from 'react';
import { Sparkles, Code2, Wand2 } from 'lucide-react';
import { ChatInterface } from '../components/ChatInterface';

export function FromScratchPage() {
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);

  const handleCodeGenerated = (code: string) => {
    setGeneratedCode(code);
    setShowPreview(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Wand2 className="w-10 h-10 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Build From Scratch
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Describe your app idea and watch it come to life in real-time
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-250px)]">
          {/* Chat Interface */}
          <div className="flex flex-col">
            <ChatInterface
              onCodeGenerated={handleCodeGenerated}
            />
          </div>

          {/* Code Preview */}
          <div className="flex flex-col bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Code2 className="w-6 h-6 text-purple-600" />
                <h3 className="font-bold text-gray-900">Generated Code</h3>
              </div>
              {generatedCode && (
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    showPreview
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </button>
              )}
            </div>

            <div className="flex-1 overflow-auto p-6">
              {generatedCode ? (
                <div className="space-y-4">
                  {/* Code Display */}
                  <div className="bg-gray-900 rounded-xl p-4">
                    <pre className="text-sm text-green-400 overflow-x-auto">
                      <code>{generatedCode}</code>
                    </pre>
                  </div>

                  {/* Preview */}
                  {showPreview && (
                    <div className="border-2 border-purple-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        <h4 className="font-bold text-gray-900">Live Preview</h4>
                      </div>
                      <div
                        className="border border-gray-200 rounded-lg p-4 bg-white"
                        dangerouslySetInnerHTML={{ __html: '<!-- Preview will be rendered here -->' }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Code2 className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-bold text-gray-400 mb-2">
                    No code generated yet
                  </h3>
                  <p className="text-gray-500">
                    Start chatting with the AI to generate your application code
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Wand2 className="w-6 h-6 text-blue-600" />
              <h3 className="font-bold text-blue-900">Describe Your Idea</h3>
            </div>
            <p className="text-blue-800 text-sm">
              Tell the AI what you want to build in natural language. Be as detailed or as simple as you like.
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Code2 className="w-6 h-6 text-purple-600" />
              <h3 className="font-bold text-purple-900">Watch It Generate</h3>
            </div>
            <p className="text-purple-800 text-sm">
              The AI will generate production-ready code in real-time based on your conversation.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-6 h-6 text-green-600" />
              <h3 className="font-bold text-green-900">Iterate & Refine</h3>
            </div>
            <p className="text-green-800 text-sm">
              Refine your app by continuing the conversation. Add features, fix issues, or change styling.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
