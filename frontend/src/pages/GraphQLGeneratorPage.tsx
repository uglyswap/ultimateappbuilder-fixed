import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useGraphQLSchema,
  useSaveGraphQLSchema,
  useGenerateGraphQLResolvers,
  useValidateGraphQLSchema
} from '../hooks';

export const GraphQLGeneratorPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [schema, setSchema] = useState(`type Query {
  users: [User!]!
  user(id: ID!): User
  posts: [Post!]!
  post(id: ID!): Post
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  deleteUser(id: ID!): Boolean!
  createPost(input: CreatePostInput!): Post!
}

type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
  createdAt: DateTime!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  published: Boolean!
  createdAt: DateTime!
}

input CreateUserInput {
  name: String!
  email: String!
}

input UpdateUserInput {
  name: String
  email: String
}

input CreatePostInput {
  title: String!
  content: String!
  authorId: ID!
}

scalar DateTime`);
  const [activeTab, setActiveTab] = useState('editor');
  const [validationResult, setValidationResult] = useState<unknown>(null);

  const { data: savedSchema, isLoading } = useGraphQLSchema(projectId || '');
  const saveSchema = useSaveGraphQLSchema();
  const generateResolvers = useGenerateGraphQLResolvers();
  const validateSchema = useValidateGraphQLSchema();

  const handleSaveSchema = async () => {
    if (!projectId) return;
    await saveSchema.mutateAsync({ projectId, data: { schema } });
  };

  const handleGenerateResolvers = async () => {
    if (!projectId) return;
    await generateResolvers.mutateAsync({
      projectId,
      data: { database: 'prisma', typescript: true }
    });
  };

  const handleValidate = async () => {
    if (!projectId) return;
    const result = await validateSchema.mutateAsync({
      projectId,
      data: { schema }
    });
    setValidationResult(result);
  };

  const tabs = [
    { id: 'editor', label: 'Schema Editor' },
    { id: 'playground', label: 'Playground' },
    { id: 'docs', label: 'Documentation' },
    { id: 'resolvers', label: 'Resolvers' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">GraphQL Generator</h1>
          <p className="text-gray-400 mt-2">Design your GraphQL schema and generate resolvers</p>
        </header>

        {/* Actions */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleSaveSchema}
            disabled={saveSchema.isPending}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 px-4 py-2 rounded-lg"
          >
            {saveSchema.isPending ? 'Saving...' : 'Save Schema'}
          </button>
          <button
            onClick={handleValidate}
            disabled={validateSchema.isPending}
            className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-800 px-4 py-2 rounded-lg"
          >
            {validateSchema.isPending ? 'Validating...' : 'Validate'}
          </button>
          <button
            onClick={handleGenerateResolvers}
            disabled={generateResolvers.isPending}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 px-4 py-2 rounded-lg"
          >
            {generateResolvers.isPending ? 'Generating...' : 'Generate Resolvers'}
          </button>
        </div>

        {/* Validation Result */}
        {validationResult && (
          <div className={`mb-6 p-4 rounded-lg ${
            (validationResult as { valid?: boolean }).valid
              ? 'bg-green-900/50 text-green-300'
              : 'bg-red-900/50 text-red-300'
          }`}>
            {(validationResult as { valid?: boolean }).valid
              ? 'Schema is valid!'
              : `Validation errors: ${JSON.stringify((validationResult as { errors?: unknown[] }).errors)}`
            }
          </div>
        )}

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
        {activeTab === 'editor' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="font-medium mb-4">Schema Definition</h2>
              <textarea
                value={schema}
                onChange={(e) => setSchema(e.target.value)}
                className="w-full h-[600px] bg-gray-800 rounded-lg p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Define your GraphQL schema..."
              />
            </div>
            <div>
              <h2 className="font-medium mb-4">Schema Preview</h2>
              <div className="bg-gray-800 rounded-lg p-4 h-[600px] overflow-auto">
                <pre className="text-sm text-gray-300">{schema}</pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'playground' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="font-medium mb-4">Query</h2>
              <textarea
                className="w-full h-[400px] bg-gray-800 rounded-lg p-4 font-mono text-sm resize-none"
                placeholder={`query {
  users {
    id
    name
    email
    posts {
      title
    }
  }
}`}
              />
              <button className="mt-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg">
                Run Query
              </button>
            </div>
            <div>
              <h2 className="font-medium mb-4">Response</h2>
              <div className="bg-gray-800 rounded-lg p-4 h-[400px] overflow-auto">
                <pre className="text-sm text-gray-300">
                  {JSON.stringify({ data: { users: [] } }, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="font-medium mb-4">Schema Documentation</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-blue-400 font-medium">Types</h3>
                <div className="mt-2 space-y-2">
                  <div className="bg-gray-700 p-3 rounded">
                    <span className="text-green-400">User</span>
                    <span className="text-gray-400 ml-2">- Represents a user in the system</span>
                  </div>
                  <div className="bg-gray-700 p-3 rounded">
                    <span className="text-green-400">Post</span>
                    <span className="text-gray-400 ml-2">- Represents a blog post</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-blue-400 font-medium">Queries</h3>
                <div className="mt-2 space-y-2">
                  <div className="bg-gray-700 p-3 rounded">
                    <span className="text-yellow-400">users</span>
                    <span className="text-gray-400 ml-2">: [User!]! - Get all users</span>
                  </div>
                  <div className="bg-gray-700 p-3 rounded">
                    <span className="text-yellow-400">user(id: ID!)</span>
                    <span className="text-gray-400 ml-2">: User - Get user by ID</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-blue-400 font-medium">Mutations</h3>
                <div className="mt-2 space-y-2">
                  <div className="bg-gray-700 p-3 rounded">
                    <span className="text-purple-400">createUser</span>
                    <span className="text-gray-400 ml-2">- Create a new user</span>
                  </div>
                  <div className="bg-gray-700 p-3 rounded">
                    <span className="text-purple-400">createPost</span>
                    <span className="text-gray-400 ml-2">- Create a new post</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resolvers' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="font-medium mb-4">Generated Resolvers</h2>
            <pre className="text-sm text-gray-300 overflow-auto">
{`import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    users: () => prisma.user.findMany(),
    user: (_: any, { id }: { id: string }) =>
      prisma.user.findUnique({ where: { id } }),
    posts: () => prisma.post.findMany(),
    post: (_: any, { id }: { id: string }) =>
      prisma.post.findUnique({ where: { id } }),
  },
  Mutation: {
    createUser: (_: any, { input }: { input: any }) =>
      prisma.user.create({ data: input }),
    updateUser: (_: any, { id, input }: { id: string; input: any }) =>
      prisma.user.update({ where: { id }, data: input }),
    deleteUser: (_: any, { id }: { id: string }) =>
      prisma.user.delete({ where: { id } }),
    createPost: (_: any, { input }: { input: any }) =>
      prisma.post.create({ data: input }),
  },
  User: {
    posts: (parent: any) =>
      prisma.post.findMany({ where: { authorId: parent.id } }),
  },
  Post: {
    author: (parent: any) =>
      prisma.user.findUnique({ where: { id: parent.authorId } }),
  },
};`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphQLGeneratorPage;
