"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiCodeReviewService = exports.AICodeReviewService = void 0;
const logger_1 = require("../utils/logger");
const universal_ai_client_1 = require("../utils/universal-ai-client");
class AICodeReviewService {
    /**
     * Review code using AI
     */
    async reviewCode(code, language = 'typescript') {
        logger_1.logger.info('Starting AI code review');
        const prompt = `You are an expert code reviewer. Review this ${language} code for:
1. Security vulnerabilities (XSS, SQL injection, etc.)
2. Performance issues
3. Code quality & best practices
4. Type safety
5. Accessibility issues
6. Missing tests

Code:
\`\`\`${language}
${code}
\`\`\`

Return ONLY valid JSON in this format:
{
  "score": 85,
  "issues": [
    {
      "severity": "high",
      "category": "security",
      "line": 42,
      "message": "Potential XSS vulnerability",
      "suggestion": "Use DOMPurify to sanitize user input"
    }
  ],
  "suggestions": [
    "Add input validation",
    "Add error handling"
  ],
  "summary": "Overall good code quality with a few security concerns"
}`;
        const result = await universal_ai_client_1.universalAIClient.generateCode(prompt, 'backend', {
            autonomousMode: true,
            temperature: 0.3,
        });
        try {
            return JSON.parse(result.content);
        }
        catch (error) {
            logger_1.logger.error('Failed to parse code review result', { error });
            return {
                score: 0,
                issues: [],
                suggestions: [],
                summary: 'Code review failed',
            };
        }
    }
    /**
     * Review entire project
     */
    async reviewProject(files) {
        logger_1.logger.info('Reviewing entire project');
        const fileReviews = {};
        for (const [filename, code] of Object.entries(files)) {
            const ext = filename.split('.').pop() || 'typescript';
            fileReviews[filename] = await this.reviewCode(code, ext);
        }
        // Calculate overall score
        const scores = Object.values(fileReviews).map(r => r.score);
        const overallScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        const allIssues = Object.values(fileReviews).flatMap(r => r.issues);
        return {
            overall: {
                score: overallScore,
                issues: allIssues,
                suggestions: [],
                summary: `Project review complete. ${allIssues.length} issues found.`,
            },
            fileReviews,
        };
    }
    /**
     * Get improvement suggestions
     */
    async getSuggestions(code) {
        const review = await this.reviewCode(code);
        return review.suggestions;
    }
    /**
     * Auto-fix code issues
     */
    async autoFixCode(code) {
        logger_1.logger.info('Auto-fixing code issues');
        const prompt = `Fix all issues in this code while maintaining functionality:

${code}

Return ONLY the fixed code, nothing else.`;
        const result = await universal_ai_client_1.universalAIClient.generateCode(prompt, 'backend', {
            autonomousMode: true,
            temperature: 0.2,
        });
        return result.content;
    }
}
exports.AICodeReviewService = AICodeReviewService;
exports.aiCodeReviewService = new AICodeReviewService();
//# sourceMappingURL=ai-code-review-service.js.map