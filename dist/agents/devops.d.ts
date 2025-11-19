import type { OrchestratorContext, GeneratedFile } from '../types';
export declare class DevOpsAgent {
    generate(context: OrchestratorContext): Promise<{
        files: GeneratedFile[];
    }>;
    private generateDockerFiles;
    private generateGitHubActions;
    private generateDeploymentConfig;
}
//# sourceMappingURL=devops.d.ts.map