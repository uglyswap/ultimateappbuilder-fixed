"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseAgent = void 0;
const logger_1 = require("../utils/logger");
class DatabaseAgent {
    async generate(context) {
        logger_1.logger.info('Database Agent: Generating database schema');
        const files = [];
        // Generate Prisma schema
        files.push(this.generatePrismaSchema(context));
        // Generate database client
        files.push(this.generatePrismaClient());
        // Generate seed file
        files.push(this.generateSeedFile(context));
        return { files };
    }
    generatePrismaSchema(context) {
        const dbType = context.config.database?.type || 'postgresql';
        let schema = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "${dbType}"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  avatar    String?
  role      UserRole @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
  @@map("users")
}

enum UserRole {
  USER
  ADMIN
}
`;
        // Add template-specific models
        if (context.config.template === 'ECOMMERCE') {
            schema += `
model Product {
  id          String   @id @default(cuid())
  name        String
  description String?
  price       Float
  stock       Int      @default(0)
  imageUrl    String?
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([categoryId])
  @@map("products")
}

model Category {
  id        String    @id @default(cuid())
  name      String    @unique
  slug      String    @unique
  products  Product[]
  createdAt DateTime  @default(now())

  @@map("categories")
}

model Order {
  id         String      @id @default(cuid())
  userId     String
  total      Float
  status     OrderStatus @default(PENDING)
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt

  @@index([userId])
  @@map("orders")
}

enum OrderStatus {
  PENDING
  PAID
  SHIPPED
  DELIVERED
  CANCELLED
}
`;
        }
        else if (context.config.template === 'BLOG') {
            schema += `
model Post {
  id         String   @id @default(cuid())
  title      String
  slug       String   @unique
  content    String   @db.Text
  excerpt    String?
  published  Boolean  @default(false)
  authorId   String
  author     User     @relation(fields: [authorId], references: [id])
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([authorId])
  @@index([slug])
  @@map("posts")
}

model User {
  posts Post[]
}
`;
        }
        else if (context.config.template === 'SAAS') {
            schema += `
model Subscription {
  id        String           @id @default(cuid())
  userId    String           @unique
  tier      SubscriptionTier
  status    String
  startDate DateTime
  endDate   DateTime?
  createdAt DateTime         @default(now())

  @@index([userId])
  @@map("subscriptions")
}

enum SubscriptionTier {
  FREE
  PRO
  ENTERPRISE
}

model Usage {
  id        String   @id @default(cuid())
  userId    String
  metric    String
  value     Int
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([metric])
  @@map("usage")
}
`;
        }
        return {
            path: 'backend/prisma/schema.prisma',
            content: schema,
            language: 'prisma',
            description: 'Prisma database schema',
        };
    }
    generatePrismaClient() {
        return {
            path: 'backend/src/lib/prisma.ts',
            content: `import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
`,
            language: 'typescript',
            description: 'Prisma client singleton',
        };
    }
    generateSeedFile(context) {
        let seedContent = `import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log('✅ Created admin user:', admin.email);
`;
        if (context.config.template === 'ECOMMERCE') {
            seedContent += `
  // Create categories
  const electronics = await prisma.category.create({
    data: { name: 'Electronics', slug: 'electronics' },
  });

  const clothing = await prisma.category.create({
    data: { name: 'Clothing', slug: 'clothing' },
  });

  // Create products
  await prisma.product.createMany({
    data: [
      {
        name: 'Laptop',
        description: 'High-performance laptop',
        price: 999.99,
        stock: 10,
        categoryId: electronics.id,
      },
      {
        name: 'T-Shirt',
        description: 'Comfortable cotton t-shirt',
        price: 19.99,
        stock: 50,
        categoryId: clothing.id,
      },
    ],
  });

  console.log('✅ Created sample products');
`;
        }
        seedContent += `
  console.log('✨ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
`;
        return {
            path: 'backend/prisma/seed.ts',
            content: seedContent,
            language: 'typescript',
            description: 'Database seed file',
        };
    }
}
exports.DatabaseAgent = DatabaseAgent;
//# sourceMappingURL=database.js.map