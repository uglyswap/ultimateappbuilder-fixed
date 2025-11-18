#!/bin/bash

# ============================================
# DÉPLOIEMENT DIRECT - Ultimate App Builder
# ============================================
# Ce script déploie l'application directement sur le serveur
# Sans utiliser l'API Dokploy (qui ne fonctionne pas)
# ============================================

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

clear

echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                            ║${NC}"
echo -e "${CYAN}║     ${GREEN}🚀 ULTIMATE APP BUILDER - DÉPLOIEMENT DIRECT${CYAN}     ║${NC}"
echo -e "${CYAN}║                                                            ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Configuration
DOMAIN="ultimate-app-builder.84.247.175.132.nip.io"
PROJECT_DIR="/opt/ultimate-app-builder"
POSTGRES_PASSWORD="UltimateAppBuilder2024!$(openssl rand -hex 8)"
JWT_SECRET=$(openssl rand -hex 32)
ENCRYPTION_KEY=$(openssl rand -base64 32 | head -c 32)

echo -e "${BLUE}📋 Configuration du déploiement:${NC}"
echo -e "  ${CYAN}➜${NC} Domaine:     ${GREEN}${DOMAIN}${NC}"
echo -e "  ${CYAN}➜${NC} Répertoire:  ${GREEN}${PROJECT_DIR}${NC}"
echo -e "  ${CYAN}➜${NC} URL HTTP:    ${GREEN}http://${DOMAIN}${NC}"
echo ""

# Vérifier si on est root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ Ce script doit être exécuté en tant que root${NC}"
    echo -e "${YELLOW}Utilisez: sudo $0${NC}"
    exit 1
fi

# Vérifier Docker
echo -e "${BLUE}🔍 Vérification des prérequis...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker n'est pas installé${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker installé${NC}"

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose n'est pas installé${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker Compose installé${NC}"
echo ""

# Créer le réseau Dokploy si nécessaire
echo -e "${BLUE}🌐 Configuration du réseau...${NC}"
docker network create dokploy-network 2>/dev/null && echo -e "${GREEN}✅ Réseau dokploy-network créé${NC}" || echo -e "${YELLOW}ℹ️  Réseau dokploy-network existe déjà${NC}"
echo ""

# Créer le répertoire du projet
echo -e "${BLUE}📁 Préparation du répertoire...${NC}"
mkdir -p ${PROJECT_DIR}
cd ${PROJECT_DIR}

# Cloner ou mettre à jour le dépôt
if [ -d ".git" ]; then
    echo -e "${YELLOW}ℹ️  Mise à jour du dépôt existant...${NC}"
    git fetch origin
    git checkout claude/fix-deployment-setup-018d1JAP1pEHGzVud4jprNdv
    git pull
else
    echo -e "${YELLOW}ℹ️  Clonage du dépôt...${NC}"
    git clone https://github.com/uglyswap/ultimateappbuilder-fixed.git .
    git checkout claude/fix-deployment-setup-018d1JAP1pEHGzVud4jprNdv
fi
echo -e "${GREEN}✅ Code source prêt${NC}"
echo ""

# Créer le fichier .env
echo -e "${BLUE}⚙️  Configuration de l'environnement...${NC}"
cat > .env <<EOF
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
POSTGRES_DB=ultimate_app_builder
DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/ultimate_app_builder?schema=public
REDIS_URL=redis://redis:6379

# Application
NODE_ENV=production
PORT=3000
APP_URL=http://${DOMAIN}
PROJECT_NAME=ultimate-app-builder

# Security
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=7d
ENCRYPTION_KEY=${ENCRYPTION_KEY}

# AI Configuration
AI_PROVIDER=anthropic
AI_MODEL=claude-3-5-sonnet-20241022
AI_MAX_TOKENS=8000
AI_TEMPERATURE=0.7

# API Keys (à configurer après déploiement)
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
OPENROUTER_API_KEY=

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

