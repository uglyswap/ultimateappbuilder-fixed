import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '@/services/project-service';
import { AppError } from '@/api/middleware/error-handler';
import { logger } from '@/utils/logger';

export class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = 'demo-user'; // TODO: Get from auth
      const project = await this.projectService.create(userId, req.body);

      logger.info('Project created', { projectId: project.id });

      res.status(201).json({
        status: 'success',
        data: project,
      });
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = 'demo-user'; // TODO: Get from auth
      const projects = await this.projectService.list(userId);

      res.json({
        status: 'success',
        data: projects,
      });
    } catch (error) {
      next(error);
    }
  };

  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const project = await this.projectService.getById(req.params.id);

      if (!project) {
        throw new AppError(404, 'Project not found');
      }

      res.json({
        status: 'success',
        data: project,
      });
    } catch (error) {
      next(error);
    }
  };

  generate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = 'demo-user'; // TODO: Get from auth

      // Start generation asynchronously
      this.projectService.generateCode(req.params.id, userId).catch(err => {
        logger.error('Code generation failed', { projectId: req.params.id, error: err });
      });

      res.json({
        status: 'success',
        message: 'Code generation started',
        projectId: req.params.id,
      });
    } catch (error) {
      next(error);
    }
  };

  download = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const zipPath = await this.projectService.downloadProject(req.params.id);

      res.download(zipPath, `project-${req.params.id}.zip`, (err) => {
        if (err) {
          logger.error('Download failed', { error: err });
        }
      });
    } catch (error) {
      next(error);
    }
  };
}
