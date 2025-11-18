import { Router, Request, Response } from 'express';
import { cloudDeploymentService } from '@/services/cloud-deployment-service';
import { logger } from '@/utils/logger';

const router = Router();

/**
 * POST /api/deployment/deploy
 * Deploy project to cloud platform
 */
router.post('/deploy', async (req: Request, res: Response) => {
  try {
    const config = req.body;

    if (!config.projectId || !config.platform) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: projectId, platform',
      });
    }

    const result = await cloudDeploymentService.deploy(config);

    if (result.success) {
      res.json({
        success: true,
        ...result,
        message: `🚀 Deployed to ${config.platform} successfully!`,
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    logger.error('Deployment failed', { error });
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Deployment failed',
    });
  }
});

/**
 * GET /api/deployment/status/:deploymentId
 * Get deployment status
 */
router.get('/status/:deploymentId', async (req: Request, res: Response) => {
  try {
    const { deploymentId } = req.params;
    const status = await cloudDeploymentService.getDeploymentStatus(deploymentId);

    res.json({
      success: true,
      ...status,
    });
  } catch (error) {
    logger.error('Failed to get deployment status', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to get deployment status',
    });
  }
});

/**
 * GET /api/deployment/logs/:deploymentId
 * Get deployment logs
 */
router.get('/logs/:deploymentId', async (req: Request, res: Response) => {
  try {
    const { deploymentId } = req.params;
    const logs = await cloudDeploymentService.getLogs(deploymentId);

    res.json({
      success: true,
      logs,
    });
  } catch (error) {
    logger.error('Failed to get deployment logs', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to get deployment logs',
    });
  }
});

/**
 * POST /api/deployment/rollback/:deploymentId
 * Rollback deployment
 */
router.post('/rollback/:deploymentId', async (req: Request, res: Response) => {
  try {
    const { deploymentId } = req.params;
    const result = await cloudDeploymentService.rollback(deploymentId);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    logger.error('Failed to rollback deployment', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to rollback deployment',
    });
  }
});

/**
 * POST /api/deployment/docker-config
 * Generate Docker configuration
 */
router.post('/docker-config', async (req: Request, res: Response) => {
  try {
    const { projectType } = req.body;

    if (!projectType || !['node', 'python', 'go'].includes(projectType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid projectType. Must be: node, python, or go',
      });
    }

    const dockerfile = cloudDeploymentService.generateDockerConfig(projectType);

    res.json({
      success: true,
      dockerfile,
      message: 'Dockerfile generated! 🐳',
    });
  } catch (error) {
    logger.error('Failed to generate Docker config', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to generate Docker configuration',
    });
  }
});

/**
 * POST /api/deployment/cicd-config
 * Generate CI/CD configuration
 */
router.post('/cicd-config', async (req: Request, res: Response) => {
  try {
    const { platform } = req.body;

    if (!platform || !['github', 'gitlab', 'circleci'].includes(platform)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid platform. Must be: github, gitlab, or circleci',
      });
    }

    const config = await cloudDeploymentService.generateCICD(platform);

    res.json({
      success: true,
      config,
      message: `CI/CD configuration for ${platform} generated! 🔄`,
    });
  } catch (error) {
    logger.error('Failed to generate CI/CD config', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to generate CI/CD configuration',
    });
  }
});

/**
 * GET /api/deployment/platforms
 * Get supported platforms
 */
router.get('/platforms', async (req: Request, res: Response) => {
  try {
    const platforms = [
      {
        id: 'vercel',
        name: 'Vercel',
        description: 'Serverless platform for frontend frameworks',
        features: ['Edge Functions', 'Serverless', 'CDN', 'Analytics'],
        pricing: 'Free tier available',
      },
      {
        id: 'netlify',
        name: 'Netlify',
        description: 'JAMstack platform with edge functions',
        features: ['Edge Functions', 'Forms', 'Identity', 'Analytics'],
        pricing: 'Free tier available',
      },
      {
        id: 'aws',
        name: 'AWS',
        description: 'Amazon Web Services cloud platform',
        features: ['Lambda', 'EC2', 'S3', 'RDS', 'CloudFront'],
        pricing: 'Pay as you go',
      },
      {
        id: 'railway',
        name: 'Railway',
        description: 'Modern infrastructure platform',
        features: ['Containers', 'Databases', 'Cron Jobs', 'Private Networks'],
        pricing: 'Free tier available',
      },
      {
        id: 'render',
        name: 'Render',
        description: 'Cloud platform for modern apps',
        features: ['Web Services', 'Static Sites', 'Databases', 'Cron Jobs'],
        pricing: 'Free tier available',
      },
      {
        id: 'heroku',
        name: 'Heroku',
        description: 'Platform as a Service (PaaS)',
        features: ['Dynos', 'Add-ons', 'Pipelines', 'Metrics'],
        pricing: 'Free tier available',
      },
      {
        id: 'digitalocean',
        name: 'DigitalOcean',
        description: 'Cloud infrastructure provider',
        features: ['App Platform', 'Droplets', 'Databases', 'Spaces'],
        pricing: 'Starting at $5/month',
      },
      {
        id: 'gcp',
        name: 'Google Cloud Platform',
        description: 'Google cloud services',
        features: ['Cloud Run', 'App Engine', 'Cloud Functions', 'Firebase'],
        pricing: 'Free tier available',
      },
    ];

    res.json({
      success: true,
      platforms,
    });
  } catch (error) {
    logger.error('Failed to get platforms', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to get platforms',
    });
  }
});

export default router;
