import { Router } from 'express';
import projectsRouter from './projects';
import generationsRouter from './generations';
import templatesRouter from './templates';

const router = Router();

// API routes
router.use('/projects', projectsRouter);
router.use('/generations', generationsRouter);
router.use('/templates', templatesRouter);

// API info
router.get('/', (req, res) => {
  res.json({
    name: 'Ultimate App Builder API',
    version: '1.0.0',
    endpoints: {
      projects: '/api/projects',
      generations: '/api/generations',
      templates: '/api/templates',
    },
  });
});

export default router;
