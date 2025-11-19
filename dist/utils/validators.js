"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlSchema = exports.passwordSchema = exports.emailSchema = exports.projectConfigSchema = void 0;
exports.validateProjectConfig = validateProjectConfig;
exports.validateEmail = validateEmail;
exports.validatePassword = validatePassword;
exports.validateApiKey = validateApiKey;
exports.validateUrl = validateUrl;
const zod_1 = require("zod");
// Project Configuration Schema
exports.projectConfigSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100).regex(/^[a-z0-9-]+$/i, 'Project name must be alphanumeric with hyphens'),
    description: zod_1.z.string().min(10).max(500).optional(),
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
        schema: zod_1.z.string().optional(),
    }).optional(),
    auth: zod_1.z.object({
        providers: zod_1.z.array(zod_1.z.enum(['email', 'google', 'github', 'facebook'])),
        jwtSecret: zod_1.z.string().optional(),
        sessionDuration: zod_1.z.string().optional(),
        enableMFA: zod_1.z.boolean().optional(),
    }).optional(),
    integrations: zod_1.z.array(zod_1.z.object({
        type: zod_1.z.enum(['stripe', 'sendgrid', 'aws', 'github', 'slack', 'custom']),
        credentials: zod_1.z.record(zod_1.z.string()),
        config: zod_1.z.record(zod_1.z.unknown()).optional(),
    })).optional(),
    deployment: zod_1.z.object({
        provider: zod_1.z.enum(['vercel', 'netlify', 'aws', 'docker', 'custom']),
        region: zod_1.z.string().optional(),
        environment: zod_1.z.enum(['development', 'staging', 'production']),
        customDomain: zod_1.z.string().optional(),
    }).optional(),
});
function validateProjectConfig(config) {
    try {
        exports.projectConfigSchema.parse(config);
        return { valid: true };
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return {
                valid: false,
                errors: error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message,
                    code: err.code,
                })),
            };
        }
        return {
            valid: false,
            errors: [{
                    field: 'unknown',
                    message: 'Unknown validation error',
                    code: 'UNKNOWN_ERROR',
                }],
        };
    }
}
// Email validation
exports.emailSchema = zod_1.z.string().email();
function validateEmail(email) {
    return exports.emailSchema.safeParse(email).success;
}
// Password validation
exports.passwordSchema = zod_1.z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');
function validatePassword(password) {
    const result = exports.passwordSchema.safeParse(password);
    if (result.success) {
        return { valid: true };
    }
    return {
        valid: false,
        errors: result.error.errors.map(err => ({
            field: 'password',
            message: err.message,
            code: err.code,
        })),
    };
}
// API Key validation
function validateApiKey(key) {
    return /^[a-zA-Z0-9_-]{32,}$/.test(key);
}
// URL validation
exports.urlSchema = zod_1.z.string().url();
function validateUrl(url) {
    return exports.urlSchema.safeParse(url).success;
}
//# sourceMappingURL=validators.js.map