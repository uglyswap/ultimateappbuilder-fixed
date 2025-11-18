# Database Schema Documentation

## Overview

Ultimate App Builder uses **PostgreSQL** as its primary database with **Prisma ORM** for type-safe database access.

## Database Design

### Core Tables

#### Users
Stores user accounts and authentication information.

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  name          String?
  avatar        String?
  role          UserRole  @default(USER)

  subscriptionTier   SubscriptionTier @default(FREE)
  subscriptionStatus String?
  stripeCustomerId   String?          @unique

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  lastLoginAt   DateTime?

  projects      Project[]
  apiKeys       ApiKey[]
  generations   Generation[]
}
```

#### Projects
Generated application projects.

```prisma
model Project {
  id              String        @id @default(cuid())
  name            String
  description     String?
  template        ProjectTemplate
  status          ProjectStatus @default(DRAFT)
  config          Json
  features        String[]
  generatedPath   String?
  repositoryUrl   String?
  deploymentUrl   String?

  userId          String
  user            User          @relation(fields: [userId], references: [id])

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  deployedAt      DateTime?

  generations     Generation[]
  deployments     Deployment[]
}
```

#### Generations
AI code generation history.

```prisma
model Generation {
  id              String           @id @default(cuid())
  projectId       String
  userId          String
  agentType       AgentType
  prompt          String           @db.Text
  response        String           @db.Text
  status          GenerationStatus @default(PENDING)
  tokensUsed      Int              @default(0)
  durationMs      Int?
  errorMessage    String?          @db.Text

  createdAt       DateTime         @default(now())
  completedAt     DateTime?
}
```

## Enums

### UserRole
- `USER`: Regular user
- `ADMIN`: Administrator
- `SUPER_ADMIN`: Super administrator

### SubscriptionTier
- `FREE`: Free tier (limited features)
- `STARTER`: Starter plan
- `PRO`: Professional plan
- `ENTERPRISE`: Enterprise plan

### ProjectTemplate
- `SAAS`: SaaS application
- `ECOMMERCE`: E-commerce platform
- `BLOG`: Blog/CMS
- `API`: REST API
- `CUSTOM`: Custom template

### ProjectStatus
- `DRAFT`: Initial state
- `GENERATING`: Code generation in progress
- `READY`: Code generated successfully
- `DEPLOYING`: Deployment in progress
- `DEPLOYED`: Successfully deployed
- `ERROR`: Error occurred

### AgentType
- `ORCHESTRATOR`: Main orchestrator
- `BACKEND`: Backend code generator
- `FRONTEND`: Frontend code generator
- `DATABASE`: Database schema generator
- `AUTH`: Authentication generator
- `INTEGRATIONS`: Third-party integrations
- `DEVOPS`: DevOps configuration

## Indexes

For optimal performance, the following indexes are created:

- `users.email`: Unique index for fast email lookups
- `projects.userId`: For querying user's projects
- `projects.status`: For filtering by project status
- `generations.projectId`: For project's generation history
- `generations.userId`: For user's generation history
- `generations.status`: For filtering by generation status

## Relationships

```
User
  ├── projects (1:N)
  ├── apiKeys (1:N)
  └── generations (1:N)

Project
  ├── user (N:1)
  ├── generations (1:N)
  └── deployments (1:N)

Generation
  ├── project (N:1)
  └── user (N:1)
```

## Migrations

### Running Migrations

```bash
# Create a new migration
npm run prisma:migrate -- --name migration_name

# Apply migrations
npm run prisma:migrate

# Reset database (development only)
npx prisma migrate reset
```

### Seeding

```bash
# Seed database with initial data
npx prisma db seed
```

## Queries

### Common Queries

#### Get User with Projects
```typescript
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    projects: {
      orderBy: { createdAt: 'desc' },
      take: 10,
    },
  },
});
```

#### Get Project with Generations
```typescript
const project = await prisma.project.findUnique({
  where: { id: projectId },
  include: {
    generations: {
      orderBy: { createdAt: 'desc' },
    },
    user: {
      select: {
        id: true,
        email: true,
        name: true,
      },
    },
  },
});
```

## Performance Tips

1. **Use Select**: Only query fields you need
2. **Pagination**: Always paginate large result sets
3. **Indexes**: Ensure proper indexes on frequently queried fields
4. **Connection Pooling**: Prisma handles this automatically
5. **Transactions**: Use for multi-step operations

## Backup & Recovery

### Backup
```bash
pg_dump -h localhost -U postgres ultimate_app_builder > backup.sql
```

### Restore
```bash
psql -h localhost -U postgres ultimate_app_builder < backup.sql
```

## Security

- All passwords are hashed with **bcrypt** (cost factor: 10)
- Sensitive data is encrypted at rest
- API keys are hashed before storage
- Connection strings use SSL in production
