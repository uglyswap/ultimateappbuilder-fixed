"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.microservicesGeneratorService = exports.MicroservicesGeneratorService = void 0;
const logger_1 = require("../utils/logger");
const universal_ai_client_1 = require("../utils/universal-ai-client");
class MicroservicesGeneratorService {
    /**
     * Generate microservices architecture
     */
    async generateMicroservices(services) {
        logger_1.logger.info('Generating microservices architecture');
        const generatedServices = {};
        // Generate each service
        for (const service of services) {
            generatedServices[service.name] = await this.generateService(service);
        }
        // Generate API Gateway
        const apiGateway = await this.generateAPIGateway(services);
        // Generate Docker Compose
        const dockerCompose = this.generateDockerCompose(services);
        // Generate Kubernetes manifests
        const kubernetes = this.generateKubernetesManifests(services);
        // Generate message queue config
        const messageQueue = this.generateMessageQueueConfig(services);
        return {
            services: generatedServices,
            apiGateway,
            dockerCompose,
            kubernetes,
            messageQueue,
        };
    }
    /**
     * Generate individual microservice
     */
    async generateService(config) {
        const prompt = `Generate a production-ready microservice in TypeScript/Express.

Service: ${config.name}
Port: ${config.port}
Dependencies: ${config.dependencies.join(', ')}
Database: ${config.database || 'none'}

Requirements:
- Express.js with TypeScript
- Health check endpoint
- Graceful shutdown
- Error handling
- Logging
- Docker support
- Database connection (if applicable)
- Message queue integration (if applicable)

Generate the complete service code.`;
        const result = await universal_ai_client_1.universalAIClient.generateCode(prompt, 'backend', {
            autonomousMode: true,
        });
        return result.content;
    }
    /**
     * Generate API Gateway
     */
    async generateAPIGateway(services) {
        const serviceRoutes = services.map(s => `    '/${s.name}': 'http://localhost:${s.port}'`).join(',\n');
        return `import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import rateLimit from 'express-rate-limit';

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

// Service routes
const services = {
${serviceRoutes}
};

// Proxy to services
Object.entries(services).forEach(([path, target]) => {
  app.use(
    path,
    createProxyMiddleware({
      target: target as string,
      changeOrigin: true,
      pathRewrite: {
        [\`^\${path}\`]: '',
      },
    })
  );
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', services: Object.keys(services) });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(\`API Gateway running on port \${PORT}\`);
});
`;
    }
    /**
     * Generate Docker Compose
     */
    generateDockerCompose(services) {
        const serviceConfigs = services
            .map(s => `  ${s.name}:
    build: ./services/${s.name}
    ports:
      - "${s.port}:${s.port}"
    environment:
      - NODE_ENV=production
      - PORT=${s.port}
    depends_on:
      - ${s.database || 'none'}`)
            .join('\n\n');
        return `version: '3.8'

services:
  api-gateway:
    build: ./api-gateway
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
${services.map(s => `      - ${s.name}`).join('\n')}

${serviceConfigs}

  postgres:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"

  redis:
    image: redis:7
    ports:
      - "6379:6379"

  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"
`;
    }
    /**
     * Generate Kubernetes manifests
     */
    generateKubernetesManifests(services) {
        const manifests = {};
        services.forEach(service => {
            manifests[`${service.name}-deployment.yaml`] = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${service.name}
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ${service.name}
  template:
    metadata:
      labels:
        app: ${service.name}
    spec:
      containers:
      - name: ${service.name}
        image: ${service.name}:latest
        ports:
        - containerPort: ${service.port}
        env:
        - name: PORT
          value: "${service.port}"
---
apiVersion: v1
kind: Service
metadata:
  name: ${service.name}
spec:
  selector:
    app: ${service.name}
  ports:
  - port: ${service.port}
    targetPort: ${service.port}
  type: ClusterIP
`;
        });
        return manifests;
    }
    /**
     * Generate message queue config
     */
    generateMessageQueueConfig(services) {
        return `import amqp from 'amqplib';

class MessageQueue {
  private connection?: amqp.Connection;
  private channel?: amqp.Channel;

  async connect() {
    this.connection = await amqp.connect('amqp://localhost');
    this.channel = await this.connection.createChannel();
  }

  async publish(queue: string, message: any) {
    await this.channel?.assertQueue(queue);
    this.channel?.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  }

  async subscribe(queue: string, handler: (msg: any) => void) {
    await this.channel?.assertQueue(queue);
    this.channel?.consume(queue, (msg) => {
      if (msg) {
        handler(JSON.parse(msg.content.toString()));
        this.channel?.ack(msg);
      }
    });
  }
}

export const messageQueue = new MessageQueue();
`;
    }
}
exports.MicroservicesGeneratorService = MicroservicesGeneratorService;
exports.microservicesGeneratorService = new MicroservicesGeneratorService();
//# sourceMappingURL=microservices-generator-service.js.map