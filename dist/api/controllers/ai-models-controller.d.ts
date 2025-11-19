import { Request, Response } from 'express';
/**
 * AI Models Controller
 * Browse and search through 200+ AI models
 */
export declare class AIModelsController {
    /**
     * GET /api/ai-models
     * Get all available AI models with optional search
     */
    getAllModels(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/ai-models/providers
     * Get list of all AI providers
     */
    getProviders(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/ai-models/recommended
     * Get recommended models based on use case
     */
    getRecommendedModels(req: Request, res: Response): Promise<void>;
}
export declare const aiModelsController: AIModelsController;
//# sourceMappingURL=ai-models-controller.d.ts.map