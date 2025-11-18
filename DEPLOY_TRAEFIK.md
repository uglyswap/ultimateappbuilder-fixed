# 🚀 Déploiement Ultimate App Builder avec Traefik + nip.io

## 🌐 Votre Domaine

Votre application sera accessible sur :

**http://ultimate-app-builder.84.247.175.132.nip.io**

Et automatiquement sur HTTPS :

**https://ultimate-app-builder.84.247.175.132.nip.io**

---

## ⚡ MÉTHODE 1 : Import dans Dokploy (5 MINUTES)

### Étape 1 : Connexion à Dokploy

Ouvrez : **http://84.247.175.132:3000**

### Étape 2 : Créer un Projet

1. Cliquez sur **"Projects"** → **"Create Project"**
2. **Name** : `ultimate-app-builder`
3. Cliquez **"Create"**

### Étape 3 : Ajouter Docker Compose avec Traefik

1. Dans le projet, cliquez **"Add Service"** → **"Docker Compose"**
2. Configuration :

```
Service Name: ultimate-app-builder
Source Type: Git
Repository: https://github.com/uglyswap/ultimateappbuilder-fixed
Branch: claude/fix-deployment-setup-018d1JAP1pEHGzVud4jprNdv
Docker Compose File: docker-compose.traefik.yml
```

### Étape 4 : Variables d'Environnement

**Copiez-collez EXACTEMENT ces variables** :

```bash
POSTGRES_USER=postgres
POSTGRES_PASSWORD=UltimateAppBuilder2024!SecurePassword
POSTGRES_DB=ultimate_app_builder
NODE_ENV=production
PORT=3000
APP_URL=http://ultimate-app-builder.84.247.175.132.nip.io
PROJECT_NAME=ultimate-app-builder
DATABASE_URL=postgresql://postgres:UltimateAppBuilder2024!SecurePassword@postgres:5432/ultimate_app_builder?schema=public
REDIS_URL=redis://redis:6379
AI_PROVIDER=anthropic
AI_MODEL=claude-3-5-sonnet-20241022
AUTONOMOUS_MODE=true
AUTO_FIX_ERRORS=true
AUTO_OPTIMIZE=true
AUTO_TEST=true
```

### Étape 5 : Configuration Traefik (IMPORTANT)

Dans Dokploy, allez dans la section **"Traefik"** ou **"Domains"** :

1. Cochez **"Enable Traefik"**
2. **Domain** : `ultimate-app-builder.84.247.175.132.nip.io`
3. **Port** : `3000`
4. Cochez **"Enable HTTPS"** si disponible

### Étape 6 : Déployer !

1. Cliquez sur **"Deploy"**
2. Attendez 2-3 minutes
3. Surveillez les logs

### Étape 7 : Vérifier le Déploiement

```bash
# Test HTTP
curl http://ultimate-app-builder.84.247.175.132.nip.io/health

# Test HTTPS (après quelques minutes)
curl https://ultimate-app-builder.84.247.175.132.nip.io/health
```

### Étape 8 : Configurer les Clés AI

```bash
curl -X POST http://ultimate-app-builder.84.247.175.132.nip.io/api/setup/complete \
  -H "Content-Type: application/json" \
  -d '{
    "aiProvider": "anthropic",
    "anthropicApiKey": "sk-ant-votre-clé-ici"
  }'
```

---

## ⚡ MÉTHODE 2 : Déploiement Manuel (SI VOUS AVEZ SSH)

### Prérequis

- Accès SSH au serveur
- Docker et Docker Compose installés
- Traefik déjà configuré sur Dokploy

### Étape 1 : Connexion SSH

```bash
ssh root@84.247.175.132
```

### Étape 2 : Préparation

```bash
# Créer le répertoire
mkdir -p /opt/ultimate-app-builder
cd /opt/ultimate-app-builder

# Cloner le repo
git clone https://github.com/uglyswap/ultimateappbuilder-fixed.git .
git checkout claude/fix-deployment-setup-018d1JAP1pEHGzVud4jprNdv
```

### Étape 3 : Configuration

