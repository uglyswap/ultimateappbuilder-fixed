"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntelligentOrchestrator = void 0;
const logger_1 = require("../utils/logger");
const ai_client_1 = require("../utils/ai-client");
const backend_1 = require("../agents/backend");
const frontend_1 = require("../agents/frontend");
const database_1 = require("../agents/database");
const auth_1 = require("../agents/auth");
const integrations_1 = require("../agents/integrations");
const devops_1 = require("../agents/devops");
const context_manager_1 = require("./context-manager");
/**
 * Intelligent Orchestrator with Dynamic Task Delegation
 *
 * Features:
 * - Analyzes project requirements using AI
 * - Dynamically decides which agents to use and in what order
 * - Manages dependencies between agents
 * - Handles parallel execution where possible
 * - Advanced context management with memory
 */
class IntelligentOrchestrator {
    context;
    agents;
    contextManager;
    taskQueue = [];
    runningTasks = new Set();
    constructor(projectId, userId, config) {
        this.context = {
            projectId,
            userId,
            config,
            currentPhase: 'initialization',
            completedTasks: [],
            pendingTasks: [],
            generatedFiles: [],
            errors: [],
        };
        // Initialize specialized agents
        this.agents = new Map([
            ['backend', new backend_1.BackendAgent()],
            ['frontend', new frontend_1.FrontendAgent()],
            ['database', new database_1.DatabaseAgent()],
            ['auth', new auth_1.AuthAgent()],
            ['integrations', new integrations_1.IntegrationsAgent()],
            ['devops', new devops_1.DevOpsAgent()],
        ]);
        // Initialize context manager with large context window
        this.contextManager = new context_manager_1.ContextManager(projectId, {
            maxContextSize: 100000, // 100K tokens
            enableMemory: true,
            enableRAG: true,
        });
    }
    /**
     * Main orchestration method with intelligent task delegation
     */
    async orchestrate() {
        logger_1.logger.info('🎯 Starting intelligent orchestration', {
            projectId: this.context.projectId,
            template: this.context.config.template,
        });
        try {
            // Phase 1: Analyze requirements and create dynamic plan
            const executionPlan = await this.analyzeAndPlan();
            // Phase 2: Execute tasks with intelligent delegation
            await this.executePlan(executionPlan);
            // Phase 3: Validate and assemble
            const project = await this.assembleProject();
            logger_1.logger.info('✅ Intelligent orchestration completed', {
                projectId: this.context.projectId,
                tasksCompleted: this.context.completedTasks.length,
                filesGenerated: this.context.generatedFiles.length,
            });
            return project;
        }
        catch (error) {
            logger_1.logger.error('❌ Orchestration failed', {
                projectId: this.context.projectId,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
            throw error;
        }
    }
    /**
     * AI-powered analysis and planning
     * Decides which agents to use and in what order
     */
    async analyzeAndPlan() {
        logger_1.logger.info('🧠 Analyzing requirements with AI...');
        this.context.currentPhase = 'planning';
        // Add project config to context
        await this.contextManager.addToContext('project_config', this.context.config);
        // Ask AI to analyze and create execution plan
        const analysisPrompt = `
Analyze this project configuration and create an optimal execution plan.

Project: ${this.context.config.name}
Template: ${this.context.config.template}
Features: ${this.context.config.features.map(f => f.name).join(', ')}

Available Agents:
1. database - Creates database schemas, relationships, migrations
2. backend - Builds REST APIs, business logic, validation
3. auth - Implements authentication and authorization
4. frontend - Creates React components, UI, state management
5. integrations - Sets up third-party services (Stripe, SendGrid, etc.)
6. devops - Configures Docker, CI/CD, deployment

Requirements:
- database must run FIRST (others depend on it)
- auth should run AFTER database if authentication is needed
- backend can run AFTER database and auth
- frontend can run in PARALLEL with integrations (both depend on backend)
- devops runs LAST (depends on everything)

Create a JSON execution plan with tasks including:
- agent: which agent to use
- priority: 1-10 (higher = more important)
- dependencies: array of task IDs this depends on
- canRunInParallel: boolean

Return ONLY valid JSON, no explanation.
`;
        const response = await ai_client_1.aiClient.generateCode(analysisPrompt, 'orchestrator');
        // Parse AI response
        const tasks = this.parseExecutionPlan(response.content);
        logger_1.logger.info(`📋 Created execution plan with ${tasks.length} tasks`, {
            tasks: tasks.map(t => ({ agent: t.type, priority: t.priority })),
        });
        return tasks;
    }
    /**
     * Parse and validate execution plan from AI
     */
    parseExecutionPlan(aiResponse) {
        try {
            // Extract JSON from response (AI might include markdown)
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in AI response');
            }
            const plan = JSON.parse(jsonMatch[0]);
            // Convert to AgentTask format
            const tasks = [];
            if (plan.tasks && Array.isArray(plan.tasks)) {
                for (const task of plan.tasks) {
                    tasks.push({
                        id: `task_${task.agent}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        type: task.agent,
                        description: task.description || `Generate ${task.agent} code`,
                        dependencies: task.dependencies || [],
                        priority: task.priority || 5,
                        status: 'pending',
                    });
                }
            }
            return tasks;
        }
        catch (error) {
            logger_1.logger.warn('Failed to parse AI plan, using fallback', { error });
            return this.getFallbackPlan();
        }
    }
    /**
     * Fallback plan if AI parsing fails
     */
    getFallbackPlan() {
        const tasks = [
            {
                id: 'task_database',
                type: 'database',
                description: 'Generate database schema',
                dependencies: [],
                priority: 10,
                status: 'pending',
            },
        ];
        if (this.context.config.auth) {
            tasks.push({
                id: 'task_auth',
                type: 'auth',
                description: 'Generate authentication system',
                dependencies: ['task_database'],
                priority: 9,
                status: 'pending',
            });
        }
        tasks.push({
            id: 'task_backend',
            type: 'backend',
            description: 'Generate backend API',
            dependencies: this.context.config.auth ? ['task_database', 'task_auth'] : ['task_database'],
            priority: 8,
            status: 'pending',
        });
        tasks.push({
            id: 'task_frontend',
            type: 'frontend',
            description: 'Generate frontend application',
            dependencies: ['task_backend'],
            priority: 7,
            status: 'pending',
        }, {
            id: 'task_devops',
            type: 'devops',
            description: 'Generate deployment configuration',
            dependencies: ['task_backend', 'task_frontend'],
            priority: 5,
            status: 'pending',
        });
        if (this.context.config.integrations?.length) {
            tasks.push({
                id: 'task_integrations',
                type: 'integrations',
                description: 'Setup third-party integrations',
                dependencies: ['task_backend'],
                priority: 6,
                status: 'pending',
            });
        }
        return tasks;
    }
    /**
     * Execute plan with intelligent parallel processing
     */
    async executePlan(tasks) {
        this.taskQueue = [...tasks];
        this.context.pendingTasks = tasks;
        while (this.taskQueue.length > 0 || this.runningTasks.size > 0) {
            // Find tasks ready to run (dependencies met)
            const readyTasks = this.taskQueue.filter(task => task.dependencies.every(depId => this.context.completedTasks.includes(depId)));
            if (readyTasks.length === 0 && this.runningTasks.size === 0) {
                logger_1.logger.error('Deadlock detected: No tasks can run', {
                    pending: this.taskQueue.map(t => ({ id: t.id, deps: t.dependencies })),
                });
                throw new Error('Task execution deadlock');
            }
            // Sort by priority
            readyTasks.sort((a, b) => b.priority - a.priority);
            // Execute ready tasks (up to 3 in parallel)
            const MAX_PARALLEL = 3;
            const tasksToRun = readyTasks.slice(0, MAX_PARALLEL - this.runningTasks.size);
            for (const task of tasksToRun) {
                this.executeTask(task).catch(error => {
                    logger_1.logger.error('Task execution failed', { task: task.id, error });
                    this.context.errors.push(error);
                });
            }
            // Wait a bit before checking again
            if (this.runningTasks.size >= MAX_PARALLEL) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }
    /**
     * Execute a single task with context management
     */
    async executeTask(task) {
        this.taskQueue = this.taskQueue.filter(t => t.id !== task.id);
        this.runningTasks.add(task.id);
        task.status = 'in_progress';
        logger_1.logger.info(`🚀 Executing task: ${task.description}`, {
            agent: task.type,
            taskId: task.id,
        });
        try {
            const agent = this.agents.get(task.type);
            if (!agent) {
                throw new Error(`Agent not found: ${task.type}`);
            }
            // Get relevant context for this agent
            await this.contextManager.getContextForAgent(task.type);
            this.context.currentPhase = `executing_${task.type}`;
            // Execute agent
            const result = await agent.generate(this.context);
            // Store results in context
            await this.contextManager.addToContext(`agent_${task.type}_output`, result);
            // Add generated files
            this.context.generatedFiles.push(...result.files);
            // Mark task complete
            task.status = 'completed';
            this.context.completedTasks.push(task.id);
            this.runningTasks.delete(task.id);
            logger_1.logger.info(`✅ Task completed: ${task.description}`, {
                filesGenerated: result.files.length,
            });
        }
        catch (error) {
            task.status = 'failed';
            task.error = error instanceof Error ? error.message : 'Unknown error';
            this.runningTasks.delete(task.id);
            throw error;
        }
    }
    /**
     * Assemble final project
     */
    async assembleProject() {
        logger_1.logger.info('📦 Assembling final project...');
        return {
            name: this.context.config.name,
            structure: this.context.generatedFiles,
            packageJson: this.generatePackageJson(),
            readme: this.generateReadme(),
            envExample: this.generateEnvExample(),
        };
    }
    generatePackageJson() {
        return {
            name: this.context.config.name,
            version: '1.0.0',
            description: this.context.config.description || '',
            scripts: {
                dev: 'concurrently "npm run dev:backend" "npm run dev:frontend"',
                'dev:backend': 'cd backend && npm run dev',
                'dev:frontend': 'cd frontend && npm run dev',
                build: 'npm run build:backend && npm run build:frontend',
                start: 'npm run start:backend',
                test: 'npm run test:backend && npm run test:frontend',
            },
            keywords: [this.context.config.template.toLowerCase()],
            license: 'MIT',
        };
    }
    generateReadme() {
        return `# ${this.context.config.name}

Generated by Ultimate App Builder

## Template: ${this.context.config.template}

## Quick Start

\`\`\`bash
# Install dependencies
npm install

# Start development
npm run dev
\`\`\`

Generated with ❤️ by Ultimate App Builder
`;
    }
    generateEnvExample() {
        return {
            NODE_ENV: 'development',
            PORT: '3000',
            DATABASE_URL: 'postgresql://user:password@localhost:5432/dbname',
        };
    }
    /**
     * Get current context snapshot
     */
    getContext() {
        return this.context;
    }
    /**
     * Get context manager for advanced operations
     */
    getContextManager() {
        return this.contextManager;
    }
}
exports.IntelligentOrchestrator = IntelligentOrchestrator;
//# sourceMappingURL=intelligent-orchestrator.js.map