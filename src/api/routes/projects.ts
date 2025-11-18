import { Router } from 'express';
import { ProjectController } from '@/api/controllers/project-controller';
import { validate } from '@/api/middleware/validate';
import { createProjectSchema } from '@/api/schemas/project-schemas';

const router = Router();
const projectController = new ProjectController();

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
router.post('/', validate(createProjectSchema), projectController.create);

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

export default router;
