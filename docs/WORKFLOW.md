# FaMoney Development Workflow

**Generated**: 2026-01-08
**Based on**: PRD v1.0, OpenAPI Spec v1.0

---

## Current State Analysis

### Implementation Status

| Component | Status | Details |
|-----------|--------|---------|
| OpenAPI Spec | ✅ Complete | All MVP endpoints defined (Auth, Users, Ledgers, Members, Expenses, Categories) |
| Backend (Spring Boot) | ❌ Empty | Directory exists but no implementation |
| API Client | ❌ Not Generated | package.json ready, needs `npm run generate` |
| Frontend - Landing | ✅ Complete | Refactored with component extraction |
| Frontend - Auth UI | ✅ UI Only | Login/Signup forms with mock data |
| Frontend - Ledgers UI | ✅ UI Only | Dashboard shell with mock data |
| Frontend - Expense UI | ❌ Placeholder | Empty page |
| Frontend - Statistics | ❌ Placeholder | Empty page |
| Frontend - Profile | ❌ Placeholder | Empty page |
| API Integration | ❌ None | All pages use mock data |

### Gap Analysis (MVP Requirements)

| PRD Requirement | OpenAPI | Backend | Frontend UI | API Integration |
|-----------------|---------|---------|-------------|-----------------|
| FR-001 회원가입 | ✅ | ❌ | ✅ | ❌ |
| FR-002 로그인 | ✅ | ❌ | ✅ | ❌ |
| FR-003 프로필관리 | ✅ | ❌ | ❌ | ❌ |
| FR-010 원장생성 | ✅ | ❌ | ⚠️ Button only | ❌ |
| FR-011 원장조회 | ✅ | ❌ | ✅ Mock list | ❌ |
| FR-012 원장수정 | ✅ | ❌ | ❌ | ❌ |
| FR-013 원장삭제 | ✅ | ❌ | ❌ | ❌ |
| FR-020 멤버초대 | ✅ | ❌ | ❌ | ❌ |
| FR-021 멤버역할 | ✅ | ❌ | ❌ | ❌ |
| FR-030 지출생성 | ✅ | ❌ | ❌ | ❌ |
| FR-031 지출조회 | ✅ | ❌ | ❌ | ❌ |
| FR-032 지출수정 | ✅ | ❌ | ❌ | ❌ |
| FR-033 지출삭제 | ✅ | ❌ | ❌ | ❌ |
| FR-040 카테고리 | ✅ | ❌ | ❌ | ❌ |

---

## Testing Strategy

### Test Pyramid

```
           E2E Tests (10%)
          ┌─────────────┐
         /  Playwright   \
        /─────────────────\
       /  Integration (30%) \
      /  API + Component     \
     /─────────────────────────\
    /     Unit Tests (60%)       \
   /  Services, Utils, Hooks      \
  ─────────────────────────────────
```

### Coverage Targets

| Layer | Target | Tool |
|-------|--------|------|
| Backend Unit | 80%+ | JUnit 5 + JaCoCo |
| Backend Integration | 70%+ | @SpringBootTest + Testcontainers |
| Frontend Unit | 70%+ | Vitest + RTL |
| Frontend Integration | 60%+ | Vitest + MSW |
| E2E Critical Paths | 100% | Playwright |

### Test Environment

| Environment | Backend | Frontend |
|-------------|---------|----------|
| Unit | H2 in-memory | JSDOM + MSW |
| Integration | Testcontainers PostgreSQL | MSW + React Query |
| E2E | Docker Compose (full stack) | Real browser (Playwright) |

### Testing Tools

**Backend**:
- JUnit 5 + Mockito (unit tests)
- @SpringBootTest + MockMvc (integration)
- Testcontainers (database tests)
- JaCoCo (coverage reporting)
- ArchUnit (architecture tests)

**Frontend**:
- Vitest + React Testing Library (unit/component)
- MSW (Mock Service Worker for API mocking)
- Playwright (E2E tests)
- Coverage via Vitest built-in

---

## Phase 1: MVP Implementation Workflow

### Sprint 1: Foundation (Week 1-2)

