# 🚀 Déploiement Rapide sur Dokploy

Guide ultra-rapide pour déployer sur votre serveur Dokploy en 5 minutes.

## 📝 Informations de votre Serveur

- **URL Dokploy** : http://84.247.175.132:3000
- **Application sera accessible sur** : http://84.247.175.132:3001

---

## ⚡ Déploiement en 3 Étapes

### Étape 1 : Aller sur Dokploy

1. Ouvrez : http://84.247.175.132:3000
2. Connectez-vous

### Étape 2 : Créer l'Application

1. Cliquez sur **"Create Project"** ou **"New Application"**
2. Configurez :
   - **Nom** : `ultimate-app-builder`
   - **Type** : `Docker Compose`
   - **Repository** : `https://github.com/uglyswap/ultimateappbuilder-fixed`
   - **Branch** : `claude/fix-deployment-setup-018d1JAP1pEHGzVud4jprNdv`
   - **Docker Compose File** : `docker-compose.dokploy.yml`

### Étape 3 : Variables d'Environnement

Ajoutez ces variables dans Dokploy (section Environment) :

```bash
# Essentielles
POSTGRES_PASSWORD=VotreMotDePasseSecurise123!
APP_URL=http://84.247.175.132:3001
APP_PORT=3001

# Le reste peut être laissé vide (sera configuré via l'API après)
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
```

Cliquez sur **"Deploy"** et attendez 2-3 minutes.

---

## ✅ Vérification

```bash
# Test rapide
curl http://84.247.175.132:3001/health

# Devrait afficher: {"status":"ok",...}
```

---

## 🔧 Configuration Post-Déploiement

Une fois déployé, configurez vos clés API :

```bash
curl -X POST http://84.247.175.132:3001/api/setup/complete \
  -H "Content-Type: application/json" \
  -d '{
    "aiProvider": "anthropic",
    "anthropicApiKey": "sk-ant-votre-clé-ici"
  }'
```

---

## 📱 Accès

- **Application** : http://84.247.175.132:3001
- **API Docs** : http://84.247.175.132:3001/api-docs
- **Setup Status** : http://84.247.175.132:3001/api/setup/status

---

## 🆘 Problèmes ?

### L'application ne démarre pas

Dans Dokploy, allez dans l'onglet **"Logs"** et regardez les erreurs.

**Erreurs communes** :

1. **"Cannot connect to database"**
   - Vérifiez que `POSTGRES_PASSWORD` est bien défini
   - Attendez 1-2 minutes que PostgreSQL démarre

2. **"Port already in use"**
   - Changez `APP_PORT=3002` (ou autre port libre)

3. **"Build failed"**
   - Vérifiez que la branche Git est correcte
   - Assurez-vous que `docker-compose.dokploy.yml` existe

### Redémarrer l'application

Dans Dokploy : Cliquez sur **"Restart"** dans les options du projet.

---

## 🔐 Sécurité Important !

⚠️ **ATTENTION** : Votre clé API Dokploy `WstNw...` a été exposée publiquement.

**À faire immédiatement :**

1. Allez dans Dokploy → **Settings** → **API Keys**
2. **Supprimez** l'ancienne clé `WstNw...`
3. **Créez** une nouvelle clé API
4. **Ne la partagez jamais** publiquement

---

## 🎯 Génération Automatique des Variables

Si vous avez accès SSH au serveur :

```bash
# Clone le repo
git clone https://github.com/uglyswap/ultimateappbuilder-fixed.git
cd ultimateappbuilder-fixed
git checkout claude/fix-deployment-setup-018d1JAP1pEHGzVud4jprNdv

# Génère un fichier .env sécurisé
./scripts/generate-dokploy-env.sh

# Le fichier .env contient toutes les variables nécessaires
# Copiez-les dans l'interface Dokploy
```

---

## 📚 Documentation Complète

Pour plus de détails : **DOKPLOY_DEPLOYMENT.md**

---

## ✅ Checklist

- [ ] Application accessible sur http://84.247.175.132:3001
- [ ] Health check répond : `/health`
- [ ] Clés API configurées via `/api/setup/complete`
- [ ] Documentation accessible : `/api-docs`
- [ ] Ancienne clé API Dokploy supprimée

---

**Fait avec ❤️ pour un déploiement ultra-rapide**

**The #1 AI-Powered App Builder** 🌍
