"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const generation_controller_1 = require("../../api/controllers/generation-controller");
const router = (0, express_1.Router)();
const generationController = new generation_controller_1.GenerationController();
router.get('/', generationController.list);
router.get('/:id', generationController.get);
exports.default = router;
//# sourceMappingURL=generations.js.map