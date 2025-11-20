import { useState } from 'react';
import { Github, Loader2, FolderOpen, AlertCircle, CheckCircle } from 'lucide-react';
import type { GeneratedFile } from '../types';

interface GitHubConnectProps {
  onFilesLoaded: (files: GeneratedFile[]) => void;
  githubToken: string;
}

interface RepoInfo {
  name: string;
  description: string;
  defaultBranch: string;
  stars: number;
  language: string;
}

export function GitHubConnect({ onFilesLoaded, githubToken }: GitHubConnectProps) {
  const [repoUrl, setRepoUrl] = useState('');
  const [branch, setBranch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null);
  const [filesCount, setFilesCount] = useState(0);

  const handleConnect = async () => {
    if (!repoUrl.trim()) {
      setError('Please enter a GitHub repository URL');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRepoInfo(null);

    try {
      const response = await fetch('/api/github/repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoUrl: repoUrl.trim(),
          token: githubToken || undefined,
          branch: branch || undefined,
        }),
      });

      const result = await response.json();

      if (result.status === 'error') {
        setError(result.message);
        return;
      }

      setRepoInfo(result.data.repoInfo);
      setFilesCount(result.data.files.length);

      // Convert to GeneratedFile format
      const files: GeneratedFile[] = result.data.files.map((f: any) => ({
        path: f.path,
        content: f.content,
      }));

      onFilesLoaded(files);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to repository');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Github className="w-5 h-5 text-white" />
        <h3 className="text-white font-medium">Connect GitHub Repository</h3>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Repository URL</label>
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/owner/repo"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Branch (optional)</label>
          <input
            type="text"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            placeholder="main"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          onClick={handleConnect}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <FolderOpen className="w-4 h-4" />
              Load Repository
            </>
          )}
        </button>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-900/30 border border-red-700 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {repoInfo && (
          <div className="p-3 bg-green-900/30 border border-green-700 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-green-400 font-medium">{repoInfo.name}</p>
                {repoInfo.description && (
                  <p className="text-xs text-gray-400 mt-1">{repoInfo.description}</p>
                )}
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span>{repoInfo.language}</span>
                  <span>{repoInfo.stars} stars</span>
                  <span>{filesCount} files loaded</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {!githubToken && (
          <p className="text-xs text-gray-500">
            Tip: Add a GitHub token in Settings for private repos and higher rate limits.
          </p>
        )}
      </div>
    </div>
  );
}
