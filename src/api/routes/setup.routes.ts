import { Router } from 'express';
import { setupController } from '@/api/controllers/setup-controller';

const router = Router();

/**
 * @swagger
 * /api/setup/status:
 *   get:
 *     summary: Get setup status
 *     description: Check if the system is properly configured
 *     tags: [Setup]
 *     responses:
 *       200:
 *         description: Setup status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     isConfigured:
 *                       type: boolean
 *                     hasAiKey:
 *                       type: boolean
 *                     hasJwtSecret:
 *                       type: boolean
 *                     missingConfigs:
 *                       type: array
 *                       items:
 *                         type: string
 */
router.get('/status', setupController.getStatus.bind(setupController));

/**
 * @swagger
 * /api/setup/complete:
 *   post:
 *     summary: Complete initial setup
 *     description: Configure the system with API keys and settings
 *     tags: [Setup]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               aiProvider:
 *                 type: string
 *                 enum: [anthropic, openai, openrouter]
 *               anthropicApiKey:
 *                 type: string
 *               openaiApiKey:
 *                 type: string
 *               openrouterApiKey:
 *                 type: string
 *               jwtSecret:
 *                 type: string
 *               smtpHost:
 *                 type: string
 *               smtpPort:
 *                 type: string
 *               smtpUser:
 *                 type: string
 *               smtpPass:
 *                 type: string
 *               stripeSecretKey:
 *                 type: string
 *               githubToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Setup completed successfully
 *       400:
 *         description: Invalid input
 */
router.post('/complete', setupController.completeSetup.bind(setupController));

/**
 * @swagger
 * /api/setup/config:
 *   post:
 *     summary: Update configuration
 *     description: Update a specific configuration value
 *     tags: [Setup]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - key
 *               - value
 *             properties:
 *               key:
 *                 type: string
 *               value:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Configuration updated successfully
 */
router.post('/config', setupController.updateConfig.bind(setupController));

/**
 * @swagger
 * /api/setup/config/{category}:
 *   get:
 *     summary: Get configurations by category
 *     description: Retrieve all configurations for a specific category
 *     tags: [Setup]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Configuration category (ai, integration, email, etc.)
 *     responses:
 *       200:
 *         description: Configurations retrieved successfully
 */
router.get('/config/:category', setupController.getConfigsByCategory.bind(setupController));

/**
 * @swagger
 * /api/setup/test-ai:
 *   post:
 *     summary: Test AI connection
 *     description: Test if an AI provider API key is valid
 *     tags: [Setup]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - provider
 *               - apiKey
 *             properties:
 *               provider:
 *                 type: string
 *                 enum: [anthropic, openai, openrouter]
 *               apiKey:
 *                 type: string
 *     responses:
 *       200:
 *         description: Test result
 */
router.post('/test-ai', setupController.testAiConnection.bind(setupController));

export default router;
