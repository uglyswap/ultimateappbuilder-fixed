/**
 * Cloud Deployment Service
 *
 * Automated deployment to multiple cloud platforms:
 * - Vercel (Serverless, Edge Functions)
 * - Netlify (JAMstack, Edge Functions)
 * - AWS (EC2, Lambda, ECS, Amplify)
 * - Railway (Containers, Databases)
 * - Render (Web Services, Static Sites)
 * - Heroku (Dynos, Add-ons)
 * - DigitalOcean (Droplets, App Platform)
 * - Google Cloud (Cloud Run, App Engine)
 */
export interface DeploymentConfig {
    projectId: string;
    platform: 'vercel' | 'netlify' | 'aws' | 'railway' | 'render' | 'heroku' | 'digitalocean' | 'gcp';
    envVars?: Record<string, string>;
    domain?: string;
    region?: string;
    buildCommand?: string;
    startCommand?: string;
}
export interface DeploymentResult {
    success: boolean;
    url?: string;
    deploymentId?: string;
    logs?: string;
    error?: string;
}
export declare class CloudDeploymentService {
    /**
     * Deploy to cloud platform
     */
    deploy(config: DeploymentConfig): Promise<DeploymentResult>;
    /**
     * Deploy to Vercel
     */
    private deployToVercel;
    /**
     * Deploy to Netlify
     */
    private deployToNetlify;
    /**
     * Deploy to AWS (Lambda + API Gateway)
     */
    private deployToAWS;
    /**
     * Deploy to Railway
     */
    private deployToRailway;
    /**
     * Deploy to Render
     */
    private deployToRender;
    /**
     * Deploy to Heroku
     */
    private deployToHeroku;
    /**
     * Deploy to DigitalOcean App Platform
     */
    private deployToDigitalOcean;
    /**
     * Deploy to Google Cloud Platform (Cloud Run)
     */
    private deployToGCP;
    /**
     * Generate Docker configuration
     */
    generateDockerConfig(projectType: 'node' | 'python' | 'go'): string;
    /**
     * Generate CI/CD configuration
     */
    generateCICD(platform: 'github' | 'gitlab' | 'circleci'): Promise<string>;
    /**
     * Get deployment status
     */
    getDeploymentStatus(deploymentId: string): Promise<{
        status: 'pending' | 'building' | 'deploying' | 'ready' | 'error';
        url?: string;
        logs?: string;
    }>;
    /**
     * Rollback deployment
     */
    rollback(deploymentId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Get deployment logs
     */
    getLogs(deploymentId: string): Promise<string[]>;
}
export declare const cloudDeploymentService: CloudDeploymentService;
//# sourceMappingURL=cloud-deployment-service.d.ts.map