"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logger_1 = require("../../utils/logger");
const router = (0, express_1.Router)();
/**
 * Get repository contents
 * POST /api/github/repo
 */
router.post('/repo', async (req, res) => {
    try {
        const { repoUrl, token, branch } = req.body;
        if (!repoUrl) {
            return res.status(400).json({
                status: 'error',
                message: 'Repository URL is required',
            });
        }
        // Parse GitHub URL
        const urlMatch = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        if (!urlMatch) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid GitHub repository URL',
            });
        }
        const [, owner, repo] = urlMatch;
        const repoName = repo.replace(/\.git$/, '');
        logger_1.logger.info('Fetching GitHub repository', { owner, repo: repoName });
        const headers = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'UltimateAppBuilder',
        };
        if (token) {
            headers['Authorization'] = `token ${token}`;
        }
        // Get repo info
        const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
            headers,
        });
        if (!repoResponse.ok) {
            const error = await repoResponse.json();
            return res.status(repoResponse.status).json({
                status: 'error',
                message: error.message || 'Failed to fetch repository',
            });
        }
        const repoData = await repoResponse.json();
        const targetBranch = branch || repoData.default_branch;
        // Get repository tree (all files)
        const treeResponse = await fetch(`https://api.github.com/repos/${owner}/${repoName}/git/trees/${targetBranch}?recursive=1`, { headers });
        if (!treeResponse.ok) {
            return res.status(treeResponse.status).json({
                status: 'error',
                message: 'Failed to fetch repository contents',
            });
        }
        const treeData = await treeResponse.json();
        // Filter for relevant files (code files, not too large)
        const codeExtensions = [
            '.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.scss', '.html',
            '.md', '.yaml', '.yml', '.env.example', '.prisma', '.sql',
            '.py', '.go', '.rs', '.java', '.php', '.rb', '.vue', '.svelte'
        ];
        const relevantFiles = treeData.tree.filter((item) => {
            if (item.type !== 'blob')
                return false;
            if (item.size && item.size > 100000)
                return false; // Skip files > 100KB
            // Skip common non-code directories
            if (item.path.includes('node_modules/'))
                return false;
            if (item.path.includes('.git/'))
                return false;
            if (item.path.includes('dist/'))
                return false;
            if (item.path.includes('build/'))
                return false;
            if (item.path.includes('.next/'))
                return false;
            if (item.path.includes('coverage/'))
                return false;
            return codeExtensions.some(ext => item.path.endsWith(ext)) ||
                item.path === 'package.json' ||
                item.path === 'tsconfig.json' ||
                item.path === 'README.md' ||
                item.path === '.env.example';
        });
        // Fetch content for each file (limit to 50 files to avoid rate limits)
        const filesToFetch = relevantFiles.slice(0, 50);
        const files = [];
        for (const file of filesToFetch) {
            try {
                const contentResponse = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/${file.path}?ref=${targetBranch}`, { headers });
                if (contentResponse.ok) {
                    const contentData = await contentResponse.json();
                    if (contentData.content) {
                        const content = Buffer.from(contentData.content, 'base64').toString('utf-8');
                        files.push({
                            path: file.path,
                            content,
                            type: 'file',
                        });
                    }
                }
            }
            catch (error) {
                logger_1.logger.warn(`Failed to fetch file: ${file.path}`, { error });
            }
        }
        const result = {
            files,
            repoInfo: {
                name: repoData.name,
                description: repoData.description || '',
                defaultBranch: repoData.default_branch,
                stars: repoData.stargazers_count,
                language: repoData.language || 'Unknown',
            },
        };
        logger_1.logger.info('Repository fetched successfully', {
            owner,
            repo: repoName,
            filesCount: files.length,
        });
        return res.json({
            status: 'success',
            data: result,
        });
    }
    catch (error) {
        logger_1.logger.error('GitHub fetch failed', { error });
        return res.status(500).json({
            status: 'error',
            message: error instanceof Error ? error.message : 'Failed to fetch repository',
        });
    }
});
/**
 * Get single file content
 * POST /api/github/file
 */
router.post('/file', async (req, res) => {
    try {
        const { repoUrl, filePath, token, branch } = req.body;
        if (!repoUrl || !filePath) {
            return res.status(400).json({
                status: 'error',
                message: 'Repository URL and file path are required',
            });
        }
        const urlMatch = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        if (!urlMatch) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid GitHub repository URL',
            });
        }
        const [, owner, repo] = urlMatch;
        const repoName = repo.replace(/\.git$/, '');
        const headers = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'UltimateAppBuilder',
        };
        if (token) {
            headers['Authorization'] = `token ${token}`;
        }
        const targetBranch = branch || 'main';
        const contentResponse = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents/${filePath}?ref=${targetBranch}`, { headers });
        if (!contentResponse.ok) {
            return res.status(contentResponse.status).json({
                status: 'error',
                message: 'Failed to fetch file',
            });
        }
        const contentData = await contentResponse.json();
        const content = Buffer.from(contentData.content, 'base64').toString('utf-8');
        return res.json({
            status: 'success',
            data: {
                path: filePath,
                content,
                size: contentData.size,
                sha: contentData.sha,
            },
        });
    }
    catch (error) {
        logger_1.logger.error('GitHub file fetch failed', { error });
        return res.status(500).json({
            status: 'error',
            message: error instanceof Error ? error.message : 'Failed to fetch file',
        });
    }
});
exports.default = router;
//# sourceMappingURL=github.routes.js.map