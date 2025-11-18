#!/bin/sh
set -e

echo "🚀 Ultimate App Builder - Starting..."
echo "========================================"

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "✅ PostgreSQL is ready!"

# Wait for Redis to be ready
echo "⏳ Waiting for Redis to be ready..."
while ! nc -z redis 6379; do
  sleep 1
done
echo "✅ Redis is ready!"

# Run Prisma migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy || {
  echo "⚠️  Migration failed, trying to generate Prisma client..."
  npx prisma generate
  npx prisma migrate deploy || {
    echo "⚠️  Migrations not found, creating database schema..."
    npx prisma db push --skip-generate
  }
}
echo "✅ Database migrations completed!"

# Generate Prisma client (if not already done)
echo "🔧 Generating Prisma client..."
npx prisma generate
echo "✅ Prisma client generated!"

# Initialize default configurations
echo "🔧 Initializing system..."

# Start the application
echo "========================================"
echo "🎉 Starting Ultimate App Builder!"
echo "========================================"
exec node dist/index.js
