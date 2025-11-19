"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_models_controller_1 = require("../controllers/ai-models-controller");
const router = (0, express_1.Router)();
/**
 * @route GET /api/ai-models
 * @desc Get all available AI models
 * @query search - Search query
 * @query provider - Filter by provider
 * @query minContext - Minimum context window
 */
router.get('/', (req, res) => ai_models_controller_1.aiModelsController.getAllModels(req, res));
/**
 * @route GET /api/ai-models/providers
 * @desc Get all AI providers with stats
 */
router.get('/providers', (req, res) => ai_models_controller_1.aiModelsController.getProviders(req, res));
/**
 * @route GET /api/ai-models/recommended
 * @desc Get recommended models for a use case
 * @query useCase - Use case (code-generation, chat, analysis, etc.)
 */
router.get('/recommended', (req, res) => ai_models_controller_1.aiModelsController.getRecommendedModels(req, res));
exports.default = router;
//# sourceMappingURL=ai-models.routes.js.map