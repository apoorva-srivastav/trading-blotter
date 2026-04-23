# Trading Platform Setup Guide

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- PostgreSQL 14+ ([Download](https://www.postgresql.org/download/))
- npm 10+ (comes with Node.js)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install all dependencies for the monorepo including:
- Root workspace dependencies
- apps/web (Next.js)
- apps/api (NestJS)
- packages/types
- packages/utils
- packages/config

### 2. Database Setup

```bash
# Create database
createdb trading_blotter

# Or using psql
psql -U postgres
CREATE DATABASE trading_blotter;
\q

# Run schema
psql -U postgres -d trading_blotter -f apps/api/database/schema.sql

# Optional: Seed sample data
psql -U postgres -d trading_blotter -f server/database/seed.sql
```

### 3. Environment Configuration

**Create apps/web/.env.local:**
```bash
cp apps/web/.env.example apps/web/.env.local
```

Edit `apps/web/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=http://localhost:4000
```

**Create apps/api/.env:**
```bash
cp apps/api/.env.example apps/api/.env
```

Edit `apps/api/.env`:
```env
PORT=4000
NODE_ENV=development

# Update with your PostgreSQL credentials
DB_HOST=localhost
DB_PORT=5432
DB_NAME=trading_blotter
DB_USER=postgres
DB_PASSWORD=your_password_here

CORS_ORIGIN=http://localhost:3000
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

### 4. Run Development Servers

**Option 1: Run all apps simultaneously**
```bash
npm run dev
```

**Option 2: Run apps individually**

```bash
# Terminal 1 - API Server
npm run dev --filter=api

# Terminal 2 - Web App
npm run dev --filter=web
```

### 5. Access the Application

- **Web App**: http://localhost:3000
- **API Server**: http://localhost:4000
- **API Health**: http://localhost:4000/api/health
- **WebSocket**: ws://localhost:4000

## Development Workflow

### Running Specific Apps

```bash
# Web app only
npm run dev --filter=web

# API server only
npm run dev --filter=api
```

### Building for Production

```bash
# Build all apps
npm run build

# Build specific app
npm run build --filter=web
npm run build --filter=api
```

### Running Production Build

```bash
# Start web app
npm run start --filter=web

# Start API server
npm run start --filter=api
```

### Linting

```bash
# Lint all apps
npm run lint

# Lint specific app
npm run lint --filter=web
npm run lint --filter=api
```

### Testing

```bash
# Run all tests
npm run test

# Run tests for specific app
npm run test --filter=api
```

### Clean Build Artifacts

```bash
# Clean all apps
npm run clean

# Clean specific app
npm run clean --filter=web
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in .env files
```

### Database Connection Errors

```bash
# Test PostgreSQL connection
psql -U postgres -d trading_blotter -c "SELECT 1;"

# Check if PostgreSQL is running
pg_isready

# Start PostgreSQL (macOS)
brew services start postgresql

# Start PostgreSQL (Linux)
sudo systemctl start postgresql
```

### Module Not Found Errors

```bash
# Clear all node_modules and reinstall
rm -rf node_modules apps/*/node_modules packages/*/node_modules
npm install

# Clear Turborepo cache
rm -rf .turbo
```

### WebSocket Connection Issues

1. Verify API server is running on port 4000
2. Check CORS_ORIGIN in apps/api/.env
3. Verify NEXT_PUBLIC_WS_URL in apps/web/.env.local
4. Check browser console for errors

## Project Structure

```
trading-platform/
├── apps/
│   ├── web/                 # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/        # App Router pages
│   │   │   ├── components/ # React components
│   │   │   ├── hooks/      # Custom hooks
│   │   │   └── stores/     # Zustand stores
│   │   └── package.json
│   └── api/                 # NestJS backend
│       ├── src/
│       │   ├── orders/     # Orders module
│       │   ├── database/   # Database service
│       │   └── websocket/  # WebSocket gateway
│       ├── database/       # SQL schemas
│       └── package.json
├── packages/
│   ├── types/              # Shared TypeScript types
│   ├── utils/              # Shared utilities
│   └── config/             # Shared configs
├── turbo.json              # Turborepo config
└── package.json            # Root workspace
```

## Environment Variables

### Web App (apps/web/.env.local)

| Variable | Description | Default |
|----------|-------------|--------|
| NEXT_PUBLIC_API_URL | API server URL | http://localhost:4000 |
| NEXT_PUBLIC_WS_URL | WebSocket URL | http://localhost:4000 |

### API Server (apps/api/.env)

| Variable | Description | Default |
|----------|-------------|--------|
| PORT | Server port | 4000 |
| NODE_ENV | Environment | development |
| DB_HOST | Database host | localhost |
| DB_PORT | Database port | 5432 |
| DB_NAME | Database name | trading_blotter |
| DB_USER | Database user | postgres |
| DB_PASSWORD | Database password | - |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:3000 |
| THROTTLE_TTL | Rate limit window (ms) | 60000 |
| THROTTLE_LIMIT | Max requests per window | 100 |

## Next Steps

1. ✅ Complete setup
2. 📖 Read [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
3. 🚀 Start development
4. 📊 Monitor performance
5. 🧪 Write tests
6. 🚢 Deploy to production
