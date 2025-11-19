"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphqlGeneratorService = exports.GraphQLGeneratorService = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
const universal_ai_client_1 = require("../utils/universal-ai-client");
const prisma = new client_1.PrismaClient();
class GraphQLGeneratorService {
    /**
     * Generate GraphQL schema from description
     */
    async generateSchemaFromDescription(projectId, description, features) {
        logger_1.logger.info(`Generating GraphQL schema for project ${projectId}`);
        const prompt = `You are an expert GraphQL API architect. Generate a production-ready GraphQL schema based on this description:

Project Description: ${description}

Features: ${features.join(', ')}

Generate a comprehensive GraphQL schema with:
1. Type definitions for all entities
2. Queries for fetching data
3. Mutations for creating/updating/deleting data
4. Subscriptions for real-time updates (if applicable)
5. Proper authentication/authorization annotations

Return ONLY valid JSON in this format:
{
  "types": [
    {
      "name": "User",
      "description": "User account",
      "fields": [
        { "name": "id", "type": "ID", "nullable": false },
        { "name": "email", "type": "String", "nullable": false },
        { "name": "name", "type": "String", "nullable": true }
      ]
    }
  ],
  "queries": [
    {
      "name": "getUser",
      "returnType": "User",
      "args": [{ "name": "id", "type": "ID", "required": true }],
      "requiresAuth": true,
      "description": "Get user by ID"
    }
  ],
  "mutations": [
    {
      "name": "createUser",
      "returnType": "User",
      "args": [{ "name": "input", "type": "CreateUserInput", "required": true }],
      "requiresAuth": false,
      "description": "Create a new user"
    }
  ],
  "subscriptions": [
    {
      "name": "userUpdated",
      "returnType": "User",
      "args": [{ "name": "userId", "type": "ID", "required": true }],
      "requiresAuth": true,
      "description": "Subscribe to user updates"
    }
  ]
}`;
        const result = await universal_ai_client_1.universalAIClient.generateCode(prompt, 'backend', {
            autonomousMode: true,
            temperature: 0.7,
        });
        try {
            const schema = JSON.parse(result.content);
            return schema;
        }
        catch (error) {
            logger_1.logger.error('Failed to parse GraphQL schema', { error });
            throw new Error('AI generated invalid GraphQL schema');
        }
    }
    /**
     * Generate GraphQL type definitions (SDL)
     */
    generateTypeDefinitions(schema) {
        const types = schema.types.map(type => this.generateTypeDefinition(type)).join('\n\n');
        const queries = this.generateQueryDefinitions(schema.queries);
        const mutations = this.generateMutationDefinitions(schema.mutations);
        const subscriptions = this.generateSubscriptionDefinitions(schema.subscriptions);
        return `# ===================================
# GraphQL Schema - Auto-Generated
# ===================================

${types}

${queries}

${mutations}

${subscriptions}
`;
    }
    generateTypeDefinition(type) {
        const description = type.description ? `"""\n${type.description}\n"""\n` : '';
        const fields = type.fields
            .map(field => {
            const fieldDescription = field.description ? `  """\n  ${field.description}\n  """\n` : '';
            const nullable = field.nullable ? '' : '!';
            const list = field.list ? `[${field.type}]` : field.type;
            return `${fieldDescription}  ${field.name}: ${list}${nullable}`;
        })
            .join('\n');
        return `${description}type ${type.name} {
${fields}
}`;
    }
    generateQueryDefinitions(queries) {
        if (queries.length === 0)
            return '';
        const queryFields = queries
            .map(query => {
            const description = query.description ? `  """\n  ${query.description}\n  """\n` : '';
            const args = query.args
                ? `(${query.args.map(arg => `${arg.name}: ${arg.type}${arg.required ? '!' : ''}`).join(', ')})`
                : '';
            const directive = query.requiresAuth ? ' @auth' : '';
            return `${description}  ${query.name}${args}: ${query.returnType}${directive}`;
        })
            .join('\n');
        return `type Query {
${queryFields}
}`;
    }
    generateMutationDefinitions(mutations) {
        if (mutations.length === 0)
            return '';
        const mutationFields = mutations
            .map(mutation => {
            const description = mutation.description ? `  """\n  ${mutation.description}\n  """\n` : '';
            const args = mutation.args
                ? `(${mutation.args.map(arg => `${arg.name}: ${arg.type}${arg.required ? '!' : ''}`).join(', ')})`
                : '';
            const directive = mutation.requiresAuth ? ' @auth' : '';
            return `${description}  ${mutation.name}${args}: ${mutation.returnType}${directive}`;
        })
            .join('\n');
        return `type Mutation {
${mutationFields}
}`;
    }
    generateSubscriptionDefinitions(subscriptions) {
        if (subscriptions.length === 0)
            return '';
        const subscriptionFields = subscriptions
            .map(subscription => {
            const description = subscription.description
                ? `  """\n  ${subscription.description}\n  """\n`
                : '';
            const args = subscription.args
                ? `(${subscription.args.map(arg => `${arg.name}: ${arg.type}${arg.required ? '!' : ''}`).join(', ')})`
                : '';
            const directive = subscription.requiresAuth ? ' @auth' : '';
            return `${description}  ${subscription.name}${args}: ${subscription.returnType}${directive}`;
        })
            .join('\n');
        return `type Subscription {
${subscriptionFields}
}`;
    }
    /**
     * Generate resolvers using AI
     */
    async generateResolvers(schema) {
        logger_1.logger.info('Generating GraphQL resolvers with AI');
        const prompt = `Generate production-ready GraphQL resolvers in TypeScript for this schema:

${JSON.stringify(schema, null, 2)}

Requirements:
- Use TypeScript with proper types
- Use Prisma for database operations
- Include authentication checks for protected resolvers
- Use DataLoader to prevent N+1 queries
- Include proper error handling
- Add input validation
- Include comments
- Use async/await
- Follow best practices

Generate ONLY the resolver code, nothing else.`;
        const result = await universal_ai_client_1.universalAIClient.generateCode(prompt, 'backend', {
            autonomousMode: true,
            temperature: 0.5,
        });
        return result.content;
    }
    /**
     * Generate Apollo Server configuration
     */
    async generateApolloServerConfig(projectName) {
        const config = `import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { applyMiddleware } from 'graphql-middleware';
import { shield, rule } from 'graphql-shield';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { PrismaClient } from '@prisma/client';
import { createDataLoaders } from './dataloaders';

const prisma = new PrismaClient();

// Authentication rule
const isAuthenticated = rule({ cache: 'contextual' })(
  async (parent, args, ctx, info) => {
    return ctx.user !== null;
  }
);

// Authorization shield
const permissions = shield({
  Query: {
    '*': isAuthenticated, // Protect all queries by default
  },
  Mutation: {
    '*': isAuthenticated, // Protect all mutations by default
  },
}, {
  allowExternalErrors: true,
});

// Create executable schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Apply authorization middleware
const schemaWithMiddleware = applyMiddleware(schema, permissions);

// Create Apollo Server
const server = new ApolloServer({
  schema: schemaWithMiddleware,
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return error;
  },
  plugins: [
    {
      async requestDidStart() {
        return {
          async didEncounterErrors(requestContext) {
            console.error('GraphQL Request Errors:', requestContext.errors);
          },
        };
      },
    },
  ],
});

// Start server
async function startServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => {
      // Extract user from JWT token
      const token = req.headers.authorization?.replace('Bearer ', '');
      let user = null;

      if (token) {
        try {
          // Verify JWT and get user
          // user = await verifyToken(token);
        } catch (error) {
          console.error('Token verification failed:', error);
        }
      }

      return {
        user,
        prisma,
        dataloaders: createDataLoaders(prisma),
      };
    },
  });

  console.log(\`🚀 GraphQL Server ready at \${url}\`);
}

startServer().catch(console.error);

export { server };
`;
        return config;
    }
    /**
     * Generate DataLoaders for N+1 prevention
     */
    async generateDataLoaders(schema) {
        const types = schema.types.map(t => t.name).join(', ');
        const dataloadersCode = `import DataLoader from 'dataloader';
import { PrismaClient } from '@prisma/client';

export function createDataLoaders(prisma: PrismaClient) {
  return {
${schema.types
            .map(type => `    ${type.name.toLowerCase()}Loader: new DataLoader(async (ids: readonly string[]) => {
      const items = await prisma.${type.name.toLowerCase()}.findMany({
        where: { id: { in: [...ids] } },
      });
      const itemMap = new Map(items.map(item => [item.id, item]));
      return ids.map(id => itemMap.get(id) || null);
    }),`)
            .join('\n')}
  };
}

export type DataLoaders = ReturnType<typeof createDataLoaders>;
`;
        return dataloadersCode;
    }
    /**
     * Generate complete GraphQL API package
     */
    async generateCompleteGraphQLAPI(projectId, description, features) {
        logger_1.logger.info(`Generating complete GraphQL API for project ${projectId}`);
        // Generate schema
        const schema = await this.generateSchemaFromDescription(projectId, description, features);
        // Generate type definitions
        const typeDefs = this.generateTypeDefinitions(schema);
        // Generate resolvers
        const resolvers = await this.generateResolvers(schema);
        // Generate server config
        const serverConfig = await this.generateApolloServerConfig(projectId);
        // Generate dataloaders
        const dataloaders = await this.generateDataLoaders(schema);
        // Generate package.json
        const packageJson = JSON.stringify({
            name: `${projectId}-graphql-api`,
            version: '1.0.0',
            description: 'Auto-generated GraphQL API',
            main: 'dist/server.js',
            scripts: {
                dev: 'ts-node-dev --respawn --transpile-only src/server.ts',
                build: 'tsc',
                start: 'node dist/server.js',
                codegen: 'graphql-codegen --config codegen.yml',
            },
            dependencies: {
                '@apollo/server': '^4.10.0',
                '@graphql-tools/schema': '^10.0.2',
                '@prisma/client': '^5.8.0',
                'dataloader': '^2.2.2',
                'graphql': '^16.8.1',
                'graphql-middleware': '^6.1.35',
                'graphql-shield': '^7.6.5',
                'jsonwebtoken': '^9.0.2',
            },
            devDependencies: {
                '@graphql-codegen/cli': '^5.0.0',
                '@graphql-codegen/typescript': '^4.0.1',
                '@graphql-codegen/typescript-resolvers': '^4.0.1',
                '@types/node': '^20.10.6',
                'prisma': '^5.8.0',
                'ts-node-dev': '^2.0.0',
                'typescript': '^5.3.3',
            },
        }, null, 2);
        logger_1.logger.info('GraphQL API generation completed successfully!');
        return {
            schema,
            typeDefs,
            resolvers,
            serverConfig,
            dataloaders,
            packageJson,
        };
    }
    /**
     * Generate GraphQL subscriptions using WebSocket
     */
    async generateSubscriptionServer() {
        return `import { createServer } from 'http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

const app = express();
const httpServer = createServer(app);

// Create schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// WebSocket server for subscriptions
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

const serverCleanup = useServer(
  {
    schema,
    context: async (ctx) => {
      // Add authentication context
      return {
        user: null, // Extract from connection params
      };
    },
  },
  wsServer
);

// Apollo Server
const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

async function startServer() {
  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({
        user: null, // Extract from headers
      }),
    })
  );

  const PORT = 4000;
  httpServer.listen(PORT, () => {
    console.log(\`🚀 GraphQL Server ready at http://localhost:\${PORT}/graphql\`);
    console.log(\`🔌 Subscriptions ready at ws://localhost:\${PORT}/graphql\`);
  });
}

startServer().catch(console.error);
`;
    }
}
exports.GraphQLGeneratorService = GraphQLGeneratorService;
exports.graphqlGeneratorService = new GraphQLGeneratorService();
//# sourceMappingURL=graphql-generator-service.js.map