import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Code2,
  FileText,
  Download,
  Play,
  Settings,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { api } from '../services/api';
import { websocket } from '../services/websocket';
import { CodeEditor } from '../components/CodeEditor';
import { LivePreview } from '../components/LivePreview';
import { FileExplorer } from '../components/FileExplorer';
import type { Project, GeneratedFile } from '../types';

interface AgentStatus {
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
}

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'files'>('editor');
  const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Fetch project details
  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ['project', id],
    queryFn: () => api.get(`/projects/${id}`),
    refetchInterval: (data) => {
      // Refetch every 2s if generating
      return data?.status === 'generating' ? 2000 : false;
    },
  });

  // Agent statuses - connected to WebSocket
  const [agentStatuses, setAgentStatuses] = useState<AgentStatus[]>([
    { name: 'Orchestrator', status: 'pending', progress: 0 },
    { name: 'Database Agent', status: 'pending', progress: 0 },
    { name: 'Backend Agent', status: 'pending', progress: 0 },
    { name: 'Frontend Agent', status: 'pending', progress: 0 },
    { name: 'Auth Agent', status: 'pending', progress: 0 },
    { name: 'DevOps Agent', status: 'pending', progress: 0 },
  ]);

  const [generationLogs, setGenerationLogs] = useState<string[]>([]);

  // Connect to WebSocket for real-time updates
  useEffect(() => {
    if (!id) return;

    // Subscribe to project events
    const unsubscribe = websocket.subscribeToProject(id, {
      onProgress: (payload) => {
        // Update agent status based on progress
        if (payload.currentAgent) {
          setAgentStatuses((prev) =>
            prev.map((agent) => {
              const agentName = payload.currentAgent?.toLowerCase();
              if (agent.name.toLowerCase().includes(agentName || '')) {
                return {
                  ...agent,
                  status: 'running',
                  progress: payload.progress,
                };
              }
              // Mark previous agents as completed
              if (prev.indexOf(agent) < prev.findIndex(a =>
                a.name.toLowerCase().includes(agentName || '')
              )) {
                return { ...agent, status: 'completed', progress: 100 };
              }
              return agent;
            })
          );
        }

        // Add log message
        if (payload.message) {
          setGenerationLogs((prev) => [...prev.slice(-99), payload.message]);
        }
      },
      onAgentUpdate: (payload) => {
        setAgentStatuses((prev) =>
          prev.map((agent) => {
            if (agent.name.toLowerCase().includes(payload.agent.type.toLowerCase())) {
              return {
                ...agent,
                status: payload.agent.status as AgentStatus['status'],
                progress: payload.agent.progress,
              };
            }
            return agent;
          })
        );
      },
      onCompleted: () => {
        setAgentStatuses((prev) =>
          prev.map((agent) => ({
            ...agent,
            status: 'completed',
            progress: 100,
          }))
        );
        toast.success('Project generation completed!');
      },
      onFailed: (error) => {
        toast.error(`Generation failed: ${error}`);
      },
    });

    // Connect WebSocket if not already connected
    websocket.connect();

    return () => {
      unsubscribe();
    };
  }, [id]);

  const handleFileSelect = (file: GeneratedFile) => {
    setSelectedFile(file);
    setFileContent(file.content);
  };

  const handleCodeChange = (newContent: string) => {
    setFileContent(newContent);
    if (selectedFile) {
      // Update file content (in real app, save to backend)
      selectedFile.content = newContent;
      toast.success('File updated');
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await api.download(`/projects/${id}/download`);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project?.name || 'project'}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Project downloaded!');
    } catch (error) {
      toast.error('Failed to download project');
    }
  };

  const handlePreview = () => {
    // Generate preview from generated files
    if (!project?.generatedFiles?.length) {
      toast.error('No files to preview yet');
      return;
    }

    // Find index.html or main component
    const indexHtml = project.generatedFiles.find(
      f => f.path.endsWith('index.html') || f.path.includes('index.html')
    );

    const mainTsx = project.generatedFiles.find(
      f => f.path.endsWith('page.tsx') || f.path.endsWith('App.tsx') || f.path.endsWith('index.tsx')
    );

    if (indexHtml) {
      // Create a blob URL from the HTML content
      const blob = new Blob([indexHtml.content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } else if (mainTsx) {
      // Create a simple HTML wrapper for React component
      const htmlWrapper = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview - ${project.name}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: system-ui, sans-serif; }
    .code-preview { padding: 20px; max-width: 1200px; margin: 0 auto; }
    pre { background: #f5f5f5; padding: 16px; border-radius: 8px; overflow-x: auto; }
    code { font-family: 'Fira Code', monospace; font-size: 14px; }
  </style>
</head>
<body class="bg-gray-50 min-h-screen">
  <div class="code-preview">
    <div class="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h1 class="text-xl font-bold text-blue-800">Generated Code Preview</h1>
      <p class="text-blue-600 text-sm mt-1">This is a static preview of your generated code. For a live preview, download and run the project locally.</p>
    </div>
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h2 class="text-lg font-semibold mb-4">${mainTsx.path}</h2>
      <pre><code>${mainTsx.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
    </div>
  </div>
</body>
</html>`;
      const blob = new Blob([htmlWrapper], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } else {
      // Create a preview of all files
      const filesPreview = project.generatedFiles.map(f => `
        <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 class="text-lg font-semibold mb-4">${f.path}</h2>
          <pre><code>${f.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
        </div>
      `).join('');

      const htmlWrapper = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview - ${project.name}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: system-ui, sans-serif; }
    .code-preview { padding: 20px; max-width: 1200px; margin: 0 auto; }
    pre { background: #f5f5f5; padding: 16px; border-radius: 8px; overflow-x: auto; max-height: 400px; }
    code { font-family: 'Fira Code', monospace; font-size: 12px; }
  </style>
</head>
<body class="bg-gray-50 min-h-screen">
  <div class="code-preview">
    <div class="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h1 class="text-xl font-bold text-blue-800">Generated Code Preview - ${project.name}</h1>
      <p class="text-blue-600 text-sm mt-1">Preview of ${project.generatedFiles.length} generated files</p>
    </div>
    ${filesPreview}
  </div>
</body>
</html>`;
      const blob = new Blob([htmlWrapper], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    }

    setActiveTab('preview');
    toast.success('Preview generated!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Project not found</p>
          <button
            onClick={() => navigate('/projects')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {project.name}
              </h1>
              <p className="text-gray-600 text-sm mt-1">{project.description}</p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  project.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : project.status === 'generating'
                    ? 'bg-blue-100 text-blue-700'
                    : project.status === 'failed'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {project.status}
              </span>

              <button
                onClick={handlePreview}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                disabled={project.status !== 'completed'}
              >
                <Play className="w-4 h-4" />
                Preview
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                disabled={project.status !== 'completed'}
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Agent Status & File Explorer */}
          <div className="col-span-3 space-y-6">
            {/* Agent Status */}
            {project.status === 'generating' && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  Generation Progress
                </h2>

                <div className="space-y-3">
                  {agentStatuses.map((agent, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {agent.status === 'completed' && (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          )}
                          {agent.status === 'running' && (
                            <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                          )}
                          {agent.status === 'pending' && (
                            <Clock className="w-4 h-4 text-gray-400" />
                          )}
                          {agent.status === 'failed' && (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span
                            className={`text-sm font-medium ${
                              agent.status === 'completed'
                                ? 'text-green-700'
                                : agent.status === 'running'
                                ? 'text-blue-700'
                                : 'text-gray-500'
                            }`}
                          >
                            {agent.name}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">{agent.progress}%</span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            agent.status === 'completed'
                              ? 'bg-green-500'
                              : agent.status === 'running'
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                              : 'bg-gray-300'
                          }`}
                          style={{ width: `${agent.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* File Explorer */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Folder className="w-5 h-5 text-blue-600" />
                Project Files
              </h2>

              <FileExplorer
                files={project.generatedFiles || []}
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
              />
            </div>

            {/* Project Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                Project Info
              </h2>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-500">Template:</span>
                  <span className="ml-2 font-semibold text-gray-900">
                    {project.template}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Created:</span>
                  <span className="ml-2 font-semibold text-gray-900">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Files:</span>
                  <span className="ml-2 font-semibold text-gray-900">
                    {project.generatedFiles?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-9">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Tabs */}
              <div className="border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-1 p-2">
                  <button
                    onClick={() => setActiveTab('editor')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      activeTab === 'editor'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Code2 className="w-4 h-4" />
                    Code Editor
                  </button>
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      activeTab === 'preview'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Play className="w-4 h-4" />
                    Live Preview
                  </button>
                  <button
                    onClick={() => setActiveTab('files')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      activeTab === 'files'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    All Files
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="h-[calc(100vh-300px)]">
                {activeTab === 'editor' && (
                  <CodeEditor
                    file={selectedFile}
                    content={fileContent}
                    onChange={handleCodeChange}
                  />
                )}

                {activeTab === 'preview' && (
                  <LivePreview url={previewUrl} project={project} />
                )}

                {activeTab === 'files' && (
                  <div className="p-6 h-full overflow-auto">
                    <div className="grid grid-cols-2 gap-4">
                      {project.generatedFiles?.map((file, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            handleFileSelect(file);
                            setActiveTab('editor');
                          }}
                          className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
                        >
                          <div className="flex items-start gap-3">
                            <FileText className="w-5 h-5 text-gray-400 group-hover:text-blue-600 mt-1" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">
                                {file.path.split('/').pop()}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 truncate">
                                {file.path}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
