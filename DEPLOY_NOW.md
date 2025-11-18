# 🚀 DÉPLOYER MAINTENANT - Guide Pas à Pas

Ce guide vous permet de déployer **Ultimate App Builder** sur votre serveur Dokploy **en 10 minutes**.

---

## ⚠️ IMPORTANT - Clé API

Votre clé API `WstNw...` ne fonctionne pas actuellement. Vous devez la **régénérer** :

1. Allez sur : **http://84.247.175.132:3000**
2. Connectez-vous
3. Allez dans : **Settings** → **Profile** → **API/CLI Section**
4. Cliquez sur **"Generate Token"**
5. **Copiez** la nouvelle clé

---

## 📋 Méthode 1 : Interface Web Dokploy (RECOMMANDÉ - 5 MINUTES)

### Étape 1 : Connexion

Ouvrez votre navigateur : **http://84.247.175.132:3000**

### Étape 2 : Créer un Projet

1. Cliquez sur **"Projects"** dans le menu
2. Cliquez sur **"Create Project"**
3. Remplissez :
   - **Name** : `ultimate-app-builder`
   - **Description** : `AI-Powered App Builder`
4. Cliquez sur **"Create"**

### Étape 3 : Ajouter une Application Docker Compose

1. Dans votre nouveau projet, cliquez sur **"Add Service"** ou **"Create Compose"**
2. Sélectionnez **"Docker Compose"**
3. Configuration :

   ```
   Name: ultimate-app-builder
   Source Type: Git/GitHub
   Repository URL: https://github.com/uglyswap/ultimateappbuilder-fixed
   Branch: claude/fix-deployment-setup-018d1JAP1pEHGzVud4jprNdv
   Docker Compose File: docker-compose.dokploy.yml
   ```

### Étape 4 : Variables d'Environnement

Dans la section **"Environment Variables"**, ajoutez :

```bash
# Essentielles (OBLIGATOIRES)
POSTGRES_PASSWORD=VotreMotDePasse123Securise!
APP_URL=http://84.247.175.132:3001
APP_PORT=3001
PROJECT_NAME=ultimate-app-builder

# Optionnelles (peuvent rester vides)
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
OPENROUTER_API_KEY=
```

**💡 Astuce** : Générez un mot de passe sécurisé :
```bash
openssl rand -base64 32
```

### Étape 5 : Configuration des Ports

Dans **"Port Configuration"** ou **"Networking"** :
- **Internal Port** : `3000`
- **External Port** : `3001`
- **Protocol** : `HTTP`

### Étape 6 : Déployer !

1. Cliquez sur **"Deploy"** ou **"Build & Deploy"**
2. Attendez 2-3 minutes
3. Surveillez les logs pour voir la progression

### Étape 7 : Vérification

Ouvrez un terminal et testez :

```bash
# Test de santé
curl http://84.247.175.132:3001/health

# Devrait retourner : {"status":"ok",...}
```

### Étape 8 : Configuration des Clés AI

```bash
curl -X POST http://84.247.175.132:3001/api/setup/complete \
  -H "Content-Type: application/json" \
  -d '{
    "aiProvider": "anthropic",
    "anthropicApiKey": "sk-ant-votre-clé-anthropic",
    "openaiApiKey": "sk-votre-clé-openai-optionnelle"
  }'
```

---

## 📋 Méthode 2 : Script Automatisé (SI VOUS AVEZ LA BONNE CLÉ API)

### Prérequis

- Clé API Dokploy valide
- `jq` installé (`sudo apt install jq`)

### Étapes

```bash
# 1. Régénérer votre clé API Dokploy (voir ci-dessus)

# 2. Définir la clé API
export DOKPLOY_API_KEY="votre-nouvelle-cle-api"

# 3. Exécuter le script
./scripts/deploy-to-dokploy.sh

# 4. Suivre les instructions
```

---

## 📋 Méthode 3 : Déploiement Manuel SSH (SI VOUS AVEZ ACCÈS SSH)

### Étape 1 : Connexion SSH

