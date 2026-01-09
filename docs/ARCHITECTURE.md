# FaMoney Architecture Documentation

## Overview

FaMoney is a collaborative expense ledger application built with a modern full-stack architecture. This document describes the system architecture, component structure, and data flow patterns.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Next.js 14+ (App Router)                    │    │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │    │
│  │  │  Pages  │  │Components│  │  Hooks  │  │ Stores  │    │    │
│  │  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘    │    │
│  │       └───────────┬┴───────────┬┴───────────┘          │    │
│  │                   │            │                        │    │
│  │              React Query    Zustand                     │    │
│  │              (Server State) (Client State)              │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST (JSON)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API Layer                                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Spring Boot 3.4.x (Java 17+)               │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │    │
│  │  │ Controllers │──│  Services   │──│Repositories │     │    │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │    │
│  │         │                │                 │            │    │
│  │    DTO/Request      Business Logic     JPA/Hibernate   │    │
│  │    Validation       Transactions       Query Methods   │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ JDBC
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Data Layer                                 │
│  ┌─────────────────┐          ┌─────────────────┐               │
│  │   H2 (Dev)      │    OR    │  PostgreSQL     │               │
│  │   In-Memory     │          │  (Production)   │               │
│  └─────────────────┘          └─────────────────┘               │
│                                                                  │
│  Managed by: Flyway Database Migrations                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Backend Architecture

### Package Structure (Feature-based)

```
com.famoney.api/
├── FamoneyApplication.java          # Spring Boot entry point
│
├── common/                          # Shared infrastructure
│   ├── config/
│   │   └── OpenApiConfig.java       # Swagger/OpenAPI configuration
│   ├── security/
│   │   ├── SecurityConfig.java      # Spring Security configuration
│   │   ├── JwtTokenProvider.java    # JWT token generation/validation (Phase 2)
│   │   └── JwtAuthFilter.java       # JWT authentication filter (Phase 2)
│   ├── exception/
│   │   ├── GlobalExceptionHandler.java  # @RestControllerAdvice
│   │   ├── ErrorResponse.java           # Standard error DTO
│   │   ├── FieldError.java              # Validation error DTO
│   │   ├── ResourceNotFoundException.java   # 404
│   │   ├── DuplicateResourceException.java  # 409
│   │   ├── UnauthorizedException.java       # 401
│   │   ├── ForbiddenException.java          # 403
│   │   ├── InvalidTokenException.java       # Token errors
│   │   └── BadRequestException.java         # 400
│   └── dto/
│       └── PageInfo.java            # Pagination response (Phase 3)
│
├── auth/                            # Authentication domain (Phase 2)
│   ├── controller/
│   ├── dto/
│   ├── entity/
│   └── service/
│
├── user/                            # User management domain (Phase 3)
│   ├── controller/
│   ├── dto/
│   ├── entity/
│   ├── repository/
│   └── service/
│
├── ledger/                          # Ledger domain (Phase 3)
│   ├── controller/
│   ├── dto/
│   ├── entity/
│   ├── repository/
│   └── service/
│
├── member/                          # Member & invitation domain (Phase 3)
│   ├── controller/
│   ├── dto/
│   ├── entity/
│   ├── repository/
│   └── service/
│
├── expense/                         # Expense domain (Phase 3)
│   ├── controller/
│   ├── dto/
│   ├── entity/
│   ├── repository/
│   └── service/
│
└── category/                        # Category domain (Phase 3)
    ├── controller/
    ├── dto/
    ├── entity/
    ├── repository/
    └── service/
```

### Layer Responsibilities

| Layer | Responsibility | Annotations |
|-------|---------------|-------------|
| **Controller** | HTTP handling, request validation, response formatting | `@RestController`, `@RequestMapping` |
| **Service** | Business logic, transactions, orchestration | `@Service`, `@Transactional` |
| **Repository** | Data access, queries | `@Repository`, extends `JpaRepository` |
| **Entity** | Database table mapping | `@Entity`, `@Table` |
| **DTO** | Data transfer objects | `@Data` (Lombok), validation annotations |

### Request Flow

```
HTTP Request
     │
     ▼
┌─────────────────┐
│ Security Filter │ ← JWT validation (Phase 2)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Controller    │ ← @Valid, @RequestBody
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Service      │ ← @Transactional, business logic
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Repository    │ ← JPA queries
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Database     │
└─────────────────┘
```

### Exception Handling Flow

```
Exception thrown anywhere
         │
         ▼
┌─────────────────────────────┐
│  GlobalExceptionHandler     │
│  (@RestControllerAdvice)    │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│  Matching @ExceptionHandler │
│  method found?              │
└────────────┬────────────────┘
             │
     ┌───────┴───────┐
     │               │
    Yes              No
     │               │
     ▼               ▼
┌─────────┐    ┌─────────┐
│ Custom  │    │ Generic │
│ Handler │    │ Handler │
└────┬────┘    └────┬────┘
     │              │
     └──────┬───────┘
            │
            ▼
┌─────────────────────────────┐
│    ErrorResponse JSON       │
│  {status, error, message,   │
│   path, details, timestamp} │
└─────────────────────────────┘
```