echo -e "${GREEN}✅ Configuration créée${NC}"
echo ""

# Sauvegarder les credentials
cat > credentials.txt <<EOF
╔════════════════════════════════════════════════════════╗
║         CREDENTIALS - ULTIMATE APP BUILDER            ║
╚════════════════════════════════════════════════════════╝

📅 Généré le: $(date)

🔐 Base de données:
   PostgreSQL Password: ${POSTGRES_PASSWORD}

🔑 Sécurité:
   JWT Secret: ${JWT_SECRET}
   Encryption Key: ${ENCRYPTION_KEY}

🌐 URLs:
   Application: http://${DOMAIN}
   API Docs: http://${DOMAIN}/api-docs
   Health Check: http://${DOMAIN}/health

⚠️  IMPORTANT: Gardez ce fichier en sécurité!
   Chemin: ${PROJECT_DIR}/credentials.txt

EOF

chmod 600 credentials.txt
echo -e "${GREEN}✅ Credentials sauvegardés dans: ${YELLOW}credentials.txt${NC}"
echo ""

# Copier le docker-compose avec Traefik
echo -e "${BLUE}🐳 Configuration de Docker Compose...${NC}"
if [ -f "docker-compose.traefik.yml" ]; then
    cp docker-compose.traefik.yml docker-compose.yml
    echo -e "${GREEN}✅ Utilisation de la configuration Traefik${NC}"
else
    echo -e "${YELLOW}⚠️  docker-compose.traefik.yml non trouvé, utilisation de docker-compose.yml${NC}"
fi
echo ""

# Arrêter les anciens conteneurs si ils existent
echo -e "${BLUE}🛑 Nettoyage des anciens conteneurs...${NC}"
docker-compose down 2>/dev/null || true
echo -e "${GREEN}✅ Nettoyage terminé${NC}"
echo ""

# Démarrer les services
echo -e "${BLUE}🚀 Démarrage des services...${NC}"
echo ""
docker-compose up -d

echo ""
echo -e "${GREEN}✅ Services démarrés!${NC}"
echo ""

# Attendre que les services soient prêts
echo -e "${BLUE}⏳ Attente du démarrage des services...${NC}"
echo ""

# Attendre PostgreSQL
echo -ne "${CYAN}  PostgreSQL:${NC} "
for i in {1..30}; do
    if docker-compose exec -T postgres pg_isready -U postgres &>/dev/null 2>&1; then
        echo -e "${GREEN}✅ Prêt${NC}"
        break
    fi
    echo -n "."
    sleep 2
done

# Attendre Redis
echo -ne "${CYAN}  Redis:     ${NC} "
for i in {1..15}; do
    if docker-compose exec -T redis redis-cli ping &>/dev/null 2>&1; then
        echo -e "${GREEN}✅ Prêt${NC}"
        break
    fi
    echo -n "."
    sleep 1
done

# Attendre l'application
echo -ne "${CYAN}  Application:${NC} "
for i in {1..60}; do
    if curl -s http://localhost:3000/health &>/dev/null; then
        echo -e "${GREEN}✅ Prêt${NC}"
        break
    fi
    echo -n "."
    sleep 2
done

echo ""

# Tests de vérification
echo -e "${BLUE}🧪 Vérification du déploiement...${NC}"
echo ""

# Test 1: Health check local
echo -ne "${CYAN}  Test health check local:    ${NC}"
if curl -s http://localhost:3000/health | grep -q "ok"; then
    echo -e "${GREEN}✅ Pass${NC}"
    HEALTH_LOCAL=true
else
    echo -e "${RED}❌ Fail${NC}"
    HEALTH_LOCAL=false
fi

# Test 2: Health check via domaine
echo -ne "${CYAN}  Test health check domaine:  ${NC}"
if curl -s http://${DOMAIN}/health | grep -q "ok"; then
    echo -e "${GREEN}✅ Pass${NC}"
    HEALTH_DOMAIN=true
