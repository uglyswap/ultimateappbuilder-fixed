"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerationController = void 0;
const generation_service_1 = require("../../services/generation-service");
class GenerationController {
    generationService;
    constructor() {
        this.generationService = new generation_service_1.GenerationService();
    }
    list = async (req, res, next) => {
        try {
            const userId = 'demo-user'; // TODO: Get from auth
            const generations = await this.generationService.list(userId);
            res.json({
                status: 'success',
                data: generations,
            });
        }
        catch (error) {
            next(error);
        }
    };
    get = async (req, res, next) => {
        try {
            const generation = await this.generationService.getById(req.params.id);
            res.json({
                status: 'success',
                data: generation,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.GenerationController = GenerationController;
//# sourceMappingURL=generation-controller.js.map