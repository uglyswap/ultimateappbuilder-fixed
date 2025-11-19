"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_controller_1 = require("../../api/controllers/project-controller");
const validate_1 = require("../../api/middleware/validate");
const project_schemas_1 = require("../../api/schemas/project-schemas");
const router = (0, express_1.Router)();
const projectController = new project_controller_1.ProjectController();
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