import { useState, useEffect } from 'react';
import {
  Sparkles, Code2, Wand2, X, Download, Github, Globe,
  Rocket, Eye, Loader2, CheckCircle, AlertCircle,
  Play, Terminal, FileCode, FolderTree,
  Cloud, Server, Database, ExternalLink
} from 'lucide-react';
import { ChatInterface } from '../components/ChatInterface';
import { SandpackPreview } from '../components/SandpackPreview';
import type { GeneratedFile, AgentStatus, AgentType } from '../types';
import * as monaco from 'monaco-editor';

// Configure Monaco Editor worker
self.MonacoEnvironment = {
  getWorkerUrl: function (_moduleId: string, label: string) {
    if (label === 'json') return './json.worker.js';
    if (label === 'css' || label === 'scss' || label === 'less') return './css.worker.js';
    if (label === 'html' || label === 'handlebars' || label === 'razor') return './html.worker.js';
    if (label === 'typescript' || label === 'javascript') return './ts.worker.js';
    return './editor.worker.js';
  },
};

// Agent icons and colors
const AGENT_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  orchestrator: { icon: '🎯', color: 'purple', label: 'Orchestrator' },
  database: { icon: '🗄️', color: 'blue', label: 'Database Agent' },
  backend: { icon: '⚙️', color: 'green', label: 'Backend Agent' },
  frontend: { icon: '🎨', color: 'pink', label: 'Frontend Agent' },
  auth: { icon: '🔐', color: 'yellow', label: 'Auth Agent' },
  integrations: { icon: '🔌', color: 'orange', label: 'Integrations Agent' },
  devops: { icon: '🚀', color: 'cyan', label: 'DevOps Agent' },
};

type ViewMode = 'code' | 'preview' | 'agents' | 'deploy';