#### 1.1 Backend Setup & Auth
**Priority**: 🔴 Critical
**Estimated Effort**: 3-4 days

```
Tasks:
├── 1.1.1 Spring Boot Project Setup
│   ├── Initialize Gradle project with Spring Boot 3.x
│   ├── Configure dependencies (Web, Security, JPA, H2/PostgreSQL)
│   ├── Setup OpenAPI code generation (springdoc-openapi)
│   └── Configure application properties (dev/prod profiles)
│
├── 1.1.2 Database Schema
│   ├── Create JPA entities (User, Ledger, Member, Expense, Category)
│   ├── Define relationships and constraints
│   ├── Setup Flyway/Liquibase migrations
│   └── Seed default categories
│
├── 1.1.3 Authentication Implementation
│   ├── JWT token service (access + refresh)
│   ├── Password hashing (BCrypt)
│   ├── Spring Security configuration
│   ├── POST /api/v1/auth/signup
│   ├── POST /api/v1/auth/login
│   ├── POST /api/v1/auth/refresh
│   └── POST /api/v1/auth/logout
│
└── 1.1.4 User Endpoints
    ├── GET /api/v1/users/me
    ├── PATCH /api/v1/users/me
    └── DELETE /api/v1/users/me
```

#### 1.2 API Client Generation & Frontend Auth Integration
**Priority**: 🔴 Critical
**Estimated Effort**: 2-3 days

```
Tasks:
├── 1.2.1 Generate TypeScript API Client
│   ├── Run openapi-generator-cli
│   ├── Configure fetch client with interceptors
│   ├── Add token refresh logic
│   └── Export types and API functions
│
├── 1.2.2 Frontend Auth Store Enhancement
│   ├── Replace mock auth with real API calls
│   ├── Implement token storage (localStorage/sessionStorage)
│   ├── Add refresh token handling
│   └── Implement logout cleanup
│
├── 1.2.3 Protected Route Middleware
│   ├── Create auth middleware/higher-order component
│   ├── Implement redirect to login for unauthenticated users
│   └── Add loading states during auth check
│
└── 1.2.4 Login/Signup Integration
    ├── Connect LoginPage to API
    ├── Connect SignUpPage to API
    ├── Add error handling and feedback
    └── Implement "Remember me" with refresh token
```

#### 1.3 Sprint 1 Testing
**Priority**: 🔴 Critical
**Estimated Effort**: 1-2 days

```
Tasks:
├── 1.3.1 Backend Test Setup
│   ├── Configure JUnit 5 + Mockito
│   ├── Setup H2 test profile
│   ├── Configure JaCoCo coverage reporting
│   └── Create test utilities (TestDataFactory)
│
├── 1.3.2 Auth Service Unit Tests
│   ├── JwtTokenService tests (token generation, validation, expiry)
│   ├── UserService tests (signup validation, password hashing)
│   └── AuthController tests with MockMvc
│
├── 1.3.3 Auth Integration Tests
│   ├── POST /auth/signup - success, duplicate email, validation errors
│   ├── POST /auth/login - success, wrong password, unknown user
│   ├── POST /auth/refresh - valid token, expired token, invalid token
│   └── Security filter chain tests
│
├── 1.3.4 Frontend Test Setup
│   ├── Configure Vitest + React Testing Library
│   ├── Setup MSW for API mocking
│   ├── Create test utilities (renderWithProviders, mockAuthStore)
│   └── Configure coverage reporting
│
└── 1.3.5 Frontend Auth Tests
    ├── LoginPage component tests (form validation, submission)
    ├── SignupPage component tests
    ├── useAuth hook tests
    └── Token refresh interceptor tests
```

### Sprint 2: Ledger & Member Management (Week 3-4)

#### 2.1 Backend Ledger & Member APIs
**Priority**: 🔴 Critical
**Estimated Effort**: 3-4 days

