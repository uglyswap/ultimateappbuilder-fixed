"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const template_controller_1 = require("../../api/controllers/template-controller");
const router = (0, express_1.Router)();
const templateController = new template_controller_1.TemplateController();
router.get('/', templateController.list);
router.get('/:id', templateController.get);
exports.default = router;
//# sourceMappingURL=templates.js.map