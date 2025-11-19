"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const custom_prompts_controller_1 = require("../controllers/custom-prompts-controller");
const router = (0, express_1.Router)();
/**
 * @route GET /api/custom-prompts
 * @desc Get all custom prompts for the user
 * @query agentType - Filter by agent type
 * @query isActive - Filter by active status
 */
router.get('/', (req, res) => custom_prompts_controller_1.customPromptsController.getUserPrompts(req, res));
/**
 * @route POST /api/custom-prompts
 * @desc Create a new custom prompt
 */
router.post('/', (req, res) => custom_prompts_controller_1.customPromptsController.createPrompt(req, res));
/**
 * @route PUT /api/custom-prompts/:id
 * @desc Update a custom prompt
 */
router.put('/:id', (req, res) => custom_prompts_controller_1.customPromptsController.updatePrompt(req, res));
/**
 * @route DELETE /api/custom-prompts/:id
 * @desc Delete a custom prompt
 */
router.delete('/:id', (req, res) => custom_prompts_controller_1.customPromptsController.deletePrompt(req, res));
/**
 * @route POST /api/custom-prompts/:id/activate
 * @desc Activate a custom prompt
 */
router.post('/:id/activate', (req, res) => custom_prompts_controller_1.customPromptsController.activatePrompt(req, res));
exports.default = router;
//# sourceMappingURL=custom-prompts.routes.js.map