```
Tasks:
├── 2.1.1 Ledger Service Layer
│   ├── LedgerRepository + JPA queries
│   ├── LedgerService (CRUD + authorization)
│   ├── POST /api/v1/ledgers
│   ├── GET /api/v1/ledgers
│   ├── GET /api/v1/ledgers/{id}
│   ├── PATCH /api/v1/ledgers/{id}
│   └── DELETE /api/v1/ledgers/{id}
│
├── 2.1.2 Member Service Layer
│   ├── MemberRepository + queries
│   ├── Role-based authorization logic
│   ├── GET /api/v1/ledgers/{id}/members
│   ├── POST /api/v1/ledgers/{id}/members/invite
│   ├── PATCH /api/v1/ledgers/{id}/members/{memberId}
│   └── DELETE /api/v1/ledgers/{id}/members/{memberId}
│
└── 2.1.3 Invitation System
    ├── Invitation entity and repository
    ├── Invite code generation (UUID or short code)
    ├── Expiration handling
    └── POST /api/v1/invitations/{code}/accept
```

#### 2.2 Frontend Ledger UI & Integration
**Priority**: 🔴 Critical
**Estimated Effort**: 3-4 days

```
Tasks:
├── 2.2.1 Ledger List Enhancement
│   ├── Connect to GET /api/v1/ledgers
│   ├── Add React Query for caching
│   ├── Implement empty state
│   └── Add loading/error states
│
├── 2.2.2 Ledger Creation
│   ├── Create LedgerCreateDialog component
│   ├── Form with name, description, currency
│   ├── Connect to POST /api/v1/ledgers
│   └── Optimistic updates
│
├── 2.2.3 Ledger Detail Page
│   ├── Create /ledgers/[id]/page.tsx
│   ├── Connect to GET /api/v1/ledgers/{id}
│   ├── Display ledger info and recent expenses
│   └── Add member list sidebar/section
│
├── 2.2.4 Ledger Settings
│   ├── Edit ledger info (OWNER/ADMIN only)
│   ├── Delete ledger (OWNER only)
│   └── Leave ledger functionality
│
└── 2.2.5 Member Management UI
    ├── Member list component
    ├── Invite member dialog (email + role)
    ├── Role change dropdown (OWNER only)
    └── Remove member confirmation
```

#### 2.3 Sprint 2 Testing
**Priority**: 🔴 Critical
**Estimated Effort**: 1-2 days

```
Tasks:
├── 2.3.1 Ledger Service Tests
│   ├── LedgerService unit tests (CRUD, authorization)
│   ├── LedgerRepository tests with @DataJpaTest
│   └── LedgerController integration tests
│
├── 2.3.2 Member Service Tests
│   ├── Role-based access control tests
│   ├── Invitation service tests (create, accept, expire)
│   └── Member management tests (add, remove, update role)
│
├── 2.3.3 Authorization Tests
│   ├── OWNER-only operations (delete ledger, change roles)
│   ├── ADMIN operations (invite, remove members)
│   ├── MEMBER operations (view, basic actions)
│   └── VIEWER operations (read-only verification)
│
└── 2.3.4 Frontend Ledger Tests
    ├── LedgerList component tests (loading, empty, error states)
    ├── LedgerCreateDialog tests
    ├── MemberList component tests
    └── useLedgers/useMembers hook tests
```

### Sprint 3: Expense Management (Week 5-6)

#### 3.1 Backend Expense APIs
**Priority**: 🔴 Critical
**Estimated Effort**: 2-3 days

```
Tasks:
├── 3.1.1 Expense Service Layer
│   ├── ExpenseRepository + complex queries
│   ├── ExpenseService with authorization
│   ├── POST /api/v1/ledgers/{id}/expenses
│   ├── GET /api/v1/ledgers/{id}/expenses (with filters)
│   ├── GET /api/v1/ledgers/{id}/expenses/{expenseId}
│   ├── PATCH /api/v1/ledgers/{id}/expenses/{expenseId}
│   └── DELETE /api/v1/ledgers/{id}/expenses/{expenseId}
│
└── 3.1.2 Category Service
    ├── Default category seeding
    ├── GET /api/v1/ledgers/{id}/categories
    └── POST /api/v1/ledgers/{id}/categories
```

#### 3.2 Frontend Expense UI & Integration
**Priority**: 🔴 Critical
**Estimated Effort**: 4-5 days

