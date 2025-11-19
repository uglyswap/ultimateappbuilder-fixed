"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class TemplateService {
    async list() {
        return prisma.template.findMany({
            orderBy: { downloads: 'desc' },
        });
    }
    async getById(id) {
        return prisma.template.findUnique({
            where: { id },
        });
    }
    async getByCategory(category) {
        return prisma.template.findMany({
            where: { category },
        });
    }
    // Predefined templates
    getBuiltInTemplates() {
        return [
            {
                id: 'saas-starter',
                name: 'SaaS Starter',
                description: 'Complete SaaS application with authentication, subscriptions, and admin panel',
                category: 'SAAS',
                version: '1.0.0',
                structure: {
                    directories: [
                        'backend/src',
                        'frontend/src',
                        'docs',
                    ],
                    files: [],
                },
                dependencies: {
                    'express': '^4.19.2',
                    'react': '^18.3.1',
                    '@prisma/client': '^5.20.0',
                    'stripe': '^16.12.0',
                },
                devDependencies: {
                    'typescript': '^5.6.2',
                    'vite': '^5.4.7',
                },
                scripts: {
                    'dev': 'npm run dev:backend & npm run dev:frontend',
                    'build': 'npm run build:backend && npm run build:frontend',
                },
            },
            {
                id: 'ecommerce-platform',
                name: 'E-Commerce Platform',
                description: 'Full-featured online store with products, cart, checkout, and admin',
                category: 'ECOMMERCE',
                version: '1.0.0',
                structure: {
                    directories: [
                        'backend/src',
                        'frontend/src',
                        'docs',
                    ],
                    files: [],
                },
                dependencies: {
                    'express': '^4.19.2',
                    'react': '^18.3.1',
                    '@prisma/client': '^5.20.0',
                    'stripe': '^16.12.0',
                },
            },
            {
                id: 'blog-cms',
                name: 'Blog CMS',
                description: 'Modern blog with markdown support, SEO optimization, and admin panel',
                category: 'BLOG',
                version: '1.0.0',
                structure: {
                    directories: [
                        'backend/src',
                        'frontend/src',
                        'docs',
                    ],
                    files: [],
                },
                dependencies: {
                    'express': '^4.19.2',
                    'react': '^18.3.1',
                    '@prisma/client': '^5.20.0',
                },
            },
            {
                id: 'rest-api',
                name: 'REST API',
                description: 'Production-ready REST API with authentication, validation, and documentation',
                category: 'API',
                version: '1.0.0',
                structure: {
                    directories: [
                        'src',
                        'docs',
                    ],
                    files: [],
                },
                dependencies: {
                    'express': '^4.19.2',
                    '@prisma/client': '^5.20.0',
                },
            },
        ];
    }
}
exports.TemplateService = TemplateService;
//# sourceMappingURL=template-service.js.map