export function FromScratchPage() {
  // Files state - multiple files with tabs
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('code');

  // Agent status state
  const [agentStatuses, setAgentStatuses] = useState<AgentStatus[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);


  // Deployment state
  const [githubRepo, setGithubRepo] = useState('');
  const [githubToken, setGithubToken] = useState(() => localStorage.getItem('github-token') || '');
  const [vercelToken, setVercelToken] = useState(() => localStorage.getItem('vercel-token') || '');
  const [netlifyToken, setNetlifyToken] = useState(() => localStorage.getItem('netlify-token') || '');
  const [railwayToken, setRailwayToken] = useState(() => localStorage.getItem('railway-token') || '');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('github');

  // Monaco editor ref
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  // WebSocket connection
  const wsRef = useRef<WebSocket | null>(null);

  // Save tokens to localStorage
  useEffect(() => {
    if (githubToken) localStorage.setItem('github-token', githubToken);
    if (vercelToken) localStorage.setItem('vercel-token', vercelToken);
    if (netlifyToken) localStorage.setItem('netlify-token', netlifyToken);
    if (railwayToken) localStorage.setItem('railway-token', railwayToken);
  }, [githubToken, vercelToken, netlifyToken, railwayToken]);

  // Initialize Monaco Editor
  useEffect(() => {
    if (editorRef.current && !monacoEditorRef.current && viewMode === 'code') {
      const editor = monaco.editor.create(editorRef.current, {
        value: generatedFiles[activeFileIndex]?.content || '// Generated code will appear here...',
        language: getLanguageFromPath(generatedFiles[activeFileIndex]?.path || 'file.ts'),
        theme: 'vs-dark',
        automaticLayout: true,
        fontSize: 14,
        fontFamily: 'Fira Code, Monaco, Consolas, monospace',
        fontLigatures: true,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        lineNumbers: 'on',
        renderWhitespace: 'selection',
        tabSize: 2,
        insertSpaces: true,
        folding: true,
        bracketPairColorization: { enabled: true },
        readOnly: false,
      });

      monacoEditorRef.current = editor;

      // Listen for changes
      editor.onDidChangeModelContent(() => {
        const newContent = editor.getValue();
        setGeneratedFiles(prev => {
          const updated = [...prev];
          if (updated[activeFileIndex]) {
            updated[activeFileIndex] = { ...updated[activeFileIndex], content: newContent };
          }
          return updated;
        });
      });
    }

    return () => {
      if (monacoEditorRef.current) {
        monacoEditorRef.current.dispose();
        monacoEditorRef.current = null;
      }
    };
  }, [viewMode]);

  // Update editor when active file changes
  useEffect(() => {
    if (monacoEditorRef.current && generatedFiles[activeFileIndex]) {
      const file = generatedFiles[activeFileIndex];
      const language = getLanguageFromPath(file.path);
      const model = monacoEditorRef.current.getModel();

      if (model) {
        monaco.editor.setModelLanguage(model, language);
        monacoEditorRef.current.setValue(file.content);
      }
    }
  }, [activeFileIndex, generatedFiles]);

  // Connect to WebSocket for real-time updates
  useEffect(() => {
    const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`;

    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log('WebSocket connected');
        };

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            handleWebSocketMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
          console.log('WebSocket disconnected, reconnecting...');
          setTimeout(connectWebSocket, 3000);
        };

        wsRef.current = ws;
      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Handle WebSocket messages
  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case 'generation_started':
        setIsGenerating(true);
        setGenerationProgress(0);
        setAgentStatuses([]);
        setGenerationLogs([`[${new Date().toLocaleTimeString()}] Generation started...`]);
        break;

      case 'agent_status_update':
        setAgentStatuses(prev => {
          const existing = prev.findIndex(a => a.type === message.payload.agent.type);
          if (existing >= 0) {
            const updated = [...prev];
            updated[existing] = message.payload.agent;
            return updated;
          }
          return [...prev, message.payload.agent];
        });
        setGenerationLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] ${AGENT_CONFIG[message.payload.agent.type]?.label || message.payload.agent.type}: ${message.payload.agent.status}`
        ]);
        break;

      case 'generation_progress':
        setGenerationProgress(message.payload.progress);
        break;

      case 'file_generated':
        setGeneratedFiles(prev => [...prev, message.payload.file]);
        setGenerationLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] Generated: ${message.payload.file.path}`
        ]);
        break;

      case 'generation_completed':
        setIsGenerating(false);
        setGenerationProgress(100);
        setGenerationLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] Generation completed successfully!`
        ]);
        break;

      case 'generation_failed':
        setIsGenerating(false);
        setGenerationLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] ERROR: ${message.payload.error}`
        ]);
        break;

      default:
        break;
    }
  };

  // Get language from file path
  const getLanguageFromPath = (filePath: string): string => {
    const ext = filePath.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      ts: 'typescript', tsx: 'typescript', js: 'javascript', jsx: 'javascript',
      json: 'json', html: 'html', css: 'css', scss: 'scss', md: 'markdown',
      sql: 'sql', py: 'python', yaml: 'yaml', yml: 'yaml', xml: 'xml',
      sh: 'shell', dockerfile: 'dockerfile', env: 'shell',
    };
    return languageMap[ext || ''] || 'plaintext';
  };

  // Get file icon based on extension
  const getFileIcon = (filePath: string): string => {
    const ext = filePath.split('.').pop()?.toLowerCase();
    const iconMap: Record<string, string> = {
      ts: '📘', tsx: '⚛️', js: '📙', jsx: '⚛️', json: '📋', html: '🌐',
      css: '🎨', scss: '🎨', md: '📝', sql: '🗄️', py: '🐍', yaml: '⚙️',
      yml: '⚙️', dockerfile: '🐳', env: '🔐',
    };
    return iconMap[ext || ''] || '📄';
  };

  // Handle code generated from chat
  const handleCodeGenerated = (code: string) => {
    // Parse the code to extract multiple files if present
    const fileMatches = code.match(/\/\/ File: (.+)\n([\s\S]*?)(?=\/\/ File:|$)/g);

    if (fileMatches && fileMatches.length > 0) {
      const files: GeneratedFile[] = fileMatches.map(match => {
        const pathMatch = match.match(/\/\/ File: (.+)\n/);
        const content = match.replace(/\/\/ File: .+\n/, '');
        return {
          path: pathMatch?.[1]?.trim() || 'untitled.ts',
          content: content.trim(),
        };
      });
      setGeneratedFiles(files);
    } else {
      // Single file
      setGeneratedFiles([{
        path: 'App.tsx',
        content: code,
      }]);
    }
    setActiveFileIndex(0);
    setViewMode('code');
  };

  // Close file tab
  const handleCloseFile = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setGeneratedFiles(prev => {
      const updated = prev.filter((_, i) => i !== index);
      if (activeFileIndex >= updated.length) {
        setActiveFileIndex(Math.max(0, updated.length - 1));
      }
      return updated;
    });
  };

  // Download all files as ZIP
  const handleDownload = async () => {
    if (generatedFiles.length === 0) return;

    try {
      const response = await fetch('/api/projects/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: generatedFiles }),
      });

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'generated-project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download project');
    }
  };

  // Push to GitHub
  const handlePushToGitHub = async () => {
    if (!githubToken || !githubRepo || generatedFiles.length === 0) {
      alert('Please provide GitHub token, repository name, and generate code first');
      return;
    }

    setIsDeploying(true);
    setDeploymentStatus('idle');

    try {
      const response = await fetch('/api/deployment/github-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: githubToken,
          repo: githubRepo,
          files: generatedFiles,
          message: 'Generated by Ultimate App Builder',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'GitHub push failed');
      }

      const result = await response.json();
      setDeploymentStatus('success');
      setDeploymentUrl(result.data.url);
    } catch (error) {
      console.error('GitHub push error:', error);
      setDeploymentStatus('error');
      alert(`GitHub push failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDeploying(false);
    }
  };

  // Deploy to Vercel
  const handleDeployToVercel = async () => {
    if (!vercelToken || generatedFiles.length === 0) {
      alert('Please provide Vercel token and generate code first');
      return;
    }

    setIsDeploying(true);
    setDeploymentStatus('idle');

    try {
      const response = await fetch('/api/deployment/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: 'vercel',
          token: vercelToken,
          files: generatedFiles,
          projectName: `app-${Date.now()}`,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Vercel deployment failed');
      }

      const result = await response.json();
      setDeploymentStatus('success');
      setDeploymentUrl(result.data.url);
    } catch (error) {
      console.error('Vercel deployment error:', error);
      setDeploymentStatus('error');
      alert(`Vercel deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wand2 className="w-8 h-8 text-purple-500" />
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Agentic App Builder
                </h1>
                <p className="text-sm text-gray-400">
                  Build production-ready apps with AI agents
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              {generatedFiles.length > 0 && (
                <>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>

                  <button
                    onClick={() => setViewMode(viewMode === 'deploy' ? 'code' : 'deploy')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      viewMode === 'deploy'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-white'
                    }`}
                  >
                    <Rocket className="w-4 h-4" />
                    Deploy
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Progress bar during generation */}
          {isGenerating && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                <span>Generating...</span>
                <span>{generationProgress}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Chat Interface */}
          <div className="w-1/3 border-r border-gray-700 flex flex-col">
            <ChatInterface onCodeGenerated={handleCodeGenerated} />
          </div>

          {/* Right Panel - Code/Preview/Agents/Deploy */}
          <div className="flex-1 flex flex-col">
            {/* View Mode Tabs */}
            <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center gap-2">
              <button
                onClick={() => setViewMode('code')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'code'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <FileCode className="w-4 h-4" />
                Code
              </button>

              <button
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'preview'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>

              <button
                onClick={() => setViewMode('agents')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'agents'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Terminal className="w-4 h-4" />
                Agents
              </button>

              <button
                onClick={() => setViewMode('deploy')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'deploy'
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Rocket className="w-4 h-4" />
                Deploy
              </button>
            </div>

            {/* Code View */}
            {viewMode === 'code' && (
              <div className="flex-1 flex flex-col">
                {/* File Tabs */}
                {generatedFiles.length > 0 && (
                  <div className="bg-gray-900 border-b border-gray-700 flex overflow-x-auto">
                    {generatedFiles.map((file, index) => (
                      <button
                        key={file.path}
                        onClick={() => setActiveFileIndex(index)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm border-r border-gray-700 whitespace-nowrap ${
                          index === activeFileIndex
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                        }`}
                      >
                        <span>{getFileIcon(file.path)}</span>
                        <span>{file.path.split('/').pop()}</span>
                        <button
                          onClick={(e) => handleCloseFile(index, e)}
                          className="ml-2 p-0.5 rounded hover:bg-gray-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </button>
                    ))}
                  </div>
                )}

                {/* Monaco Editor */}
                <div ref={editorRef} className="flex-1" />

                {/* No files message */}
                {generatedFiles.length === 0 && (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <Code2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">No code generated yet</p>
                      <p className="text-sm mt-2">
                        Start chatting with the AI to generate your application
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Preview View */}
            {viewMode === 'preview' && (
              <div className="flex-1 flex flex-col bg-gray-100">
                {generatedFiles.length > 0 ? (
                  <SandpackPreview
                    files={generatedFiles}
                    showEditor={true}
                    showConsole={false}
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">No preview available</p>
                      <p className="text-sm mt-2">Generate code first to see the live preview</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Agents View */}
            {viewMode === 'agents' && (
              <div className="flex-1 overflow-auto p-6 bg-gray-900">
                <h3 className="text-lg font-bold text-white mb-4">Agent Status</h3>

                {/* Agent Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {Object.entries(AGENT_CONFIG).map(([type, config]) => {
                    const status = agentStatuses.find(a => a.type === type as AgentType);
                    return (
                      <div
                        key={type}
                        className={`bg-gray-800 rounded-lg p-4 border ${
                          status?.status === 'running' ? 'border-blue-500' :
                          status?.status === 'completed' ? 'border-green-500' :
                          status?.status === 'failed' ? 'border-red-500' :
                          'border-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{config.icon}</span>
                          <div>
                            <h4 className="text-white font-medium">{config.label}</h4>
                            <span className={`text-xs ${
                              status?.status === 'running' ? 'text-blue-400' :
                              status?.status === 'completed' ? 'text-green-400' :
                              status?.status === 'failed' ? 'text-red-400' :
                              'text-gray-500'
                            }`}>
                              {status?.status || 'pending'}
                            </span>
                          </div>
                        </div>

                        {status?.status === 'running' && (
                          <div className="mt-2">
                            <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 transition-all"
                                style={{ width: `${status.progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {status?.filesGenerated && status.filesGenerated > 0 && (
                          <div className="mt-2 text-xs text-gray-400">
                            {status.filesGenerated} files generated
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Logs */}
                <h3 className="text-lg font-bold text-white mb-4">Generation Logs</h3>
                <div className="bg-black rounded-lg p-4 h-64 overflow-auto font-mono text-sm">
                  {generationLogs.length > 0 ? (
                    generationLogs.map((log, index) => (
                      <div key={index} className="text-green-400 mb-1">
                        {log}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">No logs yet...</div>
                  )}
                </div>
              </div>
            )}

            {/* Deploy View */}
            {viewMode === 'deploy' && (
              <div className="flex-1 overflow-auto p-6 bg-gray-900">
                <h3 className="text-lg font-bold text-white mb-6">Deploy Your Application</h3>

                {/* Platform Selection */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {[
                    { id: 'github', name: 'GitHub', icon: Github, color: 'from-gray-600 to-gray-800' },
                    { id: 'vercel', name: 'Vercel', icon: Globe, color: 'from-black to-gray-900' },
                    { id: 'netlify', name: 'Netlify', icon: Cloud, color: 'from-teal-600 to-teal-800' },
                    { id: 'railway', name: 'Railway', icon: Server, color: 'from-purple-600 to-purple-800' },
                  ].map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => setSelectedPlatform(platform.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedPlatform === platform.id
                          ? 'border-blue-500 bg-blue-500/20'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <platform.icon className="w-6 h-6 text-white mx-auto mb-2" />
                      <span className="text-sm text-white font-medium">{platform.name}</span>
                    </button>
                  ))}
                </div>

                {/* GitHub Section */}
                {selectedPlatform === 'github' && (
                  <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Github className="w-6 h-6 text-white" />
                      <h4 className="text-white font-bold">Push to GitHub</h4>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">GitHub Token</label>
                        <input
                          type="password"
                          value={githubToken}
                          onChange={(e) => setGithubToken(e.target.value)}
                          placeholder="ghp_xxxxxxxxxxxx"
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Repository (owner/repo)</label>
                        <input
                          type="text"
                          value={githubRepo}
                          onChange={(e) => setGithubRepo(e.target.value)}
                          placeholder="username/my-app"
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <button
                        onClick={handlePushToGitHub}
                        disabled={isDeploying || !githubToken || !githubRepo || generatedFiles.length === 0}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                          isDeploying || !githubToken || !githubRepo || generatedFiles.length === 0
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-black hover:bg-gray-200'
                        }`}
                      >
                        {isDeploying ? <Loader2 className="w-5 h-5 animate-spin" /> : <Github className="w-5 h-5" />}
                        Push to GitHub
                      </button>
                    </div>
                  </div>
                )}

                {/* Vercel Section */}
                {selectedPlatform === 'vercel' && (
                  <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Globe className="w-6 h-6 text-white" />
                      <h4 className="text-white font-bold">Deploy to Vercel</h4>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Vercel Token</label>
                        <input
                          type="password"
                          value={vercelToken}
                          onChange={(e) => setVercelToken(e.target.value)}
                          placeholder="Enter your Vercel token"
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <button
                        onClick={handleDeployToVercel}
                        disabled={isDeploying || !vercelToken || generatedFiles.length === 0}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                          isDeploying || !vercelToken || generatedFiles.length === 0
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-black text-white hover:bg-gray-900 border border-white'
                        }`}
                      >
                        {isDeploying ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5" />}
                        Deploy to Vercel
                      </button>
                    </div>
                  </div>
                )}

                {/* Netlify Section */}
                {selectedPlatform === 'netlify' && (
                  <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Cloud className="w-6 h-6 text-teal-400" />
                      <h4 className="text-white font-bold">Deploy to Netlify</h4>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Netlify Token</label>
                        <input
                          type="password"
                          value={netlifyToken}
                          onChange={(e) => setNetlifyToken(e.target.value)}
                          placeholder="Enter your Netlify token"
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      <button
                        disabled={isDeploying || !netlifyToken || generatedFiles.length === 0}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                          isDeploying || !netlifyToken || generatedFiles.length === 0
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-500 hover:to-teal-600'
                        }`}
                      >
                        {isDeploying ? <Loader2 className="w-5 h-5 animate-spin" /> : <Cloud className="w-5 h-5" />}
                        Deploy to Netlify
                      </button>
                    </div>
                  </div>
                )}

                {/* Railway Section */}
                {selectedPlatform === 'railway' && (
                  <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Server className="w-6 h-6 text-purple-400" />
                      <h4 className="text-white font-bold">Deploy to Railway</h4>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Railway Token</label>
                        <input
                          type="password"
                          value={railwayToken}
                          onChange={(e) => setRailwayToken(e.target.value)}
                          placeholder="Enter your Railway token"
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <button
                        disabled={isDeploying || !railwayToken || generatedFiles.length === 0}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                          isDeploying || !railwayToken || generatedFiles.length === 0
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-500 hover:to-purple-600'
                        }`}
                      >
                        {isDeploying ? <Loader2 className="w-5 h-5 animate-spin" /> : <Server className="w-5 h-5" />}
                        Deploy to Railway
                      </button>
                    </div>
                  </div>
                )}

                {/* More Platforms Info */}
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    More Platforms
                  </h4>
                  <p className="text-gray-400 text-sm mb-3">
                    Additional deployment options available via API:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Render', 'Fly.io', 'AWS', 'GCP', 'Dokploy', 'Coolify'].map((platform) => (
                      <span
                        key={platform}
                        className="px-3 py-1 bg-gray-700 rounded-full text-xs text-gray-300"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Deployment Status */}
                {deploymentStatus !== 'idle' && (
                  <div className={`mt-6 rounded-lg p-4 ${
                    deploymentStatus === 'success' ? 'bg-green-900/50 border border-green-500' :
                    'bg-red-900/50 border border-red-500'
                  }`}>
                    <div className="flex items-center gap-3">
                      {deploymentStatus === 'success' ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-red-500" />
                      )}
                      <div>
                        <h4 className={`font-bold ${
                          deploymentStatus === 'success' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {deploymentStatus === 'success' ? 'Deployment Successful!' : 'Deployment Failed'}
                        </h4>
                        {deploymentUrl && (
                          <a
                            href={deploymentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline text-sm flex items-center gap-1"
                          >
                            {deploymentUrl}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
