/**
 * GraphQL API Generator Service
 *
 * Generates production-ready GraphQL APIs with:
 * - Type-safe schemas (using GraphQL SDL)
 * - Resolvers with business logic
 * - Apollo Server integration
 * - Authentication & authorization
 * - DataLoader for N+1 query prevention
 * - Subscriptions for real-time updates
 * - Error handling & validation
 */
export interface GraphQLSchema {
    types: GraphQLType[];
    queries: GraphQLQuery[];
    mutations: GraphQLMutation[];
    subscriptions: GraphQLSubscription[];
}
export interface GraphQLType {
    name: string;
    fields: GraphQLField[];
    description?: string;
}
export interface GraphQLField {
    name: string;
    type: string;
    nullable?: boolean;
    list?: boolean;
    description?: string;
}
export interface GraphQLQuery {
    name: string;
    returnType: string;
    args?: GraphQLArgument[];
    description?: string;
    requiresAuth?: boolean;
}
export interface GraphQLMutation {
    name: string;
    returnType: string;
    args?: GraphQLArgument[];
    description?: string;
    requiresAuth?: boolean;
}
export interface GraphQLSubscription {
    name: string;
    returnType: string;
    args?: GraphQLArgument[];
    description?: string;
    requiresAuth?: boolean;
}
export interface GraphQLArgument {
    name: string;
    type: string;
    required?: boolean;
    description?: string;
}
export declare class GraphQLGeneratorService {
    /**
     * Generate GraphQL schema from description
     */
    generateSchemaFromDescription(projectId: string, description: string, features: string[]): Promise<GraphQLSchema>;
    /**
     * Generate GraphQL type definitions (SDL)
     */
    generateTypeDefinitions(schema: GraphQLSchema): string;
    private generateTypeDefinition;
    private generateQueryDefinitions;
    private generateMutationDefinitions;
    private generateSubscriptionDefinitions;
    /**
     * Generate resolvers using AI
     */
    generateResolvers(schema: GraphQLSchema): Promise<string>;
    /**
     * Generate Apollo Server configuration
     */
    generateApolloServerConfig(projectName: string): Promise<string>;
    /**
     * Generate DataLoaders for N+1 prevention
     */
    generateDataLoaders(schema: GraphQLSchema): Promise<string>;
    /**
     * Generate complete GraphQL API package
     */
    generateCompleteGraphQLAPI(projectId: string, description: string, features: string[]): Promise<{
        schema: GraphQLSchema;
        typeDefs: string;
        resolvers: string;
        serverConfig: string;
        dataloaders: string;
        packageJson: string;
    }>;
    /**
     * Generate GraphQL subscriptions using WebSocket
     */
    generateSubscriptionServer(): Promise<string>;
}
export declare const graphqlGeneratorService: GraphQLGeneratorService;
//# sourceMappingURL=graphql-generator-service.d.ts.map