```
Tasks:
├── 3.2.1 Expense List Page
│   ├── Create /ledgers/[id]/expenses/page.tsx
│   ├── Expense list with date grouping
│   ├── Filtering (date range, category, author)
│   ├── Sorting options
│   └── Pagination with infinite scroll
│
├── 3.2.2 Expense Creation
│   ├── Create ExpenseCreateForm component
│   ├── Amount input with currency formatting
│   ├── Date picker (default: today)
│   ├── Category selector
│   ├── Description field
│   └── Quick add (FAB button)
│
├── 3.2.3 Expense Detail & Edit
│   ├── Expense detail view/modal
│   ├── Edit form (same as create)
│   ├── Delete confirmation
│   └── Author info display
│
└── 3.2.4 Category Management
    ├── Category selector component
    ├── Category color indicator
    └── Custom category creation modal
```

#### 3.3 Sprint 3 Testing
**Priority**: 🔴 Critical
**Estimated Effort**: 1-2 days

```
Tasks:
├── 3.3.1 Expense Service Tests
│   ├── ExpenseService unit tests (CRUD, filtering, pagination)
│   ├── Complex query tests (date range, category, author filters)
│   └── Expense authorization tests (own vs admin)
│
├── 3.3.2 Category Service Tests
│   ├── Default category seeding verification
│   ├── Custom category creation tests
│   └── Category-expense relationship tests
│
├── 3.3.3 Frontend Expense Tests
│   ├── ExpenseList component tests
│   ├── ExpenseForm tests (validation, submission)
│   ├── CategorySelector tests
│   └── useExpenses hook tests (filtering, pagination)
│
└── 3.3.4 API Contract Tests
    ├── OpenAPI spec compliance tests
    ├── Request/Response schema validation
    └── Error response format tests
```

### Sprint 4: Polish & MVP Release (Week 6-7)

#### 4.1 Profile & Settings
**Priority**: 🟡 Important
**Estimated Effort**: 1-2 days

```
Tasks:
├── 4.1.1 Profile Page
│   ├── Create /profile/page.tsx
│   ├── Display user info
│   ├── Edit name/profile image
│   └── Change password (Phase 2 prep)
│
└── 4.1.2 Settings
    ├── Notification preferences (stub for Phase 2)
    └── Account deletion
```

#### 4.2 E2E Testing & Quality Assurance
**Priority**: 🔴 Critical
**Estimated Effort**: 2-3 days

```
Tasks:
├── 4.2.1 E2E Test Setup
│   ├── Configure Playwright
│   ├── Docker Compose for test environment
│   ├── Test data seeding scripts
│   └── CI/CD pipeline integration
│
├── 4.2.2 Critical Path E2E Tests
│   ├── User Registration Flow
│   │   ├── Visit landing → Click signup
│   │   ├── Fill form → Submit
│   │   ├── Verify redirect to dashboard
│   │   └── Verify user data persistence
│   │
│   ├── Login Flow
│   │   ├── Visit login → Enter credentials
│   │   ├── Verify JWT storage
│   │   └── Verify protected route access
│   │
│   ├── Ledger Management Flow
│   │   ├── Create new ledger
│   │   ├── Edit ledger details
│   │   ├── Invite member (verify email sent/link)
│   │   └── Delete ledger (verify cascade)
│   │
│   ├── Expense Recording Flow
│   │   ├── Add expense to ledger
│   │   ├── Edit existing expense
│   │   ├── Delete expense
│   │   └── Filter expenses by date/category
│   │
│   └── Multi-User Collaboration Flow
│       ├── User A creates ledger, invites User B
│       ├── User B accepts invitation
│       ├── Both users add expenses
│       └── Verify data sync across users
│
├── 4.2.3 Cross-Browser Testing
│   ├── Chrome (latest)
│   ├── Firefox (latest)
│   ├── Safari (latest)
│   └── Mobile Safari/Chrome (responsive)
│
├── 4.2.4 Performance Testing
│   ├── Lighthouse audit (target: 90+ all categories)
│   ├── API response time verification (< 500ms p95)
│   └── Bundle size analysis
│
├── 4.2.5 Security Testing
│   ├── OWASP Top 10 basic checks
│   ├── JWT security validation
│   ├── CORS configuration verification
│   └── Input sanitization tests
│
└── 4.2.6 Manual QA
    ├── Full user flow testing
    ├── Mobile responsiveness check
    └── Edge case validation
```