---

## Frontend Architecture

### Directory Structure

```
apps/service/frontend/
├── app/                             # Next.js App Router
│   ├── layout.tsx                   # Root layout (ThemeRegistry)
│   ├── page.tsx                     # Landing page (/)
│   │
│   ├── (auth)/                      # Auth route group
│   │   ├── layout.tsx               # Auth-specific layout
│   │   ├── login/
│   │   │   └── page.tsx             # Login page
│   │   └── signup/
│   │       └── page.tsx             # Signup page
│   │
│   └── (dashboard)/                 # Dashboard route group
│       ├── layout.tsx               # Dashboard layout (navigation)
│       ├── ledgers/
│       │   └── page.tsx             # Ledgers list
│       ├── expenses/
│       │   └── page.tsx             # Expenses list
│       ├── statistics/
│       │   └── page.tsx             # Statistics view
│       └── profile/
│           └── page.tsx             # User profile
│
├── components/                      # Reusable components
│   ├── common/                      # Shared components
│   │   ├── Logo.tsx                 # App logo
│   │   └── Toast.tsx                # Toast notifications
│   ├── landing/                     # Landing page components
│   │   ├── FeatureCard.tsx
│   │   └── UseCaseCard.tsx
│   └── layout/                      # Layout components
│       ├── TopAppBar.tsx            # Header navigation
│       ├── BottomNavigation.tsx     # Mobile bottom nav
│       └── SideDrawer.tsx           # Mobile drawer
│
├── lib/                             # Utilities and configuration
│   ├── theme.ts                     # MUI theme configuration
│   ├── ThemeRegistry.tsx            # Theme provider wrapper
│   └── utils.ts                     # Utility functions
│
├── hooks/                           # Custom React hooks (Phase 2+)
│   ├── useAuth.ts                   # Authentication hook
│   ├── useLedgers.ts                # Ledger queries
│   └── useExpenses.ts               # Expense queries
│
└── stores/                          # Zustand stores (Phase 2+)
    └── authStore.ts                 # Auth state management
```

### Component Hierarchy

```
app/layout.tsx (Root)
└── ThemeRegistry
    └── CssBaseline
        │
        ├── app/page.tsx (Landing)
        │   ├── TopAppBar
        │   ├── FeatureCard[]
        │   └── UseCaseCard[]
        │
        ├── app/(auth)/layout.tsx
        │   └── app/(auth)/login/page.tsx
        │   └── app/(auth)/signup/page.tsx
        │
        └── app/(dashboard)/layout.tsx
            ├── TopAppBar
            ├── SideDrawer
            ├── BottomNavigation
            └── {Page Content}
                ├── ledgers/page.tsx
                ├── expenses/page.tsx
                ├── statistics/page.tsx
                └── profile/page.tsx
```

### State Management Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    State Management                          │
├─────────────────────────────┬───────────────────────────────┤
│       Server State          │        Client State           │
│       (React Query)         │        (Zustand)              │
├─────────────────────────────┼───────────────────────────────┤
│  • API responses            │  • Auth tokens                │
│  • Ledger data              │  • UI state (modals, menus)   │
│  • Expense data             │  • User preferences           │
│  • User profile             │  • Form state                 │
│  • Categories               │  • Navigation state           │
├─────────────────────────────┼───────────────────────────────┤
│  Caching: 5 min default     │  Persistence: localStorage    │
│  Refetch: on focus          │  Hydration: SSR compatible    │
└─────────────────────────────┴───────────────────────────────┘
```

---

## Database Schema

### Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    users     │       │   members    │       │   ledgers    │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │──┐    │ id (PK)      │    ┌──│ id (PK)      │
│ email        │  │    │ user_id (FK) │────┘  │ name         │
│ password     │  └────│ ledger_id(FK)│───────│ description  │
│ name         │       │ role         │       │ currency     │
│ profile_image│       │ joined_at    │       │ owner_id(FK) │──┐
│ created_at   │       │ created_at   │       │ created_at   │  │
│ updated_at   │       │ updated_at   │       │ updated_at   │  │
└──────────────┘       └──────────────┘       └──────────────┘  │
       │                                             │          │
       │                                             │          │
       └─────────────────────────────────────────────┼──────────┘
                                                     │
┌──────────────┐       ┌──────────────┐              │
│  categories  │       │   expenses   │              │
├──────────────┤       ├──────────────┤              │
│ id (PK)      │──┐    │ id (PK)      │              │
│ ledger_id(FK)│──┼────│ ledger_id(FK)│──────────────┘
│ name         │  │    │ category_id  │────┐
│ color        │  │    │ amount       │    │
│ icon         │  │    │ description  │    │
│ is_default   │  │    │ expense_date │    │
│ created_at   │  │    │ created_by   │    │
│ updated_at   │  └────│ created_at   │    │
└──────────────┘       │ updated_at   │    │
       ▲               └──────────────┘    │
       │                                   │
       └───────────────────────────────────┘

┌──────────────┐       ┌──────────────┐
│ invitations  │       │refresh_tokens│
├──────────────┤       ├──────────────┤
│ id (PK)      │       │ id (PK)      │
│ ledger_id(FK)│       │ user_id (FK) │
│ invite_code  │       │ token        │
│ role         │       │ expires_at   │
│ expires_at   │       │ created_at   │
│ created_by   │       └──────────────┘
│ used_by      │
│ used_at      │
│ created_at   │
└──────────────┘
```

