"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_controller_1 = require("../../api/controllers/project-controller");
const validate_1 = require("../../api/middleware/validate");
const project_schemas_1 = require("../../api/schemas/project-schemas");
const archiver_1 = __importDefault(require("archiver"));
const logger_1 = require("../../utils/logger");
const router = (0, express_1.Router)();
const projectController = new project_controller_1.ProjectController();
/**
 * @swagger
 * /api/projects/download:
 *   post:
 *     summary: Download files as ZIP archive
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     path:
 *                       type: string
 *                     content:
 *                       type: string
 *               projectName:
 *                 type: string
 *     responses:
 *       200:
 *         description: ZIP file download
 */
router.post('/download', async (req, res) => {
    try {
        const { files, projectName = 'generated-project' } = req.body;
        if (!files || !Array.isArray(files) || files.length === 0) {
            res.status(400).json({
                status: 'error',
                message: 'Files array is required',
            });
            return;
        }
        logger_1.logger.info('Creating ZIP download', { projectName, fileCount: files.length });
        // Set response headers for ZIP download
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${projectName}.zip"`);
        // Create archive and pipe directly to response
        const archive = (0, archiver_1.default)('zip', { zlib: { level: 9 } });
        archive.on('error', (err) => {
            logger_1.logger.error('Archive error', { error: err });
            throw err;
        });
        archive.pipe(res);
        // Add each file to the archive
        for (const file of files) {
            if (file.path && file.content) {
                archive.append(file.content, { name: file.path });
            }
        }
        await archive.finalize();
        logger_1.logger.info('ZIP download completed', { projectName, fileCount: files.length });
    }
    catch (error) {
        logger_1.logger.error('ZIP download failed', { error });
        if (!res.headersSent) {
            res.status(500).json({
                status: 'error',
                message: error instanceof Error ? error.message : 'Failed to create ZIP download',
            });
        }
    }
});
/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProject'
 *     responses:
 *       201:
 *         description: Project created successfully
 */
router.post('/', (0, validate_1.validate)(project_schemas_1.createProjectSchema), projectController.create);
/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: List all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of projects
 */
router.get('/', projectController.list);
/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project details
 */
router.get('/:id', projectController.get);
/**
 * @swagger
 * /api/projects/{id}/generate:
 *   post:
 *     summary: Generate project code
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Code generation started
 */
router.post('/:id/generate', projectController.generate);
/**
 * @swagger
 * /api/projects/{id}/download:
 *   get:
 *     summary: Download generated project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ZIP file download
 */
router.get('/:id/download', projectController.download);
exports.default = router;
//# sourceMappingURL=projects.js.map