/**
 * Generate a secure random API key
 */
export declare function generateApiKey(): string;
/**
 * Generate a unique ID
 */
export declare function generateId(prefix?: string): string;
/**
 * Slugify a string
 */
export declare function slugify(text: string): string;
/**
 * Ensure directory exists
 */
export declare function ensureDir(dirPath: string): Promise<void>;
/**
 * Write file with directory creation
 */
export declare function writeFileSafe(filePath: string, content: string): Promise<void>;
/**
 * Read JSON file
 */
export declare function readJsonFile<T>(filePath: string): Promise<T>;
/**
 * Write JSON file
 */
export declare function writeJsonFile(filePath: string, data: unknown): Promise<void>;
/**
 * Delay execution
 */
export declare function delay(ms: number): Promise<void>;
/**
 * Retry function with exponential backoff
 */
export declare function retry<T>(fn: () => Promise<T>, options?: {
    maxAttempts?: number;
    delayMs?: number;
    backoff?: boolean;
}): Promise<T>;
/**
 * Format bytes to human readable
 */
export declare function formatBytes(bytes: number, decimals?: number): string;
/**
 * Calculate duration in human readable format
 */
export declare function formatDuration(ms: number): string;
/**
 * Safe JSON parse
 */
export declare function safeJsonParse<T>(json: string, fallback: T): T;
/**
 * Chunk array
 */
export declare function chunkArray<T>(array: T[], size: number): T[][];
/**
 * Remove undefined values from object
 */
export declare function removeUndefined<T extends Record<string, unknown>>(obj: T): Partial<T>;
//# sourceMappingURL=helpers.d.ts.map