"use strict";
/**
 * Code Verification Utility
 * Cleans and validates generated code output
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAndCleanCode = verifyAndCleanCode;
exports.formatCode = formatCode;
/**
 * Clean and verify generated code
 * Removes markdown, annotations, and extracts clean code
 */
function verifyAndCleanCode(rawOutput) {
    const errors = [];
    let cleanedContent = rawOutput;
    // Remove common AI prefixes/suffixes (multi-language support)
    const prefixPatterns = [
        // English
        /^(I'll |I will |Let me |Here's |Here is |I've created |I have created |Below is |Following is ).*?\n+/i,
        /^.*?(creating|building|generating|making|implementing).*?\n+/i,
        /^(Sure|Of course|Certainly|Absolutely|Great|Perfect|Alright).*?\n+/i,
        /^(Here's? (the|a|an|your)).*?\n+/i,
        // French
        /^(Je vais |Voici |Voilà |Créons |J'ai créé ).*?\n+/i,
        // Spanish
        /^(Voy a |Aquí está |He creado |Crearemos ).*?\n+/i,
        // German
        /^(Ich werde |Hier ist |Lass mich ).*?\n+/i,
        // Common patterns
        /^(Based on your request|As requested|As you asked).*?\n+/i,
        /^(The following|Below you'll find).*?\n+/i,
    ];
    for (const pattern of prefixPatterns) {
        cleanedContent = cleanedContent.replace(pattern, '');
    }
    // Remove any remaining conversational text at the start
    cleanedContent = cleanedContent.replace(/^[^\/\n<{]*?:\s*\n+/i, '');
    // Remove markdown code block markers
    cleanedContent = cleanedContent.replace(/```[\w]*\n?/g, '');
    cleanedContent = cleanedContent.replace(/```$/gm, '');
    // Remove trailing explanations
    const trailingPatterns = [
        /\n\n(This code|The code|This implementation|This creates|Note:|Notes:|Important:)[\s\S]*$/i,
        /\n\n(Key features|Features:|What this does|How it works|Usage:)[\s\S]*$/i,
        /\n\n(You can|To use|To run|Install|Setup:|Getting started)[\s\S]*$/i,
        /\n\n(Let me know|Feel free|If you need|I hope|Happy coding)[\s\S]*$/i,
        /\n\n(Remember to|Don't forget|Make sure|Please note)[\s\S]*$/i,
        /\n\n(Ce code|Cette implémentation|Notez que|N'oubliez pas)[\s\S]*$/i,
        /\n\n(Este código|Recuerda|No olvides)[\s\S]*$/i,
        /\n\n---[\s\S]*$/,
    ];
    for (const pattern of trailingPatterns) {
        cleanedContent = cleanedContent.replace(pattern, '');
    }
    // Trim whitespace
    cleanedContent = cleanedContent.trim();
    // Extract multiple files if present
    const files = [];
    // Pattern 1: // File: path/to/file.tsx
    const filePattern1 = /\/\/\s*File:\s*([^\n]+)\n([\s\S]*?)(?=\/\/\s*File:|$)/g;
    let match;
    while ((match = filePattern1.exec(cleanedContent)) !== null) {
        const path = match[1].trim();
        let content = match[2].trim();
        // Clean individual file content
        content = cleanFileContent(content);
        if (content) {
            files.push({ path, content });
        }
    }
    // Pattern 2: // === path/to/file.tsx ===
    if (files.length === 0) {
        const filePattern2 = /\/\/\s*===\s*([^\n=]+)\s*===\n([\s\S]*?)(?=\/\/\s*===|$)/g;
        while ((match = filePattern2.exec(cleanedContent)) !== null) {
            const path = match[1].trim();
            let content = match[2].trim();
            content = cleanFileContent(content);
            if (content) {
                files.push({ path, content });
            }
        }
    }
    // Pattern 3: /* filename.tsx */
    if (files.length === 0) {
        const filePattern3 = /\/\*\s*([^\n*]+)\s*\*\/\n([\s\S]*?)(?=\/\*\s*[^\n*]+\s*\*\/|$)/g;
        while ((match = filePattern3.exec(cleanedContent)) !== null) {
            const path = match[1].trim();
            let content = match[2].trim();
            content = cleanFileContent(content);
            if (content) {
                files.push({ path, content });
            }
        }
    }
    // If no files extracted, treat as single file
    if (files.length === 0) {
        cleanedContent = cleanFileContent(cleanedContent);
        // Detect file type from content
        let path = 'App.tsx';
        if (cleanedContent.includes('export default function')) {
            path = 'App.tsx';
        }
        else if (cleanedContent.includes('<!DOCTYPE html>') || cleanedContent.includes('<html')) {
            path = 'index.html';
        }
        else if (cleanedContent.includes('import express') || cleanedContent.includes('const express')) {
            path = 'server.ts';
        }
        else if (cleanedContent.includes('.prisma') || cleanedContent.includes('model ')) {
            path = 'schema.prisma';
        }
        files.push({ path, content: cleanedContent });
    }
    // Validate files
    for (const file of files) {
        const validation = validateFileContent(file.path, file.content);
        if (!validation.isValid) {
            errors.push(...validation.errors.map(e => `${file.path}: ${e}`));
        }
    }
    return {
        content: files.map(f => `// File: ${f.path}\n${f.content}`).join('\n\n'),
        files,
        isValid: errors.length === 0,
        errors,
    };
}
/**
 * Clean individual file content
 */
function cleanFileContent(content) {
    let cleaned = content;
    // Remove markdown code blocks
    cleaned = cleaned.replace(/```[\w]*\n?/g, '');
    cleaned = cleaned.replace(/```$/gm, '');
    // Remove inline explanations in code
    cleaned = cleaned.replace(/\/\/\s*(TODO|FIXME|NOTE|HACK):\s*.*$/gm, '');
    // Remove placeholder comments
    cleaned = cleaned.replace(/\/\/\s*\.\.\.\s*(rest of|more|additional|other).*$/gim, '');
    cleaned = cleaned.replace(/\/\*\s*\.\.\.\s*(rest of|more|additional|other).*\*\//gim, '');
    // Clean up excessive newlines
    cleaned = cleaned.replace(/\n{4,}/g, '\n\n\n');
    // Trim
    cleaned = cleaned.trim();
    return cleaned;
}
/**
 * Validate file content
 */
function validateFileContent(path, content) {
    const errors = [];
    // Check for empty content
    if (!content || content.trim().length === 0) {
        errors.push('Empty file content');
        return { isValid: false, errors };
    }
    // Check for leftover markdown
    if (content.includes('```')) {
        errors.push('Contains markdown code blocks');
    }
    // Check for placeholder text
    const placeholders = [
        /\/\/\s*rest of (the )?code/i,
        /\/\/\s*\.\.\./,
        /\/\/\s*add your code here/i,
        /\/\/\s*implementation goes here/i,
        /TODO:\s*implement/i,
    ];
    for (const pattern of placeholders) {
        if (pattern.test(content)) {
            errors.push('Contains placeholder text');
            break;
        }
    }
    // Extension-specific validation
    const ext = path.split('.').pop()?.toLowerCase();
    if (ext === 'tsx' || ext === 'jsx' || ext === 'ts' || ext === 'js') {
        // Check for basic syntax
        const openBraces = (content.match(/{/g) || []).length;
        const closeBraces = (content.match(/}/g) || []).length;
        if (Math.abs(openBraces - closeBraces) > 2) {
            errors.push('Mismatched braces - code may be truncated');
        }
        const openParens = (content.match(/\(/g) || []).length;
        const closeParens = (content.match(/\)/g) || []).length;
        if (Math.abs(openParens - closeParens) > 2) {
            errors.push('Mismatched parentheses - code may be truncated');
        }
    }
    if (ext === 'html') {
        // Check for basic HTML structure
        if (content.includes('<html') && !content.includes('</html>')) {
            errors.push('Missing closing </html> tag');
        }
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
}
/**
 * Format code for better readability
 */
function formatCode(content, language) {
    // Basic formatting - in production, use prettier or similar
    let formatted = content;
    // Normalize indentation
    const lines = formatted.split('\n');
    const minIndent = lines
        .filter(line => line.trim().length > 0)
        .reduce((min, line) => {
        const match = line.match(/^(\s*)/);
        const indent = match ? match[1].length : 0;
        return Math.min(min, indent);
    }, Infinity);
    if (minIndent > 0 && minIndent !== Infinity) {
        formatted = lines
            .map(line => line.substring(minIndent))
            .join('\n');
    }
    return formatted;
}
exports.default = {
    verifyAndCleanCode,
    cleanFileContent,
    formatCode,
};
//# sourceMappingURL=code-verifier.js.map