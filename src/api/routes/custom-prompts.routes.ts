import { Router } from 'express';
import { customPromptsController } from '../controllers/custom-prompts-controller';

const router = Router();

/**
 * @route GET /api/custom-prompts
 * @desc Get all custom prompts for the user
 * @query agentType - Filter by agent type
 * @query isActive - Filter by active status
 */
router.get('/', (req, res) => customPromptsController.getUserPrompts(req, res));

/**
 * @route POST /api/custom-prompts
 * @desc Create a new custom prompt
 */
router.post('/', (req, res) => customPromptsController.createPrompt(req, res));

/**
 * @route PUT /api/custom-prompts/:id
 * @desc Update a custom prompt
 */
router.put('/:id', (req, res) => customPromptsController.updatePrompt(req, res));

/**
 * @route DELETE /api/custom-prompts/:id
 * @desc Delete a custom prompt
 */
router.delete('/:id', (req, res) => customPromptsController.deletePrompt(req, res));

/**
 * @route POST /api/custom-prompts/:id/activate
 * @desc Activate a custom prompt
 */
router.post('/:id/activate', (req, res) => customPromptsController.activatePrompt(req, res));

export default router;