```bash
# Copier le fichier de configuration
cp .env.traefik .env

# OU créer manuellement
cat > .env <<'EOF'
POSTGRES_USER=postgres
POSTGRES_PASSWORD=UltimateAppBuilder2024!SecurePassword
POSTGRES_DB=ultimate_app_builder
NODE_ENV=production
PORT=3000
APP_URL=http://ultimate-app-builder.84.247.175.132.nip.io
PROJECT_NAME=ultimate-app-builder
DATABASE_URL=postgresql://postgres:UltimateAppBuilder2024!SecurePassword@postgres:5432/ultimate_app_builder?schema=public
REDIS_URL=redis://redis:6379
AI_PROVIDER=anthropic
AUTONOMOUS_MODE=true
AUTO_FIX_ERRORS=true
AUTO_OPTIMIZE=true
AUTO_TEST=true
EOF
```

### Étape 4 : Vérifier le Réseau Traefik

```bash
# Créer le réseau Dokploy si nécessaire
docker network create dokploy-network 2>/dev/null || true

# Vérifier que Traefik utilise ce réseau
docker network inspect dokploy-network
```

### Étape 5 : Déploiement

```bash
# Copier le docker-compose avec Traefik
cp docker-compose.traefik.yml docker-compose.yml

# Démarrer tous les services
docker-compose up -d

# Vérifier les logs
docker-compose logs -f app
```

### Étape 6 : Vérification

```bash
# Attendre 2 minutes
sleep 120

# Test local
curl http://localhost:3000/health

# Test via domaine nip.io
curl http://ultimate-app-builder.84.247.175.132.nip.io/health
```

---

## 🔍 Vérifications Post-Déploiement

### 1. Health Check

```bash
curl http://ultimate-app-builder.84.247.175.132.nip.io/health
```

**Réponse attendue :**
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "uptime": 123,
  "version": "1.0.0"
}
```

### 2. Setup Status

```bash
curl http://ultimate-app-builder.84.247.175.132.nip.io/api/setup/status
```

### 3. API Documentation

Ouvrez dans votre navigateur :
**http://ultimate-app-builder.84.247.175.132.nip.io/api-docs**

### 4. Vérifier Traefik

```bash
# Voir les routes Traefik
docker logs dokploy-traefik 2>&1 | grep ultimate-app-builder

# Vérifier les labels
docker inspect ultimate-app-builder-app | grep -A 20 Labels
```

---

## 🌐 Comprendre nip.io

**nip.io** est un service DNS magique qui résout automatiquement :

- `anything.84.247.175.132.nip.io` → `84.247.175.132`
- `ultimate-app-builder.84.247.175.132.nip.io` → `84.247.175.132`

**Avantages :**
- ✅ Pas besoin de configurer le DNS
- ✅ Fonctionne immédiatement
- ✅ Gratuit et sans inscription
- ✅ Compatible avec Let's Encrypt pour HTTPS

**Traefik** détecte automatiquement le domaine via les labels Docker et route le trafic.

---

## 🔐 Configuration HTTPS avec Let's Encrypt

Si Traefik est configuré avec Let's Encrypt sur Dokploy, HTTPS sera automatique !

### Vérifier HTTPS

```bash
# Attendre 2-3 minutes après le déploiement
curl https://ultimate-app-builder.84.247.175.132.nip.io/health
```

### Si HTTPS ne fonctionne pas

Vérifiez la configuration Traefik dans Dokploy :

1. Allez dans **Settings** → **Traefik**
2. Vérifiez que **Let's Encrypt** est activé
3. Vérifiez l'email pour Let's Encrypt
4. Redéployez votre application

---

## 🔧 Configuration des Clés AI

```bash
curl -X POST http://ultimate-app-builder.84.247.175.132.nip.io/api/setup/complete \
  -H "Content-Type: application/json" \
  -d '{
    "aiProvider": "anthropic",
    "anthropicApiKey": "sk-ant-votre-clé-anthropic",
    "openaiApiKey": "sk-votre-clé-openai-optionnelle",
    "openrouterApiKey": "sk-or-votre-clé-openrouter-optionnelle"
  }'
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "Setup completed successfully!"
}
```

---

## 🐛 Dépannage

### L'application ne répond pas sur le domaine

```bash
# 1. Vérifier que l'app fonctionne localement
curl http://localhost:3000/health

