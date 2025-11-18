# ⚡ DÉPLOIEMENT EN 2 MINUTES - GUIDE ULTRA-SIMPLE

## 🎯 CE QUE VOUS DEVEZ FAIRE (2 MINUTES MAXIMUM)

### ✅ Étape 1 : Ouvrez Dokploy (10 secondes)

Cliquez sur ce lien : **http://84.247.175.132:3000**

### ✅ Étape 2 : Créez un Projet (20 secondes)

1. Cliquez sur le bouton **"Create Project"** (en haut à droite)
2. Entrez le nom : `ultimate-app-builder`
3. Cliquez **"Create"**

### ✅ Étape 3 : Ajoutez l'Application (30 secondes)

Dans votre projet :

1. Cliquez sur **"Add Service"** ou le bouton **"+"**
2. Sélectionnez **"Docker Compose"**
3. Remplissez :

```
Name: ultimate-app-builder
Source: Git / GitHub
Repository: https://github.com/uglyswap/ultimateappbuilder-fixed
Branch: claude/fix-deployment-setup-018d1JAP1pEHGzVud4jprNdv
Compose File: docker-compose.traefik.yml
```

### ✅ Étape 4 : Copiez les Variables (30 secondes)

Dans la section **"Environment Variables"**, cliquez sur **"Bulk Edit"** et collez :

```
POSTGRES_PASSWORD=UltimateAppBuilder2024SecurePass!
APP_URL=http://ultimate-app-builder.84.247.175.132.nip.io
NODE_ENV=production
PORT=3000
PROJECT_NAME=ultimate-app-builder
POSTGRES_USER=postgres
POSTGRES_DB=ultimate_app_builder
DATABASE_URL=postgresql://postgres:UltimateAppBuilder2024SecurePass!@postgres:5432/ultimate_app_builder?schema=public
REDIS_URL=redis://redis:6379
AI_PROVIDER=anthropic
AUTONOMOUS_MODE=true
AUTO_FIX_ERRORS=true
```

### ✅ Étape 5 : Configurez le Domaine (20 secondes)

Dans la section **"Domains"** ou **"Traefik"** :

1. Cochez **"Enable Traefik"**
2. Entrez le domaine : `ultimate-app-builder.84.247.175.132.nip.io`
3. Port : `3000`

### ✅ Étape 6 : Déployez ! (10 secondes)

1. Cliquez sur le gros bouton bleu **"Deploy"**
2. Attendez 3 minutes pendant que ça se déploie

### ✅ Étape 7 : Testez (10 secondes)

Ouvrez un nouveau terminal et tapez :

```bash
curl http://ultimate-app-builder.84.247.175.132.nip.io/health
```

Vous devriez voir :
```json
{"status":"ok"}
```

---

## 🎉 C'EST FAIT !

Votre application est maintenant accessible sur :

### **http://ultimate-app-builder.84.247.175.132.nip.io**

---

## 🔧 Configurez vos Clés AI (30 secondes)

```bash
curl -X POST http://ultimate-app-builder.84.247.175.132.nip.io/api/setup/complete \
  -H "Content-Type: application/json" \
  -d '{
    "aiProvider": "anthropic",
    "anthropicApiKey": "sk-ant-VOTRE-CLÉ-ICI"
  }'
```

---

## 📱 URLs Importantes

- **Application** : http://ultimate-app-builder.84.247.175.132.nip.io
- **API Docs** : http://ultimate-app-builder.84.247.175.132.nip.io/api-docs
- **Health** : http://ultimate-app-builder.84.247.175.132.nip.io/health

---

## 🆘 Si Ça Ne Marche Pas

### Erreur 1 : "Cannot connect to database"
→ Attendez 2 minutes de plus, PostgreSQL démarre

### Erreur 2 : Domaine ne répond pas
→ Vérifiez que Traefik est activé dans Dokploy
→ Testez avec : `curl http://localhost:3000/health` depuis le serveur

### Erreur 3 : Les logs montrent des erreurs
→ Dans Dokploy, cliquez sur votre app → Onglet "Logs"
→ Copiez les erreurs et cherchez dans Google

---

## ⚠️ POURQUOI L'API NE FONCTIONNE PAS

Vos clés API retournent "Access denied". Pour les régénérer :

1. Dokploy → **Settings** → **Profile**
2. Section **"API/CLI"**
3. Supprimez toutes les anciennes clés
4. Cliquez sur **"Generate Token"**
5. Copiez la nouvelle clé

Mais **vous n'avez PAS besoin de l'API** pour déployer !
L'interface web suffit et c'est plus simple.

---

## ✅ RÉSUMÉ : 7 ÉTAPES, 2 MINUTES

1. ✅ Ouvrez Dokploy
2. ✅ Créez un projet
3. ✅ Ajoutez Docker Compose
4. ✅ Collez les variables
5. ✅ Configurez le domaine
6. ✅ Déployez
7. ✅ Testez

**TEMPS TOTAL : 2-3 MINUTES**

---

## 🎯 FAITES-LE MAINTENANT

Ouvrez : **http://84.247.175.132:3000**

Et suivez les 7 étapes ci-dessus.

**Votre application sera en ligne dans 3 minutes !** 🚀
