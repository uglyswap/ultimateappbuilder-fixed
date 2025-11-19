import type { OrchestratorContext, GeneratedFile } from '../types';
export declare class IntegrationsAgent {
    generate(context: OrchestratorContext): Promise<{
        files: GeneratedFile[];
    }>;
    private generateStripeIntegration;
    private generateSendGridIntegration;
    private generateAWSIntegration;
    private generateGitHubIntegration;
}
//# sourceMappingURL=integrations.d.ts.map