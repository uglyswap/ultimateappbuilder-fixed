import { Request, Response, NextFunction } from 'express';
import { GenerationService } from '@/services/generation-service';

export class GenerationController {
  private generationService: GenerationService;

  constructor() {
    this.generationService = new GenerationService();
  }

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = 'demo-user'; // TODO: Get from auth
      const generations = await this.generationService.list(userId);

      res.json({
        status: 'success',
        data: generations,
      });
    } catch (error) {
      next(error);
    }
  };

  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const generation = await this.generationService.getById(req.params.id);

      res.json({
        status: 'success',
        data: generation,
      });
    } catch (error) {
      next(error);
    }
  };
}
