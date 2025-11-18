# 🚀 Déploiement sur Dokploy

Ce guide vous explique comment déployer Ultimate App Builder sur votre serveur Dokploy.

## 📋 Prérequis

- Serveur Dokploy accessible : `http://84.247.175.132:3000`
- Compte Dokploy avec accès administrateur
- Dépôt GitHub/GitLab avec le code source

---

## 🎯 Méthode 1 : Déploiement via l'Interface Dokploy (Recommandé)

### Étape 1 : Accéder à Dokploy

1. Ouvrez votre navigateur et allez sur : `http://84.247.175.132:3000`
2. Connectez-vous avec vos identifiants

### Étape 2 : Créer un Nouveau Projet

1. Cliquez sur **"Create Project"** ou **"New Application"**
2. Remplissez les informations :
   - **Nom du projet** : `ultimate-app-builder`
   - **Type** : Docker Compose
   - **Repository** : `https://github.com/uglyswap/ultimateappbuilder-fixed`
   - **Branch** : `claude/fix-deployment-setup-018d1JAP1pEHGzVud4jprNdv`

### Étape 3 : Configurer Docker Compose

1. Dans la section **"Docker Compose"**, sélectionnez :
   - **Fichier** : `docker-compose.dokploy.yml` (ou `docker-compose.yml`)

2. Ou copiez le contenu du fichier `docker-compose.dokploy.yml` dans l'éditeur

### Étape 4 : Configurer les Variables d'Environnement

Ajoutez les variables d'environnement suivantes dans Dokploy :

#### **Variables Essentielles** (Minimum requis)

```bash
# Base de données (Dokploy les génère souvent automatiquement)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<générer_un_mot_de_passe_sécurisé>
POSTGRES_DB=ultimate_app_builder

# Application
APP_URL=http://84.247.175.132:3001
APP_PORT=3001
PROJECT_NAME=ultimate-app-builder
```

#### **Variables AI** (Configurables après déploiement via Setup API)

```bash
# Laissez vides pour configurer via l'API après déploiement
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
OPENROUTER_API_KEY=
AI_PROVIDER=anthropic
```

#### **Variables de Sécurité** (Auto-générées si vides)

```bash
# Laissez vides, elles seront générées automatiquement
JWT_SECRET=
ENCRYPTION_KEY=
```

### Étape 5 : Configurer le Port

Dans les paramètres de Dokploy :
- **Port interne** : `3000` (port du conteneur)
- **Port externe** : `3001` (ou autre port disponible sur votre serveur)
- **Protocole** : HTTP

### Étape 6 : Déployer

1. Cliquez sur **"Deploy"** ou **"Build & Deploy"**
2. Attendez que le déploiement se termine (2-5 minutes)
3. Vérifiez les logs pour vous assurer qu'il n'y a pas d'erreurs

### Étape 7 : Vérifier le Déploiement

```bash
# Test de santé
curl http://84.247.175.132:3001/health

# Devrait retourner:
# {"status":"ok","timestamp":"...","uptime":...,"version":"1.0.0"}

# Vérifier le statut de configuration
curl http://84.247.175.132:3001/api/setup/status
```

### Étape 8 : Configuration Post-Déploiement

Configurez vos clés API via l'API Setup :

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

---

## 🎯 Méthode 2 : Déploiement via Git

### Option A : Dokploy GitHub Integration

1. Dans Dokploy, allez dans **"Settings"** → **"Git Providers"**
2. Connectez votre compte GitHub
3. Autorisez l'accès au dépôt `ultimateappbuilder-fixed`
4. Dokploy détectera automatiquement le `Dockerfile` et `docker-compose.yml`
5. Suivez les étapes 4-8 de la Méthode 1

### Option B : Déploiement Manuel

Si vous avez accès SSH au serveur :

```bash
# SSH sur le serveur Dokploy
ssh user@84.247.175.132

# Clone le dépôt
git clone https://github.com/uglyswap/ultimateappbuilder-fixed.git
cd ultimateappbuilder-fixed
git checkout claude/fix-deployment-setup-018d1JAP1pEHGzVud4jprNdv

# Copier le fichier docker-compose
cp docker-compose.dokploy.yml docker-compose.yml

# Créer le fichier .env
cat > .env <<EOF
POSTGRES_USER=postgres
POSTGRES_PASSWORD=votre_mot_de_passe_sécurisé
POSTGRES_DB=ultimate_app_builder
APP_URL=http://84.247.175.132:3001
APP_PORT=3001
EOF

# Démarrer avec Docker Compose
docker-compose up -d

# Vérifier les logs
docker-compose logs -f app
```

---

## 🔧 Configuration Avancée

### Domaine Personnalisé

Si vous voulez utiliser un domaine personnalisé :

1. Dans Dokploy, allez dans **"Domains"**
2. Ajoutez votre domaine : `app.votredomaine.com`
3. Configurez le DNS :
   ```
   Type: A
   Name: app
   Value: 84.247.175.132
   TTL: 3600
   ```
