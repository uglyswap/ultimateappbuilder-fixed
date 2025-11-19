# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Copy package files for backend
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

# Install backend dependencies
RUN npm ci

# Copy backend source code
COPY src ./src

# Generate Prisma client
RUN npx prisma generate

# Build backend application
RUN npm run build

# Build frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend ./
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built application and Prisma files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Copy built frontend
COPY --from=builder /app/frontend/dist ./frontend/dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Create directories and set ownership
RUN mkdir -p /app/storage /app/generated && \
    chown -R nodejs:nodejs /app

USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
