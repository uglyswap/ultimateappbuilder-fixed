# 🚀 Deployment Guide - Ultimate App Builder

## Quick Start with Docker Compose (Recommended)

The easiest way to deploy Ultimate App Builder with all dependencies (PostgreSQL + Redis) already configured:

```bash
# 1. Clone the repository
git clone https://github.com/uglyswap/ultimateappbuilder-fixed.git
cd ultimateappbuilder-fixed

# 2. Copy environment file (optional - has sensible defaults)
cp .env.example .env

# 3. Start everything with Docker Compose
docker-compose up -d

# 4. Access the application
# → Application: http://localhost:3000
# → API Docs: http://localhost:3000/api-docs
# → Health Check: http://localhost:3000/health
```

That's it! The application is ready to use.

## 🔑 Configure AI API Keys (After Deployment)

**API keys are now OPTIONAL** - you can configure them after deployment via the web interface or environment variables.

### Option 1: Via Web Interface (Recommended)
1. Access http://localhost:3000
2. Go to Settings → API Configuration
3. Enter your AI API key (OpenRouter, Anthropic, or OpenAI)
4. Save and restart if needed

### Option 2: Via Environment Variables
Edit your `.env` file and add:

```bash
# Choose your AI provider
AI_PROVIDER=openrouter  # or anthropic, openai

# Add the corresponding API key
OPENROUTER_API_KEY=sk-or-v1-your-key-here
# OR
ANTHROPIC_API_KEY=sk-ant-your-key-here
# OR
OPENAI_API_KEY=sk-your-key-here
```

Then restart: `docker-compose restart app`

## 📦 What's Included

The `docker-compose up` command automatically sets up:

- ✅ **PostgreSQL 16** database (with automatic schema migrations)
- ✅ **Redis 7** for caching and queues
- ✅ **Application server** on port 3000
- ✅ **Health checks** for all services
- ✅ **Persistent volumes** for data
- ✅ **Automatic migrations** on startup

## 🔧 Advanced Configuration

### Production Deployment

For production, update these in your `.env`:

```bash
NODE_ENV=production
JWT_SECRET=your-super-secure-random-string-here
APP_URL=https://your-domain.com
```

### Using External Databases

If you want to use existing PostgreSQL/Redis instances:

1. Comment out the `postgres` and `redis` services in `docker-compose.yml`
2. Update `.env` with your database URLs:

```bash
DATABASE_URL=postgresql://user:pass@your-db-host:5432/dbname
REDIS_URL=redis://your-redis-host:6379
```

## 🎯 Deployment on Dokploy / Cloud Platforms

### Dokploy Deployment

1. In Dokploy, create a new application
2. Connect to GitHub repository: `uglyswap/ultimateappbuilder-fixed`
3. Set Build Type: `nixpacks` or `docker`
4. Add environment variables (only DATABASE_URL is required):
   ```
   DATABASE_URL=your-postgres-url
   REDIS_URL=your-redis-url
   ```
5. Deploy!

**Note:** PostgreSQL and Redis will be created automatically if using docker-compose mode.

### Heroku / Railway / Render

These platforms will auto-detect the Dockerfile and deploy. Just add:

1. PostgreSQL addon
2. Redis addon  
3. Environment variables from `.env.example`

## 🛠️ Development Mode

```bash
# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Start development server (with hot reload)
npm run dev
```

## 📊 Database Migrations

Migrations run automatically on startup. To manage manually:

```bash
# Create a new migration
npx prisma migrate dev --name your_migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (⚠️ destroys data)
npx prisma migrate reset
```

## 🔍 Troubleshooting

### Application won't start

1. Check logs: `docker-compose logs app`
2. Verify database is ready: `docker-compose logs postgres`
3. Check environment variables in `.env`

### Database connection errors

- Ensure PostgreSQL is running: `docker-compose ps`
- Verify DATABASE_URL format:  
  `postgresql://user:password@host:port/database?schema=public`

### "No AI API keys configured" warning

This is normal! Configure your API key via the web interface after deployment, or add it to `.env` and restart.

## 🆘 Support

- 📖 Full API Documentation: http://localhost:3000/api-docs
- 🐛 Issues: https://github.com/uglyswap/ultimateappbuilder-fixed/issues
- 💬 Discussions: https://github.com/uglyswap/ultimateappbuilder-fixed/discussions

## 🎉 Success!

If you see this message in the logs:
```
✨ Ready to build amazing apps! ✨
```

You're all set! Visit http://localhost:3000 to start building.
