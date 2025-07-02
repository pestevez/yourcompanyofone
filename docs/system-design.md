# AI-Powered Social Media Management System

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Technical Stack](#technical-stack)
4. [Package Structure](#package-structure)
5. [Core Components](#core-components)
6. [Database Schema](#database-schema)
7. [API Design](#api-design)
8. [Workflow Management](#workflow-management)
9. [MVP Implementation Plan](#mvp-implementation-plan)
10. [Security Considerations](#security-considerations)
11. [Future Roadmap](#future-roadmap)
12. [Development Setup](#development-setup)

## System Overview

### Problem Statement
The system aims to provide an AI-powered platform for professional social media management, enabling users to manage multiple social media accounts, receive content recommendations, and customize their level of automation.

### Key Features
1. Persona Management
   - Manage different accounts
   - Custom target audiences
2. Content Recommendations
   - AI-powered suggestions
   - Trend analysis
3. Customizable Automation
   - Workflow configuration
   - Approval chains
4. Flexible Authentication
   - Multiple auth providers
   - Organization-level identity management
5. Plan Management
   - Feature-based access control
   - Flexible pricing

### Actors
1. Content Creators
2. Administrators
3. Organization Owners

## Architecture

### High-Level Architecture
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Frontend App   │◄───►│  API Gateway    │◄───►│  Backend API    │
│  (Next.js)      │     │                 │     │  (NestJS)       │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Inngest        │◄───►│  Redis          │◄───►│  PostgreSQL     │
│  (Workflows)    │     │  (Cache/Queue)  │     │  (Database)     │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Component Interaction
1. Frontend communicates with Backend via API Gateway
2. Backend uses Inngest for workflow management
3. Redis handles caching and queue management
4. PostgreSQL stores persistent data

## Technical Stack

### Backend
- **Language**: TypeScript
- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Cache/Queue**: Redis
- **Workflow Engine**: Inngest
- **Authentication**: OAuth 2.0, JWT

### Frontend
- **Framework**: Next.js
- **UI Library**: Tailwind CSS + Headless UI
- **State Management**: React Query + Zustand
- **Authentication**: NextAuth.js

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana

## Package Structure

### Core Packages
```
packages/
├── api/              # NestJS API application
│   ├── src/          # Source code
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   └── ...
│   ├── test/         # Test configurations
│   ├── package.json  # API dependencies
│   └── tsconfig.json # TypeScript configuration
│
├── database/         # Database access layer
│   ├── prisma/       # Prisma schema and migrations
│   ├── src/          # Database client and utilities
│   ├── package.json  # Database dependencies
│   └── tsconfig.json # TypeScript configuration
│
├── shared/           # Shared utilities and constants
│   ├── src/          # Shared code
│   ├── package.json  # Shared dependencies
│   └── tsconfig.json # TypeScript configuration
│
├── types/            # Shared TypeScript types
│   ├── src/          # Type definitions
│   ├── package.json  # Types dependencies
│   └── tsconfig.json # TypeScript configuration
│
└── workflows/        # Inngest workflows
    ├── src/          # Workflow definitions
    ├── package.json  # Workflow dependencies
    └── tsconfig.json # TypeScript configuration
```

### Package Dependencies
- `@yourcompanyofone/api` depends on:
  - `@yourcompanyofone/database`
  - `@yourcompanyofone/types`
  - `@yourcompanyofone/shared`
- `@yourcompanyofone/database` depends on:
  - `@yourcompanyofone/types`
- `@yourcompanyofone/workflows` depends on:
  - `@yourcompanyofone/database`
  - `@yourcompanyofone/shared`

### Development Setup

#### Workspace Configuration
The project uses npm workspaces for managing multiple packages. The workspace configuration is defined in the root `package.json`:

```json
{
  "workspaces": {
    "packages": [
      "packages/*"
    ]
  }
}
```

#### Package Management
- All npm commands should be run from the root directory
- Use `--workspace` flag to target specific packages
- Example commands:
  ```bash
  # Install dependencies for all packages
  npm install
  
  # Install dependencies for a specific package
  npm install --workspace=packages/database
  
  # Build a specific package
  npm run build --workspace=packages/database
  ```

#### Package Structure
```
packages/
├── api/              # NestJS API application
├── database/         # Prisma database package
├── shared/          # Shared utilities and types
└── workflows/       # Inngest workflows
```

#### Environment Setup
1. Node.js >= 18.0.0
2. npm >= 10.9.2
3. Docker and Docker Compose for database
4. Prisma CLI for database migrations

#### Development Workflow
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the database:
   ```bash
   npm run db:up
   ```

3. Run database migrations:
   ```bash
   npm run db:migrate
   ```

4. Start development servers:
   ```bash
   # API development
   npm run dev --workspace=packages/api
   
   # Database package development
   npm run dev --workspace=packages/database
   ```

5. Run tests:
   ```bash
   # Run all tests
   npm run test --workspace=packages/api

   # Run tests with coverage
   npm run test:cov --workspace=packages/api

   # Run E2E tests
   npm run test:e2e --workspace=packages/api
   ```

#### Test Data Management
The project includes seed data for development and testing purposes. This includes:
- Organization plans (Free and Paid) with different feature sets
- Sample organizations with varying subscription levels
- Test users with different roles (Admin and Member)

To work with test data:
```bash
# Seed the database
npm run db:seed --workspace=packages/database

# Reset the database
npm run db:reset --workspace=packages/database
```

#### Package Dependencies
- `@yourcompanyofone/database`: Prisma client and database access
- `@yourcompanyofone/shared`: Common types and utilities
- `@yourcompanyofone/workflows`: Inngest workflows and event handlers

#### Build Process
1. Each package has its own build configuration
2. Packages are built independently
3. Dependencies are managed through workspace references
4. TypeScript configurations are package-specific

## Core Components

### 1. Authentication Service

#### Implementation Details
- **Core Components**:
  - `AuthService`: Handles authentication logic and user management
  - `AuthController`: Exposes authentication endpoints
  - `JwtStrategy`: Implements JWT-based authentication

#### Features
- **User Authentication**:
  - Email/password authentication with bcrypt hashing
  - JWT token generation with 1-day expiration
  - Multiple auth provider support (Google, GitHub, Custom OAuth)
  - Automatic organization creation during registration

#### API Endpoints
- **POST `/auth/login`**:
  - Authenticates users with email/password
  - Returns JWT access token
  - Validates auth provider type
  
- **POST `/auth/register`**:
  - Creates new user account
  - Hashes password securely
  - Creates organization automatically
  - Assigns default 'Free' plan
  - Returns JWT access token

#### Security Measures
- Password hashing using bcrypt
- JWT token signing with environment-based secrets
- Auth provider validation
- Email verification support
- Rate limiting on auth endpoints

#### Organization Identity Management
- Support for multiple auth providers per organization
- Custom OAuth provider configuration
- Secure credential storage
- Role-based access control

### 2. Content Management
- Content creation and storage
- Media asset management
- Version control
- Publishing workflows

### 3. Platform Integration
- Social media platform APIs
- Identity management
- Content publishing
- Analytics collection

### 4. Workflow Engine (Inngest)
- Content publishing workflows
- Approval chains
- Analytics processing
- AI recommendations

### 5. Analytics Engine
- Content performance metrics
- Audience analysis
- Trend detection
- Reporting

### 6. Plan Management
- Feature-based access control
- Plan upgrades/downgrades
- Usage tracking
- Billing integration

## Database Schema

### Core Tables
```typescript
// Users
interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  emailVerified?: Date;
  image?: string;
  authProvider: AuthProvider;
  createdAt: Date;
  updatedAt: Date;
}

// Organizations
interface Organization {
  id: string;
  name: string;
  planId: string;
  plan: OrganizationPlan;
  identityProviderId?: string;
  identityProvider?: OrganizationIdentityProvider;
  createdAt: Date;
  updatedAt: Date;
}

// Organization Plans
interface OrganizationPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: any; // JSON
  createdAt: Date;
  updatedAt: Date;
}

// Identity Providers
interface OrganizationIdentityProvider {
  id: string;
  type: AuthProvider;
  clientId?: string;
  clientSecret?: string;
  config: any; // JSON
  createdAt: Date;
  updatedAt: Date;
}

// Platform Identities
interface PlatformIdentity {
  id: string;
  organizationId: string;
  platform: string;
  credentials: any; // JSON
  createdAt: Date;
  updatedAt: Date;
}

// Content
interface Content {
  id: string;
  organizationId: string;
  creatorId: string;
  platformIdentityId: string;
  content: any; // JSON
  status: string;
  scheduledAt?: Date;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Test Data

The database includes seed data for development and testing purposes. This includes:
- Organization plans (Free and Paid) with different feature sets
- Sample organizations with varying subscription levels
- Test users with different roles (Admin and Member)

For a complete overview of the test data and how to work with it, see the [Development Setup Guide](./development-setup.md#test-data-overview).

## API Design

### Authentication
```typescript
POST /auth/login
POST /auth/register
POST /auth/oauth/{provider}
POST /auth/refresh
```

### Organizations
```typescript
POST /organizations
GET /organizations/:id
GET /organizations/:id/members
POST /organizations/:id/members
PUT /organizations/:id/plan
```

### Identity Providers
```typescript
POST /organizations/:id/identity-providers
GET /organizations/:id/identity-providers
PUT /organizations/:id/identity-providers/:providerId
DELETE /organizations/:id/identity-providers/:providerId
```

### Content
```typescript
POST /content
GET /content/:id
PUT /content/:id
POST /content/:id/publish
GET /content/:id/analytics
```

### Platform Identities
```typescript
POST /platform-identities
GET /platform-identities/:id
PUT /platform-identities/:id
DELETE /platform-identities/:id
```

## Workflow Management

### Core Workflows

1. **Content Publishing**
```typescript
inngest.createFunction(
  { id: "content-publishing" },
  { event: "content.created" },
  async ({ event, step }) => {
    // Implementation
  }
);
```

2. **Analytics Collection**
```typescript
inngest.createFunction(
  { id: "analytics-collection" },
  { event: "content.published" },
  async ({ event, step }) => {
    // Implementation
  }
);
```

## MVP Implementation Plan

### Phase 1: Core Infrastructure (Week 1-2)
- Project setup
- Database configuration
- Authentication system
- Basic organization management
- Plan management

### Phase 2: Platform Integration & UI Development (Week 3-4)
#### Backend
- Twitter API integration
- Platform identity management
- Basic content publishing

#### Frontend
- Authentication flows
  - Login/Register pages
  - JWT handling
  - Protected routes
- Organization dashboard
  - Organization overview
  - Settings management
  - Plan management
- Navigation structure
  - Responsive layout
  - User menu
  - Organization switcher

### Phase 3: Content Management & UI Enhancement (Week 5-6)
#### Backend
- Content creation API
- Publishing workflow
- Basic analytics

#### Frontend
- Social media integration
  - Account connection flow
  - Connected accounts list
  - Account management
- Content management
  - Content creation interface
  - Content list view
  - Basic publishing workflow

### Phase 4: Polish & Testing (Week 7-8)
- Error handling
- Testing
- Documentation
- Deployment
- UI/UX refinements
- Performance optimization

### Development Approach
1. **Parallel Development**
   - Backend and frontend teams work simultaneously
   - API contracts defined upfront
   - Mock data used for UI development
   - Regular integration points

2. **Incremental Delivery**
   - Each phase delivers working features
   - Continuous testing and feedback
   - Regular stakeholder reviews
   - Prioritize user-facing features

3. **Quality Assurance**
   - Automated testing at all levels
   - Regular code reviews
   - Performance monitoring
   - Security audits

4. **User Feedback**
   - Early access to core features
   - Regular usability testing
   - Feature prioritization based on feedback
   - Iterative improvements

## Security Considerations

### Authentication
- OAuth 2.0/OpenID Connect
- JWT tokens with refresh mechanism
- Secure session management
- MFA support
- Organization-level identity provider configuration

### Data Protection
- Encryption at rest
- Secure API endpoints
- Rate limiting
- Audit logging
- Secure credential storage

### Compliance
- GDPR compliance
- Data retention policies
- Privacy controls
- Secure credential management

## Future Roadmap

### Phase 2 Features
1. Additional platform integrations
2. Advanced analytics
3. AI-powered recommendations
4. Custom workflows

### Phase 3 Features
1. Team collaboration
2. Advanced content scheduling
3. Performance optimization
4. Enterprise features

### Phase 4 Features
1. Marketplace for integrations
2. Advanced AI features
3. White-label solutions
4. API for third-party developers

## Development Environment

For detailed instructions on setting up the development environment and working with test data, please refer to [Development Setup Guide](./development-setup.md).

## Testing Strategy

### Test Types
1. **Unit Tests**
   - Test individual components in isolation
   - Use mocks for external dependencies
   - Focus on business logic and edge cases
   - Located in `*.spec.ts` files alongside source code

2. **Integration Tests**
   - Test component interactions
   - Use real database for data persistence
   - Test API endpoints and service integration
   - Located in `*.spec.ts` files alongside source code

3. **E2E Tests**
   - Test complete user flows
   - Use real database and services
   - Test API endpoints with HTTP requests
   - Located in `test/*.e2e-spec.ts` files

### Testing Tools
- **Test Runner**: Jest
- **Test Framework**: @nestjs/testing
- **HTTP Testing**: supertest
- **Mocking**: Jest mocks
- **Coverage**: Jest coverage reports

### Test Structure
```typescript
// Example test file structure
describe('ComponentName', () => {
  let component: Component;
  let dependencies: Dependencies;

  beforeEach(async () => {
    // Setup test module
    // Initialize dependencies
  });

  afterEach(() => {
    // Clean up
  });

  describe('methodName', () => {
    it('should do something', async () => {
      // Test implementation
    });

    it('should handle error case', async () => {
      // Error handling test
    });
  });
});
```

### Running Tests
```bash
# Run all tests
npm run test --workspace=packages/api

# Run specific test file
npm run test --workspace=packages/api -- src/auth/auth.service.spec.ts

# Run tests with coverage
npm run test:cov --workspace=packages/api

# Run E2E tests
npm run test:e2e --workspace=packages/api
```

### Test Data Management
- Use Prisma's test utilities for database operations
- Clean up test data after each test
- Use factories for creating test data
- Mock external services and APIs

### Best Practices
1. **Test Isolation**
   - Each test should be independent
   - Clean up test data after each test
   - Use beforeEach/afterEach for setup/teardown

2. **Test Coverage**
   - Aim for 80%+ coverage
   - Focus on critical paths
   - Test error cases and edge conditions

3. **Test Naming**
   - Use descriptive test names
   - Follow "should do something" pattern
   - Group related tests in describe blocks

4. **Mocking**
   - Mock external dependencies
   - Use realistic mock data
   - Document mock behavior

5. **Performance**
   - Keep tests fast
   - Use in-memory database for tests
   - Avoid unnecessary setup/teardown

## Development Setup

### Environment Setup
1. Node.js >= 18.0.0
2. npm >= 10.9.2
3. Docker and Docker Compose for database
4. Prisma CLI for database migrations

### Development Workflow
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the database:
   ```bash
   npm run db:up
   ```

3. Run database migrations:
   ```bash
   npm run db:migrate
   ```

4. Start development servers:
   ```bash
   # API development
   npm run dev --workspace=packages/api
   
   # Database package development
   npm run dev --workspace=packages/database
   ```

5. Run tests:
   ```bash
   # Run all tests
   npm run test --workspace=packages/api

   # Run tests with coverage
   npm run test:cov --workspace=packages/api

   # Run E2E tests
   npm run test:e2e --workspace=packages/api
   ```

### Test Data Management
The project includes seed data for development and testing purposes. This includes:
- Organization plans (Free and Paid) with different feature sets
- Sample organizations with varying subscription levels
- Test users with different roles (Admin and Member)

To work with test data:
```bash
# Seed the database
npm run db:seed --workspace=packages/database

# Reset the database
npm run db:reset --workspace=packages/database
```

### Package Dependencies
- `@yourcompanyofone/database`: Prisma client and database access
- `@yourcompanyofone/shared`: Common types and utilities
- `@yourcompanyofone/workflows`: Inngest workflows and event handlers

### Build Process
1. Each package has its own build configuration
2. Packages are built independently
3. Dependencies are managed through workspace references
4. TypeScript configurations are package-specific

## Core Components

### 1. Authentication Service

#### Implementation Details
- **Core Components**:
  - `AuthService`: Handles authentication logic and user management
  - `AuthController`: Exposes authentication endpoints
  - `JwtStrategy`: Implements JWT-based authentication

#### Features
- **User Authentication**:
  - Email/password authentication with bcrypt hashing
  - JWT token generation with 1-day expiration
  - Multiple auth provider support (Google, GitHub, Custom OAuth)
  - Automatic organization creation during registration

#### API Endpoints
- **POST `/auth/login`**:
  - Authenticates users with email/password
  - Returns JWT access token
  - Validates auth provider type
  
- **POST `/auth/register`**:
  - Creates new user account
  - Hashes password securely
  - Creates organization automatically
  - Assigns default 'Free' plan
  - Returns JWT access token

#### Security Measures
- Password hashing using bcrypt
- JWT token signing with environment-based secrets
- Auth provider validation
- Email verification support
- Rate limiting on auth endpoints

#### Organization Identity Management
- Support for multiple auth providers per organization
- Custom OAuth provider configuration
- Secure credential storage
- Role-based access control

### 2. Content Management
- Content creation and storage
- Media asset management
- Version control
- Publishing workflows

### 3. Platform Integration
- Social media platform APIs
- Identity management
- Content publishing
- Analytics collection

### 4. Workflow Engine (Inngest)
- Content publishing workflows
- Approval chains
- Analytics processing
- AI recommendations

### 5. Analytics Engine
- Content performance metrics
- Audience analysis
- Trend detection
- Reporting

### 6. Plan Management
- Feature-based access control
- Plan upgrades/downgrades
- Usage tracking
- Billing integration

## Database Schema

### Core Tables
```typescript
// Users
interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  emailVerified?: Date;
  image?: string;
  authProvider: AuthProvider;
  createdAt: Date;
  updatedAt: Date;
}

// Organizations
interface Organization {
  id: string;
  name: string;
  planId: string;
  plan: OrganizationPlan;
  identityProviderId?: string;
  identityProvider?: OrganizationIdentityProvider;
  createdAt: Date;
  updatedAt: Date;
}

// Organization Plans
interface OrganizationPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: any; // JSON
  createdAt: Date;
  updatedAt: Date;
}

// Identity Providers
interface OrganizationIdentityProvider {
  id: string;
  type: AuthProvider;
  clientId?: string;
  clientSecret?: string;
  config: any; // JSON
  createdAt: Date;
  updatedAt: Date;
}

// Platform Identities
interface PlatformIdentity {
  id: string;
  organizationId: string;
  platform: string;
  credentials: any; // JSON
  createdAt: Date;
  updatedAt: Date;
}

// Content
interface Content {
  id: string;
  organizationId: string;
  creatorId: string;
  platformIdentityId: string;
  content: any; // JSON
  status: string;
  scheduledAt?: Date;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Test Data

The database includes seed data for development and testing purposes. This includes:
- Organization plans (Free and Paid) with different feature sets
- Sample organizations with varying subscription levels
- Test users with different roles (Admin and Member)

For a complete overview of the test data and how to work with it, see the [Development Setup Guide](./development-setup.md#test-data-overview). 