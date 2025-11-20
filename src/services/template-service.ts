import { PrismaClient } from '@prisma/client';
import type { TemplateConfig } from '@/types';

const prisma = new PrismaClient();

export class TemplateService {
  async list() {
    // Try to get from database first
    const dbTemplates = await prisma.template.findMany({
      orderBy: { downloads: 'desc' },
    });

    // If database is empty, return built-in templates
    if (dbTemplates.length === 0) {
      return this.getBuiltInTemplates().map(t => ({
        id: t.id,
        name: t.name,
        description: t.description,
        category: t.category,
        structure: t.structure,
        dependencies: t.dependencies,
        configuration: {},
        version: t.version,
        downloads: 0,
        rating: 4.5,
        features: [],
        tags: [],
        isPremium: false,
        isOfficial: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
    }

    return dbTemplates;
  }

  async getById(id: string) {
    // Try database first
    const dbTemplate = await prisma.template.findUnique({
      where: { id },
    });

    if (dbTemplate) {
      return dbTemplate;
    }

    // Fallback to built-in templates
    const builtIn = this.getBuiltInTemplates().find(t => t.id === id);
    if (builtIn) {
      return {
        id: builtIn.id,
        name: builtIn.name,
        description: builtIn.description,
        category: builtIn.category,
        structure: builtIn.structure,
        dependencies: builtIn.dependencies,
        configuration: {},
        version: builtIn.version,
        downloads: 0,
        rating: 4.5,
        features: [],
        tags: [],
        isPremium: false,
        isOfficial: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    return null;
  }

  async getByCategory(category: string) {
    const dbTemplates = await prisma.template.findMany({
      where: { category },
    });

    if (dbTemplates.length === 0) {
      return this.getBuiltInTemplates()
        .filter(t => t.category === category)
        .map(t => ({
          id: t.id,
          name: t.name,
          description: t.description,
          category: t.category,
          structure: t.structure,
          dependencies: t.dependencies,
          configuration: {},
          version: t.version,
          downloads: 0,
          rating: 4.5,
          features: [],
          tags: [],
          isPremium: false,
          isOfficial: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
    }

    return dbTemplates;
  }

  // Predefined templates with best-in-class boilerplate integrations
  getBuiltInTemplates(): TemplateConfig[] {
    return [
      {
        id: 'saas-starter',
        name: 'SaaS Starter Pro',
        description: 'Enterprise-grade SaaS with Next.js 14, Shadcn UI, Auth.js, Prisma, Stripe subscriptions, admin dashboard, and more. Inspired by Saasfly.',
        category: 'SAAS',
        version: '2.0.0',
        structure: {
          directories: [
            'src/app',
            'src/components/ui',
            'src/lib',
            'src/hooks',
            'prisma',
            'public',
          ],
          files: [],
        },
        dependencies: {
          'next': '^14.2.0',
          'react': '^18.3.1',
          'react-dom': '^18.3.1',
          '@prisma/client': '^5.20.0',
          '@auth/prisma-adapter': '^2.0.0',
          'next-auth': '^5.0.0-beta.19',
          'stripe': '^16.12.0',
          '@stripe/stripe-js': '^4.4.0',
          'tailwindcss': '^3.4.1',
          '@radix-ui/react-dialog': '^1.0.5',
          '@radix-ui/react-dropdown-menu': '^2.0.6',
          '@radix-ui/react-slot': '^1.0.2',
          'class-variance-authority': '^0.7.0',
          'clsx': '^2.1.0',
          'lucide-react': '^0.400.0',
          'tailwind-merge': '^2.3.0',
          'zod': '^3.23.8',
          'react-hook-form': '^7.52.0',
          '@hookform/resolvers': '^3.6.0',
          'sonner': '^1.5.0',
          'resend': '^3.4.0',
        },
        devDependencies: {
          'typescript': '^5.6.2',
          'prisma': '^5.20.0',
          '@types/node': '^20.14.0',
          '@types/react': '^18.3.3',
          'eslint': '^8.57.0',
          'eslint-config-next': '^14.2.0',
        },
        scripts: {
          'dev': 'next dev',
          'build': 'next build',
          'start': 'next start',
          'lint': 'next lint',
          'db:push': 'prisma db push',
          'db:studio': 'prisma studio',
        },
      },
      {
        id: 'ecommerce-platform',
        name: 'E-Commerce Pro',
        description: 'Full-featured e-commerce platform with Next.js 14, Shadcn UI, Stripe payments, inventory management, admin dashboard, and multi-vendor support.',
        category: 'ECOMMERCE',
        version: '2.0.0',
        structure: {
          directories: [
            'src/app',
            'src/components/ui',
            'src/lib',
            'src/hooks',
            'prisma',
            'public',
          ],
          files: [],
        },
        dependencies: {
          'next': '^14.2.0',
          'react': '^18.3.1',
          '@prisma/client': '^5.20.0',
          'stripe': '^16.12.0',
          '@stripe/stripe-js': '^4.4.0',
          'next-auth': '^5.0.0-beta.19',
          'tailwindcss': '^3.4.1',
          '@radix-ui/react-dialog': '^1.0.5',
          '@radix-ui/react-tabs': '^1.0.4',
          'class-variance-authority': '^0.7.0',
          'clsx': '^2.1.0',
          'lucide-react': '^0.400.0',
          'zustand': '^4.5.4',
          'uploadthing': '^6.13.2',
          'recharts': '^2.12.7',
          'zod': '^3.23.8',
        },
        devDependencies: {
          'typescript': '^5.6.2',
          'prisma': '^5.20.0',
        },
        scripts: {
          'dev': 'next dev',
          'build': 'next build',
        },
      },
      {
        id: 'blog-cms',
        name: 'Blog & CMS Pro',
        description: 'Modern content management system with Next.js 14, MDX support, Shadcn UI, SEO optimization, analytics, and admin dashboard.',
        category: 'BLOG',
        version: '2.0.0',
        structure: {
          directories: [
            'src/app',
            'src/components/ui',
            'src/content',
            'src/lib',
            'prisma',
            'public',
          ],
          files: [],
        },
        dependencies: {
          'next': '^14.2.0',
          'react': '^18.3.1',
          '@prisma/client': '^5.20.0',
          'next-auth': '^5.0.0-beta.19',
          'tailwindcss': '^3.4.1',
          '@radix-ui/react-dialog': '^1.0.5',
          'class-variance-authority': '^0.7.0',
          'clsx': '^2.1.0',
          'lucide-react': '^0.400.0',
          '@next/mdx': '^14.2.0',
          'contentlayer': '^0.3.4',
          'next-contentlayer': '^0.3.4',
          'rehype-pretty-code': '^0.13.2',
          'shiki': '^1.10.0',
          'next-seo': '^6.5.0',
        },
        devDependencies: {
          'typescript': '^5.6.2',
          'prisma': '^5.20.0',
        },
        scripts: {
          'dev': 'next dev',
          'build': 'next build',
        },
      },
      {
        id: 'rest-api',
        name: 'REST API Pro',
        description: 'Production-ready REST API with Express.js, TypeScript, Prisma, JWT auth, Swagger docs, rate limiting, and comprehensive testing.',
        category: 'API',
        version: '2.0.0',
        structure: {
          directories: [
            'src/api/routes',
            'src/api/controllers',
            'src/api/middleware',
            'src/services',
            'src/utils',
            'prisma',
            'tests',
          ],
          files: [],
        },
        dependencies: {
          'express': '^4.19.2',
          '@prisma/client': '^5.20.0',
          'bcrypt': '^5.1.1',
          'jsonwebtoken': '^9.0.2',
          'zod': '^3.23.8',
          'helmet': '^7.1.0',
          'cors': '^2.8.5',
          'swagger-jsdoc': '^6.2.8',
          'swagger-ui-express': '^5.0.1',
          'winston': '^3.14.0',
          'express-rate-limit': '^7.3.1',
          'ioredis': '^5.4.1',
        },
        devDependencies: {
          'typescript': '^5.6.2',
          'prisma': '^5.20.0',
          'vitest': '^2.1.1',
          'supertest': '^7.0.0',
          '@types/express': '^4.17.21',
          '@types/bcrypt': '^5.0.2',
          '@types/jsonwebtoken': '^9.0.7',
        },
        scripts: {
          'dev': 'tsx watch src/index.ts',
          'build': 'tsc',
          'start': 'node dist/index.js',
          'test': 'vitest',
        },
      },
      {
        id: 'ai-saas',
        name: 'AI SaaS Platform',
        description: 'AI-powered SaaS with Next.js 14, OpenAI/Anthropic integration, credit system, chat interface, file uploads, and usage analytics.',
        category: 'SAAS',
        version: '1.0.0',
        structure: {
          directories: [
            'src/app',
            'src/components/ui',
            'src/lib/ai',
            'src/hooks',
            'prisma',
          ],
          files: [],
        },
        dependencies: {
          'next': '^14.2.0',
          'react': '^18.3.1',
          '@prisma/client': '^5.20.0',
          'openai': '^4.68.0',
          '@anthropic-ai/sdk': '^0.30.0',
          'ai': '^3.3.0',
          'stripe': '^16.12.0',
          'next-auth': '^5.0.0-beta.19',
          'tailwindcss': '^3.4.1',
          'lucide-react': '^0.400.0',
          'uploadthing': '^6.13.2',
          'zustand': '^4.5.4',
        },
      },
      {
        id: 'marketplace',
        name: 'Multi-Vendor Marketplace',
        description: 'Complete marketplace platform with vendor management, commission system, product approval, reviews, and payout management.',
        category: 'ECOMMERCE',
        version: '1.0.0',
        structure: {
          directories: [
            'src/app',
            'src/components/ui',
            'src/lib',
            'prisma',
          ],
          files: [],
        },
        dependencies: {
          'next': '^14.2.0',
          'react': '^18.3.1',
          '@prisma/client': '^5.20.0',
          'stripe': '^16.12.0',
          'next-auth': '^5.0.0-beta.19',
          'tailwindcss': '^3.4.1',
          'lucide-react': '^0.400.0',
          'uploadthing': '^6.13.2',
          'recharts': '^2.12.7',
        },
      },
    ];
  }
}
