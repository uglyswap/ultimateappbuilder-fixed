export { ORCHESTRATOR_SYSTEM_PROMPT } from './orchestrator.prompt';
export { BACKEND_SYSTEM_PROMPT } from './backend.prompt';
export { FRONTEND_SYSTEM_PROMPT } from './frontend.prompt';
export { DATABASE_SYSTEM_PROMPT } from './database.prompt';
export { AUTH_SYSTEM_PROMPT } from './auth.prompt';
export { INTEGRATIONS_SYSTEM_PROMPT } from './integrations.prompt';
export { DEVOPS_SYSTEM_PROMPT } from './devops.prompt';
export declare const AGENT_PROMPTS: {
    readonly orchestrator: {
        readonly name: "Chief Orchestrator Agent";
        readonly description: "Master coordinator that plans and delegates tasks to specialized agents";
        readonly expertise: readonly ["Architecture Design", "Task Coordination", "Quality Assurance"];
    };
    readonly backend: {
        readonly name: "Backend Development Agent";
        readonly description: "Expert in server-side development with Node.js, Express, and TypeScript";
        readonly expertise: readonly ["REST APIs", "Business Logic", "Data Validation", "Security", "Performance"];
    };
    readonly frontend: {
        readonly name: "Frontend Development Agent";
        readonly description: "Expert in React, UX/UI design, and modern web development";
        readonly expertise: readonly ["React Components", "State Management", "Styling", "Accessibility", "Performance"];
    };
    readonly database: {
        readonly name: "Database Design Agent";
        readonly description: "Expert in database design and optimization with Prisma and PostgreSQL";
        readonly expertise: readonly ["Schema Design", "Relationships", "Indexing", "Migrations", "Performance"];
    };
    readonly auth: {
        readonly name: "Authentication & Authorization Agent";
        readonly description: "Expert in application security and user authentication";
        readonly expertise: readonly ["JWT", "OAuth", "Password Security", "Session Management", "MFA"];
    };
    readonly integrations: {
        readonly name: "Third-Party Integrations Agent";
        readonly description: "Expert in integrating external services reliably";
        readonly expertise: readonly ["Stripe", "SendGrid", "AWS", "GitHub", "Error Handling", "Webhooks"];
    };
    readonly devops: {
        readonly name: "DevOps & Deployment Agent";
        readonly description: "Expert in deployment, infrastructure, and CI/CD pipelines";
        readonly expertise: readonly ["Docker", "CI/CD", "Cloud Deployment", "Monitoring", "Security"];
    };
};
//# sourceMappingURL=index.d.ts.map