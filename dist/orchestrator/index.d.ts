import type { ProjectConfig, OrchestratorContext, GeneratedProject } from '../types';
export declare class Orchestrator {
    private context;
    private agents;
    constructor(projectId: string, userId: string, config: ProjectConfig);
    orchestrate(): Promise<GeneratedProject>;
    private planProject;
    private generateDatabase;
    private generateBackend;
    private generateAuth;
    private generateFrontend;
    private generateIntegrations;
    private generateDevOps;
    private assembleProject;
    private generatePackageJson;
    private generateReadme;
    private generateEnvExample;
    getContext(): OrchestratorContext;
}
//# sourceMappingURL=index.d.ts.map