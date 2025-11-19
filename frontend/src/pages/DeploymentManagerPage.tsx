import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useDeployments,
  useDeployment,
  useCreateDeployment,
  useDeploy,
  useRollbackDeployment,
  useDeploymentLogs,
  useDeploymentMetrics
} from '../hooks';

export const DeploymentManagerPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [selectedDeployment, setSelectedDeployment] = useState<string | null>(null);
  const [platform, setPlatform] = useState<'vercel' | 'netlify' | 'railway' | 'aws' | 'docker'>('vercel');

  const { data: deployments, isLoading } = useDeployments(projectId || '');
  const { data: deployment } = useDeployment(selectedDeployment || '');
  const { data: logs } = useDeploymentLogs(selectedDeployment || '');
  const { data: metrics } = useDeploymentMetrics(selectedDeployment || '');

  const createDeployment = useCreateDeployment();
  const deploy = useDeploy();
  const rollback = useRollbackDeployment();

  const handleCreateDeployment = async () => {
    if (!projectId) return;
    await createDeployment.mutateAsync({ projectId, platform });
  };

  const handleDeploy = async (deploymentId: string) => {
    await deploy.mutateAsync(deploymentId);
  };

  const handleRollback = async (deploymentId: string, version: string) => {
    await rollback.mutateAsync({ deploymentId, version });
  };

  const platforms = [
    { id: 'vercel', name: 'Vercel', icon: '▲' },
    { id: 'netlify', name: 'Netlify', icon: '◆' },
    { id: 'railway', name: 'Railway', icon: '🚂' },
    { id: 'aws', name: 'AWS', icon: '☁' },
    { id: 'docker', name: 'Docker', icon: '🐳' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Deployment Manager</h1>
          <p className="text-gray-400 mt-2">Deploy and manage your application across platforms</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Deployments List */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <h2 className="font-medium mb-4">Create New Deployment</h2>
              <div className="space-y-3">
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as typeof platform)}
                  className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white"
                >
                  {platforms.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.icon} {p.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleCreateDeployment}
                  disabled={createDeployment.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 rounded-lg py-2"
                >
                  {createDeployment.isPending ? 'Creating...' : 'Create Deployment'}
                </button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="font-medium mb-4">Deployments</h2>
              {isLoading ? (
                <div className="text-center py-4 text-gray-400">Loading...</div>
              ) : (
                <div className="space-y-2">
                  {(Array.isArray(deployments) ? deployments : []).map((dep: unknown) => {
                    const d = dep as { id: string; platform: string; status: string; createdAt: string };
                    return (
                      <button
                        key={d.id}
                        onClick={() => setSelectedDeployment(d.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedDeployment === d.id
                            ? 'bg-blue-600'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{d.platform}</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            d.status === 'deployed' ? 'bg-green-900 text-green-300' :
                            d.status === 'failed' ? 'bg-red-900 text-red-300' :
                            'bg-yellow-900 text-yellow-300'
                          }`}>
                            {d.status}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(d.createdAt).toLocaleString()}
                        </div>
                      </button>
                    );
                  })}
                  {(Array.isArray(deployments) ? deployments : []).length === 0 && (
                    <div className="text-center py-4 text-gray-400 text-sm">
                      No deployments yet
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Deployment Details */}
          <div className="lg:col-span-2">
            {selectedDeployment && deployment ? (
              <div className="space-y-4">
                {/* Actions */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h2 className="font-medium">Deployment Details</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeploy(selectedDeployment)}
                        disabled={deploy.isPending}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 rounded-lg px-4 py-2 text-sm"
                      >
                        {deploy.isPending ? 'Deploying...' : 'Deploy'}
                      </button>
                      <button
                        onClick={() => handleRollback(selectedDeployment, 'previous')}
                        disabled={rollback.isPending}
                        className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-800 rounded-lg px-4 py-2 text-sm"
                      >
                        {rollback.isPending ? 'Rolling back...' : 'Rollback'}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <span className="text-gray-400 text-sm">Platform</span>
                      <p className="font-medium">{(deployment as { platform?: string }).platform}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Status</span>
                      <p className="font-medium">{(deployment as { status?: string }).status}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">URL</span>
                      <p className="font-medium text-blue-400">
                        {(deployment as { url?: string }).url || 'Not deployed'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Version</span>
                      <p className="font-medium">{(deployment as { version?: string }).version || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                {metrics && (
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h2 className="font-medium mb-4">Metrics</h2>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-700 rounded-lg p-3">
                        <span className="text-gray-400 text-sm">Requests</span>
                        <p className="text-xl font-bold">{(metrics as { requests?: number }).requests || 0}</p>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-3">
                        <span className="text-gray-400 text-sm">Avg Response</span>
                        <p className="text-xl font-bold">{(metrics as { avgResponse?: number }).avgResponse || 0}ms</p>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-3">
                        <span className="text-gray-400 text-sm">Error Rate</span>
                        <p className="text-xl font-bold">{(metrics as { errorRate?: number }).errorRate || 0}%</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Logs */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <h2 className="font-medium mb-4">Deployment Logs</h2>
                  <div className="bg-gray-900 rounded-lg p-4 h-64 overflow-auto font-mono text-sm">
                    {logs ? (
                      <pre className="text-gray-300 whitespace-pre-wrap">
                        {Array.isArray(logs) ? logs.join('\n') : JSON.stringify(logs, null, 2)}
                      </pre>
                    ) : (
                      <div className="text-gray-500">No logs available</div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-8 text-center text-gray-400">
                Select a deployment to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentManagerPage;
