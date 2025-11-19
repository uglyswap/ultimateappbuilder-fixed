"use strict";
// World-Class AI Agent System Prompts
// Each agent has a specialized, comprehensive prompt engineered for optimal code generation
Object.defineProperty(exports, "__esModule", { value: true });
exports.AGENT_PROMPTS = exports.DEVOPS_SYSTEM_PROMPT = exports.INTEGRATIONS_SYSTEM_PROMPT = exports.AUTH_SYSTEM_PROMPT = exports.DATABASE_SYSTEM_PROMPT = exports.FRONTEND_SYSTEM_PROMPT = exports.BACKEND_SYSTEM_PROMPT = exports.ORCHESTRATOR_SYSTEM_PROMPT = void 0;
var orchestrator_prompt_1 = require("./orchestrator.prompt");
Object.defineProperty(exports, "ORCHESTRATOR_SYSTEM_PROMPT", { enumerable: true, get: function () { return orchestrator_prompt_1.ORCHESTRATOR_SYSTEM_PROMPT; } });
var backend_prompt_1 = require("./backend.prompt");
Object.defineProperty(exports, "BACKEND_SYSTEM_PROMPT", { enumerable: true, get: function () { return backend_prompt_1.BACKEND_SYSTEM_PROMPT; } });
var frontend_prompt_1 = require("./frontend.prompt");
Object.defineProperty(exports, "FRONTEND_SYSTEM_PROMPT", { enumerable: true, get: function () { return frontend_prompt_1.FRONTEND_SYSTEM_PROMPT; } });
var database_prompt_1 = require("./database.prompt");
Object.defineProperty(exports, "DATABASE_SYSTEM_PROMPT", { enumerable: true, get: function () { return database_prompt_1.DATABASE_SYSTEM_PROMPT; } });
var auth_prompt_1 = require("./auth.prompt");
Object.defineProperty(exports, "AUTH_SYSTEM_PROMPT", { enumerable: true, get: function () { return auth_prompt_1.AUTH_SYSTEM_PROMPT; } });
var integrations_prompt_1 = require("./integrations.prompt");
Object.defineProperty(exports, "INTEGRATIONS_SYSTEM_PROMPT", { enumerable: true, get: function () { return integrations_prompt_1.INTEGRATIONS_SYSTEM_PROMPT; } });
var devops_prompt_1 = require("./devops.prompt");
Object.defineProperty(exports, "DEVOPS_SYSTEM_PROMPT", { enumerable: true, get: function () { return devops_prompt_1.DEVOPS_SYSTEM_PROMPT; } });
// Prompt metadata for documentation
exports.AGENT_PROMPTS = {
    orchestrator: {
        name: 'Chief Orchestrator Agent',
        description: 'Master coordinator that plans and delegates tasks to specialized agents',
        expertise: ['Architecture Design', 'Task Coordination', 'Quality Assurance'],
    },
    backend: {
        name: 'Backend Development Agent',
        description: 'Expert in server-side development with Node.js, Express, and TypeScript',
        expertise: ['REST APIs', 'Business Logic', 'Data Validation', 'Security', 'Performance'],
    },
    frontend: {
        name: 'Frontend Development Agent',
        description: 'Expert in React, UX/UI design, and modern web development',
        expertise: ['React Components', 'State Management', 'Styling', 'Accessibility', 'Performance'],
    },
    database: {
        name: 'Database Design Agent',
        description: 'Expert in database design and optimization with Prisma and PostgreSQL',
        expertise: ['Schema Design', 'Relationships', 'Indexing', 'Migrations', 'Performance'],
    },
    auth: {
        name: 'Authentication & Authorization Agent',
        description: 'Expert in application security and user authentication',
        expertise: ['JWT', 'OAuth', 'Password Security', 'Session Management', 'MFA'],
    },
    integrations: {
        name: 'Third-Party Integrations Agent',
        description: 'Expert in integrating external services reliably',
        expertise: ['Stripe', 'SendGrid', 'AWS', 'GitHub', 'Error Handling', 'Webhooks'],
    },
    devops: {
        name: 'DevOps & Deployment Agent',
        description: 'Expert in deployment, infrastructure, and CI/CD pipelines',
        expertise: ['Docker', 'CI/CD', 'Cloud Deployment', 'Monitoring', 'Security'],
    },
};
//# sourceMappingURL=index.js.map