else
    echo -e "${YELLOW}⚠️  Pending (peut prendre quelques instants)${NC}"
    HEALTH_DOMAIN=false
fi

# Test 3: API Setup
echo -ne "${CYAN}  Test API Setup:             ${NC}"
if curl -s http://localhost:3000/api/setup/status | grep -q "success"; then
    echo -e "${GREEN}✅ Pass${NC}"
    SETUP_API=true
else
    echo -e "${YELLOW}⚠️  Check${NC}"
    SETUP_API=false
fi

echo ""

# Afficher les logs récents
echo -e "${BLUE}📋 Logs récents de l'application:${NC}"
echo -e "${CYAN}─────────────────────────────────────────────────────────${NC}"
docker-compose logs --tail=15 app
echo -e "${CYAN}─────────────────────────────────────────────────────────${NC}"
echo ""

# Afficher le résumé
echo ""
echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                            ║${NC}"
echo -e "${CYAN}║              ${GREEN}🎉 DÉPLOIEMENT TERMINÉ !${CYAN}                   ║${NC}"
echo -e "${CYAN}║                                                            ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}📱 Votre application est accessible sur:${NC}"
echo ""
echo -e "  ${GREEN}➜${NC} HTTP:  ${CYAN}http://${DOMAIN}${NC}"
echo -e "  ${GREEN}➜${NC} Docs:  ${CYAN}http://${DOMAIN}/api-docs${NC}"
echo -e "  ${GREEN}➜${NC} Health: ${CYAN}http://${DOMAIN}/health${NC}"
echo ""

echo -e "${YELLOW}🔧 Pour configurer vos clés AI:${NC}"
echo ""
echo -e "${BLUE}curl -X POST http://${DOMAIN}/api/setup/complete \\${NC}"
echo -e "${BLUE}  -H 'Content-Type: application/json' \\${NC}"
echo -e "${BLUE}  -d '{${NC}"
echo -e "${BLUE}    \"aiProvider\": \"anthropic\",${NC}"
echo -e "${BLUE}    \"anthropicApiKey\": \"sk-ant-votre-clé-ici\"${NC}"
echo -e "${BLUE}  }'${NC}"
echo ""

echo -e "${YELLOW}📊 Commandes utiles:${NC}"
echo ""
echo -e "  ${CYAN}➜${NC} Voir les logs:       ${BLUE}docker-compose logs -f app${NC}"
echo -e "  ${CYAN}➜${NC} Redémarrer:          ${BLUE}docker-compose restart app${NC}"
echo -e "  ${CYAN}➜${NC} Arrêter:             ${BLUE}docker-compose stop${NC}"
echo -e "  ${CYAN}➜${NC} Tout supprimer:      ${BLUE}docker-compose down -v${NC}"
echo ""

echo -e "${YELLOW}🔐 Credentials sauvegardés dans:${NC}"
echo -e "  ${BLUE}${PROJECT_DIR}/credentials.txt${NC}"
echo ""

# Afficher les credentials
echo -e "${YELLOW}🔑 Credentials générés:${NC}"
echo -e "${CYAN}─────────────────────────────────────────────────────────${NC}"
cat credentials.txt
echo -e "${CYAN}─────────────────────────────────────────────────────────${NC}"
echo ""

if [ "$HEALTH_LOCAL" = true ] && [ "$SETUP_API" = true ]; then
    echo -e "${GREEN}✅ Déploiement réussi! L'application fonctionne parfaitement.${NC}"
else
    echo -e "${YELLOW}⚠️  L'application a démarré mais certains tests ont échoué.${NC}"
    echo -e "${YELLOW}   Vérifiez les logs avec: docker-compose logs -f app${NC}"
fi

echo ""
echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║    Merci d'utiliser Ultimate App Builder! 🚀              ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
