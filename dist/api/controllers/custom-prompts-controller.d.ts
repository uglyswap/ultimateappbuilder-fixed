import { Request, Response } from 'express';
/**
 * Custom Prompts Controller
 * Manage user-defined system prompts for AI agents
 */
export declare class CustomPromptsController {
    /**
     * GET /api/custom-prompts
     * Get all custom prompts for the user
     */
    getUserPrompts(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * POST /api/custom-prompts
     * Create a new custom prompt
     */
    createPrompt(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * PUT /api/custom-prompts/:id
     * Update a custom prompt
     */
    updatePrompt(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * DELETE /api/custom-prompts/:id
     * Delete a custom prompt
     */
    deletePrompt(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * POST /api/custom-prompts/:id/activate
     * Activate a custom prompt for use
     */
    activatePrompt(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
export declare const customPromptsController: CustomPromptsController;
//# sourceMappingURL=custom-prompts-controller.d.ts.map