/**
 * Microservices Architecture Generator
 *
 * Generates microservices-based applications with:
 * - Service discovery
 * - API Gateway
 * - Message queues (RabbitMQ/Kafka)
 * - Docker & Kubernetes
 * - Service mesh
 * - Distributed tracing
 */
export interface MicroserviceConfig {
    name: string;
    port: number;
    dependencies: string[];
    database?: 'postgres' | 'mongodb' | 'redis';
    messageQueue?: 'rabbitmq' | 'kafka';
}
export declare class MicroservicesGeneratorService {
    /**
     * Generate microservices architecture
     */
    generateMicroservices(services: MicroserviceConfig[]): Promise<{
        services: Record<string, string>;
        apiGateway: string;
        dockerCompose: string;
        kubernetes: Record<string, string>;
        messageQueue: string;
    }>;
    /**
     * Generate individual microservice
     */
    private generateService;
    /**
     * Generate API Gateway
     */
    private generateAPIGateway;
    /**
     * Generate Docker Compose
     */
    private generateDockerCompose;
    /**
     * Generate Kubernetes manifests
     */
    private generateKubernetesManifests;
    /**
     * Generate message queue config
     */
    private generateMessageQueueConfig;
}
export declare const microservicesGeneratorService: MicroservicesGeneratorService;
//# sourceMappingURL=microservices-generator-service.d.ts.map