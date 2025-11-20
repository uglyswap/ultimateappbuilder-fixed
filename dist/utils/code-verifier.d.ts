/**
 * Code Verification Utility
 * Cleans and validates generated code output
 */
export interface VerifiedCode {
    content: string;
    files: Array<{
        path: string;
        content: string;
    }>;
    isValid: boolean;
    errors: string[];
}
/**
 * Clean and verify generated code
 * Removes markdown, annotations, and extracts clean code
 */
export declare function verifyAndCleanCode(rawOutput: string): VerifiedCode;
/**
 * Clean individual file content
 */
declare function cleanFileContent(content: string): string;
/**
 * Format code for better readability
 */
export declare function formatCode(content: string, language: string): string;
declare const _default: {
    verifyAndCleanCode: typeof verifyAndCleanCode;
    cleanFileContent: typeof cleanFileContent;
    formatCode: typeof formatCode;
};
export default _default;
//# sourceMappingURL=code-verifier.d.ts.map