# 2. Vérifier les labels Traefik
docker inspect ultimate-app-builder-app | grep traefik

# 3. Vérifier que le conteneur est sur le bon réseau
docker inspect ultimate-app-builder-app | grep -A 5 Networks

# 4. Redémarrer Traefik
docker restart dokploy-traefik
```

### Erreur 404 ou 502 Bad Gateway

```bash
# Vérifier les logs Traefik
docker logs dokploy-traefik --tail=100

# Vérifier que l'app est sur le réseau dokploy-network
docker network connect dokploy-network ultimate-app-builder-app

# Redémarrer l'app
docker restart ultimate-app-builder-app
```

### PostgreSQL ne démarre pas

```bash
# Vérifier les logs
docker logs ultimate-app-builder-db

# Vérifier les permissions du volume
docker volume inspect ultimate-app-builder_postgres_data

# Réinitialiser (⚠️ supprime les données)
docker-compose down -v
docker-compose up -d
```

### nip.io ne résout pas

```bash
# Tester la résolution DNS
nslookup ultimate-app-builder.84.247.175.132.nip.io

# Devrait retourner: 84.247.175.132

# Si ça ne fonctionne pas, utilisez le port direct
curl http://84.247.175.132:3000/health
```

---

## 📱 URLs Importantes

- **🏠 Application** : http://ultimate-app-builder.84.247.175.132.nip.io
- **🔒 HTTPS** : https://ultimate-app-builder.84.247.175.132.nip.io
- **📚 API Docs** : http://ultimate-app-builder.84.247.175.132.nip.io/api-docs
- **🩺 Health** : http://ultimate-app-builder.84.247.175.132.nip.io/health
- **⚙️ Setup** : http://ultimate-app-builder.84.247.175.132.nip.io/api/setup/status
- **🎛️ Dokploy** : http://84.247.175.132:3000

---

## 🎯 Test Complet

```bash
# 1. Health check
curl http://ultimate-app-builder.84.247.175.132.nip.io/health

# 2. Setup status
curl http://ultimate-app-builder.84.247.175.132.nip.io/api/setup/status

# 3. List templates
curl http://ultimate-app-builder.84.247.175.132.nip.io/api/templates

# 4. Browse AI models
curl http://ultimate-app-builder.84.247.175.132.nip.io/api/ai-models

# 5. Test WebSocket
curl -i -N \
  -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  http://ultimate-app-builder.84.247.175.132.nip.io/ws
```

---

## ✅ Checklist Finale

- [ ] Dokploy accessible
- [ ] Projet créé
- [ ] Docker Compose avec Traefik ajouté
- [ ] Variables d'environnement configurées
- [ ] Traefik activé avec domaine nip.io
- [ ] Déploiement lancé
- [ ] Logs surveillés (pas d'erreurs)
- [ ] Health check HTTP réussit
- [ ] Domaine nip.io accessible
- [ ] HTTPS fonctionne (optionnel)
- [ ] Clés AI configurées
- [ ] API Docs accessibles

---

## 🆘 Besoin d'Aide ?

### Logs à consulter

```bash
# Application
docker logs ultimate-app-builder-app --tail=100

# Traefik
docker logs dokploy-traefik --tail=100

# PostgreSQL
docker logs ultimate-app-builder-db --tail=50

# Redis
docker logs ultimate-app-builder-redis --tail=50
```

### Support

- GitHub Issues : https://github.com/uglyswap/ultimateappbuilder/issues
- Documentation : Tous les fichiers `*.md` du projet

---

## 🎉 Prêt à Déployer !

**Méthode recommandée** : MÉTHODE 1 (Import dans Dokploy)

**Temps estimé** : 5-10 minutes

**Difficulté** : 🟢 Facile

---

**Fait avec ❤️ pour un déploiement ultra-simple avec Traefik + nip.io**

**The #1 AI-Powered App Builder in the World** 🌍
