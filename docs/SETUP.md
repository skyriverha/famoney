# FaMoney Development Environment Setup

This guide covers the complete setup process for developing FaMoney locally.

---

## Prerequisites

### Required Software

| Software | Version | Download |
|----------|---------|----------|
| Node.js | 18.x or 20.x | [nodejs.org](https://nodejs.org/) |
| pnpm | 8.x+ | `npm install -g pnpm` |
| Java | 17+ | [Adoptium Temurin](https://adoptium.net/) |
| Git | Latest | [git-scm.com](https://git-scm.com/) |

### Verify Installation

```bash
# Check versions
node --version    # v18.x.x or v20.x.x
pnpm --version    # 8.x.x
java --version    # openjdk 17.x.x
git --version     # git version 2.x.x
```

---

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/your-org/famoney.git
cd famoney
```

### 2. Install Dependencies

```bash
# Install all workspace dependencies
pnpm install
```

### 3. Environment Configuration

```bash
# Copy environment templates
cp apps/service/frontend/.env.example apps/service/frontend/.env.local
cp apps/service/backend/.env.example apps/service/backend/.env
```

### 4. Start Development Servers

**Option A: Start both (recommended)**
```bash
pnpm dev
```

**Option B: Start individually**
```bash
# Terminal 1: Backend
cd apps/service/backend
./gradlew bootRun

# Terminal 2: Frontend
cd apps/service/frontend
pnpm dev
```

### 5. Verify Setup

| Service | URL | Expected |
|---------|-----|----------|
| Frontend | http://localhost:3000 | Landing page |
| Backend API | http://localhost:8080/actuator/health | `{"status":"UP"}` |
| Swagger UI | http://localhost:8080/swagger-ui.html | API documentation |
| H2 Console | http://localhost:8080/h2-console | Database browser |

---

## Environment Variables

### Frontend (`apps/service/frontend/.env.local`)

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_API_VERSION=v1

# App Configuration
NEXT_PUBLIC_APP_NAME=FaMoney
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Backend (`apps/service/backend/.env`)

```bash
# Server Configuration
SERVER_PORT=8080

# Database (Development - H2)
# No configuration needed, uses in-memory H2

# Database (Production - PostgreSQL)
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=famoney
# DB_USERNAME=famoney_user
# DB_PASSWORD=your_secure_password

# JWT Configuration
JWT_SECRET=your-256-bit-secret-key-for-jwt-signing-must-be-long
JWT_ACCESS_TOKEN_EXPIRATION=3600000
JWT_REFRESH_TOKEN_EXPIRATION=604800000

# Logging
LOG_LEVEL=DEBUG
```

---

## IDE Setup

### VS Code (Frontend)

**Recommended Extensions**:
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "formulahendry.auto-rename-tag",
    "dsznajder.es7-react-js-snippets"
  ]
}
```

**Settings** (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

### IntelliJ IDEA (Backend)

**Recommended Plugins**:
- Lombok
- Spring Boot Assistant
- SonarLint

**Settings**:
1. **Enable Annotation Processing**:
   - `Settings` → `Build, Execution, Deployment` → `Compiler` → `Annotation Processors`
   - Check "Enable annotation processing"

2. **Gradle JVM**:
   - `Settings` → `Build, Execution, Deployment` → `Build Tools` → `Gradle`
   - Set Gradle JVM to Java 17

3. **Code Style**:
   - `Settings` → `Editor` → `Code Style` → `Java`
   - Import Google Java Style or project-specific style

---

## Database Access

### H2 Console (Development)

1. Start the backend server
2. Navigate to http://localhost:8080/h2-console
3. Connection settings:
   - **JDBC URL**: `jdbc:h2:mem:famoney`
   - **Username**: `sa`
   - **Password**: (leave empty)
4. Click "Connect"

### PostgreSQL (Production Setup)

```bash
# Using Docker
docker run -d \
  --name famoney-postgres \
  -e POSTGRES_DB=famoney \
  -e POSTGRES_USER=famoney_user \
  -e POSTGRES_PASSWORD=your_secure_password \
  -p 5432:5432 \
  postgres:15

# Verify connection
psql -h localhost -U famoney_user -d famoney
```

Update `application-prod.yml` or set environment variables:
```bash
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=famoney
export DB_USERNAME=famoney_user
export DB_PASSWORD=your_secure_password
```

---

## Running Tests

### Backend Tests

```bash
cd apps/service/backend

# Run all tests
./gradlew test

# Run with coverage report
./gradlew test jacocoTestReport

# Run specific test class
./gradlew test --tests "com.famoney.api.auth.AuthServiceTest"
```

### Frontend Tests

```bash
cd apps/service/frontend

# Run unit tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run in watch mode
pnpm test:watch
```

### E2E Tests (Playwright)

```bash
cd apps/service/frontend

# Install browsers (first time)
pnpm exec playwright install

# Run E2E tests
pnpm test:e2e

# Run with UI
pnpm exec playwright test --ui
```

---

## Common Tasks

### Generate API Client

After updating `specs/openapi.yaml`:

```bash
# Generate TypeScript client
pnpm run generate:api
```

### Database Migration

Create new migration:
```bash
# Create file manually
touch apps/service/backend/src/main/resources/db/migration/V9__description.sql
```

Migration naming convention: `V{number}__{description}.sql`

### Build for Production

```bash
# Backend
cd apps/service/backend
./gradlew build

# Frontend
cd apps/service/frontend
pnpm build
```

---

## Troubleshooting

### Backend Issues

**Port 8080 already in use**:
```bash
# Find and kill the process
lsof -i :8080
kill -9 <PID>
```

**Gradle build fails**:
```bash
# Clean and rebuild
./gradlew clean build --refresh-dependencies
```

**Flyway migration conflicts**:
```bash
# Reset H2 (restart server clears in-memory DB)
# For persistent DB, use Flyway repair
./gradlew flywayRepair
```

### Frontend Issues

**Module not found errors**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules
pnpm install
```

**Next.js cache issues**:
```bash
# Clear Next.js cache
rm -rf .next
pnpm dev
```

**Port 3000 already in use**:
```bash
# Use different port
PORT=3001 pnpm dev
```

### General Issues

**Git hooks failing**:
```bash
# Skip hooks temporarily (not recommended)
git commit --no-verify -m "message"

# Fix: ensure dependencies are installed
pnpm install
```

---

## Docker Development Environment

### docker-compose.yml (Optional)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: famoney
      POSTGRES_USER: famoney_user
      POSTGRES_PASSWORD: dev_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build:
      context: ./apps/service/backend
      dockerfile: Dockerfile
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_NAME=famoney
      - DB_USERNAME=famoney_user
      - DB_PASSWORD=dev_password
    ports:
      - "8080:8080"
    depends_on:
      - postgres

  frontend:
    build:
      context: ./apps/service/frontend
      dockerfile: Dockerfile
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8080
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### Start with Docker

```bash
docker-compose up -d
```

---

## Related Documentation

- [README.md](../README.md) - Project overview
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [WORKFLOW.md](./WORKFLOW.md) - Development workflow
- [CLAUDE.md](../CLAUDE.md) - Development guidelines
