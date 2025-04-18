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

## Getting Started

### Prerequisites

- Node.js 18+
- Docker
- Docker Compose
- Inngest CLI

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/yourcompanyofone.git
   cd yourcompanyofone
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development environment:
   ```bash
   docker-compose up -d
   ```

4. Run database migrations:
   ```bash
   npm run db:migrate
   ```

5. Start the development servers:
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

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
│   └── workflows/     # Inngest workflows
├── docs/              # Documentation
└── docker/            # Docker configurations
```

### Available Scripts

- `npm run dev`: Start development servers
- `npm run build`: Build all packages and apps
- `npm run start`: Start production servers
- `npm run lint`: Run linting
- `npm run test`: Run tests
- `npm run db:migrate`: Run database migrations
- `npm run db:generate`: Generate Prisma client

## License

ISC 