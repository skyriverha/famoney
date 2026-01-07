# FaMoney - Claude Code Project Instructions

## Project Overview

FaMoney is a collaborative expense ledger web application where multiple users can jointly record expenses in a shared ledger.

## Core Principles

### 1. SDD (Spec-Driven Development)
- **Always start with OpenAPI spec** before implementing any API
- OpenAPI spec is the single source of truth for all API contracts
- Update `specs/openapi.yaml` first, then generate code

### 2. SSoT (Single Source of Truth)
- All API types, interfaces, and contracts are derived from `specs/openapi.yaml`
- Never manually define types that should come from OpenAPI
- Use code generation to ensure consistency

### 3. Monorepo Structure
- Use pnpm workspace for package management
- Shared code goes in `packages/`
- Application code stays in `apps/`

---

## Development Workflow

```
1. Define/Update API Spec (specs/openapi.yaml)
           │
           ▼
2. Generate Code
   ├── Frontend: pnpm run generate:api
   └── Backend: gradle openApiGenerate
           │
           ▼
3. Implement
   ├── Backend: Service/Repository
   └── Frontend: UI + API integration
           │
           ▼
4. Test & Validate
```

---

## Project Structure

```
/famoney
├── apps/
│   └── service/
│       ├── frontend/      # Next.js 14+ (App Router)
│       └── backend/       # Spring Boot 3.x (Java 17+)
├── packages/
│   └── api-client/        # Generated TypeScript API client
├── specs/
│   └── openapi.yaml       # SSoT - OpenAPI 3.0 specification
├── docs/
│   └── PRD.md            # Product Requirements Document
└── deploy/
    └── docker/           # Docker configurations
```

---

## Tech Stack

### Frontend (apps/service/frontend)
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript 5.x
- **State Management**: React Query (server state) + Zustand (client state)
- **Styling**: Tailwind CSS 3.x
- **API Client**: Generated from OpenAPI spec

### Backend (apps/service/backend)
- **Framework**: Spring Boot 3.x
- **Language**: Java 17+
- **OpenAPI**: springdoc-openapi 2.x
- **Database**: H2 (dev) / PostgreSQL (prod)
- **Security**: Spring Security + JWT

---

## Code Generation Rules

### Frontend API Client Generation
```bash
# From project root
pnpm run generate:api

# Or directly
npx openapi-generator-cli generate \
  -i specs/openapi.yaml \
  -g typescript-fetch \
  -o packages/api-client/src
```

### Backend Code Generation
```bash
# From apps/service/backend
./gradlew openApiGenerate
```

**Generated files should NOT be manually edited**. If changes are needed, update the OpenAPI spec and regenerate.

---

## Coding Conventions

### Commit Messages (Conventional Commits)
```
<type>(<scope>): <description>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance

Scopes:
- api: OpenAPI spec changes
- frontend: Frontend changes
- backend: Backend changes
- infra: Infrastructure changes
```

Examples:
```
feat(api): add expense category endpoint
fix(backend): correct JWT token validation
docs: update README with setup instructions
```

### Branch Naming
```
feature/<issue-number>-<short-description>
fix/<issue-number>-<short-description>
chore/<short-description>
```

---

## File Naming Conventions

### Frontend (TypeScript/React)
- Components: `PascalCase.tsx` (e.g., `ExpenseForm.tsx`)
- Hooks: `camelCase.ts` with `use` prefix (e.g., `useExpenses.ts`)
- Utils: `camelCase.ts` (e.g., `formatCurrency.ts`)
- Types: `camelCase.types.ts` (e.g., `expense.types.ts`)

### Backend (Java)
- Classes: `PascalCase.java`
- Controllers: `*Controller.java` (e.g., `ExpenseController.java`)
- Services: `*Service.java` (e.g., `ExpenseService.java`)
- Repositories: `*Repository.java` (e.g., `ExpenseRepository.java`)
- DTOs: `*Dto.java` or `*Request.java`/`*Response.java`

---

## API Design Guidelines

### RESTful Conventions
- Use plural nouns for resources: `/api/v1/expenses`
- Use HTTP methods correctly:
  - GET: Retrieve
  - POST: Create
  - PUT: Full update
  - PATCH: Partial update
  - DELETE: Remove
- Return appropriate status codes:
  - 200: Success
  - 201: Created
  - 204: No Content
  - 400: Bad Request
  - 401: Unauthorized
  - 403: Forbidden
  - 404: Not Found
  - 500: Server Error

### Pagination
```yaml
# Standard pagination parameters
?page=0&size=20&sort=createdAt,desc
```

### Error Response Format
```json
{
  "timestamp": "2024-01-07T10:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/v1/expenses",
  "details": [
    { "field": "amount", "message": "must be positive" }
  ]
}
```

---

## Domain Model (MVP)

### Core Entities
1. **User**: Application user
2. **Ledger**: Shared expense ledger
3. **Member**: User's membership in a ledger (with role)
4. **Expense**: Individual expense record

### Relationships
```
User 1──M Member M──1 Ledger
                      │
                      1
                      │
                      M
                   Expense
```

---

## Testing Guidelines

### Frontend
- Unit tests: Vitest + React Testing Library
- E2E tests: Playwright (optional for MVP)

### Backend
- Unit tests: JUnit 5 + Mockito
- Integration tests: @SpringBootTest + Testcontainers
- API tests: MockMvc or RestAssured

---

## Security Considerations

1. **Authentication**: JWT tokens with refresh mechanism
2. **Authorization**: Role-based (OWNER, ADMIN, MEMBER, VIEWER)
3. **Input Validation**: Always validate on both client and server
4. **CORS**: Configure for specific origins only
5. **Secrets**: Never commit secrets; use environment variables

---

## When Working on This Project

1. **Before adding a new API endpoint**:
   - Update `specs/openapi.yaml` first
   - Run code generation
   - Then implement

2. **Before modifying existing API**:
   - Check if it's a breaking change
   - Update OpenAPI spec
   - Regenerate code
   - Update affected code

3. **Before committing**:
   - Run tests
   - Check linting
   - Follow commit message convention

4. **Keep generated code out of manual edits**:
   - If you need to customize generated code, create wrapper/extension instead
