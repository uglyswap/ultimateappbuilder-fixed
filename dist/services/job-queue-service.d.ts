export interface ProjectGenerationJob {
    projectId: string;
    userId: string;
    config: any;
}
export interface DeploymentJob {
    projectId: string;
    userId: string;
    provider: string;
    config: any;
}
/**
 * Job Queue Service using BullMQ
 * AUTONOMOUS MODE: Background processing with automatic retries
 */
export declare class JobQueueService {
    private generationQueue;
    private deploymentQueue;
    private generationWorker?;
    private deploymentWorker?;
    constructor();
    /**
     * Start workers to process jobs
     */
    startWorkers(): Promise<void>;
    /**
     * Queue a project generation job
     */
    queueProjectGeneration(data: ProjectGenerationJob): Promise<string>;
    /**
     * Queue a deployment job
     */
    queueDeployment(data: DeploymentJob): Promise<string>;
    /**
     * Process project generation job
     */
    private processGenerationJob;
    /**
     * Process deployment job
     */
    private processDeploymentJob;
    /**
     * Get job status
     */
    getJobStatus(jobId: string, queueType?: 'generation' | 'deployment'): Promise<{
        id: string | undefined;
        state: "unknown" | import("bullmq").JobState;
        progress: import("bullmq").JobProgress;
        data: ProjectGenerationJob;
        returnvalue: any;
        failedReason: string;
        attemptsMade: number;
        processedOn: number | undefined;
        finishedOn: number | undefined;
    } | null>;
    /**
     * Get queue statistics
     */
    getQueueStats(): Promise<{
        generation: {
            waiting: number;
            active: number;
            completed: number;
            failed: number;
        };
        deployment: {
            waiting: number;
            active: number;
            completed: number;
            failed: number;
        };
    }>;
    /**
     * Shutdown workers and queues
     */
    shutdown(): Promise<void>;
}
export declare const jobQueueService: JobQueueService;
//# sourceMappingURL=job-queue-service.d.ts.map