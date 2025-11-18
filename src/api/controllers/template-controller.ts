import { Request, Response, NextFunction } from 'express';
import { TemplateService } from '@/services/template-service';

export class TemplateController {
  private templateService: TemplateService;

  constructor() {
    this.templateService = new TemplateService();
  }

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const templates = await this.templateService.list();

      res.json({
        status: 'success',
        data: templates,
      });
    } catch (error) {
      next(error);
    }
  };

  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const template = await this.templateService.getById(req.params.id);

      res.json({
        status: 'success',
        data: template,
      });
    } catch (error) {
      next(error);
    }
  };
}
