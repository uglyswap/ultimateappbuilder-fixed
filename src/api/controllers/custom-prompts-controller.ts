import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '@/utils/logger';

const prisma = new PrismaClient();

/**
 * Custom Prompts Controller
 * Manage user-defined system prompts for AI agents
 */
export class CustomPromptsController {
  /**
   * GET /api/custom-prompts
   * Get all custom prompts for the user
   */
  async getUserPrompts(req: Request, res: Response) {
    try {
      const userId = 'demo-user'; // TODO: Get from auth
      const { agentType, isActive } = req.query;

      const where: any = { userId };
      if (agentType) where.agentType = agentType;
      if (isActive !== undefined) where.isActive = isActive === 'true';

      const prompts = await prisma.customPrompt.findMany({
        where,
        orderBy: {
          usageCount: 'desc',
        },
      });

      res.json({
        success: true,
        count: prompts.length,
        prompts,
      });
    } catch (error) {
      logger.error('[Custom Prompts] Failed to get prompts', { error });
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve prompts',
      });
    }
  }

  /**
   * POST /api/custom-prompts
   * Create a new custom prompt
   */
  async createPrompt(req: Request, res: Response) {
    try {
      const userId = 'demo-user'; // TODO: Get from auth
      const { name, description, agentType, prompt, tags } = req.body;

      if (!name || !agentType || !prompt) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: name, agentType, prompt',
        });
      }

      const customPrompt = await prisma.customPrompt.create({
        data: {
          userId,
          name,
          description,
          agentType,
          prompt,
          tags: tags || [],
          isActive: true,
        },
      });

      logger.info('[Custom Prompts] Created prompt', { promptId: customPrompt.id, name });

      res.status(201).json({
        success: true,
        prompt: customPrompt,
      });
    } catch (error) {
      logger.error('[Custom Prompts] Failed to create prompt', { error });
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create prompt',
      });
    }
  }

  /**
   * PUT /api/custom-prompts/:id
   * Update a custom prompt
   */
  async updatePrompt(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = 'demo-user'; // TODO: Get from auth
      const { name, description, prompt, tags, isActive } = req.body;

      // Verify ownership
      const existing = await prisma.customPrompt.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          error: 'Custom prompt not found',
        });
      }

      const updated = await prisma.customPrompt.update({
        where: { id },
        data: {
          name,
          description,
          prompt,
          tags,
          isActive,
        },
      });

      logger.info('[Custom Prompts] Updated prompt', { promptId: id });

      res.json({
        success: true,
        prompt: updated,
      });
    } catch (error) {
      logger.error('[Custom Prompts] Failed to update prompt', { error });
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update prompt',
      });
    }
  }

  /**
   * DELETE /api/custom-prompts/:id
   * Delete a custom prompt
   */
  async deletePrompt(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = 'demo-user'; // TODO: Get from auth

      // Verify ownership
      const existing = await prisma.customPrompt.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          error: 'Custom prompt not found',
        });
      }

      await prisma.customPrompt.delete({
        where: { id },
      });

      logger.info('[Custom Prompts] Deleted prompt', { promptId: id });

      res.json({
        success: true,
        message: 'Prompt deleted successfully',
      });
    } catch (error) {
      logger.error('[Custom Prompts] Failed to delete prompt', { error });
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete prompt',
      });
    }
  }

  /**
   * POST /api/custom-prompts/:id/activate
   * Activate a custom prompt for use
   */
  async activatePrompt(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = 'demo-user'; // TODO: Get from auth

      const prompt = await prisma.customPrompt.findFirst({
        where: { id, userId },
      });

      if (!prompt) {
        return res.status(404).json({
          success: false,
          error: 'Custom prompt not found',
        });
      }

      // Deactivate all other prompts of the same agent type
      await prisma.customPrompt.updateMany({
        where: {
          userId,
          agentType: prompt.agentType,
          isActive: true,
        },
        data: {
          isActive: false,
        },
      });

      // Activate this prompt
      const updated = await prisma.customPrompt.update({
        where: { id },
        data: {
          isActive: true,
          usageCount: {
            increment: 1,
          },
        },
      });

      logger.info('[Custom Prompts] Activated prompt', { promptId: id, agentType: prompt.agentType });

      res.json({
        success: true,
        prompt: updated,
      });
    } catch (error) {
      logger.error('[Custom Prompts] Failed to activate prompt', { error });
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to activate prompt',
      });
    }
  }
}

export const customPromptsController = new CustomPromptsController();
