"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateController = void 0;
const template_service_1 = require("../../services/template-service");
class TemplateController {
    templateService;
    constructor() {
        this.templateService = new template_service_1.TemplateService();
    }
    list = async (req, res, next) => {
        try {
            const templates = await this.templateService.list();
            res.json({
                status: 'success',
                data: templates,
            });
        }
        catch (error) {
            next(error);
        }
    };
    get = async (req, res, next) => {
        try {
            const template = await this.templateService.getById(req.params.id);
            res.json({
                status: 'success',
                data: template,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.TemplateController = TemplateController;
//# sourceMappingURL=template-controller.js.map