"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const project_service_1 = require("../../services/project-service");
const error_handler_1 = require("../../api/middleware/error-handler");
const logger_1 = require("../../utils/logger");
class ProjectController {
    projectService;
    constructor() {
        this.projectService = new project_service_1.ProjectService();
    }
    create = async (req, res, next) => {
        try {
            const userId = 'demo-user'; // TODO: Get from auth
            const project = await this.projectService.create(userId, req.body);
            logger_1.logger.info('Project created', { projectId: project.id });
            res.status(201).json({
                status: 'success',
                data: project,
            });
        }
        catch (error) {
            next(error);
        }
    };
    list = async (req, res, next) => {
        try {
            const userId = 'demo-user'; // TODO: Get from auth
            const projects = await this.projectService.list(userId);
            res.json({
                status: 'success',
                data: projects,
            });
        }
        catch (error) {
            next(error);
        }
    };
    get = async (req, res, next) => {
        try {
            const project = await this.projectService.getById(req.params.id);
            if (!project) {
                throw new error_handler_1.AppError(404, 'Project not found');
            }
            res.json({
                status: 'success',
                data: project,
            });
        }
        catch (error) {
            next(error);
        }
    };
    generate = async (req, res, next) => {
        try {
            const userId = 'demo-user'; // TODO: Get from auth
            // Start generation asynchronously
            this.projectService.generateCode(req.params.id, userId).catch(err => {
                logger_1.logger.error('Code generation failed', { projectId: req.params.id, error: err });
            });
            res.json({
                status: 'success',
                message: 'Code generation started',
                projectId: req.params.id,
            });
        }
        catch (error) {
            next(error);
        }
    };
    download = async (req, res, next) => {
        try {
            const zipPath = await this.projectService.downloadProject(req.params.id);
            res.download(zipPath, `project-${req.params.id}.zip`, (err) => {
                if (err) {
                    logger_1.logger.error('Download failed', { error: err });
                }
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.ProjectController = ProjectController;
//# sourceMappingURL=project-controller.js.map