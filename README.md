# 🚀 Ultimate App Builder - The #1 AI-Powered App Builder in the World

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/uglyswap/ultimateappbuilder)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![AI Models](https://img.shields.io/badge/AI_Models-200+-purple.svg)](#-200-ai-models-support)
[![Templates](https://img.shields.io/badge/Templates-FREE-orange.svg)](#-20-premium-templates-100-free)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)

> **Generate production-ready, full-stack applications in minutes using AI. No coding knowledge required. 100% free and open source.**

## ✨ What Makes Ultimate App Builder #1?

### 🤖 **Autonomous Mode (YOLO Mode)**
- **Zero interruptions**: The AI works autonomously from start to finish
- **Auto-error fixing**: Detects and fixes errors automatically
- **Auto-optimization**: Optimizes generated code for performance
- **Self-correcting**: Learns from mistakes and improves continuously
- **No confirmations needed**: Just set it and forget it!

### 🌍 **200+ AI Models Support**
Access the world's best AI models through multiple providers:

| Provider | Models | Best For |
|----------|--------|----------|
| **Anthropic** | Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku | Code generation, analysis |
| **OpenAI** | GPT-4 Turbo, GPT-4, GPT-3.5, o1, o3 | General purpose |
| **Google** | Gemini 2.0, Gemini Pro 1.5 | Long context (2M tokens) |
| **Meta** | Llama 3.3 70B, Llama 3.1 405B | Open source models |
| **Mistral** | Mistral Large, Codestral | Code specialist |
| **DeepSeek** | DeepSeek Coder, DeepSeek Chat | Fast responses |
| **Cohere** | Command R+, Command R | Retrieval & search |
| **OpenRouter** | Access to ALL models | One API for everything |

**Total: 200+ models** - Choose the perfect model for your use case!

### 🎨 **20+ Premium Templates (100% FREE)**
All templates are production-ready, fully customizable, and completely free:

- **💼 SaaS**: Full-Stack SaaS Starter, AI SaaS Platform, Team Collaboration
- **🛒 E-Commerce**: Modern Store, Multi-Vendor Marketplace, Subscription Box
- **👥 Social**: Social Network, Community Forum, Video Conference Platform
- **📝 Content**: Headless CMS, Blog Platform (Medium-style), Podcast Platform
- **💰 Finance**: Crypto Exchange, Personal Finance Manager, Payment Gateway
- **🎓 Education**: Learning Management System, Online Courses Platform
- **⚕️ Healthcare**: Telemedicine Platform, Patient Management System
- **📊 Analytics**: Business Intelligence Dashboard, Data Visualization
- **⚡ Real-time**: Chat App, Video Streaming, Live Collaboration

### ⚡ **Real-Time Everything**
- **WebSocket support** - Live updates for generation progress
- **Streaming responses** - See code being generated in real-time
- **Live deployment logs** - Watch your app deploy live
- **Instant notifications** - Never miss an update

### 🗄️ **Auto Database Setup**
- **Automatic schema generation** - AI analyzes your app and creates optimal schema
- **Multiple databases**: PostgreSQL, MySQL, MongoDB, SQLite
- **Cloud integrations**: Supabase, PlanetScale, Neon, Railway
- **Auto-migrations** - Database updates handled automatically
- **Seed data generation** - Realistic test data created by AI

### 🎯 **Custom System Prompts**
- **Customize AI behavior** - Create your own system prompts per agent
- **Share prompts** - Build a library of proven prompts
- **Version control** - Track prompt performance over time

## 🏗️ Architecture

### Multi-Agent System
7 specialized AI agents working together:

1. **🎭 Orchestrator Agent** - Plans and coordinates
2. **⚙️ Backend Agent** - Express.js/Node.js backend
3. **🎨 Frontend Agent** - React UI components
4. **🗄️ Database Agent** - Prisma schemas
5. **🔐 Auth Agent** - Authentication & security
6. **🔌 Integrations Agent** - Third-party services
7. **🚀 DevOps Agent** - Docker, CI/CD, deployment

### Technology Stack

**Backend:** Node.js 20+ • Express.js 4 • TypeScript 5 • Prisma ORM • Redis • BullMQ • WebSocket

**Frontend:** React 18 • Vite 5 • Tailwind CSS 3 • TanStack Query • Monaco Editor

**AI:** Anthropic • OpenAI • OpenRouter • 200+ models

**DevOps:** Docker • GitHub Actions • Multi-cloud deployment

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16
- Redis 7
- One AI API key (Anthropic, OpenAI, or OpenRouter)

### Installation

```bash
# Clone the repository
git clone https://github.com/uglyswap/ultimateappbuilder.git
cd ultimateappbuilder

# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env and add your API key(s)

# Setup database
npx prisma generate
npx prisma migrate dev

# Start development server
npm run dev
```

**Your app is now running! 🎉**

- 🌐 **API**: http://localhost:3000
- 📚 **Docs**: http://localhost:3000/api-docs
- 🔌 **WebSocket**: ws://localhost:3000/ws

### Docker Quick Start

```bash
# Start everything with Docker Compose (PostgreSQL, Redis, App)
docker-compose up

# That's it! The app starts automatically with all dependencies
```

## 📖 Usage

### 1. Create Your First Project

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Awesome SaaS",
    "description": "A SaaS platform for task management",
    "template": "SAAS",
    "features": ["auth", "subscriptions", "teams", "api"]
  }'
```

Response:
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

### 2. Monitor Progress (Real-Time WebSocket)

```javascript
const ws = new WebSocket('ws://localhost:3000/ws?projectId=proj_abc123');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data);
  // { type: 'generation_progress', data: { step: 'Creating backend...', percentage: 45 } }
};
```

### 3. Download Generated Code

```bash
curl http://localhost:3000/api/projects/proj_abc123/download -o my-app.zip
unzip my-app.zip
cd my-app
npm install
npm run dev
```

**Your generated app is now running!** 🎉

## 🎯 Advanced Features

### Browse 200+ AI Models

```bash
# List all available models
curl http://localhost:3000/api/ai-models

