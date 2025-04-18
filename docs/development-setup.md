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
npm run db:up

# Run database migrations
npm run db:migrate

# Seed the database with test data
npm run db:seed
```

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

> ⚠️ Note: These are test credentials and should never be used in production.

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

## Troubleshooting

1. **Database Connection Issues**
   - Ensure Docker Desktop is running
   - Check if the PostgreSQL container is running: `docker ps`
   - Verify the database URL in `.env` matches the Docker configuration

2. **Reset Database**
   If you need to start fresh:
   ```bash
   npm run db:reset
   ```

3. **Workspace Dependencies**
   If you encounter workspace dependency issues:
   ```bash
   # Clean install dependencies
   rm -rf node_modules
   npm install
   ``` 