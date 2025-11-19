"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const graphql_generator_service_1 = require("../../services/graphql-generator-service");
const logger_1 = require("../../utils/logger");
const router = (0, express_1.Router)();
/**
 * POST /api/graphql/generate-schema
 * Generate GraphQL schema from description
 */
router.post('/generate-schema', async (req, res) => {
    try {
        const { projectId, description, features } = req.body;
        if (!projectId || !description) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: projectId, description',
            });
        }
        const schema = await graphql_generator_service_1.graphqlGeneratorService.generateSchemaFromDescription(projectId, description, features || []);
        return res.json({
            success: true,
            schema,
            message: 'GraphQL schema generated successfully! 🚀',
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to generate GraphQL schema', { error });
        return res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to generate GraphQL schema',
        });
    }
});
/**
 * POST /api/graphql/generate-complete-api
 * Generate complete GraphQL API with all files
 */
router.post('/generate-complete-api', async (req, res) => {
    try {
        const { projectId, description, features } = req.body;
        if (!projectId || !description) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: projectId, description',
            });
        }
        const result = await graphql_generator_service_1.graphqlGeneratorService.generateCompleteGraphQLAPI(projectId, description, features || []);
        return res.json({
            success: true,
            ...result,
            message: 'Complete GraphQL API generated! Production-ready code with Apollo Server, DataLoaders, and subscriptions! 🎉',
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to generate complete GraphQL API', { error });
        return res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to generate GraphQL API',
        });
    }
});
/**
 * POST /api/graphql/generate-resolvers
 * Generate resolvers for a schema
 */
router.post('/generate-resolvers', async (req, res) => {
    try {
        const { schema } = req.body;
        if (!schema) {
            return res.status(400).json({
                success: false,
                error: 'Missing required field: schema',
            });
        }
        const resolvers = await graphql_generator_service_1.graphqlGeneratorService.generateResolvers(schema);
        return res.json({
            success: true,
            resolvers,
            message: 'GraphQL resolvers generated! 💪',
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to generate resolvers', { error });
        return res.status(500).json({
            success: false,
            error: 'Failed to generate GraphQL resolvers',
        });
    }
});
/**
 * POST /api/graphql/generate-subscription-server
 * Generate WebSocket subscription server
 */
router.post('/generate-subscription-server', async (req, res) => {
    try {
        const subscriptionServer = await graphql_generator_service_1.graphqlGeneratorService.generateSubscriptionServer();
        return res.json({
            success: true,
            subscriptionServer,
            message: 'GraphQL subscription server generated! Real-time updates ready! ⚡',
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to generate subscription server', { error });
        return res.status(500).json({
            success: false,
            error: 'Failed to generate subscription server',
        });
    }
});
/**
 * GET /api/graphql/examples
 * Get example GraphQL schemas
 */
router.get('/examples', async (req, res) => {
    try {
        const examples = [
            {
                name: 'Blog API',
                description: 'Blog with posts, comments, and users',
                features: ['auth', 'pagination', 'search'],
            },
            {
                name: 'E-commerce API',
                description: 'Products, orders, and payments',
                features: ['auth', 'payments', 'inventory'],
            },
            {
                name: 'Social Network API',
                description: 'Users, posts, likes, and followers',
                features: ['auth', 'subscriptions', 'real-time'],
            },
            {
                name: 'Task Management API',
                description: 'Projects, tasks, and team collaboration',
                features: ['auth', 'teams', 'notifications'],
            },
        ];
        return res.json({
            success: true,
            examples,
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to get GraphQL examples', { error });
        return res.status(500).json({
            success: false,
            error: 'Failed to get examples',
        });
    }
});
exports.default = router;
//# sourceMappingURL=graphql-generator.routes.js.map