#### 4.3 Deployment Setup
**Priority**: 🟡 Important
**Estimated Effort**: 1-2 days

```
Tasks:
├── 4.3.1 Backend Deployment
│   ├── Dockerfile for Spring Boot
│   ├── Production configuration
│   ├── Database migration strategy
│   └── Health check endpoints
│
└── 4.3.2 Frontend Deployment
    ├── Next.js production build optimization
    ├── Environment variable configuration
    └── Static asset optimization
```

---

## Phase 2: Enhancement (Post-MVP)

### Features (PRD Phase 2)
- [ ] 정산 기능 (Settlement calculation)
- [ ] 영수증 이미지 첨부 (Receipt images)
- [ ] 이메일 인증 (Email verification)
- [ ] 비밀번호 재설정 (Password reset)
- [ ] 통계/차트 (Statistics page)
- [ ] Kakao 소셜 로그인

### Technical Improvements
- [ ] React Query DevTools integration
- [ ] Error boundary implementation
- [ ] Offline support (PWA)
- [ ] Performance optimization
- [ ] Accessibility audit (WCAG 2.1 AA)

---

## Development Guidelines

### SDD (Spec-Driven Development) Flow

```
1. Update OpenAPI Spec (if API change needed)
   └── specs/openapi.yaml

2. Generate Code
   ├── Backend: ./gradlew openApiGenerate
   └── Frontend: npm run generate (in packages/api-client)

3. Implement
   ├── Backend: Service → Controller → Tests
   └── Frontend: Component → Hook → Integration

4. Verify
   └── API contract adherence
```

### Git Workflow

```
main
 └── feature/sprint-1-auth
      ├── feature/backend-auth
      ├── feature/frontend-auth
      └── PR → main (after tests pass)
```

### Commit Convention

```
feat(backend): implement JWT authentication
feat(frontend): add ledger creation dialog
fix(api): correct pagination response format
test(backend): add expense service unit tests
chore(deps): update Spring Boot to 3.x
```

---

## Risk Mitigation

| Risk | Mitigation Strategy |
|------|---------------------|
| Backend development delay | Start with mock API server (MSW) for frontend |
| API contract mismatch | Strict OpenAPI spec adherence, contract testing |
| Authentication complexity | Use proven JWT library, follow security best practices |
| Mobile responsiveness issues | Test on real devices throughout development |
| Performance bottlenecks | Profile early, implement pagination from start |

---

## Test Utilities & Fixtures

### Backend Test Fixtures

```java
// TestDataFactory.java
public class TestDataFactory {
    public static User createUser(String email) {
        return User.builder()
            .email(email)
            .password("hashedPassword")
            .name("Test User")
            .build();
    }

    public static Ledger createLedger(User owner, String name) {
        return Ledger.builder()
            .name(name)
            .owner(owner)
            .currency("KRW")
            .build();
    }

    public static Expense createExpense(Ledger ledger, User creator, BigDecimal amount) {
        return Expense.builder()
            .ledger(ledger)
            .creator(creator)
            .amount(amount)
            .description("Test expense")
            .expenseDate(LocalDate.now())
            .build();
    }
}

// WithMockUser annotation for auth tests
@WithMockUser(username = "test@example.com", roles = {"USER"})
```

### Frontend Test Utilities

```typescript
// test-utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/lib/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

export function renderWithProviders(
  ui: React.ReactElement,
  options?: RenderOptions
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    ),
    ...options,
  });
}

// Mock auth store
export const mockAuthStore = {
  user: { id: '1', email: 'test@example.com', name: 'Test User' },
  isAuthenticated: true,
  login: vi.fn(),
  logout: vi.fn(),
};
```

### MSW Handlers

