"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProjectSchema = void 0;
const zod_1 = require("zod");
exports.createProjectSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().max(500).optional(),
    template: zod_1.z.enum(['SAAS', 'ECOMMERCE', 'BLOG', 'API', 'CUSTOM']),
    features: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        name: zod_1.z.string(),
        enabled: zod_1.z.boolean(),
        config: zod_1.z.record(zod_1.z.unknown()).optional(),
    })),
    database: zod_1.z.object({
        type: zod_1.z.enum(['postgresql', 'mysql', 'mongodb', 'sqlite']),
        host: zod_1.z.string().optional(),
        port: zod_1.z.number().optional(),
        database: zod_1.z.string(),
    }).optional(),
    auth: zod_1.z.object({
        providers: zod_1.z.array(zod_1.z.enum(['email', 'google', 'github', 'facebook'])),
        enableMFA: zod_1.z.boolean().optional(),
    }).optional(),
    integrations: zod_1.z.array(zod_1.z.object({
        type: zod_1.z.enum(['stripe', 'sendgrid', 'aws', 'github', 'slack', 'custom']),
        credentials: zod_1.z.record(zod_1.z.string()),
    })).optional(),
    deployment: zod_1.z.object({
        provider: zod_1.z.enum(['vercel', 'netlify', 'aws', 'docker', 'custom']),
        region: zod_1.z.string().optional(),
        environment: zod_1.z.enum(['development', 'staging', 'production']),
    }).optional(),
});
//# sourceMappingURL=project-schemas.js.map