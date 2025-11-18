import { logger } from '@/utils/logger';
import { aiClient } from '@/utils/ai-client';
import type {
  ProjectConfig,
  AgentTask,
  OrchestratorContext,
  GeneratedProject,
  AgentType,
} from '@/types';
import { BackendAgent } from '@/agents/backend';
import { FrontendAgent } from '@/agents/frontend';
import { DatabaseAgent } from '@/agents/database';
import { AuthAgent } from '@/agents/auth';
import { IntegrationsAgent } from '@/agents/integrations';
import { DevOpsAgent } from '@/agents/devops';

export class Orchestrator {
  private context: OrchestratorContext;
  private agents: Map<AgentType, any>;

  constructor(projectId: string, userId: string, config: ProjectConfig) {
    this.context = {
      projectId,
      userId,
      config,
      currentPhase: 'initialization',
      completedTasks: [],
      pendingTasks: [],
      generatedFiles: [],
      errors: [],
    };

    // Initialize agents
    this.agents = new Map([
      ['backend', new BackendAgent()],
      ['frontend', new FrontendAgent()],
      ['database', new DatabaseAgent()],
      ['auth', new AuthAgent()],
      ['integrations', new IntegrationsAgent()],
      ['devops', new DevOpsAgent()],
    ]);
  }

