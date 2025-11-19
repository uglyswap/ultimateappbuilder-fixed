import { z } from 'zod';
import type { ValidationResult } from '../types';
export declare const projectConfigSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    template: z.ZodEnum<["SAAS", "ECOMMERCE", "BLOG", "API", "CUSTOM"]>;
    features: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        enabled: z.ZodBoolean;
        config: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        name: string;
        id: string;
        config?: Record<string, unknown> | undefined;
    }, {
        enabled: boolean;
        name: string;
        id: string;
        config?: Record<string, unknown> | undefined;
    }>, "many">;
    database: z.ZodOptional<z.ZodObject<{
        type: z.ZodEnum<["postgresql", "mysql", "mongodb", "sqlite"]>;
        host: z.ZodOptional<z.ZodString>;
        port: z.ZodOptional<z.ZodNumber>;
        database: z.ZodString;
        schema: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        database: string;
        type: "postgresql" | "mysql" | "mongodb" | "sqlite";
        host?: string | undefined;
        port?: number | undefined;
        schema?: string | undefined;
    }, {
        database: string;
        type: "postgresql" | "mysql" | "mongodb" | "sqlite";
        host?: string | undefined;
        port?: number | undefined;
        schema?: string | undefined;
    }>>;
    auth: z.ZodOptional<z.ZodObject<{
        providers: z.ZodArray<z.ZodEnum<["email", "google", "github", "facebook"]>, "many">;
        jwtSecret: z.ZodOptional<z.ZodString>;
        sessionDuration: z.ZodOptional<z.ZodString>;
        enableMFA: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        providers: ("email" | "google" | "github" | "facebook")[];
        enableMFA?: boolean | undefined;
        jwtSecret?: string | undefined;
        sessionDuration?: string | undefined;
    }, {
        providers: ("email" | "google" | "github" | "facebook")[];
        enableMFA?: boolean | undefined;
        jwtSecret?: string | undefined;
        sessionDuration?: string | undefined;
    }>>;
    integrations: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["stripe", "sendgrid", "aws", "github", "slack", "custom"]>;
        credentials: z.ZodRecord<z.ZodString, z.ZodString>;
        config: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        type: "github" | "stripe" | "sendgrid" | "aws" | "slack" | "custom";
        credentials: Record<string, string>;
        config?: Record<string, unknown> | undefined;
    }, {
        type: "github" | "stripe" | "sendgrid" | "aws" | "slack" | "custom";
        credentials: Record<string, string>;
        config?: Record<string, unknown> | undefined;
    }>, "many">>;
    deployment: z.ZodOptional<z.ZodObject<{
        provider: z.ZodEnum<["vercel", "netlify", "aws", "docker", "custom"]>;
        region: z.ZodOptional<z.ZodString>;
        environment: z.ZodEnum<["development", "staging", "production"]>;
        customDomain: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        provider: "aws" | "custom" | "vercel" | "netlify" | "docker";
        environment: "development" | "staging" | "production";
        region?: string | undefined;
        customDomain?: string | undefined;
    }, {
        provider: "aws" | "custom" | "vercel" | "netlify" | "docker";
        environment: "development" | "staging" | "production";
        region?: string | undefined;
        customDomain?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    template: "SAAS" | "ECOMMERCE" | "BLOG" | "API" | "CUSTOM";
    features: {
        enabled: boolean;
        name: string;
        id: string;
        config?: Record<string, unknown> | undefined;
    }[];
    database?: {
        database: string;
        type: "postgresql" | "mysql" | "mongodb" | "sqlite";
        host?: string | undefined;
        port?: number | undefined;
        schema?: string | undefined;
    } | undefined;
    auth?: {
        providers: ("email" | "google" | "github" | "facebook")[];
        enableMFA?: boolean | undefined;
        jwtSecret?: string | undefined;
        sessionDuration?: string | undefined;
    } | undefined;
    integrations?: {
        type: "github" | "stripe" | "sendgrid" | "aws" | "slack" | "custom";
        credentials: Record<string, string>;
        config?: Record<string, unknown> | undefined;
    }[] | undefined;
    description?: string | undefined;
    deployment?: {
        provider: "aws" | "custom" | "vercel" | "netlify" | "docker";
        environment: "development" | "staging" | "production";
        region?: string | undefined;
        customDomain?: string | undefined;
    } | undefined;
}, {
    name: string;
    template: "SAAS" | "ECOMMERCE" | "BLOG" | "API" | "CUSTOM";
    features: {
        enabled: boolean;
        name: string;
        id: string;
        config?: Record<string, unknown> | undefined;
    }[];
    database?: {
        database: string;
        type: "postgresql" | "mysql" | "mongodb" | "sqlite";
        host?: string | undefined;
        port?: number | undefined;
        schema?: string | undefined;
    } | undefined;
    auth?: {
        providers: ("email" | "google" | "github" | "facebook")[];
        enableMFA?: boolean | undefined;
        jwtSecret?: string | undefined;
        sessionDuration?: string | undefined;
    } | undefined;
    integrations?: {
        type: "github" | "stripe" | "sendgrid" | "aws" | "slack" | "custom";
        credentials: Record<string, string>;
        config?: Record<string, unknown> | undefined;
    }[] | undefined;
    description?: string | undefined;
    deployment?: {
        provider: "aws" | "custom" | "vercel" | "netlify" | "docker";
        environment: "development" | "staging" | "production";
        region?: string | undefined;
        customDomain?: string | undefined;
    } | undefined;
}>;
export declare function validateProjectConfig(config: unknown): ValidationResult;
export declare const emailSchema: z.ZodString;
export declare function validateEmail(email: string): boolean;
export declare const passwordSchema: z.ZodString;
export declare function validatePassword(password: string): ValidationResult;
export declare function validateApiKey(key: string): boolean;
export declare const urlSchema: z.ZodString;
export declare function validateUrl(url: string): boolean;
//# sourceMappingURL=validators.d.ts.map