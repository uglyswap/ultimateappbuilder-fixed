/**
 * AI Code Review Service
 *
 * Automated code review using AI:
 * - Security vulnerabilities
 * - Performance issues
 * - Code quality & best practices
 * - TypeScript type safety
 * - Accessibility issues
 * - Test coverage suggestions
 */
export interface CodeReviewResult {
    score: number;
    issues: CodeIssue[];
    suggestions: string[];
    summary: string;
}
export interface CodeIssue {
    severity: 'critical' | 'high' | 'medium' | 'low';
    category: 'security' | 'performance' | 'quality' | 'accessibility' | 'types';
    line?: number;
    file?: string;
    message: string;
    suggestion?: string;
}
export declare class AICodeReviewService {
    /**
     * Review code using AI
     */
    reviewCode(code: string, language?: string): Promise<CodeReviewResult>;
    /**
     * Review entire project
     */
    reviewProject(files: Record<string, string>): Promise<{
        overall: CodeReviewResult;
        fileReviews: Record<string, CodeReviewResult>;
    }>;
    /**
     * Get improvement suggestions
     */
    getSuggestions(code: string): Promise<string[]>;
    /**
     * Auto-fix code issues
     */
    autoFixCode(code: string): Promise<string>;
}
export declare const aiCodeReviewService: AICodeReviewService;
//# sourceMappingURL=ai-code-review-service.d.ts.map