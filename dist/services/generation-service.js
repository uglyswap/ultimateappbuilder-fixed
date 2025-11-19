"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerationService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class GenerationService {
    async list(userId) {
        return prisma.generation.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: {
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }
    async getById(id) {
        return prisma.generation.findUnique({
            where: { id },
            include: {
                project: true,
            },
        });
    }
}
exports.GenerationService = GenerationService;
//# sourceMappingURL=generation-service.js.map