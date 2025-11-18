#!/bin/bash

# ============================================
# Dokploy Automated Deployment Script
# ============================================
#
# This script automates deployment to Dokploy
# via the Dokploy API
#
# Usage: ./scripts/deploy-to-dokploy.sh
#
# ============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOKPLOY_URL="${DOKPLOY_URL:-http://84.247.175.132:3000}"
API_KEY="${DOKPLOY_API_KEY}"

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}🚀 Dokploy Automated Deployment${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Check if API key is provided
if [ -z "$API_KEY" ]; then
    echo -e "${RED}❌ Error: DOKPLOY_API_KEY not set${NC}"
    echo ""
    echo -e "${YELLOW}Please set your Dokploy API key:${NC}"
    echo ""
    echo "  export DOKPLOY_API_KEY='your-api-key-here'"
    echo ""
    echo -e "${YELLOW}To get your API key:${NC}"
    echo "  1. Go to: ${DOKPLOY_URL}"
    echo "  2. Login to your account"
    echo "  3. Navigate to: Settings → Profile → API/CLI Section"
    echo "  4. Click 'Generate Token'"
    echo ""
    exit 1
fi

echo -e "${BLUE}📡 Testing Dokploy API connection...${NC}"

# Test API connection
API_TEST=$(curl -s -w "%{http_code}" -o /dev/null -X GET "${DOKPLOY_URL}/api/project.all" \
  -H "accept: application/json" \
  -H "x-api-key: ${API_KEY}")

if [ "$API_TEST" != "200" ]; then
    echo -e "${RED}❌ API connection failed (HTTP ${API_TEST})${NC}"
    echo ""
    echo -e "${YELLOW}Possible issues:${NC}"
    echo "  1. API key is invalid or expired"
    echo "  2. Dokploy server is not accessible"
    echo "  3. You don't have API permissions"
    echo ""
    echo -e "${YELLOW}Please verify:${NC}"
    echo "  - Your API key is correct"
    echo "  - You can access: ${DOKPLOY_URL}"
    echo "  - You have admin permissions in Dokploy"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ API connection successful!${NC}"
echo ""

# List existing projects
echo -e "${BLUE}📋 Fetching existing projects...${NC}"
PROJECTS=$(curl -s -X GET "${DOKPLOY_URL}/api/project.all" \
  -H "accept: application/json" \
  -H "x-api-key: ${API_KEY}")

echo "$PROJECTS" | jq '.' 2>/dev/null || echo "$PROJECTS"
echo ""

# Prompt for project creation
read -p "Do you want to create a new project? (y/N): " CREATE_PROJECT

if [[ $CREATE_PROJECT =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${BLUE}📝 Creating new project...${NC}"

    # Generate secure passwords
    POSTGRES_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | head -c 32)

    # Create project
    PROJECT_DATA=$(cat <<EOF
{
  "name": "ultimate-app-builder",
  "description": "Ultimate App Builder - AI-Powered Full-Stack App Generator"
}
EOF
)

    echo "Creating project with data:"
    echo "$PROJECT_DATA" | jq '.'

    PROJECT_RESPONSE=$(curl -s -X POST "${DOKPLOY_URL}/api/project.create" \
      -H "accept: application/json" \
      -H "Content-Type: application/json" \
      -H "x-api-key: ${API_KEY}" \
      -d "$PROJECT_DATA")

    echo ""
    echo "Response:"
    echo "$PROJECT_RESPONSE" | jq '.' 2>/dev/null || echo "$PROJECT_RESPONSE"

    PROJECT_ID=$(echo "$PROJECT_RESPONSE" | jq -r '.projectId // .id' 2>/dev/null)

    if [ -z "$PROJECT_ID" ] || [ "$PROJECT_ID" == "null" ]; then
        echo -e "${RED}❌ Failed to create project${NC}"
        exit 1
    fi

    echo -e "${GREEN}✅ Project created: ${PROJECT_ID}${NC}"
    echo ""

    # Create Docker Compose application
    echo -e "${BLUE}🐳 Creating Docker Compose application...${NC}"

    APP_DATA=$(cat <<EOF
{
  "projectId": "${PROJECT_ID}",
  "name": "ultimate-app-builder",
  "sourceType": "git",
  "repository": "https://github.com/uglyswap/ultimateappbuilder-fixed",
  "branch": "claude/fix-deployment-setup-018d1JAP1pEHGzVud4jprNdv",
  "composeFile": "docker-compose.dokploy.yml",
  "env": {
    "POSTGRES_PASSWORD": "${POSTGRES_PASSWORD}",
    "APP_URL": "http://84.247.175.132:3001",
    "APP_PORT": "3001",
    "PROJECT_NAME": "ultimate-app-builder",
    "NODE_ENV": "production"
  }
}
EOF
)

    echo "Creating application with data:"
    echo "$APP_DATA" | jq '.'

    APP_RESPONSE=$(curl -s -X POST "${DOKPLOY_URL}/api/compose.create" \
      -H "accept: application/json" \
      -H "Content-Type: application/json" \
      -H "x-api-key: ${API_KEY}" \
      -d "$APP_DATA")

    echo ""
    echo "Response:"
    echo "$APP_RESPONSE" | jq '.' 2>/dev/null || echo "$APP_RESPONSE"

    APP_ID=$(echo "$APP_RESPONSE" | jq -r '.composeId // .id' 2>/dev/null)

    if [ -z "$APP_ID" ] || [ "$APP_ID" == "null" ]; then
        echo -e "${YELLOW}⚠️  Application creation response unclear${NC}"
        echo -e "${YELLOW}Please check the Dokploy web interface${NC}"
    else
        echo -e "${GREEN}✅ Application created: ${APP_ID}${NC}"
        echo ""

        # Deploy the application
        echo -e "${BLUE}🚀 Deploying application...${NC}"

        DEPLOY_RESPONSE=$(curl -s -X POST "${DOKPLOY_URL}/api/compose.deploy" \
          -H "accept: application/json" \
          -H "Content-Type: application/json" \
          -H "x-api-key: ${API_KEY}" \
          -d "{\"composeId\": \"${APP_ID}\"}")

        echo "$DEPLOY_RESPONSE" | jq '.' 2>/dev/null || echo "$DEPLOY_RESPONSE"

        echo -e "${GREEN}✅ Deployment initiated!${NC}"
        echo ""
    fi

    # Save credentials
    echo -e "${BLUE}💾 Saving credentials...${NC}"

    cat > .dokploy-credentials <<EOF
# Dokploy Deployment Credentials
# Generated: $(date)

Project ID: ${PROJECT_ID}
Application ID: ${APP_ID}
PostgreSQL Password: ${POSTGRES_PASSWORD}

Application URL: http://84.247.175.132:3001
Dokploy Dashboard: ${DOKPLOY_URL}

⚠️  IMPORTANT: Keep these credentials secure!
EOF

    echo -e "${GREEN}✅ Credentials saved to: .dokploy-credentials${NC}"
    echo ""
fi

echo -e "${BLUE}============================================${NC}"
echo -e "${GREEN}🎉 Deployment process completed!${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo ""
echo "1. Monitor deployment in Dokploy:"
echo "   ${DOKPLOY_URL}"
echo ""
echo "2. Wait 2-3 minutes for services to start"
echo ""
echo "3. Verify deployment:"
echo "   curl http://84.247.175.132:3001/health"
echo ""
echo "4. Configure AI keys:"
echo "   curl -X POST http://84.247.175.132:3001/api/setup/complete \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"aiProvider\": \"anthropic\", \"anthropicApiKey\": \"your-key\"}'"
echo ""
echo -e "${BLUE}============================================${NC}"
