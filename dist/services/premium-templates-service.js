"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.premiumTemplatesService = exports.PremiumTemplatesService = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
const prisma = new client_1.PrismaClient();
/**
 * Premium Templates Library
 * World-class, production-ready application templates
 */
class PremiumTemplatesService {
    /**
     * Get all premium templates with filtering and search
     */
    async getAllTemplates(options = {}) {
        const { category, isPremium, isOfficial, search, limit = 50, offset = 0 } = options;
        const where = {};
        if (category)
            where.category = category;
        if (isPremium !== undefined)
            where.isPremium = isPremium;
        if (isOfficial !== undefined)
            where.isOfficial = isOfficial;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { tags: { has: search } },
            ];
        }
        const templates = await prisma.template.findMany({
            where,
            take: limit,
            skip: offset,
            orderBy: [
                { isOfficial: 'desc' },
                { downloads: 'desc' },
                { rating: 'desc' },
            ],
        });
        return templates;
    }
    /**
     * Initialize premium templates library
     */
    async seedPremiumTemplates() {
        logger_1.logger.info('Seeding premium templates...');
        const categories = await this.createCategories();
        const templates = await this.createPremiumTemplates(categories);
        logger_1.logger.info(`Seeded ${templates.length} premium templates across ${categories.length} categories`);
        return { categories, templates };
    }
    async createCategories() {
        const categories = [
            {
                name: 'SaaS',
                description: 'Software as a Service applications with subscriptions',
                icon: '🚀',
                order: 1,
            },
            {
                name: 'E-Commerce',
                description: 'Online stores and marketplaces',
                icon: '🛒',
                order: 2,
            },
            {
                name: 'Social Networks',
                description: 'Community platforms and social apps',
                icon: '👥',
                order: 3,
            },
            {
                name: 'Content Management',
                description: 'CMS, blogs, and publishing platforms',
                icon: '📝',
                order: 4,
            },
            {
                name: 'Finance & Crypto',
                description: 'Financial apps, crypto exchanges, DeFi platforms',
                icon: '💰',
                order: 5,
            },
            {
                name: 'AI & ML',
                description: 'AI-powered applications and ML platforms',
                icon: '🤖',
                order: 6,
            },
            {
                name: 'Real-time Apps',
                description: 'Chat, video, collaboration tools',
                icon: '⚡',
                order: 7,
            },
            {
                name: 'Analytics & Dashboards',
                description: 'Data visualization and business intelligence',
                icon: '📊',
                order: 8,
            },
            {
                name: 'Education',
                description: 'Learning management systems and course platforms',
                icon: '🎓',
                order: 9,
            },
            {
                name: 'Healthcare',
                description: 'Medical apps, telemedicine, health tracking',
                icon: '⚕️',
                order: 10,
            },
        ];
        const created = await Promise.all(categories.map((cat) => prisma.templateCategory.upsert({
            where: { name: cat.name },
            update: cat,
            create: cat,
        })));
        return created;
    }
    async createPremiumTemplates(categories) {
        const templates = [
            // SaaS Templates
            {
                name: 'Full-Stack SaaS Starter',
                description: 'Complete SaaS with authentication, subscriptions (Stripe), team management, billing portal, admin dashboard, and email notifications. Production-ready with TypeScript, React, and PostgreSQL.',
                category: 'SaaS',
                categoryId: categories.find((c) => c.name === 'SaaS')?.id,
                isPremium: false, // FREE & OPEN SOURCE!
                isOfficial: true,
                features: [
                    'User authentication (email, OAuth)',
                    'Stripe subscriptions & billing',
                    'Team & workspace management',
                    'Admin dashboard',
                    'Email notifications',
                    'Role-based access control',
                    'API key management',
                    'Usage analytics',
                ],
                tags: ['saas', 'stripe', 'subscriptions', 'teams', 'auth'],
                structure: {},
                dependencies: {},
                configuration: {},
            },
            // E-Commerce Templates
            {
                name: 'Modern E-Commerce Platform',
                description: 'Full-featured online store with product catalog, shopping cart, checkout, payment processing, inventory management, order tracking, and admin panel.',
                category: 'E-Commerce',
                categoryId: categories.find((c) => c.name === 'E-Commerce')?.id,
                isPremium: false, // FREE & OPEN SOURCE!
                isOfficial: true,
                features: [
                    'Product catalog with variants',
                    'Shopping cart & wishlist',
                    'Stripe & PayPal integration',
                    'Inventory management',
                    'Order tracking',
                    'Customer accounts',
                    'Admin panel',
                    'Email notifications',
                    'SEO optimization',
                ],
                tags: ['ecommerce', 'store', 'payments', 'inventory', 'shipping'],
                structure: {},
                dependencies: {},
                configuration: {},
            },
            {
                name: 'Marketplace Multi-Vendor',
                description: 'Multi-vendor marketplace like Etsy or Amazon. Vendor dashboards, commission system, order management, reviews, and analytics.',
                category: 'E-Commerce',
                categoryId: categories.find((c) => c.name === 'E-Commerce')?.id,
                isPremium: false, // FREE & OPEN SOURCE!
                isOfficial: true,
                features: [
                    'Multi-vendor support',
                    'Vendor dashboards',
                    'Commission management',
                    'Product approval workflow',
                    'Reviews & ratings',
                    'Dispute resolution',
                    'Analytics per vendor',
                ],
                tags: ['marketplace', 'multi-vendor', 'etsy', 'amazon'],
                structure: {},
                dependencies: {},
                configuration: {},
            },
            // Social Network Templates
            {
                name: 'Social Network Platform',
                description: 'Full social network with posts, comments, likes, follows, real-time notifications, direct messaging, and user profiles.',
                category: 'Social Networks',
                categoryId: categories.find((c) => c.name === 'Social Networks')?.id,
                isPremium: false, // FREE & OPEN SOURCE!
                isOfficial: true,
                features: [
                    'User profiles & customization',
                    'Posts, comments, likes',
                    'Follow/unfollow system',
                    'Real-time notifications',
                    'Direct messaging',
                    'News feed algorithm',
                    'Image & video uploads',
                    'Hashtags & mentions',
                ],
                tags: ['social', 'network', 'community', 'chat', 'realtime'],
                structure: {},
                dependencies: {},
                configuration: {},
            },
            {
                name: 'Community Forum',
                description: 'Discussion forum like Reddit or Discourse. Topics, threads, voting, moderation tools, and reputation system.',
                category: 'Social Networks',
                categoryId: categories.find((c) => c.name === 'Social Networks')?.id,
                isPremium: false, // FREE & OPEN SOURCE!
                isOfficial: true,
                features: [
                    'Topics & categories',
                    'Threaded discussions',
                    'Upvote/downvote system',
                    'Reputation & badges',
                    'Moderation tools',
                    'User mentions & notifications',
                    'Markdown support',
                    'Search & filters',
                ],
                tags: ['forum', 'community', 'reddit', 'discourse'],
                structure: {},
                dependencies: {},
                configuration: {},
            },
            // CMS Templates
            {
                name: 'Headless CMS',
                description: 'Modern headless CMS with REST & GraphQL APIs. Content types, media library, versioning, and multi-language support.',
                category: 'Content Management',
                categoryId: categories.find((c) => c.name === 'Content Management')?.id,
                isPremium: false, // FREE & OPEN SOURCE!
                isOfficial: true,
                features: [
                    'Custom content types',
                    'REST & GraphQL APIs',
                    'Media library',
                    'Version control',
                    'Multi-language',
                    'Role-based permissions',
                    'Webhooks',
                    'Preview mode',
                ],
                tags: ['cms', 'headless', 'api', 'content'],
                structure: {},
                dependencies: {},
                configuration: {},
            },
            {
                name: 'Blog Platform (like Medium)',
                description: 'Beautiful blogging platform with rich text editor, publications, followers, claps, reading time, and SEO optimization.',
                category: 'Content Management',
                categoryId: categories.find((c) => c.name === 'Content Management')?.id,
                isPremium: false, // FREE & OPEN SOURCE!
                isOfficial: true,
                features: [
                    'Rich text editor',
                    'Publications',
                    'Follow authors',
                    'Clap system',
                    'Comments',
                    'Reading time estimation',
                    'SEO optimization',
                    'Email newsletters',
                    'Monetization (Medium Partner)',
                ],
                tags: ['blog', 'medium', 'writing', 'publishing'],
                structure: {},
                dependencies: {},
                configuration: {},
            },
            // Finance & Crypto Templates
            {
                name: 'Crypto Exchange',
                description: 'Cryptocurrency exchange with order book, trading pairs, wallets, KYC, and real-time price updates.',
                category: 'Finance & Crypto',
                categoryId: categories.find((c) => c.name === 'Finance & Crypto')?.id,
                isPremium: false, // FREE & OPEN SOURCE!
                isOfficial: true,
                features: [
                    'Order book & matching engine',
                    'Multiple trading pairs',
                    'Crypto wallets integration',
                    'KYC/AML compliance',
                    'Real-time price charts',
                    'Trading history',
                    'Security (2FA, withdrawal limits)',
                    'API for trading bots',
                ],
                tags: ['crypto', 'exchange', 'trading', 'blockchain', 'defi'],
                structure: {},
                dependencies: {},
                configuration: {},
            },
            {
                name: 'Personal Finance Manager',
                description: 'Track expenses, budgets, investments, and goals. Bank connections, automatic categorization, and financial insights.',
                category: 'Finance & Crypto',
                categoryId: categories.find((c) => c.name === 'Finance & Crypto')?.id,
                isPremium: false, // FREE & OPEN SOURCE!
                isOfficial: true,
                features: [
                    'Expense tracking',
                    'Budget management',
                    'Investment portfolio',
                    'Bank connections (Plaid)',
                    'Automatic categorization',
                    'Financial goals',
                    'Reports & insights',
                    'Export to CSV/PDF',
                ],
                tags: ['finance', 'budgeting', 'expenses', 'investment'],
                structure: {},
                dependencies: {},
                configuration: {},
            },
            // AI & ML Templates
            {
                name: 'AI SaaS Platform',
                description: 'AI-powered SaaS with OpenAI/Anthropic integration, credit system, prompt templates, and usage analytics.',
                category: 'AI & ML',
                categoryId: categories.find((c) => c.name === 'AI & ML')?.id,
                isPremium: false, // FREE & OPEN SOURCE!
                isOfficial: true,
                features: [
                    'OpenAI & Anthropic integration',
                    'Credit/token system',
                    'Prompt templates library',
                    'Chat interface',
                    'File uploads & processing',
                    'Usage analytics',
                    'Model selection',
                    'Streaming responses',
                ],
                tags: ['ai', 'openai', 'anthropic', 'chatgpt', 'llm'],
                structure: {},
                dependencies: {},
                configuration: {},
            },
            {
                name: 'AI Image Generator',
                description: 'AI image generation platform using DALL-E, Midjourney, or Stable Diffusion. Gallery, styles, and commercial licensing.',
                category: 'AI & ML',
                categoryId: categories.find((c) => c.name === 'AI & ML')?.id,
                isPremium: false, // FREE & OPEN SOURCE!
                isOfficial: true,
                features: [
                    'Multiple AI models (DALL-E, SD, Midjourney)',
                    'Prompt engineering tools',
                    'Style presets',
                    'Image gallery',
                    'Upscaling & variations',
                    'Commercial licensing',
                    'API access',
                    'Batch generation',
                ],
                tags: ['ai', 'image', 'dalle', 'midjourney', 'stable-diffusion'],
                structure: {},
                dependencies: {},
                configuration: {},
            },
            // Real-time Apps
            {
                name: 'Video Conference Platform',
                description: 'Zoom-like video conferencing with screen sharing, recording, breakout rooms, and chat.',
                category: 'Real-time Apps',
                categoryId: categories.find((c) => c.name === 'Real-time Apps')?.id,
                isPremium: false, // FREE & OPEN SOURCE!
                isOfficial: true,
                features: [
                    'Video & audio calls',
                    'Screen sharing',
                    'Recording',
                    'Breakout rooms',
                    'Chat & reactions',
                    'Virtual backgrounds',
                    'Scheduling',
                    'WebRTC integration',
                ],
                tags: ['video', 'conference', 'zoom', 'webrtc', 'realtime'],
                structure: {},
                dependencies: {},
                configuration: {},
            },
            {
                name: 'Team Collaboration Tool',
                description: 'Slack-like team collaboration with channels, threads, file sharing, integrations, and search.',
                category: 'Real-time Apps',
                categoryId: categories.find((c) => c.name === 'Real-time Apps')?.id,
                isPremium: false, // FREE & OPEN SOURCE!
                isOfficial: true,
                features: [
                    'Channels & direct messages',
                    'Threaded conversations',
                    'File sharing',
                    'Reactions & emoji',
                    'Mentions & notifications',
                    'Integrations (GitHub, Jira)',
                    'Search',
                    'Video/audio calls',
                ],
                tags: ['chat', 'slack', 'collaboration', 'team', 'realtime'],
                structure: {},
                dependencies: {},
                configuration: {},
            },
            // Analytics & Dashboards
            {
                name: 'Business Intelligence Dashboard',
                description: 'Analytics dashboard with charts, KPIs, data sources integration, and custom reports.',
                category: 'Analytics & Dashboards',
                categoryId: categories.find((c) => c.name === 'Analytics & Dashboards')?.id,
                isPremium: false, // FREE & OPEN SOURCE!
                isOfficial: true,
                features: [
                    'Interactive charts (Chart.js, D3)',
                    'KPI widgets',
                    'Multiple data sources',
                    'Custom reports',
                    'Export to PDF/Excel',
                    'Real-time updates',
                    'Drill-down analysis',
                    'User permissions',
                ],
                tags: ['analytics', 'dashboard', 'bi', 'charts', 'reports'],
                structure: {},
                dependencies: {},
                configuration: {},
            },
            // Education Templates
            {
                name: 'Learning Management System (LMS)',
                description: 'Complete LMS like Udemy or Coursera. Courses, videos, quizzes, certificates, and student progress tracking.',
                category: 'Education',
                categoryId: categories.find((c) => c.name === 'Education')?.id,
                isPremium: false, // FREE & OPEN SOURCE!
                isOfficial: true,
                features: [
                    'Course creation & management',
                    'Video lessons',
                    'Quizzes & assignments',
                    'Progress tracking',
                    'Certificates',
                    'Discussion forums',
                    'Payments & enrollments',
                    'Instructor dashboards',
                ],
                tags: ['lms', 'education', 'courses', 'elearning', 'udemy'],
                structure: {},
                dependencies: {},
                configuration: {},
            },
            // Healthcare Templates
            {
                name: 'Telemedicine Platform',
                description: 'Healthcare platform with appointments, video consultations, prescriptions, and patient records.',
                category: 'Healthcare',
                categoryId: categories.find((c) => c.name === 'Healthcare')?.id,
                isPremium: false, // FREE & OPEN SOURCE!
                isOfficial: true,
                features: [
                    'Appointment scheduling',
                    'Video consultations',
                    'E-prescriptions',
                    'Patient records (HIPAA compliant)',
                    'Payment processing',
                    'Doctor availability',
                    'Medical history',
                    'Reminders & notifications',
                ],
                tags: ['healthcare', 'telemedicine', 'medical', 'appointments'],
                structure: {},
                dependencies: {},
                configuration: {},
            },
        ];
        const created = await Promise.all(templates.map((template) => prisma.template.create({
            data: template,
        })));
        return created;
    }
}
exports.PremiumTemplatesService = PremiumTemplatesService;
exports.premiumTemplatesService = new PremiumTemplatesService();
//# sourceMappingURL=premium-templates-service.js.map