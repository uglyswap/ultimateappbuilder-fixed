"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonSchemas = void 0;
exports.validateRequest = validateRequest;
exports.sanitizeString = sanitizeString;
exports.sanitizeRequest = sanitizeRequest;
const zod_1 = require("zod");
const logger_1 = require("../../utils/logger");
/**
 * Middleware to validate request body, query, and params
 */
function validateRequest(schemas) {
    return async (req, res, next) => {
        try {
            if (schemas.body) {
                req.body = schemas.body.parse(req.body);
            }
            if (schemas.query) {
                req.query = schemas.query.parse(req.query);
            }
            if (schemas.params) {
                req.params = schemas.params.parse(req.params);
            }
            next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                const formattedErrors = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                logger_1.logger.warn('Request validation failed', {
                    path: req.path,
                    errors: formattedErrors,
                });
                res.status(400).json({
                    status: 'error',
                    message: 'Validation failed',
                    errors: formattedErrors,
                });
                return;
            }
            next(error);
        }
    };
}
/**
 * Common validation schemas
 */
exports.commonSchemas = {
    // Pagination
    pagination: zod_1.z.object({
        page: zod_1.z.coerce.number().min(1).default(1),
        pageSize: zod_1.z.coerce.number().min(1).max(100).default(20),
    }),
    // ID parameter
    idParam: zod_1.z.object({
        id: zod_1.z.string().min(1),
    }),
    // Project creation
    createProject: zod_1.z.object({
        name: zod_1.z.string().min(1).max(100),
        description: zod_1.z.string().max(500).optional(),
        template: zod_1.z.enum(['SAAS', 'ECOMMERCE', 'BLOG', 'API', 'CUSTOM']),
        features: zod_1.z.array(zod_1.z.object({
            name: zod_1.z.string(),
            enabled: zod_1.z.boolean(),
            config: zod_1.z.record(zod_1.z.unknown()).optional(),
        })).default([]),
    }),
    // Code generation
    generateCode: zod_1.z.object({
        prompt: zod_1.z.string().min(1).max(10000),
        model: zod_1.z.string().min(1),
        apiKey: zod_1.z.string().min(1),
        provider: zod_1.z.enum(['anthropic', 'openai', 'openrouter']),
        conversationId: zod_1.z.string().optional(),
        messages: zod_1.z.array(zod_1.z.object({
            role: zod_1.z.enum(['user', 'assistant']),
            content: zod_1.z.string(),
        })).optional(),
    }),
    // GitHub repo
    githubRepo: zod_1.z.object({
        repoUrl: zod_1.z.string().url().refine(url => url.includes('github.com'), {
            message: 'Must be a GitHub URL',
        }),
        token: zod_1.z.string().optional(),
        branch: zod_1.z.string().optional(),
    }),
    // Deployment
    deployment: zod_1.z.object({
        projectId: zod_1.z.string().min(1),
        platform: zod_1.z.enum(['vercel', 'netlify', 'railway', 'aws', 'docker', 'github']),
        config: zod_1.z.record(zod_1.z.unknown()).optional(),
    }),
};
/**
 * Sanitize string to prevent XSS
 */
function sanitizeString(str) {
    return str
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}
/**
 * Middleware to sanitize request body strings
 */
function sanitizeRequest(req, _res, next) {
    if (req.body && typeof req.body === 'object') {
        req.body = sanitizeObject(req.body);
    }
    next();
}
function sanitizeObject(obj) {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            // Don't sanitize code content
            if (key === 'content' || key === 'code' || key === 'prompt') {
                sanitized[key] = value;
            }
            else {
                sanitized[key] = sanitizeString(value);
            }
        }
        else if (Array.isArray(value)) {
            sanitized[key] = value.map(item => typeof item === 'object' && item !== null
                ? sanitizeObject(item)
                : item);
        }
        else if (typeof value === 'object' && value !== null) {
            sanitized[key] = sanitizeObject(value);
        }
        else {
            sanitized[key] = value;
        }
    }
    return sanitized;
}
//# sourceMappingURL=validate-request.js.map