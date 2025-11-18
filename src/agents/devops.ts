import { logger } from '@/utils/logger';
import type { OrchestratorContext, GeneratedFile } from '@/types';

export class DevOpsAgent {
  async generate(context: OrchestratorContext): Promise<{ files: GeneratedFile[] }> {
    logger.info('DevOps Agent: Generating deployment configuration');

    const files: GeneratedFile[] = [];

    // Generate Docker files
    files.push(...this.generateDockerFiles());

    // Generate GitHub Actions
    files.push(...this.generateGitHubActions());

    // Generate deployment configs
    if (context.config.deployment) {
      files.push(...this.generateDeploymentConfig(context));
    }

    return { files };
  }

  private generateDockerFiles(): GeneratedFile[] {
    return [
      {
        path: 'Dockerfile',
        content: `FROM node:20-alpine AS base

# Backend Build
FROM base AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend ./
RUN npm run build

# Frontend Build
FROM base AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend ./
RUN npm run build

# Production Image
FROM base AS production
WORKDIR /app

# Install backend production dependencies
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm ci --only=production

# Copy built files
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=frontend-builder /app/frontend/dist ../frontend/dist

# Copy prisma files
COPY backend/prisma ./prisma
RUN npx prisma generate

EXPOSE 3000

CMD ["node", "dist/index.js"]
`,
        language: 'dockerfile',
        description: 'Multi-stage Dockerfile',
      },
      {
        path: 'docker-compose.yml',
        content: `version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: app_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/app_db
      REDIS_URL: redis://redis:6379
      NODE_ENV: production
    env_file:
      - .env
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  postgres_data:
  redis_data:
`,
        language: 'yaml',
        description: 'Docker Compose configuration',
      },
    ];
  }

  private generateGitHubActions(): GeneratedFile[] {
    return [
      {
        path: '.github/workflows/ci.yml',
        content: `name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: |
          cd backend && npm ci
          cd ../frontend && npm ci

      - name: Run linter
        run: |
          cd backend && npm run lint
          cd ../frontend && npm run lint

      - name: Run tests
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
        run: |
          cd backend && npm test
          cd ../frontend && npm test

      - name: Build
        run: |
          cd backend && npm run build
          cd ../frontend && npm run build
`,
        language: 'yaml',
        description: 'GitHub Actions CI workflow',
      },
      {
        path: '.github/workflows/deploy.yml',
        content: `name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Build Docker image
        run: docker build -t app:latest .

      - name: Push to registry
        run: |
          echo "\${{ secrets.DOCKER_PASSWORD }}" | docker login -u "\${{ secrets.DOCKER_USERNAME }}" --password-stdin
          docker tag app:latest \${{ secrets.DOCKER_USERNAME }}/app:latest
          docker push \${{ secrets.DOCKER_USERNAME }}/app:latest

      - name: Deploy
        run: |
          # Add deployment commands here
          echo "Deploying application..."
`,
        language: 'yaml',
        description: 'GitHub Actions deploy workflow',
      },
    ];
  }

  private generateDeploymentConfig(context: OrchestratorContext): GeneratedFile[] {
    const files: GeneratedFile[] = [];
    const provider = context.config.deployment?.provider;

    if (provider === 'vercel') {
      files.push({
        path: 'vercel.json',
        content: `{
  "version": 2,
  "builds": [
    {
      "src": "backend/package.json",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/dist/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/dist/index.html"
    }
  ]
}
`,
        language: 'json',
        description: 'Vercel configuration',
      });
    } else if (provider === 'netlify') {
      files.push({
        path: 'netlify.toml',
        content: `[build]
  base = "frontend"
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`,
        language: 'toml',
        description: 'Netlify configuration',
      });
    }

    return files;
  }
}
