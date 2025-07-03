# Development Setup Guide

## Prerequisites

- Node.js >= 18.0.0
- Docker Desktop
- npm

## Getting Started

1. **Clone the Repository**
   ```bash
   git clone https://github.com/pestevez/yourcompanyofone.git
   cd yourcompanyofone
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

## Database Setup

The project uses PostgreSQL for data storage, running in a Docker container.

### Starting the Database

```bash
# Start the PostgreSQL container
npm run db:up --workspaces=false

# Run database migrations
npm run db:migrate --workspaces=false

# Seed the database with test data
npm run db:seed --workspaces=false
```

> **Note:**
> If you see errors about missing scripts in workspaces, add the `--workspaces=false` flag to your npm commands (e.g., `npm run db:up --workspaces=false`). This ensures the script runs only in the root and not in every workspace package.

### Available Database Commands

- `npm run db:up` - Start the database container
- `npm run db:down` - Stop the database container
- `npm run db:reset` - Reset the database (drops all data and runs migrations)
- `npm run db:migrate` - Run pending migrations
- `npm run db:seed` - Populate the database with test data

### Test Data Overview

The seed script creates the following data for development:

#### Organization Plans

1. **Free Plan** (`free-plan`)
   - Basic features for individual creators
   - Limitations:
     - 1 user max
     - 1 platform max
     - 10 posts per month
     - No analytics
     - No custom workflows

2. **Paid Plan** (`paid-plan`)
   - Professional features for teams
   - Features:
     - 10 users max
     - 5 platforms max
     - 1000 posts per month
     - Analytics included
     - Custom workflows enabled
   - Price: $29.99/month

#### Organizations

1. **System Organization** (`system-org`)
   - Plan: Paid
   - Admin User:
     - Email: admin@system.com
     - Role: ADMIN

2. **Client Organization** (`client-org`)
   - Plan: Free
   - Regular User:
     - Email: user@client.com
     - Role: MEMBER

3. **Paying Clients Org** (`paying-client-org`)
   - Plan: Paid
   - Regular User:
     - Email: user@payingclient.com
     - Role: MEMBER

#### Test User Credentials

All users share the same test password: `admin123`

| User | Email | Password | Role | Organization |
|------|-------|----------|------|--------------|
| **System Admin** | `admin@system.com` | `admin123` | ADMIN | System Organization |
| **Client User** | `user@client.com` | `admin123` | MEMBER | Client Organization |
| **Paying Client** | `user@payingclient.com` | `admin123` | MEMBER | Paying Clients Org |

> ⚠️ Note: These are test credentials and should never be used in production.

## API Setup

### Environment Variables

The API requires environment variables to be configured. Create a `.env` file in `apps/api/`:

```bash
# API Configuration
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/yourcompanyofone?schema=public

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=1d

# Redis (for caching and queues)
REDIS_URL=redis://localhost:6379

# Inngest (for workflows)
INNGEST_EVENT_KEY=your-inngest-event-key
INNGEST_SIGNING_KEY=your-inngest-signing-key
```

### Starting the API

```bash
# Start the API in development mode
cd apps/api
npm run start:dev
```

The API will be available at:
- **API**: http://localhost:3001
- **Documentation**: http://localhost:3001/api

### Testing the API

You can test the authentication endpoints:

```bash
# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@system.com","password":"admin123"}'

# Register
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"new@example.com","password":"password123","name":"New User"}'
```

## Development Environment

### Environment Variables

The database connection is configured in `packages/database/.env`:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/yourcompanyofone?schema=public"
```

### Docker Services

The development environment uses Docker Compose to manage services:

- **PostgreSQL**: Runs on port 5432
- **Redis**: Runs on port 6379 (for caching and queues)
- **API**: Runs on port 3001
- **Web**: Runs on port 3000

## Current Implementation Status

### ✅ Completed Features
- **Authentication System**: Login/register with JWT tokens
- **Database Schema**: Complete with users, organizations, plans, and content
- **API Documentation**: Swagger UI available at `/api`
- **Test Data**: Seeded database with working credentials
- **Monorepo Structure**: Properly organized with apps and packages

### 🚧 In Progress
- **Frontend Implementation**: Next.js app structure ready
- **Organization Management**: API endpoints to be implemented

### 📋 Planned Features
- **Content Management**: CRUD operations for social media content
- **Platform Integration**: Social media API connections
- **Workflow Engine**: Inngest workflows for automation

## Troubleshooting

1. **Database Connection Issues**
   - Ensure Docker Desktop is running
   - Check if the PostgreSQL container is running: `docker ps`
   - Verify the database URL in `.env` matches the Docker configuration

2. **API Startup Issues**
   - Ensure all environment variables are set in `apps/api/.env`
   - Check that the database is running and accessible
   - Verify JWT_SECRET is set (required for authentication)

3. **Authentication Errors**
   - Ensure the database is seeded with test data
   - Verify you're using the correct test credentials
   - Check that the JWT_SECRET environment variable is set

4. **Workspace Script Errors**
   If you see errors about missing scripts in workspaces when running npm commands, add the `--workspaces=false` flag. For example:
   ```bash
   npm run db:up --workspaces=false
   ```

5. **Reset Database**
   If you need to start fresh:
   ```bash
   npm run db:reset --workspaces=false
   ```

6. **Workspace Dependencies**
   If you encounter workspace dependency issues:
   ```bash
   # Clean install dependencies
   rm -rf node_modules
   npm install
   ``` 