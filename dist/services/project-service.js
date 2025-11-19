"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const client_1 = require("@prisma/client");
const orchestrator_1 = require("../orchestrator");
const logger_1 = require("../utils/logger");
const archiver_1 = __importDefault(require("archiver"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const prisma = new client_1.PrismaClient();
class ProjectService {
    async create(userId, config) {
        logger_1.logger.info('Creating project', { userId, config });
        const project = await prisma.project.create({
            data: {
                name: config.name,
                description: config.description,
                template: config.template,
                config: config,
                features: config.features.map(f => f.id),
                userId,
                status: 'DRAFT',
            },
        });
        return project;
    }
    async list(userId) {
        return prisma.project.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getById(id) {
        return prisma.project.findUnique({
            where: { id },
            include: {
                generations: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
            },
        });
    }
    async generateCode(projectId, userId) {
        logger_1.logger.info('Starting code generation', { projectId });
        // Update project status
        await prisma.project.update({
            where: { id: projectId },
            data: { status: 'GENERATING' },
        });
        try {
            // Get project config
            const project = await prisma.project.findUnique({
                where: { id: projectId },
            });
            if (!project) {
                throw new Error('Project not found');
            }
            // Create orchestrator
            const orchestrator = new orchestrator_1.Orchestrator(projectId, userId, project.config);
            // Generate project
            const generatedProject = await orchestrator.orchestrate();
            // Save generated files
            const outputDir = path_1.default.join(process.cwd(), 'generated', projectId);
            await this.saveGeneratedFiles(outputDir, generatedProject.structure);
            // Update project
            await prisma.project.update({
                where: { id: projectId },
                data: {
                    status: 'READY',
                    generatedPath: outputDir,
                },
            });
            logger_1.logger.info('Code generation completed', { projectId, outputDir });
            return generatedProject;
        }
        catch (error) {
            logger_1.logger.error('Code generation failed', { projectId, error });
            await prisma.project.update({
                where: { id: projectId },
                data: { status: 'ERROR' },
            });
            throw error;
        }
    }
    async downloadProject(projectId) {
        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });
        if (!project || !project.generatedPath) {
            throw new Error('Project not ready for download');
        }
        // Create ZIP
        const zipPath = path_1.default.join(process.cwd(), 'temp', `${projectId}.zip`);
        await promises_1.default.mkdir(path_1.default.dirname(zipPath), { recursive: true });
        const output = require('fs').createWriteStream(zipPath);
        const archive = (0, archiver_1.default)('zip', { zlib: { level: 9 } });
        return new Promise((resolve, reject) => {
            output.on('close', () => resolve(zipPath));
            archive.on('error', reject);
            archive.pipe(output);
            archive.directory(project.generatedPath, false);
            archive.finalize();
        });
    }
    async saveGeneratedFiles(outputDir, files) {
        await promises_1.default.mkdir(outputDir, { recursive: true });
        for (const file of files) {
            const filePath = path_1.default.join(outputDir, file.path);
            await promises_1.default.mkdir(path_1.default.dirname(filePath), { recursive: true });
            await promises_1.default.writeFile(filePath, file.content, 'utf-8');
        }
        logger_1.logger.info('Generated files saved', { outputDir, count: files.length });
    }
}
exports.ProjectService = ProjectService;
//# sourceMappingURL=project-service.js.map