```typescript
// mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.post('/api/v1/auth/login', (req, res, ctx) => {
    return res(
      ctx.json({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: { id: '1', email: 'test@example.com', name: 'Test User' },
      })
    );
  }),

  rest.get('/api/v1/ledgers', (req, res, ctx) => {
    return res(
      ctx.json({
        content: [
          { id: '1', name: 'Test Ledger', currency: 'KRW' },
        ],
        totalElements: 1,
        totalPages: 1,
      })
    );
  }),

  rest.post('/api/v1/ledgers/:id/expenses', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({ id: '1', ...req.body })
    );
  }),
];
```

### E2E Test Page Objects

```typescript
// e2e/page-objects/LoginPage.ts
import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.fill('[data-testid="email"]', email);
    await this.page.fill('[data-testid="password"]', password);
    await this.page.click('[data-testid="login-button"]');
  }

  async expectError(message: string) {
    await this.page.waitForSelector(`text=${message}`);
  }
}

// e2e/fixtures.ts
export const testUser = {
  email: 'e2e-test@example.com',
  password: 'TestPassword123!',
  name: 'E2E Test User',
};

export const testLedger = {
  name: 'E2E Test Ledger',
  description: 'Created by E2E tests',
  currency: 'KRW',
};
```

---

## CI/CD Testing Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: famoney_test
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - name: Setup JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: gradle

      - name: Run Unit Tests
        run: ./gradlew test
        working-directory: apps/service/backend

      - name: Run Integration Tests
        run: ./gradlew integrationTest
        working-directory: apps/service/backend
        env:
          SPRING_DATASOURCE_URL: jdbc:postgresql://localhost:5432/famoney_test

      - name: Upload Coverage Report
        uses: codecov/codecov-action@v4
        with:
          files: apps/service/backend/build/reports/jacoco/test/jacocoTestReport.xml
          flags: backend

  frontend-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install Dependencies
        run: pnpm install --frozen-lockfile

      - name: Run Lint
        run: pnpm lint
        working-directory: apps/service/frontend

      - name: Run Unit Tests
        run: pnpm test -- --coverage
        working-directory: apps/service/frontend

      - name: Upload Coverage Report
        uses: codecov/codecov-action@v4
        with:
          files: apps/service/frontend/coverage/lcov.info
          flags: frontend

  e2e-tests:
    runs-on: ubuntu-latest
    needs: [backend-tests, frontend-tests]

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install Dependencies
        run: pnpm install --frozen-lockfile

      - name: Install Playwright Browsers
        run: pnpm exec playwright install --with-deps

      - name: Start Services
        run: docker-compose -f deploy/docker/docker-compose.test.yml up -d

      - name: Wait for Services
        run: |
          timeout 60 bash -c 'until curl -s http://localhost:3000 > /dev/null; do sleep 2; done'
          timeout 60 bash -c 'until curl -s http://localhost:8080/actuator/health > /dev/null; do sleep 2; done'

      - name: Run Playwright Tests
        run: pnpm exec playwright test
        working-directory: apps/service/frontend

      - name: Upload Test Results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: apps/service/frontend/playwright-report/
          retention-days: 30

      - name: Stop Services
        if: always()
        run: docker-compose -f deploy/docker/docker-compose.test.yml down
```

### Coverage Requirements

```yaml
# codecov.yml
coverage:
  status:
    project:
      default:
        target: 70%
        threshold: 2%
    patch:
      default:
        target: 80%
        threshold: 2%

flags:
  backend:
    paths:
      - apps/service/backend/
    carryforward: true
  frontend:
    paths:
      - apps/service/frontend/
    carryforward: true
```

---

## Next Steps (Immediate Actions)

1. **Backend Setup** - Create Spring Boot project structure
2. **API Client Generation** - Run `npm run generate` in packages/api-client
3. **Start Sprint 1** - Begin with authentication implementation

---

## Appendix: Technology Stack Reference

### Backend
- Java 17+
- Spring Boot 3.x
- Spring Security (JWT)
- Spring Data JPA
- H2 (dev) / PostgreSQL (prod)
- Gradle
- springdoc-openapi

### Frontend
- Next.js 16 (App Router)
- TypeScript 5.x
- MUI 7.x
- React Query (TanStack Query)
- Zustand
- Generated API Client (typescript-fetch)

### DevOps (Future)
- Docker
- GitHub Actions
- Vercel (Frontend) / Railway or Render (Backend)
