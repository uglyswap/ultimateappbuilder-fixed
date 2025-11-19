"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projects_1 = __importDefault(require("./projects"));
const generations_1 = __importDefault(require("./generations"));
const templates_1 = __importDefault(require("./templates"));
const ai_models_routes_1 = __importDefault(require("./ai-models.routes"));
const custom_prompts_routes_1 = __importDefault(require("./custom-prompts.routes"));
const visual_editor_routes_1 = __importDefault(require("./visual-editor.routes"));
const graphql_generator_routes_1 = __importDefault(require("./graphql-generator.routes"));
const mobile_app_generator_routes_1 = __importDefault(require("./mobile-app-generator.routes"));
const deployment_routes_1 = __importDefault(require("./deployment.routes"));
const testing_routes_1 = __importDefault(require("./testing.routes"));
const simple_generate_routes_1 = __importDefault(require("./simple-generate.routes"));
const router = (0, express_1.Router)();
// API routes
router.use('/projects', projects_1.default);
router.use('/generations', generations_1.default);
router.use('/templates', templates_1.default);
router.use('/ai-models', ai_models_routes_1.default);
router.use('/custom-prompts', custom_prompts_routes_1.default);
router.use('/visual-editor', visual_editor_routes_1.default);
router.use('/graphql', graphql_generator_routes_1.default);
router.use('/mobile', mobile_app_generator_routes_1.default);
router.use('/deployment', deployment_routes_1.default);
router.use('/testing', testing_routes_1.default);
router.use('/generate', simple_generate_routes_1.default);
// API info
router.get('/', (_req, res) => {
    return res.json({
        name: 'Ultimate App Builder API',
        version: '3.0.0',
        description: 'The #1 AI-Powered App Builder in the World 🌍',
        features: {
            autonomousMode: true,
            visualEditor: true,
            dragAndDrop: true,
            aiProviders: ['Anthropic', 'OpenAI', 'OpenRouter', 'Google', 'Meta', 'Mistral', 'DeepSeek', 'Cohere', 'Perplexity', 'Together', 'Groq', 'X.AI'],
            totalModels: '200+',
            templates: 'FREE & Open Source',
            realtime: 'WebSocket Support',
            backgroundJobs: 'BullMQ Integration',
            autoDatabaseSetup: true,
            customPrompts: true,
            graphqlGeneration: true,
            mobileAppGeneration: true,
            microservicesSupport: true,
            pluginSystem: true,
            aiCodeReview: true,
            multiLanguage: true,
            cloudDeployment: true,
            aiPoweredTesting: true,
        },
        endpoints: {
            projects: '/api/projects',
            generations: '/api/generations',
            templates: '/api/templates',
            aiModels: '/api/ai-models',
            customPrompts: '/api/custom-prompts',
            visualEditor: '/api/visual-editor',
            graphql: '/api/graphql',
            mobile: '/api/mobile',
            deployment: '/api/deployment',
            testing: '/api/testing',
        },
        documentation: '/api-docs',
        websocket: 'ws://localhost:3000/ws',
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map