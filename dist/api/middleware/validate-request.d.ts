import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
interface ValidationSchemas {
    body?: ZodSchema;
    query?: ZodSchema;
    params?: ZodSchema;
}
/**
 * Middleware to validate request body, query, and params
 */
export declare function validateRequest(schemas: ValidationSchemas): (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Common validation schemas
 */
export declare const commonSchemas: {
    pagination: z.ZodObject<{
        page: z.ZodDefault<z.ZodNumber>;
        pageSize: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        pageSize: number;
    }, {
        page?: number | undefined;
        pageSize?: number | undefined;
    }>;
    idParam: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    createProject: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        template: z.ZodEnum<["SAAS", "ECOMMERCE", "BLOG", "API", "CUSTOM"]>;
        features: z.ZodDefault<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            enabled: z.ZodBoolean;
            config: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            name: string;
            config?: Record<string, unknown> | undefined;
        }, {
            enabled: boolean;
            name: string;
            config?: Record<string, unknown> | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        template: "SAAS" | "ECOMMERCE" | "BLOG" | "API" | "CUSTOM";
        features: {
            enabled: boolean;
            name: string;
            config?: Record<string, unknown> | undefined;
        }[];
        description?: string | undefined;
    }, {
        name: string;
        template: "SAAS" | "ECOMMERCE" | "BLOG" | "API" | "CUSTOM";
        description?: string | undefined;
        features?: {
            enabled: boolean;
            name: string;
            config?: Record<string, unknown> | undefined;
        }[] | undefined;
    }>;
    generateCode: z.ZodObject<{
        prompt: z.ZodString;
        model: z.ZodString;
        apiKey: z.ZodString;
        provider: z.ZodEnum<["anthropic", "openai", "openrouter"]>;
        conversationId: z.ZodOptional<z.ZodString>;
        messages: z.ZodOptional<z.ZodArray<z.ZodObject<{
            role: z.ZodEnum<["user", "assistant"]>;
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            content: string;
            role: "user" | "assistant";
        }, {
            content: string;
            role: "user" | "assistant";
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        apiKey: string;
        provider: "anthropic" | "openai" | "openrouter";
        model: string;
        prompt: string;
        conversationId?: string | undefined;
        messages?: {
            content: string;
            role: "user" | "assistant";
        }[] | undefined;
    }, {
        apiKey: string;
        provider: "anthropic" | "openai" | "openrouter";
        model: string;
        prompt: string;
        conversationId?: string | undefined;
        messages?: {
            content: string;
            role: "user" | "assistant";
        }[] | undefined;
    }>;
    githubRepo: z.ZodObject<{
        repoUrl: z.ZodEffects<z.ZodString, string, string>;
        token: z.ZodOptional<z.ZodString>;
        branch: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        repoUrl: string;
        token?: string | undefined;
        branch?: string | undefined;
    }, {
        repoUrl: string;
        token?: string | undefined;
        branch?: string | undefined;
    }>;
    deployment: z.ZodObject<{
        projectId: z.ZodString;
        platform: z.ZodEnum<["vercel", "netlify", "railway", "aws", "docker", "github"]>;
        config: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        projectId: string;
        platform: "github" | "aws" | "vercel" | "netlify" | "docker" | "railway";
        config?: Record<string, unknown> | undefined;
    }, {
        projectId: string;
        platform: "github" | "aws" | "vercel" | "netlify" | "docker" | "railway";
        config?: Record<string, unknown> | undefined;
    }>;
};
/**
 * Sanitize string to prevent XSS
 */
export declare function sanitizeString(str: string): string;
/**
 * Middleware to sanitize request body strings
 */
export declare function sanitizeRequest(req: Request, _res: Response, next: NextFunction): void;
export {};
//# sourceMappingURL=validate-request.d.ts.map