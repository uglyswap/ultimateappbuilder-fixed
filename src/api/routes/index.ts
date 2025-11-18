import { Router } from 'express';
import projectsRouter from './projects';
import generationsRouter from './generations';
import templatesRouter from './templates';
import aiModelsRouter from './ai-models.routes';
import customPromptsRouter from './custom-prompts.routes';
import visualEditorRouter from './visual-editor.routes';
import graphqlGeneratorRouter from './graphql-generator.routes';
import mobileAppGeneratorRouter from './mobile-app-generator.routes';
import deploymentRouter from './deployment.routes';
import testingRouter from './testing.routes';

const router = Router();

// API routes
router.use('/projects', projectsRouter);
router.use('/generations', generationsRouter);
router.use('/templates', templatesRouter);
router.use('/ai-models', aiModelsRouter);
router.use('/custom-prompts', customPromptsRouter);
router.use('/visual-editor', visualEditorRouter);
router.use('/graphql', graphqlGeneratorRouter);
router.use('/mobile', mobileAppGeneratorRouter);
router.use('/deployment', deploymentRouter);
router.use('/testing', testingRouter);

// API info
router.get('/', (req, res) => {
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

export default router;
