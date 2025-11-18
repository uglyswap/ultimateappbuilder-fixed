#!/bin/bash

# ============================================
# Generate Dokploy Environment Configuration
# ============================================
#
# This script generates secure environment variables
# for Dokploy deployment
#
# Usage: ./scripts/generate-dokploy-env.sh
#
# ============================================

set -e

echo "🔧 Generating secure environment variables for Dokploy deployment..."
echo ""

# Generate secure passwords
POSTGRES_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | head -c 32)
JWT_SECRET=$(openssl rand -hex 32)
ENCRYPTION_KEY=$(openssl rand -base64 32 | tr -d "=+/" | head -c 32)

# Prompt for required information
read -p "Enter your Dokploy server IP/domain [84.247.175.132]: " SERVER_IP
SERVER_IP=${SERVER_IP:-84.247.175.132}

read -p "Enter external port for the app [3001]: " APP_PORT
APP_PORT=${APP_PORT:-3001}

read -p "Enter your Anthropic API key (or press Enter to configure later): " ANTHROPIC_KEY
read -p "Enter your OpenAI API key (or press Enter to configure later): " OPENAI_KEY
read -p "Enter your OpenRouter API key (or press Enter to configure later): " OPENROUTER_KEY

# Determine protocol (http or https)
read -p "Use HTTPS? (y/N): " USE_HTTPS
if [[ $USE_HTTPS =~ ^[Yy]$ ]]; then
    PROTOCOL="https"
else
    PROTOCOL="http"
fi

APP_URL="${PROTOCOL}://${SERVER_IP}:${APP_PORT}"

# Create .env file
cat > .env <<EOF
# ============================================
# Dokploy Deployment Configuration
# Generated: $(date)
# ============================================

# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
POSTGRES_DB=ultimate_app_builder

# Application Settings
NODE_ENV=production
PORT=3000
APP_URL=${APP_URL}
APP_PORT=${APP_PORT}
PROJECT_NAME=ultimate-app-builder

# Database Connections
DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/ultimate_app_builder?schema=public
REDIS_URL=redis://redis:6379

# AI Provider Keys
ANTHROPIC_API_KEY=${ANTHROPIC_KEY}
OPENAI_API_KEY=${OPENAI_KEY}
OPENROUTER_API_KEY=${OPENROUTER_KEY}

# AI Configuration
AI_PROVIDER=anthropic
AI_MODEL=claude-3-5-sonnet-20241022
AI_MAX_TOKENS=8000
AI_TEMPERATURE=0.7

# Security
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=7d
ENCRYPTION_KEY=${ENCRYPTION_KEY}

# Autonomous Mode
AUTONOMOUS_MODE=true
AUTO_FIX_ERRORS=true
AUTO_OPTIMIZE=true
AUTO_TEST=true
AUTO_DEPLOY=false

# Storage
STORAGE_TYPE=local
STORAGE_PATH=/app/storage

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_TELEMETRY=false
ENABLE_DEBUG_MODE=false
EOF

echo ""
echo "✅ Environment configuration generated!"
echo ""
echo "📄 File created: .env"
echo ""
echo "🔐 Generated secure credentials:"
echo "   - PostgreSQL Password: ${POSTGRES_PASSWORD}"
echo "   - JWT Secret: ${JWT_SECRET:0:20}..."
echo "   - Encryption Key: ${ENCRYPTION_KEY:0:20}..."
echo ""
echo "⚠️  IMPORTANT: Save these credentials securely!"
echo ""
echo "📋 Next steps for Dokploy deployment:"
echo ""
echo "1. Go to your Dokploy interface: http://${SERVER_IP}:3000"
echo "2. Create a new Docker Compose project"
echo "3. Upload docker-compose.dokploy.yml"
echo "4. Copy the environment variables from .env to Dokploy"
echo "5. Deploy the application"
echo ""
echo "Or, if you have SSH access to the server:"
echo ""
echo "   scp .env user@${SERVER_IP}:/path/to/project/"
echo "   scp docker-compose.dokploy.yml user@${SERVER_IP}:/path/to/project/docker-compose.yml"
echo "   ssh user@${SERVER_IP}"
echo "   cd /path/to/project"
echo "   docker-compose up -d"
echo ""
echo "🚀 Once deployed, configure AI keys via Setup API:"
echo ""
echo "   curl -X POST ${APP_URL}/api/setup/complete \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{"
echo "       \"aiProvider\": \"anthropic\","
echo "       \"anthropicApiKey\": \"your-key-here\""
echo "     }'"
echo ""
echo "📚 For more details, see DOKPLOY_DEPLOYMENT.md"
echo ""
