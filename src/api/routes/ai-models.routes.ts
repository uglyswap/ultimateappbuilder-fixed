import { Router } from 'express';
import { aiModelsController } from '../controllers/ai-models-controller';

const router = Router();

/**
 * @route GET /api/ai-models
 * @desc Get all available AI models
 * @query search - Search query
 * @query provider - Filter by provider
 * @query minContext - Minimum context window
 */
router.get('/', (req, res) => aiModelsController.getAllModels(req, res));

/**
 * @route GET /api/ai-models/providers
 * @desc Get all AI providers with stats
 */
router.get('/providers', (req, res) => aiModelsController.getProviders(req, res));

/**
 * @route GET /api/ai-models/recommended
 * @desc Get recommended models for a use case
 * @query useCase - Use case (code-generation, chat, analysis, etc.)
 */
router.get('/recommended', (req, res) => aiModelsController.getRecommendedModels(req, res));

export default router;