  async orchestrate(): Promise<GeneratedProject> {
    logger.info('🚀 Starting project orchestration', {
      projectId: this.context.projectId,
      template: this.context.config.template,
    });

    try {
      // Phase 1: Planning
      await this.planProject();

      // Phase 2: Database Schema
      await this.generateDatabase();

      // Phase 3: Backend API
      await this.generateBackend();

      // Phase 4: Authentication
      if (this.context.config.auth) {
        await this.generateAuth();
      }

      // Phase 5: Frontend
      await this.generateFrontend();

      // Phase 6: Integrations
      if (this.context.config.integrations && this.context.config.integrations.length > 0) {
        await this.generateIntegrations();
      }

      // Phase 7: DevOps & Deployment
      await this.generateDevOps();

      // Final: Assemble project
      const project = await this.assembleProject();

      logger.info('✅ Project orchestration completed successfully', {
        projectId: this.context.projectId,
        filesGenerated: this.context.generatedFiles.length,
      });

      return project;
    } catch (error) {
      logger.error('❌ Orchestration failed', {
        projectId: this.context.projectId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  private async planProject(): Promise<void> {
    logger.info('📋 Phase 1: Planning project architecture');
    this.context.currentPhase = 'planning';

    const planningPrompt = `
You are the Orchestrator agent. Plan the architecture for a ${this.context.config.template} application.

Project Name: ${this.context.config.name}
Description: ${this.context.config.description || 'N/A'}

Features requested:
${this.context.config.features.map(f => `- ${f.name} (${f.enabled ? 'enabled' : 'disabled'})`).join('\n')}

Create a detailed plan including:
1. Project structure (directories and key files)
2. Technology stack
3. Component breakdown
4. API endpoints needed
5. Database models
6. Integration points

Return a JSON object with the plan.
`;

    const response = await aiClient.generateCode(planningPrompt, 'orchestrator');

    // Store planning result
    this.context.currentPhase = 'planning-complete';
    logger.info('✅ Planning phase completed');
  }

  private async generateDatabase(): Promise<void> {
    logger.info('🗄️  Phase 2: Generating database schema');
    this.context.currentPhase = 'database';

    const agent = this.agents.get('database');
    const result = await agent.generate(this.context);

    this.context.generatedFiles.push(...result.files);
    this.context.completedTasks.push('database');

    logger.info('✅ Database generation completed', {
      filesGenerated: result.files.length,
    });
  }

  private async generateBackend(): Promise<void> {
    logger.info('⚙️  Phase 3: Generating backend API');
    this.context.currentPhase = 'backend';

    const agent = this.agents.get('backend');
    const result = await agent.generate(this.context);

    this.context.generatedFiles.push(...result.files);
    this.context.completedTasks.push('backend');

    logger.info('✅ Backend generation completed', {
      filesGenerated: result.files.length,
    });
  }

  private async generateAuth(): Promise<void> {
    logger.info('🔐 Phase 4: Generating authentication system');
    this.context.currentPhase = 'auth';

    const agent = this.agents.get('auth');
    const result = await agent.generate(this.context);

    this.context.generatedFiles.push(...result.files);
    this.context.completedTasks.push('auth');

    logger.info('✅ Auth generation completed', {
      filesGenerated: result.files.length,
    });
  }

  private async generateFrontend(): Promise<void> {
    logger.info('🎨 Phase 5: Generating frontend application');
    this.context.currentPhase = 'frontend';

    const agent = this.agents.get('frontend');
    const result = await agent.generate(this.context);

    this.context.generatedFiles.push(...result.files);
    this.context.completedTasks.push('frontend');

    logger.info('✅ Frontend generation completed', {
      filesGenerated: result.files.length,
    });
  }

  private async generateIntegrations(): Promise<void> {
    logger.info('🔌 Phase 6: Generating integrations');
    this.context.currentPhase = 'integrations';

    const agent = this.agents.get('integrations');
    const result = await agent.generate(this.context);

    this.context.generatedFiles.push(...result.files);
    this.context.completedTasks.push('integrations');

    logger.info('✅ Integrations generation completed', {
      filesGenerated: result.files.length,
    });
  }

  private async generateDevOps(): Promise<void> {
    logger.info('🚢 Phase 7: Generating DevOps configuration');
    this.context.currentPhase = 'devops';

    const agent = this.agents.get('devops');
    const result = await agent.generate(this.context);

    this.context.generatedFiles.push(...result.files);
    this.context.completedTasks.push('devops');

    logger.info('✅ DevOps generation completed', {
      filesGenerated: result.files.length,
    });
  }

  private async assembleProject(): Promise<GeneratedProject> {
    logger.info('📦 Assembling final project');

    return {
      name: this.context.config.name,
      structure: this.context.generatedFiles,
      packageJson: this.generatePackageJson(),
      readme: this.generateReadme(),
      envExample: this.generateEnvExample(),
    };
  }

  private generatePackageJson(): Record<string, unknown> {
    return {
      name: this.context.config.name,
      version: '1.0.0',
      description: this.context.config.description || '',
      scripts: {
        dev: 'npm run dev:backend & npm run dev:frontend',
        'dev:backend': 'cd backend && npm run dev',
        'dev:frontend': 'cd frontend && npm run dev',
        build: 'npm run build:backend && npm run build:frontend',
        'build:backend': 'cd backend && npm run build',
        'build:frontend': 'cd frontend && npm run build',
        start: 'npm run start:backend & npm run start:frontend',
        test: 'npm run test:backend && npm run test:frontend',
        'docker:up': 'docker-compose up -d',
        'docker:down': 'docker-compose down',
      },
      keywords: [this.context.config.template.toLowerCase()],
      author: '',
      license: 'MIT',
    };
  }

  private generateReadme(): string {
    return `# ${this.context.config.name}

${this.context.config.description || 'A modern web application'}

## Template: ${this.context.config.template}

## Features

${this.context.config.features.filter(f => f.enabled).map(f => `- ✅ ${f.name}`).join('\n')}

## Quick Start

\`\`\`bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev

# Or use Docker
docker-compose up
\`\`\`

## Tech Stack

- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React + TypeScript + Tailwind CSS
- **Database**: ${this.context.config.database?.type || 'PostgreSQL'}
- **Auth**: ${this.context.config.auth?.providers.join(', ') || 'JWT'}

## Deployment

\`\`\`bash
# Build for production
npm run build

# Start production server
npm start

# Or deploy with Docker
docker build -t ${this.context.config.name} .
docker run -p 3000:3000 ${this.context.config.name}
\`\`\`

## Documentation

See the \`docs/\` directory for detailed documentation.

## License

MIT

---

Generated with ❤️ by Ultimate App Builder
`;
  }

  private generateEnvExample(): Record<string, string> {
    const env: Record<string, string> = {
      NODE_ENV: 'development',
      PORT: '3000',
      DATABASE_URL: 'postgresql://user:password@localhost:5432/dbname',
    };

    if (this.context.config.auth) {
      env.JWT_SECRET = 'your-secret-key-change-this';
    }

    if (this.context.config.integrations) {
      for (const integration of this.context.config.integrations) {
        if (integration.type === 'stripe') {
          env.STRIPE_SECRET_KEY = 'sk_test_...';
        }
        if (integration.type === 'sendgrid') {
          env.SENDGRID_API_KEY = 'SG...';
        }
      }
    }

    return env;
  }

  getContext(): OrchestratorContext {
    return this.context;
  }
}