# Search for specific models
curl 'http://localhost:3000/api/ai-models?search=gpt-4'

# Get recommended models for code generation
curl 'http://localhost:3000/api/ai-models/recommended?useCase=code-generation'
```

### Create Custom System Prompts

```bash
# Create a custom prompt for the backend agent
curl -X POST http://localhost:3000/api/custom-prompts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Backend Expert",
    "agentType": "backend",
    "prompt": "You are an expert backend developer specializing in clean architecture...",
    "tags": ["backend", "clean-code"]
  }'

# Activate the prompt
curl -X POST http://localhost:3000/api/custom-prompts/{id}/activate
```

## 🌟 What Gets Generated?

Every project includes:

### ✅ Backend (Express.js + TypeScript)
- RESTful API endpoints with Swagger docs
- Authentication (JWT, OAuth)
- Database models (Prisma)
- Input validation (Zod)
- Error handling & logging
- Rate limiting & security
- Unit tests (Vitest)

### ✅ Frontend (React + TypeScript)
- Modern UI components (Tailwind CSS)
- Responsive design
- State management (React Query)
- Routing (React Router)
- Form handling & validation
- Authentication flow
- API integration

### ✅ Database (Prisma)
- Type-safe schema
- Migrations & seed data
- Indexes for performance
- Relations & constraints

### ✅ DevOps
- Docker setup (multi-stage builds)
- Docker Compose for local dev
- GitHub Actions (CI/CD)
- Environment configuration
- Health checks & monitoring

### ✅ Documentation
- README with setup instructions
- API documentation (Swagger)
- Architecture diagrams
- Deployment guides

**Everything is production-ready!**

## 🎓 Example Projects

### Generate a Blog Platform
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{ "name": "Tech Blog", "template": "BLOG", "features": ["markdown", "comments", "seo"] }'
```

### Generate an E-Commerce Store
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{ "name": "Fashion Store", "template": "ECOMMERCE", "features": ["products", "cart", "checkout"] }'
```

### Generate a SaaS Platform
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{ "name": "Project Manager Pro", "template": "SAAS", "features": ["auth", "subscriptions", "teams"] }'
```

## 🔧 Configuration

### Autonomous Mode

Edit `.env`:
```bash
# Enable full autonomy (recommended!)
AUTONOMOUS_MODE=true
AUTO_FIX_ERRORS=true
AUTO_OPTIMIZE=true
AUTO_TEST=true
AUTO_DEPLOY=false  # Keep false for safety
```

### AI Provider

```bash
# Choose your provider
AI_PROVIDER=anthropic  # or openai, or openrouter
AI_MODEL=claude-3-5-sonnet-20241022

# OpenRouter gives access to ALL 200+ models
OPENROUTER_API_KEY=your-key
```

## 📊 Performance

- **Generation speed**: 2-5 minutes for full-stack app
- **Code quality**: Production-ready, best practices
- **Test coverage**: Comprehensive test suites
- **Deployment**: 5-10 minutes to live URL

## 🤝 Contributing

We welcome contributions! This is a community-driven project.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and open a Pull Request

## 📜 License

MIT License - **Free forever. Open source. No limits.**

## 🌟 Star History

If you find Ultimate App Builder useful, please star the repo! ⭐

## 💬 Community & Support

- **GitHub Issues**: [Report bugs & request features](https://github.com/uglyswap/ultimateappbuilder/issues)
- **Discussions**: [Community forum](https://github.com/uglyswap/ultimateappbuilder/discussions)

## 🚀 Roadmap

- [x] Multi-agent AI system
- [x] 200+ AI models support
- [x] 20+ premium templates (FREE)
- [x] Autonomous mode (YOLO)
- [x] Real-time WebSocket updates
- [x] Auto database setup
- [x] Custom system prompts
- [ ] Visual editor (drag & drop)
- [ ] Template marketplace
- [ ] Plugin system
- [ ] Mobile app generation
- [ ] GraphQL API generation
- [ ] Microservices architecture

## 🙏 Acknowledgments

Built with: Anthropic Claude • OpenAI GPT • Node.js • TypeScript • React • Prisma • and 200+ other amazing open source projects

---

<div align="center">

**Made with ❤️ by developers, for developers**

**The #1 AI-Powered App Builder in the World** 🌍

[⭐ Star on GitHub](https://github.com/uglyswap/ultimateappbuilder) • [📖 Docs](http://localhost:3000/api-docs) • [🐛 Report Bug](https://github.com/uglyswap/ultimateappbuilder/issues)

</div>
