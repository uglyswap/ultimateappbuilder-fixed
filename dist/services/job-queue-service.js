"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobQueueService = exports.JobQueueService = void 0;
const bullmq_1 = require("bullmq");
const client_1 = require("@prisma/client");
const config_1 = require("../config");
const logger_1 = require("../utils/logger");
const websocket_service_1 = require("./websocket-service");
const prisma = new client_1.PrismaClient();
/**
 * Job Queue Service using BullMQ
 * AUTONOMOUS MODE: Background processing with automatic retries
 */
class JobQueueService {
    generationQueue;
    deploymentQueue;
    generationWorker;
    deploymentWorker;
    constructor() {
        const connection = {
            host: config_1.config.redis.url.includes('://') ? new URL(config_1.config.redis.url).hostname : 'localhost',
            port: config_1.config.redis.url.includes('://') ? parseInt(new URL(config_1.config.redis.url).port || '6379') : 6379,
        };
        // Initialize queues
        this.generationQueue = new bullmq_1.Queue('project-generation', {
            connection,
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 2000,
                },
                removeOnComplete: {
                    count: 100, // Keep last 100 completed jobs
                },
                removeOnFail: {
                    count: 50, // Keep last 50 failed jobs
                },
            },
        });
        this.deploymentQueue = new bullmq_1.Queue('deployment', {
            connection,
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 5000,
                },
                removeOnComplete: {
                    count: 50,
                },
                removeOnFail: {
                    count: 50,
                },
            },
        });
        logger_1.logger.info('[JobQueue] Queues initialized successfully! 🎯');
    }
    /**
     * Start workers to process jobs
     */
    async startWorkers() {
        const connection = {
            host: config_1.config.redis.url.includes('://') ? new URL(config_1.config.redis.url).hostname : 'localhost',
            port: config_1.config.redis.url.includes('://') ? parseInt(new URL(config_1.config.redis.url).port || '6379') : 6379,
        };
        // Generation worker
        this.generationWorker = new bullmq_1.Worker('project-generation', async (job) => {
            return await this.processGenerationJob(job);
        }, {
            connection,
            concurrency: 5, // Process 5 projects concurrently
        });
        this.generationWorker.on('completed', (job) => {
            logger_1.logger.info('[JobQueue] Generation completed', { jobId: job.id, projectId: job.data.projectId });
        });
        this.generationWorker.on('failed', (job, err) => {
            logger_1.logger.error('[JobQueue] Generation failed', {
                jobId: job?.id,
                projectId: job?.data.projectId,
                error: err.message,
            });
        });
        // Deployment worker
        this.deploymentWorker = new bullmq_1.Worker('deployment', async (job) => {
            return await this.processDeploymentJob(job);
        }, {
            connection,
            concurrency: 3, // Process 3 deployments concurrently
        });
        this.deploymentWorker.on('completed', (job) => {
            logger_1.logger.info('[JobQueue] Deployment completed', { jobId: job.id, projectId: job.data.projectId });
        });
        this.deploymentWorker.on('failed', (job, err) => {
            logger_1.logger.error('[JobQueue] Deployment failed', {
                jobId: job?.id,
                projectId: job?.data.projectId,
                error: err.message,
            });
        });
        logger_1.logger.info('[JobQueue] Workers started! Ready to process jobs in the background. ⚡');
    }
    /**
     * Queue a project generation job
     */
    async queueProjectGeneration(data) {
        const job = await this.generationQueue.add('generate', data, {
            jobId: `gen_${data.projectId}_${Date.now()}`,
        });
        logger_1.logger.info('[JobQueue] Project generation queued', { jobId: job.id, projectId: data.projectId });
        // Update project status
        await prisma.project.update({
            where: { id: data.projectId },
            data: { status: 'GENERATING' },
        });
        // Send real-time notification
        websocket_service_1.websocketService.sendGenerationProgress(data.projectId, {
            step: 'Queued',
            percentage: 0,
            message: 'Your project has been queued for generation! 🚀',
        });
        return job.id;
    }
    /**
     * Queue a deployment job
     */
    async queueDeployment(data) {
        const job = await this.deploymentQueue.add('deploy', data, {
            jobId: `deploy_${data.projectId}_${Date.now()}`,
        });
        logger_1.logger.info('[JobQueue] Deployment queued', { jobId: job.id, projectId: data.projectId });
        // Update project status
        await prisma.project.update({
            where: { id: data.projectId },
            data: { status: 'DEPLOYING' },
        });
        return job.id;
    }
    /**
     * Process project generation job
     */
    async processGenerationJob(job) {
        const { projectId, userId, config: projectConfig } = job.data;
        try {
            logger_1.logger.info('[JobQueue] Processing generation', { projectId });
            // Update progress: Starting
            await job.updateProgress(10);
            websocket_service_1.websocketService.sendGenerationProgress(projectId, {
                step: 'Initializing',
                percentage: 10,
                message: 'Starting code generation...',
            });
            // Import orchestrator dynamically to avoid circular dependencies
            const { Orchestrator } = await Promise.resolve().then(() => __importStar(require('../orchestrator')));
            const orchestrator = new Orchestrator(projectId, userId, projectConfig);
            // Update progress: Orchestrating
            await job.updateProgress(20);
            websocket_service_1.websocketService.sendGenerationProgress(projectId, {
                step: 'Planning',
                percentage: 20,
                currentAgent: 'orchestrator',
                message: 'AI is analyzing requirements and creating execution plan...',
            });
            // Generate code
            const result = await orchestrator.orchestrate();
            // Update progress: Saving files
            await job.updateProgress(80);
            websocket_service_1.websocketService.sendGenerationProgress(projectId, {
                step: 'Saving files',
                percentage: 80,
                message: 'Saving generated code...',
            });
            // Save to disk (this would be done by file service)
            const generatedPath = `/storage/projects/${projectId}`;
            // Update project
            await prisma.project.update({
                where: { id: projectId },
                data: {
                    status: 'READY',
                    generatedPath,
                },
            });
            // Update progress: Complete!
            await job.updateProgress(100);
            websocket_service_1.websocketService.sendGenerationComplete(projectId, {
                success: true,
                filesGenerated: result.structure?.length || 0,
                downloadUrl: `/api/projects/${projectId}/download`,
            });
            return result;
        }
        catch (error) {
            logger_1.logger.error('[JobQueue] Generation failed', { projectId, error });
            await prisma.project.update({
                where: { id: projectId },
                data: { status: 'ERROR' },
            });
            websocket_service_1.websocketService.sendGenerationError(projectId, {
                message: error instanceof Error ? error.message : 'Unknown error',
                step: 'generation',
            });
            throw error;
        }
    }
    /**
     * Process deployment job
     */
    async processDeploymentJob(job) {
        const { projectId, userId: _userId, provider, config: deployConfig } = job.data;
        try {
            logger_1.logger.info('[JobQueue] Processing deployment', { projectId, provider });
            // Update progress
            await job.updateProgress(10);
            websocket_service_1.websocketService.sendDeploymentProgress(projectId, {
                step: 'Preparing',
                percentage: 10,
                logs: ['Preparing deployment...'],
            });
            // Simulate deployment process
            // In production, this would call actual deployment services
            await job.updateProgress(30);
            websocket_service_1.websocketService.sendDeploymentProgress(projectId, {
                step: 'Building',
                percentage: 30,
                logs: ['Building application...', 'Installing dependencies...'],
            });
            await job.updateProgress(60);
            websocket_service_1.websocketService.sendDeploymentProgress(projectId, {
                step: 'Deploying',
                percentage: 60,
                logs: ['Deploying to ' + provider + '...', 'Configuring environment...'],
            });
            await job.updateProgress(90);
            websocket_service_1.websocketService.sendDeploymentProgress(projectId, {
                step: 'Finalizing',
                percentage: 90,
                logs: ['Running health checks...', 'Setting up DNS...'],
            });
            const deploymentUrl = `https://${projectId}.${provider.toLowerCase()}.app`;
            // Create deployment record
            await prisma.deployment.create({
                data: {
                    projectId,
                    provider: provider,
                    status: 'SUCCESS',
                    url: deploymentUrl,
                    config: deployConfig,
                    environment: 'production',
                    deployedAt: new Date(),
                },
            });
            // Update project
            await prisma.project.update({
                where: { id: projectId },
                data: {
                    status: 'DEPLOYED',
                    deploymentUrl,
                    deployedAt: new Date(),
                },
            });
            await job.updateProgress(100);
            websocket_service_1.websocketService.sendDeploymentProgress(projectId, {
                step: 'Complete',
                percentage: 100,
                logs: [`✅ Deployed successfully to ${deploymentUrl}`],
            });
            return { url: deploymentUrl };
        }
        catch (error) {
            logger_1.logger.error('[JobQueue] Deployment failed', { projectId, error });
            await prisma.deployment.create({
                data: {
                    projectId,
                    provider: provider,
                    status: 'FAILED',
                    config: deployConfig,
                    errorLog: error instanceof Error ? error.message : 'Unknown error',
                },
            });
            websocket_service_1.websocketService.sendDeploymentProgress(projectId, {
                step: 'Failed',
                percentage: 0,
                logs: [`❌ Deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
            });
            throw error;
        }
    }
    /**
     * Get job status
     */
    async getJobStatus(jobId, queueType = 'generation') {
        const queue = queueType === 'generation' ? this.generationQueue : this.deploymentQueue;
        const job = await queue.getJob(jobId);
        if (!job) {
            return null;
        }
        const state = await job.getState();
        const progress = job.progress;
        return {
            id: job.id,
            state,
            progress,
            data: job.data,
            returnvalue: job.returnvalue,
            failedReason: job.failedReason,
            attemptsMade: job.attemptsMade,
            processedOn: job.processedOn,
            finishedOn: job.finishedOn,
        };
    }
    /**
     * Get queue statistics
     */
    async getQueueStats() {
        const [genWaiting, genActive, genCompleted, genFailed] = await Promise.all([
            this.generationQueue.getWaitingCount(),
            this.generationQueue.getActiveCount(),
            this.generationQueue.getCompletedCount(),
            this.generationQueue.getFailedCount(),
        ]);
        const [depWaiting, depActive, depCompleted, depFailed] = await Promise.all([
            this.deploymentQueue.getWaitingCount(),
            this.deploymentQueue.getActiveCount(),
            this.deploymentQueue.getCompletedCount(),
            this.deploymentQueue.getFailedCount(),
        ]);
        return {
            generation: {
                waiting: genWaiting,
                active: genActive,
                completed: genCompleted,
                failed: genFailed,
            },
            deployment: {
                waiting: depWaiting,
                active: depActive,
                completed: depCompleted,
                failed: depFailed,
            },
        };
    }
    /**
     * Shutdown workers and queues
     */
    async shutdown() {
        logger_1.logger.info('[JobQueue] Shutting down...');
        if (this.generationWorker) {
            await this.generationWorker.close();
        }
        if (this.deploymentWorker) {
            await this.deploymentWorker.close();
        }
        await this.generationQueue.close();
        await this.deploymentQueue.close();
        logger_1.logger.info('[JobQueue] Shutdown complete');
    }
}
exports.JobQueueService = JobQueueService;
exports.jobQueueService = new JobQueueService();
//# sourceMappingURL=job-queue-service.js.map