import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useProjects,
  useTemplates,
  useQueueStats,
  useHealthCheck,
  useCustomPrompts,
  usePlugins
} from '../hooks';

export const DashboardPage: React.FC = () => {
  const { data: projects, isLoading: projectsLoading } = useProjects({ page: 1, pageSize: 5 });
  const { data: templates } = useTemplates();
  const { data: queueStats } = useQueueStats();
  const { data: health } = useHealthCheck();
  const { data: customPrompts } = useCustomPrompts();
  const { data: plugins } = usePlugins();

  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'projects', label: 'Projects' },
    { id: 'templates', label: 'Templates' },
    { id: 'prompts', label: 'Custom Prompts' },
    { id: 'plugins', label: 'Plugins' },
    { id: 'queue', label: 'Job Queue' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400 mt-2">Manage your app generation projects</p>
        </header>

        {/* Health Status */}
        <div className="mb-6 flex items-center gap-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
            health ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
          }`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${
              health ? 'bg-green-400' : 'bg-red-400'
            }`}></span>
            {health ? 'System Online' : 'System Offline'}
          </span>
          {queueStats && (
            <span className="text-sm text-gray-400">
              Queue: {(queueStats as { active?: number }).active || 0} active, {(queueStats as { waiting?: number }).waiting || 0} waiting
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700 mb-6">
          <nav className="flex gap-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-1 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Projects"
              value={(projects as { total?: number })?.total || 0}
              icon="folder"
              color="blue"
            />
            <StatCard
              title="Templates"
              value={Array.isArray(templates) ? templates.length : 0}
              icon="template"
              color="green"
            />
            <StatCard
              title="Custom Prompts"
              value={Array.isArray(customPrompts) ? customPrompts.length : 0}
              icon="chat"
              color="purple"
            />
            <StatCard
              title="Plugins"
              value={Array.isArray(plugins) ? plugins.length : 0}
              icon="plugin"
              color="orange"
            />
          </div>
        )}

        {activeTab === 'projects' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Projects</h2>
              <Link
                to="/create"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
              >
                New Project
              </Link>
            </div>
            {projectsLoading ? (
              <div className="text-center py-8 text-gray-400">Loading projects...</div>
            ) : (
              <div className="space-y-4">
                {((projects as { data?: unknown[] })?.data || []).map((project: unknown) => {
                  const p = project as { id: string; name: string; status: string; createdAt: string };
                  return (
                    <ProjectCard key={p.id} project={p} />
                  );
                })}
                {((projects as { data?: unknown[] })?.data || []).length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    No projects yet. Create your first project!
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'templates' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Available Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(Array.isArray(templates) ? templates : []).map((template: unknown) => {
                const t = template as { id: string; name: string; description: string; complexity: string };
                return (
                  <TemplateCard key={t.id} template={t} />
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'prompts' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Custom Prompts</h2>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm">
                Create Prompt
              </button>
            </div>
            <div className="space-y-3">
              {(Array.isArray(customPrompts) ? customPrompts : []).map((prompt: unknown) => {
                const p = prompt as { id: string; name: string; category: string; description?: string };
                return (
                  <div key={p.id} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{p.name}</h3>
                        <p className="text-sm text-gray-400">{p.description}</p>
                      </div>
                      <span className="px-2 py-1 bg-purple-900 text-purple-300 rounded text-xs">
                        {p.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'plugins' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Installed Plugins</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(Array.isArray(plugins) ? plugins : []).map((plugin: unknown) => {
                const p = plugin as { id: string; name: string; description: string; version: string; enabled: boolean };
                return (
                  <div key={p.id} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{p.name}</h3>
                        <p className="text-sm text-gray-400">{p.description}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        p.enabled ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-400'
                      }`}>
                        {p.enabled ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">v{p.version}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'queue' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Job Queue Status</h2>
            {queueStats ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-gray-400 text-sm">Active Jobs</h3>
                  <p className="text-2xl font-bold text-blue-400">{(queueStats as { active?: number }).active || 0}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-gray-400 text-sm">Waiting</h3>
                  <p className="text-2xl font-bold text-yellow-400">{(queueStats as { waiting?: number }).waiting || 0}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-gray-400 text-sm">Completed</h3>
                  <p className="text-2xl font-bold text-green-400">{(queueStats as { completed?: number }).completed || 0}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">Loading queue stats...</div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/create" className="bg-gray-800 hover:bg-gray-750 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">+</div>
              <div className="text-sm">New Project</div>
            </Link>
            <Link to="/build-from-scratch" className="bg-gray-800 hover:bg-gray-750 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">{'</>'}</div>
              <div className="text-sm">Build From Scratch</div>
            </Link>
            <Link to="/visual-editor" className="bg-gray-800 hover:bg-gray-750 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">[]</div>
              <div className="text-sm">Visual Editor</div>
            </Link>
            <Link to="/testing" className="bg-gray-800 hover:bg-gray-750 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">v</div>
              <div className="text-sm">Testing Suite</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: string;
  color: string;
}> = ({ title, value, color }) => {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-900/50 text-blue-400',
    green: 'bg-green-900/50 text-green-400',
    purple: 'bg-purple-900/50 text-purple-400',
    orange: 'bg-orange-900/50 text-orange-400',
  };

  return (
    <div className={`rounded-lg p-4 ${colorClasses[color]}`}>
      <h3 className="text-sm opacity-75">{title}</h3>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
};

const ProjectCard: React.FC<{
  project: { id: string; name: string; status: string; createdAt: string };
}> = ({ project }) => {
  const statusColors: Record<string, string> = {
    draft: 'bg-gray-700 text-gray-300',
    generating: 'bg-blue-900 text-blue-300',
    completed: 'bg-green-900 text-green-300',
    failed: 'bg-red-900 text-red-300',
  };

  return (
    <Link
      to={`/projects/${project.id}`}
      className="block bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors"
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium">{project.name}</h3>
          <p className="text-sm text-gray-400">
            {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span className={`px-2 py-1 rounded text-xs ${statusColors[project.status] || statusColors.draft}`}>
          {project.status}
        </span>
      </div>
    </Link>
  );
};

const TemplateCard: React.FC<{
  template: { id: string; name: string; description: string; complexity: string };
}> = ({ template }) => {
  const complexityColors: Record<string, string> = {
    beginner: 'bg-green-900 text-green-300',
    intermediate: 'bg-yellow-900 text-yellow-300',
    advanced: 'bg-red-900 text-red-300',
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="font-medium">{template.name}</h3>
      <p className="text-sm text-gray-400 mt-1">{template.description}</p>
      <span className={`inline-block px-2 py-1 rounded text-xs mt-3 ${
        complexityColors[template.complexity] || complexityColors.beginner
      }`}>
        {template.complexity}
      </span>
    </div>
  );
};

export default DashboardPage;
