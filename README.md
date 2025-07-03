# Your Company of One - Social Media Management Platform

An AI-powered platform for professional social media management.

## Features

- Persona Management
- Content Recommendations
- Customizable Automation
- Multi-platform Support
- Analytics and Reporting

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS, Headless UI
- **Backend**: NestJS, TypeScript
- **Database**: PostgreSQL
- **Cache/Queue**: Redis
- **Workflow Engine**: Inngest
- **Infrastructure**: Docker, Kubernetes

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- Docker Desktop
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/pestevez/yourcompanyofone.git
   cd yourcompanyofone
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the database:
   ```bash
   npm run db:up --workspaces=false
   ```

4. Run database migrations:
   ```bash
   npm run db:migrate --workspaces=false
   ```

5. Seed the database with test data:
   ```bash
   npm run db:seed --workspaces=false
   ```

6. Start the development servers:
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

> 📖 **For detailed setup instructions, troubleshooting, and test data information, see [Development Setup Guide](docs/development-setup.md)**

## Development

### Project Structure

```
yourcompanyofone/
├── apps/
│   ├── web/           # Next.js frontend
│   └── api/           # NestJS backend
├── packages/
│   ├── database/      # Prisma schema and client
│   ├── shared/        # Shared types and utilities
│   ├── types/         # TypeScript type definitions
│   └── workflows/     # Inngest workflows
├── docs/              # Documentation
└── docker/            # Docker configurations
```

### Available Scripts

- `npm run dev`: Start development servers
- `npm run build`: Build all packages and apps
- `npm run test`: Run tests
- `npm run db:up --workspaces=false`: Start PostgreSQL database
- `npm run db:down --workspaces=false`: Stop PostgreSQL database
- `npm run db:reset --workspaces=false`: Reset database (drops all data and runs migrations)
- `npm run db:migrate --workspaces=false`: Run database migrations
- `npm run db:seed --workspaces=false`: Seed database with test data

> ⚠️ **Note**: Database scripts require the `--workspaces=false` flag to avoid workspace-related errors.

## Documentation

- [Development Setup Guide](docs/development-setup.md) - Detailed setup instructions and troubleshooting
- [System Design](docs/system-design.md) - Architecture and system design documentation
- [MVP Implementation](docs/mvp-implementation.md) - MVP features and implementation details

## License

ISC 