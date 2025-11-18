#!/bin/bash

# ============================================
# Ultimate App Builder - Traefik Deployment
# Domain: ultimate-app-builder.84.247.175.132.nip.io
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}🚀 Ultimate App Builder - Traefik Deployment${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Configuration
DOMAIN="ultimate-app-builder.84.247.175.132.nip.io"
POSTGRES_PASSWORD="UltimateAppBuilder2024!SecurePassword"

echo -e "${BLUE}📋 Configuration:${NC}"
echo -e "  Domain: ${GREEN}${DOMAIN}${NC}"
echo -e "  HTTP:   ${GREEN}http://${DOMAIN}${NC}"
echo -e "  HTTPS:  ${GREEN}https://${DOMAIN}${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    echo "Please install Docker first: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed${NC}"
    echo "Please install Docker Compose first"
    exit 1
fi

echo -e "${GREEN}✅ Docker and Docker Compose are installed${NC}"
echo ""

# Create dokploy-network if it doesn't exist
echo -e "${BLUE}🌐 Creating Dokploy network...${NC}"
docker network create dokploy-network 2>/dev/null && echo -e "${GREEN}✅ Network created${NC}" || echo -e "${YELLOW}ℹ️  Network already exists${NC}"
echo ""

# Create .env file
echo -e "${BLUE}📝 Creating environment configuration...${NC}"
cat > .env <<EOF
POSTGRES_USER=postgres
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
POSTGRES_DB=ultimate_app_builder
NODE_ENV=production
PORT=3000
APP_URL=http://${DOMAIN}
PROJECT_NAME=ultimate-app-builder
DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/ultimate_app_builder?schema=public
REDIS_URL=redis://redis:6379
AI_PROVIDER=anthropic
AI_MODEL=claude-3-5-sonnet-20241022
AUTONOMOUS_MODE=true
AUTO_FIX_ERRORS=true
AUTO_OPTIMIZE=true
AUTO_TEST=true
AUTO_DEPLOY=false
EOF

echo -e "${GREEN}✅ Environment file created${NC}"
echo ""

# Copy Traefik docker-compose
echo -e "${BLUE}🐳 Setting up Docker Compose...${NC}"
if [ -f "docker-compose.traefik.yml" ]; then
    cp docker-compose.traefik.yml docker-compose.yml
    echo -e "${GREEN}✅ Using Traefik configuration${NC}"
elif [ -f "docker-compose.dokploy.yml" ]; then
    cp docker-compose.dokploy.yml docker-compose.yml
    echo -e "${YELLOW}⚠️  Using Dokploy configuration (no Traefik labels)${NC}"
else
    echo -e "${RED}❌ No docker-compose file found${NC}"
    exit 1
fi
echo ""

# Pull images
echo -e "${BLUE}📦 Pulling Docker images...${NC}"
docker-compose pull
echo ""

# Start services
echo -e "${BLUE}🚀 Starting services...${NC}"
docker-compose up -d

echo ""
echo -e "${GREEN}✅ Services started!${NC}"
echo ""

# Wait for services to be healthy
echo -e "${BLUE}⏳ Waiting for services to be ready...${NC}"
echo ""

# Wait for PostgreSQL
echo -n "PostgreSQL: "
for i in {1..30}; do
    if docker-compose exec -T postgres pg_isready -U postgres &> /dev/null; then
        echo -e "${GREEN}✅ Ready${NC}"
        break
    fi
    echo -n "."
    sleep 2
done

# Wait for Redis
echo -n "Redis:      "
for i in {1..15}; do
    if docker-compose exec -T redis redis-cli ping &> /dev/null; then
        echo -e "${GREEN}✅ Ready${NC}"
        break
    fi
    echo -n "."
    sleep 1
done

# Wait for App
echo -n "App:        "
for i in {1..60}; do
    if curl -s http://localhost:3000/health &> /dev/null; then
        echo -e "${GREEN}✅ Ready${NC}"
        break
    fi
    echo -n "."
    sleep 2
done

echo ""

# Test the application
echo -e "${BLUE}🧪 Testing deployment...${NC}"
echo ""

# Test 1: Local health check
echo -n "Local health check:   "
if curl -s http://localhost:3000/health | grep -q "ok"; then
    echo -e "${GREEN}✅ Pass${NC}"
else
    echo -e "${RED}❌ Fail${NC}"
fi

# Test 2: Domain health check (nip.io)
echo -n "Domain health check:  "
if curl -s http://${DOMAIN}/health | grep -q "ok"; then
    echo -e "${GREEN}✅ Pass${NC}"
else
    echo -e "${YELLOW}⚠️  Pending (may take a moment)${NC}"
fi

# Test 3: Setup status
echo -n "Setup API status:     "
if curl -s http://localhost:3000/api/setup/status | grep -q "success"; then
    echo -e "${GREEN}✅ Pass${NC}"
else
    echo -e "${YELLOW}⚠️  Check manually${NC}"
fi

echo ""

# Show logs
echo -e "${BLUE}📋 Recent logs:${NC}"
docker-compose logs --tail=20 app

echo ""
echo -e "${BLUE}============================================${NC}"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""
echo -e "${YELLOW}📱 Your application is accessible at:${NC}"
echo ""
echo -e "  HTTP:  ${GREEN}http://${DOMAIN}${NC}"
echo -e "  HTTPS: ${GREEN}https://${DOMAIN}${NC} ${YELLOW}(if Let's Encrypt is configured)${NC}"
echo ""
echo -e "${YELLOW}📚 API Documentation:${NC}"
echo -e "  ${GREEN}http://${DOMAIN}/api-docs${NC}"
echo ""
echo -e "${YELLOW}🔧 Configure AI Keys:${NC}"
echo ""
echo -e "${BLUE}curl -X POST http://${DOMAIN}/api/setup/complete \\${NC}"
echo -e "${BLUE}  -H 'Content-Type: application/json' \\${NC}"
echo -e "${BLUE}  -d '{${NC}"
echo -e "${BLUE}    \"aiProvider\": \"anthropic\",${NC}"
echo -e "${BLUE}    \"anthropicApiKey\": \"sk-ant-your-key-here\"${NC}"
echo -e "${BLUE}  }'${NC}"
echo ""
echo -e "${YELLOW}📊 Useful commands:${NC}"
echo ""
echo -e "  View logs:        ${BLUE}docker-compose logs -f app${NC}"
echo -e "  Restart:          ${BLUE}docker-compose restart app${NC}"
echo -e "  Stop:             ${BLUE}docker-compose stop${NC}"
echo -e "  Remove:           ${BLUE}docker-compose down${NC}"
echo -e "  Remove all data:  ${BLUE}docker-compose down -v${NC}"
echo ""
echo -e "${YELLOW}🔐 Database credentials saved in: ${BLUE}.env${NC}"
echo ""
echo -e "${GREEN}PostgreSQL Password: ${POSTGRES_PASSWORD}${NC}"
echo -e "${RED}⚠️  Keep this secure!${NC}"
echo ""
echo -e "${BLUE}============================================${NC}"
