"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateApiKey = generateApiKey;
exports.generateId = generateId;
exports.slugify = slugify;
exports.ensureDir = ensureDir;
exports.writeFileSafe = writeFileSafe;
exports.readJsonFile = readJsonFile;
exports.writeJsonFile = writeJsonFile;
exports.delay = delay;
exports.retry = retry;
exports.formatBytes = formatBytes;
exports.formatDuration = formatDuration;
exports.safeJsonParse = safeJsonParse;
exports.chunkArray = chunkArray;
exports.removeUndefined = removeUndefined;
const crypto_1 = __importDefault(require("crypto"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
/**
 * Generate a secure random API key
 */
function generateApiKey() {
    return crypto_1.default.randomBytes(32).toString('base64url');
}
/**
 * Generate a unique ID
 */
function generateId(prefix = '') {
    const randomPart = crypto_1.default.randomBytes(16).toString('hex');
    return prefix ? `${prefix}_${randomPart}` : randomPart;
}
/**
 * Slugify a string
 */
function slugify(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
/**
 * Ensure directory exists
 */
async function ensureDir(dirPath) {
    try {
        await promises_1.default.access(dirPath);
    }
    catch {
        await promises_1.default.mkdir(dirPath, { recursive: true });
    }
}
/**
 * Write file with directory creation
 */
async function writeFileSafe(filePath, content) {
    const dir = path_1.default.dirname(filePath);
    await ensureDir(dir);
    await promises_1.default.writeFile(filePath, content, 'utf-8');
}
/**
 * Read JSON file
 */
async function readJsonFile(filePath) {
    const content = await promises_1.default.readFile(filePath, 'utf-8');
    return JSON.parse(content);
}
/**
 * Write JSON file
 */
async function writeJsonFile(filePath, data) {
    const content = JSON.stringify(data, null, 2);
    await writeFileSafe(filePath, content);
}
/**
 * Delay execution
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * Retry function with exponential backoff
 */
async function retry(fn, options = {}) {
    const { maxAttempts = 3, delayMs = 1000, backoff = true } = options;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            if (attempt === maxAttempts) {
                throw error;
            }
            const waitTime = backoff ? delayMs * Math.pow(2, attempt - 1) : delayMs;
            await delay(waitTime);
        }
    }
    throw new Error('Retry failed');
}
/**
 * Format bytes to human readable
 */
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
/**
 * Calculate duration in human readable format
 */
function formatDuration(ms) {
    if (ms < 1000)
        return `${ms}ms`;
    if (ms < 60000)
        return `${(ms / 1000).toFixed(1)}s`;
    if (ms < 3600000)
        return `${(ms / 60000).toFixed(1)}m`;
    return `${(ms / 3600000).toFixed(1)}h`;
}
/**
 * Safe JSON parse
 */
function safeJsonParse(json, fallback) {
    try {
        return JSON.parse(json);
    }
    catch {
        return fallback;
    }
}
/**
 * Chunk array
 */
function chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}
/**
 * Remove undefined values from object
 */
function removeUndefined(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined));
}
//# sourceMappingURL=helpers.js.map