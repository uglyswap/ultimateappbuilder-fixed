"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const visual_editor_service_1 = require("../../services/visual-editor-service");
const logger_1 = require("../../utils/logger");
const router = (0, express_1.Router)();
/**
 * GET /api/visual-editor/components
 * Get all available UI components
 */
router.get('/components', async (req, res) => {
    try {
        const { category } = req.query;
        if (category && typeof category === 'string') {
            const components = visual_editor_service_1.visualEditorService.getComponentsByCategory(category);
            return res.json({
                success: true,
                components,
            });
        }
        return res.json({
            success: true,
            components: visual_editor_service_1.COMPONENT_LIBRARY,
            categories: ['layout', 'form', 'data', 'navigation', 'feedback', 'media'],
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to get components', { error });
        return res.status(500).json({
            success: false,
            error: 'Failed to get component library',
        });
    }
});
/**
 * POST /api/visual-editor/design
 * Create a new visual design
 */
router.post('/design', async (req, res) => {
    try {
        const { projectId, pageName, route } = req.body;
        if (!projectId || !pageName || !route) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: projectId, pageName, route',
            });
        }
        const design = await visual_editor_service_1.visualEditorService.createDesign(projectId, pageName, route);
        return res.json({
            success: true,
            design,
            message: 'Visual design created successfully! 🎨',
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to create design', { error });
        return res.status(500).json({
            success: false,
            error: 'Failed to create visual design',
        });
    }
});
/**
 * POST /api/visual-editor/design/:designId/component
 * Add a component to the design
 */
router.post('/design/:designId/component', async (req, res) => {
    try {
        const { designId } = req.params;
        const { componentType, parentId, props } = req.body;
        if (!componentType) {
            return res.status(400).json({
                success: false,
                error: 'Missing required field: componentType',
            });
        }
        const component = await visual_editor_service_1.visualEditorService.addComponent(designId, componentType, parentId, props);
        return res.json({
            success: true,
            component,
            message: `Component ${componentType} added! ✨`,
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to add component', { error });
        return res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to add component',
        });
    }
});
/**
 * POST /api/visual-editor/design/:designId/generate-code
 * Generate React code from visual design
 */
router.post('/design/:designId/generate-code', async (req, res) => {
    try {
        const { design } = req.body;
        if (!design) {
            return res.status(400).json({
                success: false,
                error: 'Missing required field: design',
            });
        }
        const { componentCode, routeConfig } = await visual_editor_service_1.visualEditorService.generateCodeFromDesign(design);
        return res.json({
            success: true,
            componentCode,
            routeConfig,
            message: 'Code generated successfully! 🚀',
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to generate code', { error });
        return res.status(500).json({
            success: false,
            error: 'Failed to generate code from design',
        });
    }
});
/**
 * POST /api/visual-editor/design/:designId/save
 * Save visual design to database
 */
router.post('/design/:designId/save', async (req, res) => {
    try {
        const { design } = req.body;
        if (!design) {
            return res.status(400).json({
                success: false,
                error: 'Missing required field: design',
            });
        }
        await visual_editor_service_1.visualEditorService.saveDesign(design);
        return res.json({
            success: true,
            message: 'Design saved successfully! 💾',
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to save design', { error });
        return res.status(500).json({
            success: false,
            error: 'Failed to save visual design',
        });
    }
});
/**
 * POST /api/visual-editor/generate-from-description
 * Generate a complete page from AI description
 */
router.post('/generate-from-description', async (req, res) => {
    try {
        const { projectId, pageName, description } = req.body;
        if (!projectId || !pageName || !description) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: projectId, pageName, description',
            });
        }
        const design = await visual_editor_service_1.visualEditorService.generatePageFromDescription(projectId, pageName, description);
        return res.json({
            success: true,
            design,
            message: 'AI-generated page design created! 🤖✨',
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to generate page from description', { error });
        return res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to generate page design',
        });
    }
});
/**
 * GET /api/visual-editor/examples
 * Get example page designs
 */
router.get('/examples', async (req, res) => {
    try {
        const examples = [
            {
                name: 'Landing Page',
                description: 'Modern landing page with hero section, features, and CTA',
                template: 'landing-page',
            },
            {
                name: 'Dashboard',
                description: 'Admin dashboard with stats cards, charts, and tables',
                template: 'dashboard',
            },
            {
                name: 'E-commerce Product Page',
                description: 'Product detail page with gallery, description, and add to cart',
                template: 'product-page',
            },
            {
                name: 'Blog Post',
                description: 'Blog post layout with header, content, and sidebar',
                template: 'blog-post',
            },
            {
                name: 'Contact Form',
                description: 'Contact page with form and map',
                template: 'contact-form',
            },
            {
                name: 'Pricing Page',
                description: 'Pricing table with plan comparison',
                template: 'pricing',
            },
        ];
        return res.json({
            success: true,
            examples,
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to get examples', { error });
        return res.status(500).json({
            success: false,
            error: 'Failed to get example designs',
        });
    }
});
exports.default = router;
//# sourceMappingURL=visual-editor.routes.js.map