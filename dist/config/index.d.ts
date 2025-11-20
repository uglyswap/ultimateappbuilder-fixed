import { AIConfig } from '../types';
export declare const config: {
    readonly app: {
        readonly name: "Ultimate App Builder";
        readonly version: "1.0.0";
        readonly env: string;
        readonly port: number;
        readonly url: string;
    };
    readonly database: {
        readonly url: string;
    };
    readonly redis: {
        readonly url: string;
    };
    readonly ai: AIConfig;
    readonly openai: {
        readonly apiKey: string;
    };
    readonly openrouter: {
        readonly apiKey: string;
    };
    readonly autonomous: {
        readonly enabled: boolean;
        readonly autoFix: boolean;
        readonly autoOptimize: boolean;
        readonly autoTest: boolean;
        readonly autoDeploy: boolean;
    };
    readonly auth: {
        readonly jwtSecret: string;
        readonly jwtExpiresIn: string;
    };
    readonly integrations: {
        readonly stripe: {
            readonly secretKey: string;
            readonly webhookSecret: string;
        };
        readonly github: {
            readonly token: string;
        };
        readonly aws: {
            readonly accessKeyId: string;
            readonly secretAccessKey: string;
            readonly region: string;
        };
    };
    readonly email: {
        readonly smtp: {
            readonly host: string;
            readonly port: number;
            readonly user: string;
            readonly pass: string;
        };
    };
    readonly storage: {
        readonly type: "local" | "s3";
        readonly path: string;
    };
    readonly rateLimit: {
        readonly windowMs: number;
        readonly maxRequests: number;
    };
    readonly features: {
        readonly analytics: boolean;
        readonly telemetry: boolean;
        readonly debugMode: boolean;
    };
};
export declare function validateConfig(): void;
//# sourceMappingURL=index.d.ts.map