```bash
ssh root@84.247.175.132
```

### Étape 2 : Préparation

```bash
# Créer un répertoire pour le projet
mkdir -p /opt/ultimate-app-builder
cd /opt/ultimate-app-builder

# Cloner le dépôt
git clone https://github.com/uglyswap/ultimateappbuilder-fixed.git .
git checkout claude/fix-deployment-setup-018d1JAP1pEHGzVud4jprNdv
```

### Étape 3 : Configuration

```bash
# Générer des mots de passe sécurisés
POSTGRES_PASSWORD=$(openssl rand -base64 32 | head -c 32)
JWT_SECRET=$(openssl rand -hex 32)
ENCRYPTION_KEY=$(openssl rand -base64 32 | head -c 32)

# Créer le fichier .env
cat > .env <<EOF
POSTGRES_USER=postgres
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
POSTGRES_DB=ultimate_app_builder
DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/ultimate_app_builder?schema=public
REDIS_URL=redis://redis:6379

NODE_ENV=production
PORT=3000
APP_URL=http://84.247.175.132:3001
APP_PORT=3001
PROJECT_NAME=ultimate-app-builder

JWT_SECRET=${JWT_SECRET}
ENCRYPTION_KEY=${ENCRYPTION_KEY}

ANTHROPIC_API_KEY=
OPENAI_API_KEY=
OPENROUTER_API_KEY=

AUTONOMOUS_MODE=true
AUTO_FIX_ERRORS=true
AUTO_OPTIMIZE=true
AUTO_TEST=true
AUTO_DEPLOY=false
EOF

# Sauvegarder les credentials
cat > credentials.txt <<EOF
PostgreSQL Password: ${POSTGRES_PASSWORD}
JWT Secret: ${JWT_SECRET}
Encryption Key: ${ENCRYPTION_KEY}

⚠️  GARDEZ CES INFORMATIONS EN SÉCURITÉ!
EOF

echo "✅ Credentials saved to credentials.txt"
cat credentials.txt
```

### Étape 4 : Déploiement

```bash
# Copier le docker-compose pour Dokploy
cp docker-compose.dokploy.yml docker-compose.yml

# Démarrer les services
docker-compose up -d

# Vérifier les logs
docker-compose logs -f app
```

### Étape 5 : Vérification

```bash
# Attendre 1-2 minutes puis tester
curl http://localhost:3001/health

# Voir les logs
docker-compose logs --tail=50 app
```

---

## 🔍 Surveillance du Déploiement

### Dans Dokploy

1. Allez sur votre projet dans Dokploy
2. Cliquez sur l'onglet **"Logs"**
3. Surveillez la progression :
   - ✅ PostgreSQL démarré
   - ✅ Redis démarré
   - ✅ Migrations de base de données
   - ✅ Application démarrée

### Logs Attendus

Vous devriez voir :

```
✅ PostgreSQL is ready!
✅ Redis is ready!
🔄 Running database migrations...
✅ Database migrations completed!
🔧 Generating Prisma client...
✅ Prisma client generated!
🎉 Starting Ultimate App Builder!
✨ Ready to build amazing apps! ✨
```

---

## ✅ Vérifications Post-Déploiement

### 1. Health Check

```bash
curl http://84.247.175.132:3001/health
```

**Réponse attendue** :
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
curl http://84.247.175.132:3001/api/setup/status
```

**Réponse attendue** :
```json
{
  "success": true,
  "data": {
    "isConfigured": false,
    "hasAiKey": false,
    "hasJwtSecret": true,
    "missingConfigs": ["AI API Key"]
  }
}
```

### 3. API Documentation

Ouvrez dans votre navigateur :
**http://84.247.175.132:3001/api-docs**

---

## 🔧 Configuration des Clés AI

Une fois le déploiement réussi, configurez vos clés AI :

```bash
curl -X POST http://84.247.175.132:3001/api/setup/complete \
  -H "Content-Type: application/json" \
  -d '{
    "aiProvider": "anthropic",
    "anthropicApiKey": "sk-ant-votre-clé-ici",
    "openaiApiKey": "sk-votre-clé-openai-optionnelle",
    "openrouterApiKey": "sk-or-votre-clé-openrouter-optionnelle"
  }'