4. Dokploy configurera automatiquement SSL avec Let's Encrypt
5. Mettez à jour la variable `APP_URL=https://app.votredomaine.com`

### SSL/HTTPS

Dokploy gère automatiquement SSL avec Let's Encrypt si vous utilisez un domaine.

Pour forcer HTTPS :
1. Dans les paramètres du projet Dokploy
2. Activez **"Force HTTPS"**
3. Dokploy redirigera automatiquement HTTP → HTTPS

### Scaling

Pour gérer plus de trafic :

```yaml
# Dans docker-compose.dokploy.yml, modifier le service app:
services:
  app:
    deploy:
      replicas: 3  # 3 instances de l'app
      resources:
        limits:
          cpus: '1'
          memory: 2G
```

### Backups Automatiques

Dans Dokploy :
1. Allez dans **"Backups"**
2. Configurez un backup automatique :
   - **Volume PostgreSQL** : `postgres_data`
   - **Fréquence** : Quotidien à 2h du matin
   - **Rétention** : 7 jours

---

## 📊 Monitoring

### Logs en Temps Réel

Via l'interface Dokploy :
1. Cliquez sur votre projet
2. Onglet **"Logs"**
3. Sélectionnez le service (`app`, `postgres`, `redis`)

Via CLI :
```bash
# Logs de l'application
docker logs -f ultimate-app-builder-app

# Logs de tous les services
docker-compose logs -f
```

### Métriques

Dokploy affiche automatiquement :
- CPU usage
- Memory usage
- Network I/O
- Disk usage

### Alertes

Configurez des alertes dans Dokploy :
1. **"Settings"** → **"Notifications"**
2. Ajoutez votre email ou webhook Discord/Slack
3. Configurez les alertes pour :
   - Container down
   - High CPU (>80%)
   - High memory (>90%)
   - Deployment failed

---

## 🐛 Troubleshooting

### Le déploiement échoue

```bash
# Vérifier les logs de build
docker-compose logs --tail=100 app

# Erreurs communes et solutions:
```

**Erreur : "Cannot connect to database"**
```bash
# Vérifier que PostgreSQL est démarré
docker ps | grep postgres

# Vérifier la connection string
echo $DATABASE_URL
```

**Erreur : "Port already in use"**
```bash
# Changer le port dans docker-compose.dokploy.yml
ports:
  - "3002:3000"  # Utiliser 3002 au lieu de 3001
```

**Erreur : "ENOSPC: no space left on device"**
```bash
# Nettoyer Docker
docker system prune -a --volumes
```

### L'application ne démarre pas

```bash
# Entrer dans le conteneur
docker exec -it ultimate-app-builder-app sh

# Vérifier les variables d'environnement
env | grep DATABASE_URL

# Tester la connexion à la base de données
npx prisma db execute --stdin <<< "SELECT 1"

# Relancer les migrations
npx prisma migrate deploy
```

### Performances lentes

1. Vérifier les ressources :
   ```bash
   docker stats
   ```

2. Augmenter les ressources allouées dans Dokploy :
   - CPU : 2+ cores
   - RAM : 4+ GB
   - Disk : 20+ GB

3. Activer Redis caching (déjà configuré dans notre setup)

### Reset complet

Si tout échoue :

```bash
# Arrêter et supprimer tout
docker-compose down -v

# Rebuild et redémarrer
docker-compose up -d --build

# Vérifier les logs
docker-compose logs -f
```

---

## ✅ Checklist Post-Déploiement

- [ ] Application accessible sur `http://84.247.175.132:3001`
- [ ] Health check passe : `curl http://84.247.175.132:3001/health`
- [ ] PostgreSQL fonctionne
- [ ] Redis fonctionne
- [ ] Clés API configurées (via Setup API ou variables d'env)
- [ ] SSL configuré (si domaine personnalisé)
- [ ] Backups configurés
- [ ] Monitoring actif
- [ ] Documentation accessible : `http://84.247.175.132:3001/api-docs`

---

## 🆘 Support

- **Logs Dokploy** : Consultez l'onglet "Logs" dans l'interface
- **Logs Application** : `docker-compose logs -f app`
- **API Docs** : `http://84.247.175.132:3001/api-docs`
- **GitHub Issues** : https://github.com/uglyswap/ultimateappbuilder/issues

---

## 🔐 Sécurité Post-Déploiement

1. **Régénérer la clé API Dokploy** car elle a été exposée
2. **Configurer un firewall** pour limiter l'accès au port 3001
3. **Activer SSL/HTTPS** avec un domaine personnalisé
4. **Changer les mots de passe** PostgreSQL par défaut
5. **Limiter l'accès** à l'API Dokploy (IP whitelist)
6. **Activer les logs d'audit** dans Dokploy

---

**Fait avec ❤️ pour un déploiement facile sur Dokploy**

**The #1 AI-Powered App Builder in the World** 🌍
