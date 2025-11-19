export interface AIConfig {
    provider: 'anthropic' | 'openai';
    model: string;
    maxTokens: number;
    temperature: number;
    apiKey: string;
}
export interface ProjectConfig {
    name: string;
    description: string;
    template: 'SAAS' | 'ECOMMERCE' | 'BLOG' | 'API' | 'CUSTOM';
    features: ProjectFeature[];
    database?: DatabaseConfig;
    auth?: AuthConfig;
    integrations?: IntegrationConfig[];
    deployment?: DeploymentConfig;
}
export interface ProjectFeature {
    id: string;
    name: string;
    enabled: boolean;
    config?: Record<string, unknown>;
}
export interface DatabaseConfig {
    type: 'postgresql' | 'mysql' | 'mongodb' | 'sqlite';
    host?: string;
    port?: number;
    database: string;
    schema?: string;
}
export interface AuthConfig {
    providers: ('email' | 'google' | 'github' | 'facebook')[];
    jwtSecret?: string;
    sessionDuration?: string;
    enableMFA?: boolean;
}
export interface IntegrationConfig {
    type: 'stripe' | 'sendgrid' | 'aws' | 'github' | 'slack' | 'custom';
    credentials: Record<string, string>;
    config?: Record<string, unknown>;
}
export interface DeploymentConfig {
    provider: 'vercel' | 'netlify' | 'aws' | 'docker' | 'custom';
    region?: string;
    environment: 'development' | 'staging' | 'production';
    customDomain?: string;
}
export interface AgentTask {
    id: string;
    type: AgentType;
    description: string;
    dependencies: string[];
    priority: number;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    result?: unknown;
    error?: string;
}
export type AgentType = 'orchestrator' | 'backend' | 'frontend' | 'database' | 'auth' | 'integrations' | 'devops' | 'designer';
export interface AgentResponse {
    success: boolean;
    data?: unknown;
    error?: string;
    metadata?: {
        tokensUsed?: number;
        durationMs?: number;
        agentType?: AgentType;
    };
}
export interface GeneratedFile {
    path: string;
    content: string;
    language: string;
    description?: string;
}
export interface GeneratedProject {
    name: string;
    structure: GeneratedFile[];
    packageJson?: Record<string, unknown>;
    readme?: string;
    envExample?: Record<string, string>;
}
export interface ValidationResult {
    valid: boolean;
    errors?: ValidationError[];
    warnings?: ValidationWarning[];
}
export interface ValidationError {
    field: string;
    message: string;
    code: string;
}
export interface ValidationWarning {
    field: string;
    message: string;
}
export interface TemplateConfig {
    id: string;
    name: string;
    description: string;
    category: string;
    version: string;
    structure: ProjectStructure;
    dependencies: Record<string, string>;
    devDependencies?: Record<string, string>;
    scripts?: Record<string, string>;
}
export interface ProjectStructure {
    directories: string[];
    files: FileTemplate[];
}
export interface FileTemplate {
    path: string;
    template: string;
    variables?: string[];
}
export interface OrchestratorContext {
    projectId: string;
    userId: string;
    config: ProjectConfig;
    currentPhase: string;
    completedTasks: string[];
    pendingTasks: AgentTask[];
    generatedFiles: GeneratedFile[];
    errors: Error[];
}
export interface AgentContext {
    projectConfig: ProjectConfig;
    orchestratorContext?: OrchestratorContext;
    previousResults?: Record<string, unknown>;
    constraints?: Record<string, unknown>;
}
export interface Agent {
    generate(context: OrchestratorContext): Promise<{
        files: GeneratedFile[];
    }>;
}
export type AgentMap = Map<AgentType, Agent>;
//# sourceMappingURL=index.d.ts.map