```

**Réponse attendue** :
```json
{
  "success": true,
  "message": "Setup completed successfully! Your Ultimate App Builder is ready to use."
}
```

---

## 🐛 Dépannage

### Le déploiement échoue

**1. Vérifier les logs Dokploy**

Dans l'interface Dokploy → Votre projet → Onglet "Logs"

**2. Erreurs communes**

#### "Cannot connect to database"
```bash
# Vérifier que PostgreSQL démarre
docker ps | grep postgres

# Vérifier les variables d'environnement
echo $DATABASE_URL
```

**Solution** : Attendez 1-2 minutes que PostgreSQL soit complètement démarré

#### "Port 3001 already in use"
**Solution** : Changez le port dans les variables d'environnement :
```
APP_PORT=3002
```

#### "Build failed"
**Solution** :
1. Vérifiez que la branche Git est correcte
2. Vérifiez que `docker-compose.dokploy.yml` existe
3. Relancez le déploiement

### L'application ne répond pas

```bash
# Vérifier que les conteneurs tournent
docker ps

# Vérifier les logs
docker logs ultimate-app-builder-app --tail=100

# Redémarrer
docker-compose restart app
```

### Reset complet

Si tout échoue, réinitialisez :

```bash
# Arrêter et supprimer tout
docker-compose down -v

# Redémarrer
docker-compose up -d

# Attendre 2 minutes et vérifier
sleep 120
curl http://84.247.175.132:3001/health
```

---

## 📱 URLs Importantes

Après le déploiement :

- **🏠 Application** : http://84.247.175.132:3001
- **📚 API Docs** : http://84.247.175.132:3001/api-docs
- **🩺 Health** : http://84.247.175.132:3001/health
- **⚙️ Setup Status** : http://84.247.175.132:3001/api/setup/status
- **🎛️ Dokploy Dashboard** : http://84.247.175.132:3000

---

## 🎯 Test Complet

Pour tester toutes les fonctionnalités :

```bash
# 1. Health check
curl http://84.247.175.132:3001/health

# 2. Setup status
curl http://84.247.175.132:3001/api/setup/status

# 3. List templates
curl http://84.247.175.132:3001/api/templates

# 4. Browse AI models
curl http://84.247.175.132:3001/api/ai-models

# 5. API documentation
curl http://84.247.175.132:3001/api
```

---

## 🆘 Besoin d'Aide ?

### Documentation

- **Quick Start** : `DOKPLOY_QUICKSTART.md`
- **Full Guide** : `DOKPLOY_DEPLOYMENT.md`
- **General Docs** : `QUICKSTART.md`

### Support

- Dokploy Logs : Interface web → Onglet "Logs"
- Application Logs : `docker-compose logs -f app`
- GitHub Issues : https://github.com/uglyswap/ultimateappbuilder/issues

---

## ✅ Checklist Finale

- [ ] Dokploy accessible : http://84.247.175.132:3000
- [ ] Projet créé dans Dokploy
- [ ] Application Docker Compose ajoutée
- [ ] Variables d'environnement configurées
- [ ] Déploiement lancé
- [ ] Logs surveillés (pas d'erreurs)
- [ ] Health check réussit : `/health`
- [ ] Setup status vérifié : `/api/setup/status`
- [ ] Clés AI configurées : `/api/setup/complete`
- [ ] API Docs accessibles : `/api-docs`
- [ ] Application fonctionnelle : port 3001

---

## 🎉 C'est Parti !

Suivez **Méthode 1** (Interface Web) pour le déploiement le plus simple.

**Temps estimé** : 5-10 minutes

**Niveau de difficulté** : 🟢 Facile

---

**Fait avec ❤️ pour un déploiement ultra-simple**

**The #1 AI-Powered App Builder in the World** 🌍
