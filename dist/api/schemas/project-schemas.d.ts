import { z } from 'zod';
export declare const createProjectSchema: z.ZodObject<{
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
    }, "strip", z.ZodTypeAny, {
        database: string;
        type: "postgresql" | "mysql" | "mongodb" | "sqlite";
        host?: string | undefined;
        port?: number | undefined;
    }, {
        database: string;
        type: "postgresql" | "mysql" | "mongodb" | "sqlite";
        host?: string | undefined;
        port?: number | undefined;
    }>>;
    auth: z.ZodOptional<z.ZodObject<{
        providers: z.ZodArray<z.ZodEnum<["email", "google", "github", "facebook"]>, "many">;
        enableMFA: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        providers: ("email" | "google" | "github" | "facebook")[];
        enableMFA?: boolean | undefined;
    }, {
        providers: ("email" | "google" | "github" | "facebook")[];
        enableMFA?: boolean | undefined;
    }>>;
    integrations: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["stripe", "sendgrid", "aws", "github", "slack", "custom"]>;
        credentials: z.ZodRecord<z.ZodString, z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "github" | "stripe" | "sendgrid" | "aws" | "slack" | "custom";
        credentials: Record<string, string>;
    }, {
        type: "github" | "stripe" | "sendgrid" | "aws" | "slack" | "custom";
        credentials: Record<string, string>;
    }>, "many">>;
    deployment: z.ZodOptional<z.ZodObject<{
        provider: z.ZodEnum<["vercel", "netlify", "aws", "docker", "custom"]>;
        region: z.ZodOptional<z.ZodString>;
        environment: z.ZodEnum<["development", "staging", "production"]>;
    }, "strip", z.ZodTypeAny, {
        provider: "aws" | "custom" | "vercel" | "netlify" | "docker";
        environment: "development" | "staging" | "production";
        region?: string | undefined;
    }, {
        provider: "aws" | "custom" | "vercel" | "netlify" | "docker";
        environment: "development" | "staging" | "production";
        region?: string | undefined;
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
    } | undefined;
    auth?: {
        providers: ("email" | "google" | "github" | "facebook")[];
        enableMFA?: boolean | undefined;
    } | undefined;
    integrations?: {
        type: "github" | "stripe" | "sendgrid" | "aws" | "slack" | "custom";
        credentials: Record<string, string>;
    }[] | undefined;
    description?: string | undefined;
    deployment?: {
        provider: "aws" | "custom" | "vercel" | "netlify" | "docker";
        environment: "development" | "staging" | "production";
        region?: string | undefined;
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
    } | undefined;
    auth?: {
        providers: ("email" | "google" | "github" | "facebook")[];
        enableMFA?: boolean | undefined;
    } | undefined;
    integrations?: {
        type: "github" | "stripe" | "sendgrid" | "aws" | "slack" | "custom";
        credentials: Record<string, string>;
    }[] | undefined;
    description?: string | undefined;
    deployment?: {
        provider: "aws" | "custom" | "vercel" | "netlify" | "docker";
        environment: "development" | "staging" | "production";
        region?: string | undefined;
    } | undefined;
}>;
//# sourceMappingURL=project-schemas.d.ts.map