### Member Roles

| Role | Permissions |
|------|-------------|
| `OWNER` | Full access, can delete ledger, manage all members |
| `ADMIN` | Manage expenses, categories, invite members |
| `MEMBER` | Create/edit own expenses, view all expenses |
| `VIEWER` | Read-only access to ledger |

---

## Authentication Flow

### JWT Token Flow (Phase 2)

```
┌─────────┐                          ┌─────────┐                    ┌─────────┐
│ Client  │                          │ Backend │                    │   DB    │
└────┬────┘                          └────┬────┘                    └────┬────┘
     │                                    │                              │
     │  POST /api/v1/auth/login           │                              │
     │  {email, password}                 │                              │
     │───────────────────────────────────>│                              │
     │                                    │  Validate credentials        │
     │                                    │─────────────────────────────>│
     │                                    │<─────────────────────────────│
     │                                    │                              │
     │                                    │  Generate JWT tokens         │
     │                                    │  (access + refresh)          │
     │                                    │                              │
     │  {accessToken, refreshToken,       │                              │
     │   expiresIn, user}                 │                              │
     │<───────────────────────────────────│                              │
     │                                    │                              │
     │  Store tokens (memory/localStorage)│                              │
     │                                    │                              │
     │  GET /api/v1/ledgers               │                              │
     │  Authorization: Bearer {token}     │                              │
     │───────────────────────────────────>│                              │
     │                                    │  Validate JWT                │
     │                                    │  Extract user from token     │
     │                                    │─────────────────────────────>│
     │                                    │<─────────────────────────────│
     │  {ledgers: [...]}                  │                              │
     │<───────────────────────────────────│                              │
     │                                    │                              │
```

### Token Refresh Flow

```
Access Token Expired?
         │
         ▼
┌─────────────────┐     Yes     ┌─────────────────┐
│ Check Refresh   │────────────>│ POST /auth/     │
│ Token Valid?    │             │ refresh         │
└────────┬────────┘             └────────┬────────┘
         │                               │
         │ No                            │
         ▼                               ▼
┌─────────────────┐             ┌─────────────────┐
│ Redirect to     │             │ New Access      │
│ Login Page      │             │ Token Received  │
└─────────────────┘             └─────────────────┘
```

---

## API Design Patterns

### Standard Response Format

**Success Response**:
```json
{
  "data": { ... },
  "meta": {
    "page": 0,
    "size": 20,
    "totalElements": 100,
    "totalPages": 5
  }
}
```

**Error Response**:
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

### RESTful Endpoints

| Method | Endpoint Pattern | Purpose |
|--------|-----------------|---------|
| GET | `/api/v1/{resources}` | List resources |
| GET | `/api/v1/{resources}/{id}` | Get single resource |
| POST | `/api/v1/{resources}` | Create resource |
| PUT | `/api/v1/{resources}/{id}` | Full update |
| PATCH | `/api/v1/{resources}/{id}` | Partial update |
| DELETE | `/api/v1/{resources}/{id}` | Delete resource |

---

## Development Phases

| Phase | Status | Components |
|-------|--------|-----------|
| Phase 1 | ✅ Complete | Gradle, Flyway, Exception handling, OpenAPI config |
| Phase 2 | Pending | JWT Authentication, Security filters |
| Phase 3 | Pending | Entity classes, Repositories |
| Phase 4 | Pending | Services, Controllers, API implementation |
| Phase 5 | Pending | Frontend API integration, React Query hooks |

---

## Related Documentation

- [README.md](../README.md) - Project overview and quick start
- [CLAUDE.md](../CLAUDE.md) - Development guidelines
- [PRD.md](./PRD.md) - Product requirements
- [WORKFLOW.md](./WORKFLOW.md) - Sprint planning and tasks
- [SETUP.md](./SETUP.md) - Development environment setup
