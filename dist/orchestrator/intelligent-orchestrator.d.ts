import type { ProjectConfig, OrchestratorContext, GeneratedProject } from '../types';
import { ContextManager } from './context-manager';
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
export declare class IntelligentOrchestrator {
    private context;
    private agents;
    private contextManager;
    private taskQueue;
    private runningTasks;
    constructor(projectId: string, userId: string, config: ProjectConfig);
    /**
     * Main orchestration method with intelligent task delegation
     */
    orchestrate(): Promise<GeneratedProject>;
    /**
     * AI-powered analysis and planning
     * Decides which agents to use and in what order
     */
    private analyzeAndPlan;
    /**
     * Parse and validate execution plan from AI
     */
    private parseExecutionPlan;
    /**
     * Fallback plan if AI parsing fails
     */
    private getFallbackPlan;
    /**
     * Execute plan with intelligent parallel processing
     */
    private executePlan;
    /**
     * Execute a single task with context management
     */
    private executeTask;
    /**
     * Assemble final project
     */
    private assembleProject;
    private generatePackageJson;
    private generateReadme;
    private generateEnvExample;
    /**
     * Get current context snapshot
     */
    getContext(): OrchestratorContext;
    /**
     * Get context manager for advanced operations
     */
    getContextManager(): ContextManager;
}
//# sourceMappingURL=intelligent-orchestrator.d.ts.map