# Deployment Guide

## Overview

Ultimate App Builder can be deployed in multiple ways. This guide covers all deployment options.

## Prerequisites

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16+
- Redis 7+
- Domain name (for production)

## Option 1: Docker (Recommended)

### Single Command Deploy

```bash
docker-compose up -d
```

This starts:
- Application server (port 3000)
- PostgreSQL database (port 5432)
- Redis cache (port 6379)

### Custom Build

```bash
# Build image
docker build -t ultimate-app-builder:latest .

# Run with custom environment
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL="your-db-url" \
  -e ANTHROPIC_API_KEY="your-key" \
  ultimate-app-builder:latest
```

## Option 2: Vercel

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Configure `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.ts"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

3. Deploy:
```bash
vercel --prod
```

4. Set environment variables in Vercel dashboard

## Option 3: AWS

### EC2 Deployment

1. Launch EC2 instance (t3.medium recommended)
2. SSH into instance
3. Install dependencies:
```bash
sudo apt update
sudo apt install -y nodejs npm postgresql redis docker docker-compose
```

4. Clone repository:
```bash
git clone https://github.com/uglyswap/ultimateappbuilder.git
cd ultimateappbuilder
```

5. Configure environment:
```bash
cp .env.example .env
nano .env  # Edit with your values
```

6. Start application:
```bash
docker-compose up -d
```

7. Configure Nginx reverse proxy:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

8. Enable SSL with Let's Encrypt:
```bash
sudo certbot --nginx -d your-domain.com
```

### ECS/Fargate Deployment

1. Create ECR repository:
```bash
aws ecr create-repository --repository-name ultimate-app-builder
```

2. Build and push image:
```bash
aws ecr get-login-password | docker login --username AWS --password-stdin your-account.dkr.ecr.region.amazonaws.com
docker build -t ultimate-app-builder .
docker tag ultimate-app-builder:latest your-account.dkr.ecr.region.amazonaws.com/ultimate-app-builder:latest
docker push your-account.dkr.ecr.region.amazonaws.com/ultimate-app-builder:latest
```

3. Create ECS cluster and service
4. Configure load balancer
5. Set environment variables in task definition

## Option 4: Railway

1. Install Railway CLI:
```bash
npm i -g @railway/cli
```

2. Login and init:
```bash
railway login
railway init
```

3. Add PostgreSQL:
```bash
railway add postgresql
```

4. Deploy:
```bash
railway up
```

5. Set environment variables:
```bash
railway variables set ANTHROPIC_API_KEY=your-key
```

## Environment Variables

### Required

```bash
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
ANTHROPIC_API_KEY="your-anthropic-key"
JWT_SECRET="your-secret-key"
```

### Optional

```bash
# Redis
REDIS_URL="redis://localhost:6379"

# Integrations
STRIPE_SECRET_KEY="sk_live_..."
GITHUB_TOKEN="ghp_..."
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-password"

# Application
NODE_ENV="production"
PORT="3000"
APP_URL="https://your-domain.com"
```

## Database Setup

### PostgreSQL

```bash
# Create database
createdb ultimate_app_builder

# Run migrations
npm run prisma:migrate

# Seed database (optional)
npx prisma db seed
```

## SSL/TLS

### Using Let's Encrypt

```bash
sudo certbot --nginx -d your-domain.com
```

### Using Cloudflare

1. Add domain to Cloudflare
2. Set SSL mode to "Full (strict)"
3. Enable "Always Use HTTPS"
4. Configure origin certificates

## Monitoring

### Application Logs

```bash
# View logs
docker logs -f ultimate-app-builder-app

# Specific time range
docker logs --since 1h ultimate-app-builder-app
```

### Database Monitoring

```sql
-- Active connections
SELECT count(*) FROM pg_stat_activity;

-- Slow queries
SELECT query, mean_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

## Backup

### Database Backup

```bash
# Manual backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Automated backup (cron)
0 2 * * * pg_dump $DATABASE_URL > /backups/db-$(date +\%Y\%m\%d).sql
```

### File Storage Backup

```bash
# Backup generated projects
tar -czf projects-backup.tar.gz generated/
```

## Scaling

### Horizontal Scaling

1. Use load balancer (ALB, Nginx)
2. Deploy multiple instances
3. Use Redis for session storage
4. Enable database connection pooling

### Vertical Scaling

- Increase server resources (CPU, RAM)
- Optimize database queries
- Add database indexes
- Enable caching

## Health Checks

```bash
# Application health
curl http://localhost:3000/health

# Database health
psql $DATABASE_URL -c "SELECT 1"

# Redis health
redis-cli ping
```

## Troubleshooting

### Application won't start

1. Check environment variables
2. Verify database connection
3. Check logs: `docker logs app`
4. Ensure ports are available

### Database connection errors

1. Verify DATABASE_URL
2. Check PostgreSQL is running
3. Test connection: `psql $DATABASE_URL`
4. Check firewall rules

### High memory usage

1. Optimize queries
2. Add pagination
3. Increase server resources
4. Enable caching

## Security Checklist

- [ ] Set strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set rate limiting
- [ ] Use environment variables for secrets
- [ ] Enable database SSL
- [ ] Configure firewall rules
- [ ] Regular security updates
- [ ] Monitor logs for suspicious activity
- [ ] Backup database regularly

## Performance Optimization

1. **Enable caching**: Redis for API responses
2. **Database indexing**: Add indexes on frequently queried fields
3. **Connection pooling**: Prisma handles automatically
4. **CDN**: Serve static assets via CDN
5. **Compression**: Enable gzip compression
6. **Load balancing**: Distribute traffic across instances

## Zero-Downtime Deployment

```bash
# Build new version
docker build -t app:v2 .

# Start new container
docker run -d --name app-v2 app:v2

# Switch traffic
# Update load balancer to point to new container

# Stop old container
docker stop app-v1
```

## Rollback

```bash
# Revert to previous version
docker-compose down
git checkout previous-tag
docker-compose up -d

# Revert database migration
npx prisma migrate resolve --rolled-back migration-name
```

---

For support, contact: support@ultimateappbuilder.dev
