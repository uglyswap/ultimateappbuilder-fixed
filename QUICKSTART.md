# ⚡ Quick Start Guide - Get Running in 5 Minutes!

This guide will get you up and running with Ultimate App Builder in less than 5 minutes.

## 🎯 Prerequisites

- **Docker** and **Docker Compose** installed
  - [Install Docker](https://docs.docker.com/get-docker/)
  - [Install Docker Compose](https://docs.docker.com/compose/install/)

That's it! No Node.js, PostgreSQL, or Redis installation needed.

---

## 🚀 3 Simple Steps

### Step 1: Clone and Start

```bash
# Clone the repository
git clone https://github.com/uglyswap/ultimateappbuilder.git
cd ultimateappbuilder

# Start everything with one command
docker-compose up
```

**Wait 30-60 seconds** for the services to start. You'll see:

```
✅ PostgreSQL is ready!
✅ Redis is ready!
✅ Database migrations completed!
✅ Prisma client generated!
🎉 Starting Ultimate App Builder!
✨ Ready to build amazing apps! ✨
```

### Step 2: Verify It's Running

Open your browser or use curl:

```bash
# Check health
curl http://localhost:3000/health

# You should see:
# {"status":"ok","timestamp":"...","uptime":...,"version":"1.0.0"}
```

### Step 3: Configure API Keys

You have **3 options** to add your API keys:

#### Option A: Using the Setup API (Easiest!)

```bash
curl -X POST http://localhost:3000/api/setup/complete \
  -H "Content-Type: application/json" \
  -d '{
    "aiProvider": "anthropic",
    "anthropicApiKey": "sk-ant-your-key-here"
  }'
```

#### Option B: Edit .env file

```bash
# Edit the .env file
nano .env

# Add your API key:
ANTHROPIC_API_KEY="sk-ant-your-key-here"

# Restart the app
docker-compose restart app
```

#### Option C: Use any API client (Postman, Insomnia, etc.)

- **URL**: `http://localhost:3000/api/setup/complete`
- **Method**: POST
- **Body**:
  ```json
  {
    "aiProvider": "anthropic",
    "anthropicApiKey": "sk-ant-your-key-here",
    "openaiApiKey": "sk-your-openai-key-optional",
    "openrouterApiKey": "sk-or-your-openrouter-key-optional"
  }
  ```

---

## 🎉 You're Ready!

Your Ultimate App Builder is now running at:

- 🌐 **API**: http://localhost:3000
- 📚 **API Docs**: http://localhost:3000/api-docs
- 🔧 **Setup Status**: http://localhost:3000/api/setup/status

---

## 📖 Create Your First Project

### Using curl:

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Awesome SaaS",
    "description": "A task management SaaS platform",
    "template": "SAAS",
    "features": ["auth", "subscriptions", "teams", "api"]
  }'
```

### Response:

```json
{
  "success": true,
  "project": {
    "id": "proj_abc123",
    "name": "My Awesome SaaS",
    "status": "GENERATING"
  },
  "message": "Project queued for generation! 🚀"
}
```

---

## 🔍 Monitor Progress (WebSocket)

```javascript
const ws = new WebSocket('ws://localhost:3000/ws?projectId=proj_abc123');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data);
  // Real-time updates on generation progress
};
```

---

## 📥 Download Generated Code

```bash
# Download the generated project
curl http://localhost:3000/api/projects/proj_abc123/download -o my-app.zip

# Extract and run
unzip my-app.zip
cd my-app
npm install
npm run dev
```

Your generated app is now running! 🎉

---

## 🎨 Explore Available Templates

```bash
# List all templates
curl http://localhost:3000/api/templates

# Get recommended template
curl http://localhost:3000/api/templates/recommended?category=SAAS
```

**Available templates:**
- 💼 **SaaS**: Full-stack SaaS starter
- 🛒 **E-Commerce**: Online store with cart & checkout
- 📝 **Blog**: Medium-style blog platform
- 🔌 **API**: RESTful API with authentication
- 🎨 **Custom**: Build from scratch

---

## 🤖 Browse AI Models

Access **200+ AI models** from 14+ providers:

```bash
# List all available models
curl http://localhost:3000/api/ai-models

# Search for specific models
curl 'http://localhost:3000/api/ai-models?search=gpt-4'

# Get recommended models for code generation
curl 'http://localhost:3000/api/ai-models/recommended?useCase=code-generation'
```

---

## 🛠️ Useful Commands

```bash
# View logs
docker-compose logs -f app

# Restart the app
docker-compose restart app

# Stop everything
docker-compose down

# Stop and remove all data (⚠️ WARNING: Deletes all projects!)
docker-compose down -v

# Check setup status
curl http://localhost:3000/api/setup/status
```

---

## 🆘 Troubleshooting

### App doesn't start?

```bash
# Check if all services are running
docker-compose ps

# View logs for errors
docker-compose logs app
```

### Port 3000 already in use?

Edit `docker-compose.yml` and change the port:

```yaml
services:
  app:
    ports:
      - "3001:3000"  # Use 3001 instead
```

### Need to reset everything?

```bash
docker-compose down -v
docker-compose up
```

---

## 📚 Next Steps

- **Read the full README**: [README.md](README.md)
- **Deployment guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **API Documentation**: http://localhost:3000/api-docs
- **GitHub Issues**: https://github.com/uglyswap/ultimateappbuilder/issues

---

## 🌟 Key Features

✅ **No configuration needed** - Just start and configure via API
✅ **Automatic database setup** - Migrations run automatically
✅ **200+ AI models** - Anthropic, OpenAI, OpenRouter, and more
✅ **20+ templates** - All free and open source
✅ **Autonomous mode** - AI works without interruptions
✅ **Real-time updates** - WebSocket support
✅ **Production ready** - Docker, security, monitoring included

---

**Made with ❤️ by developers, for developers**

**The #1 AI-Powered App Builder in the World** 🌍

[⭐ Star on GitHub](https://github.com/uglyswap/ultimateappbuilder) • [📖 Full Docs](README.md) • [🐛 Report Bug](https://github.com/uglyswap/ultimateappbuilder/issues)
