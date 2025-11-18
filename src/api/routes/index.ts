import { Router } from 'express';
import projectsRouter from './projects';
import generationsRouter from './generations';
import templatesRouter from './templates';
import aiModelsRouter from './ai-models.routes';
import customPromptsRouter from './custom-prompts.routes';

const router = Router();

// API routes
router.use('/projects', projectsRouter);
router.use('/generations', generationsRouter);
router.use('/templates', templatesRouter);
router.use('/ai-models', aiModelsRouter);
router.use('/custom-prompts', customPromptsRouter);

// API info
router.get('/', (req, res) => {
  res.json({
    name: 'Ultimate App Builder API',
    version: '2.0.0',
    description: 'The #1 AI-Powered App Builder in the World 🌍',
    features: {
      autonomousMode: true,
      aiProviders: ['Anthropic', 'OpenAI', 'OpenRouter', 'Google', 'Meta', 'Mistral', 'DeepSeek', 'Cohere'],
      totalModels: '200+',
      templates: 'FREE & Open Source',
      realtime: 'WebSocket Support',
      backgroundJobs: 'BullMQ Integration',
      autoDatabaseSetup: true,
      customPrompts: true,
    },
    endpoints: {
      projects: '/api/projects',
      generations: '/api/generations',
      templates: '/api/templates',
      aiModels: '/api/ai-models',
      customPrompts: '/api/custom-prompts',
    },
    documentation: '/api-docs',
    websocket: 'ws://localhost:3000/ws',
  });
});

export default router;
