# 🚀 Deployment Guide - Ultimate App Builder

This guide provides step-by-step instructions for deploying Ultimate App Builder in various environments.

## 📋 Table of Contents

- [Quick Start with Docker](#quick-start-with-docker)
- [Configuration Options](#configuration-options)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)

---

## 🐳 Quick Start with Docker

The **easiest** way to deploy Ultimate App Builder is using Docker Compose.

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/uglyswap/ultimateappbuilder.git
cd ultimateappbuilder

# 2. Start all services
docker-compose up -d

# 3. Check logs
docker-compose logs -f app

# 4. Wait for the app to be ready (usually 30-60 seconds)
# You should see: "✨ Ready to build amazing apps! ✨"
```

### Verify Deployment

```bash
# Check health
curl http://localhost:3000/health

# Expected response:
# {"status":"ok","timestamp":"...","uptime":123,"version":"1.0.0"}
```

---

## ⚙️ Configuration Options

### Option 1: Setup API (Recommended)

Configure your application **after** it starts using the Setup API:

```bash
# Check current setup status
curl http://localhost:3000/api/setup/status

# Complete setup with your API keys
curl -X POST http://localhost:3000/api/setup/complete \
  -H "Content-Type: application/json" \
  -d '{
    "aiProvider": "anthropic",
    "anthropicApiKey": "sk-ant-...",
    "openaiApiKey": "sk-...",
    "openrouterApiKey": "sk-or-..."
  }'
```

### Option 2: Environment Variables

Edit the `.env` file before starting:

```bash
# Copy the example file
cp .env.example .env

# Edit the file
nano .env

# Add your keys
ANTHROPIC_API_KEY="sk-ant-..."
OPENAI_API_KEY="sk-..."
OPENROUTER_API_KEY="sk-or-..."

# Restart the app
docker-compose restart app
```

### Option 3: Docker Compose Override

Create a `docker-compose.override.yml` file:

```yaml
version: '3.8'

services:
  app:
    environment:
      ANTHROPIC_API_KEY: "sk-ant-your-key-here"
      OPENAI_API_KEY: "sk-your-key-here"
      OPENROUTER_API_KEY: "sk-or-your-key-here"
```

Then restart:
```bash
docker-compose up -d
```

---

## 🏭 Production Deployment

### Security Checklist

- [ ] Change default JWT secret
- [ ] Use strong encryption key
- [ ] Enable HTTPS/TLS
- [ ] Set up firewall rules
- [ ] Use Docker secrets for sensitive data
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Regular backups of PostgreSQL data

### Production Configuration

```bash
# Production .env settings
NODE_ENV=production
JWT_SECRET=your-very-long-random-secret-key-change-this
ENCRYPTION_KEY=your-32-character-encryption-key!!

# Disable debug mode
ENABLE_DEBUG_MODE=false

# Adjust rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Production database (use managed service)
DATABASE_URL=postgresql://user:pass@your-db-host:5432/ultimate_app_builder
REDIS_URL=redis://your-redis-host:6379
```

### Using Docker Secrets (Recommended for Production)

```yaml
version: '3.8'

services:
  app:
    secrets:
      - anthropic_api_key
      - openai_api_key
      - jwt_secret

secrets:
  anthropic_api_key:
    file: ./secrets/anthropic_api_key.txt
  openai_api_key:
    file: ./secrets/openai_api_key.txt
  jwt_secret:
    file: ./secrets/jwt_secret.txt
```

### HTTPS with Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket support
    location /ws {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

---

## 🔧 Troubleshooting

### App doesn't start

**Check logs:**
```bash
docker-compose logs app
```

**Common issues:**

1. **Database connection failed**
   ```bash
   # Check if PostgreSQL is running
   docker-compose ps postgres

   # Restart PostgreSQL
   docker-compose restart postgres
   ```

2. **Redis connection failed**
   ```bash
   # Check if Redis is running
   docker-compose ps redis

   # Restart Redis
   docker-compose restart redis
   ```

3. **Migration errors**
   ```bash
   # Enter the app container
   docker-compose exec app sh

   # Run migrations manually
   npx prisma migrate deploy

   # Generate Prisma client
   npx prisma generate
   ```

### Port already in use

```bash
# Change the port in docker-compose.yml
services:
  app:
    ports:
      - "3001:3000"  # Use port 3001 instead
```

### Slow startup

The app can take 30-60 seconds to start on first run due to:
- Database migrations
- Prisma client generation
- Service initialization

**This is normal!** Check the health endpoint:

```bash
# Wait for healthy status
while ! curl -f http://localhost:3000/health; do
  echo "Waiting for app to be ready..."
  sleep 5
done
echo "App is ready!"
```

### Database reset

```bash
# WARNING: This will delete all data!
docker-compose down -v
docker-compose up -d
```

### View all logs

```bash
# Follow all service logs
docker-compose logs -f

# View only app logs
docker-compose logs -f app

# View only database logs
docker-compose logs -f postgres
```

---

## 📊 Monitoring

### Health Checks

```bash
# Application health
curl http://localhost:3000/health

# Database health (from within app container)
docker-compose exec app npx prisma db execute --stdin <<< "SELECT 1"

# Redis health
docker-compose exec redis redis-cli ping
```

### Resource Usage

```bash
# Check container stats
docker stats

# Check disk usage
docker system df
```

---

## 🔄 Updates

### Updating to latest version

```bash
# Pull latest code
git pull origin main

# Rebuild containers
docker-compose build --no-cache

# Restart with new version
docker-compose up -d

# Run any new migrations
docker-compose exec app npx prisma migrate deploy
```

---

## 💾 Backups

### Database Backup

```bash
# Create backup
docker-compose exec postgres pg_dump -U postgres ultimate_app_builder > backup.sql

# Restore from backup
cat backup.sql | docker-compose exec -T postgres psql -U postgres ultimate_app_builder
```

### Full Backup (including volumes)

```bash
# Stop the app
docker-compose stop app

# Backup PostgreSQL data
docker run --rm \
  -v ultimateappbuilder_postgres_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/postgres-backup.tar.gz /data

# Backup Redis data
docker run --rm \
  -v ultimateappbuilder_redis_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/redis-backup.tar.gz /data

# Restart the app
docker-compose start app
```

---

## 🆘 Support

- **GitHub Issues**: https://github.com/uglyswap/ultimateappbuilder/issues
- **Discussions**: https://github.com/uglyswap/ultimateappbuilder/discussions
- **API Docs**: http://localhost:3000/api-docs

---

## ✅ Deployment Checklist

- [ ] Docker and Docker Compose installed
- [ ] Repository cloned
- [ ] `docker-compose up -d` executed
- [ ] Health check passes
- [ ] API keys configured (via Setup API or .env)
- [ ] Application accessible at http://localhost:3000
- [ ] Can create a test project
- [ ] WebSocket connection works
- [ ] (Production) HTTPS configured
- [ ] (Production) Backups scheduled
- [ ] (Production) Monitoring set up

---

**Made with ❤️ by developers, for developers**

**The #1 AI-Powered App Builder in the World** 🌍
