import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useAnalyzeSchema,
  useGenerateMigrations,
  useSuggestIndexes,
  useOptimizeQueries
} from '../hooks';

export const DatabaseToolsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [activeTab, setActiveTab] = useState('schema');
  const [connectionString, setConnectionString] = useState('postgresql://user:password@localhost:5432/mydb');

  const analyzeSchema = useAnalyzeSchema();
  const generateMigrations = useGenerateMigrations();
  const suggestIndexes = useSuggestIndexes();
  const optimizeQueries = useOptimizeQueries();

  const handleAnalyzeSchema = async () => {
    if (!projectId) return;
    await analyzeSchema.mutateAsync({ projectId, data: { connectionString } });
  };

  const handleGenerateMigrations = async () => {
    if (!projectId) return;
    await generateMigrations.mutateAsync({
      projectId,
      data: { database: 'postgresql', orm: 'prisma' }
    });
  };

  const handleSuggestIndexes = async () => {
    if (!projectId) return;
    await suggestIndexes.mutateAsync({ projectId });
  };

  const handleOptimizeQueries = async () => {
    if (!projectId) return;
    await optimizeQueries.mutateAsync({
      projectId,
      data: { queries: ['SELECT * FROM users WHERE email = ?'] }
    });
  };

  const tabs = [
    { id: 'schema', label: 'Schema Analysis' },
    { id: 'migrations', label: 'Migrations' },
    { id: 'indexes', label: 'Index Suggestions' },
    { id: 'optimization', label: 'Query Optimization' },
  ];

  // Mock schema data
  const schemaData = {
    tables: [
      {
        name: 'users',
        columns: [
          { name: 'id', type: 'uuid', primary: true },
          { name: 'email', type: 'varchar(255)', unique: true },
          { name: 'name', type: 'varchar(100)', nullable: true },
          { name: 'created_at', type: 'timestamp' },
        ],
        indexes: ['idx_users_email'],
        relations: ['posts', 'comments']
      },
      {
        name: 'posts',
        columns: [
          { name: 'id', type: 'uuid', primary: true },
          { name: 'title', type: 'varchar(255)' },
          { name: 'content', type: 'text' },
          { name: 'author_id', type: 'uuid', foreign: 'users.id' },
          { name: 'published', type: 'boolean', default: false },
        ],
        indexes: ['idx_posts_author'],
        relations: ['users', 'comments']
      },
    ]
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Database Tools</h1>
          <p className="text-gray-400 mt-2">Analyze, optimize, and manage your database</p>
        </header>

        {/* Connection String */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <label className="text-sm text-gray-400 block mb-2">Database Connection</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={connectionString}
              onChange={(e) => setConnectionString(e.target.value)}
              className="flex-1 bg-gray-700 rounded-lg px-4 py-2 font-mono text-sm"
              placeholder="postgresql://user:password@localhost:5432/db"
            />
            <button
              onClick={handleAnalyzeSchema}
              disabled={analyzeSchema.isPending}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 px-4 py-2 rounded-lg"
            >
              {analyzeSchema.isPending ? 'Connecting...' : 'Connect'}
            </button>
          </div>
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
        {activeTab === 'schema' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm text-gray-400">Tables</h3>
                <p className="text-2xl font-bold">{schemaData.tables.length}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm text-gray-400">Total Columns</h3>
                <p className="text-2xl font-bold">
                  {schemaData.tables.reduce((acc, t) => acc + t.columns.length, 0)}
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm text-gray-400">Indexes</h3>
                <p className="text-2xl font-bold">
                  {schemaData.tables.reduce((acc, t) => acc + t.indexes.length, 0)}
                </p>
              </div>
            </div>

            {schemaData.tables.map(table => (
              <div key={table.name} className="bg-gray-800 rounded-lg p-4">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <span className="text-blue-400">#</span>
                  {table.name}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-400 border-b border-gray-700">
                        <th className="text-left pb-2">Column</th>
                        <th className="text-left pb-2">Type</th>
                        <th className="text-left pb-2">Constraints</th>
                      </tr>
                    </thead>
                    <tbody>
                      {table.columns.map(col => (
                        <tr key={col.name} className="border-b border-gray-700/50">
                          <td className="py-2 font-mono">{col.name}</td>
                          <td className="py-2 text-green-400">{col.type}</td>
                          <td className="py-2">
                            {col.primary && <span className="bg-yellow-900 text-yellow-300 px-2 py-0.5 rounded text-xs mr-1">PK</span>}
                            {col.unique && <span className="bg-blue-900 text-blue-300 px-2 py-0.5 rounded text-xs mr-1">UNIQUE</span>}
                            {col.foreign && <span className="bg-purple-900 text-purple-300 px-2 py-0.5 rounded text-xs mr-1">FK: {col.foreign}</span>}
                            {col.nullable && <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded text-xs">NULL</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 text-sm">
                  <span className="text-gray-400">Relations: </span>
                  {table.relations.map((rel, i) => (
                    <span key={rel} className="text-blue-400">
                      {rel}{i < table.relations.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'migrations' && (
          <div className="space-y-6">
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleGenerateMigrations}
                disabled={generateMigrations.isPending}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 px-4 py-2 rounded-lg"
              >
                {generateMigrations.isPending ? 'Generating...' : 'Generate Migration'}
              </button>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-medium mb-4">Migration History</h3>
              <div className="space-y-3">
                {[
                  { id: '003', name: 'add_posts_table', date: '2024-01-15', status: 'applied' },
                  { id: '002', name: 'add_user_indexes', date: '2024-01-10', status: 'applied' },
                  { id: '001', name: 'initial_schema', date: '2024-01-01', status: 'applied' },
                ].map(migration => (
                  <div key={migration.id} className="flex justify-between items-center bg-gray-700 p-3 rounded">
                    <div>
                      <span className="text-gray-400 mr-2">{migration.id}</span>
                      <span>{migration.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-400">{migration.date}</span>
                      <span className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded">
                        {migration.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-medium mb-4">Preview</h3>
              <pre className="bg-gray-900 rounded p-4 text-sm overflow-x-auto">
{`-- Migration: add_comments_table
-- Created at: ${new Date().toISOString()}

CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id),
  post_id UUID NOT NULL REFERENCES posts(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_post ON comments(post_id);`}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'indexes' && (
          <div className="space-y-6">
            <button
              onClick={handleSuggestIndexes}
              disabled={suggestIndexes.isPending}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 px-4 py-2 rounded-lg"
            >
              {suggestIndexes.isPending ? 'Analyzing...' : 'Analyze & Suggest'}
            </button>

            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-medium mb-4">Index Suggestions</h3>
              <div className="space-y-4">
                {[
                  {
                    table: 'posts',
                    column: 'published',
                    reason: 'Frequently filtered column with low cardinality',
                    impact: 'High',
                    sql: 'CREATE INDEX idx_posts_published ON posts(published);'
                  },
                  {
                    table: 'users',
                    column: 'created_at',
                    reason: 'Used in ORDER BY clauses',
                    impact: 'Medium',
                    sql: 'CREATE INDEX idx_users_created ON users(created_at DESC);'
                  },
                ].map((suggestion, i) => (
                  <div key={i} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-medium">{suggestion.table}</span>
                        <span className="text-gray-400">.{suggestion.column}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        suggestion.impact === 'High'
                          ? 'bg-red-900 text-red-300'
                          : 'bg-yellow-900 text-yellow-300'
                      }`}>
                        {suggestion.impact} Impact
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{suggestion.reason}</p>
                    <pre className="bg-gray-800 rounded p-2 text-xs font-mono text-green-400">
                      {suggestion.sql}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'optimization' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-medium mb-4">Query Analyzer</h3>
              <textarea
                className="w-full bg-gray-700 rounded-lg p-4 font-mono text-sm h-32 mb-3"
                placeholder="Enter your SQL query to optimize..."
                defaultValue="SELECT * FROM users u JOIN posts p ON u.id = p.author_id WHERE u.email LIKE '%@example.com'"
              />
              <button
                onClick={handleOptimizeQueries}
                disabled={optimizeQueries.isPending}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 px-4 py-2 rounded-lg"
              >
                {optimizeQueries.isPending ? 'Optimizing...' : 'Optimize Query'}
              </button>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="font-medium mb-4">Optimization Results</h3>
              <div className="space-y-4">
                <div className="bg-red-900/30 rounded-lg p-4">
                  <h4 className="text-red-400 font-medium mb-2">Issues Found</h4>
                  <ul className="space-y-2 text-sm">
                    <li>- Using SELECT * instead of specific columns</li>
                    <li>- LIKE pattern starts with wildcard (can't use index)</li>
                    <li>- Missing index on posts.author_id</li>
                  </ul>
                </div>
                <div className="bg-green-900/30 rounded-lg p-4">
                  <h4 className="text-green-400 font-medium mb-2">Optimized Query</h4>
                  <pre className="bg-gray-900 rounded p-3 text-sm font-mono">
{`SELECT u.id, u.name, u.email, p.title, p.content
FROM users u
JOIN posts p ON u.id = p.author_id
WHERE u.email LIKE 'user%@example.com'`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseToolsPage;
