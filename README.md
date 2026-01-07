# FaMoney

**공동 지출 원장 웹 애플리케이션** - 여러 사용자가 하나의 원장에 지출 기록을 공동으로 작성하고 관리합니다.

---

## Core Principles

### 1. SDD (Spec-Driven Development)
OpenAPI 스펙을 먼저 정의하고, 이를 기반으로 코드를 생성합니다.

### 2. SSoT (Single Source of Truth)
`specs/openapi.yaml`이 모든 API 계약의 단일 진실 공급원입니다.

### 3. Monorepo Structure
pnpm workspace를 사용한 통합 저장소 관리로 코드 공유와 일관성을 보장합니다.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14+ (App Router), TypeScript, Tailwind CSS |
| Backend | Spring Boot 3.x, Java 17+ |
| Database | H2 (dev) / PostgreSQL (prod) |
| API Spec | OpenAPI 3.0 |
| Auth | JWT (Spring Security) |

---

## Project Structure

```
/famoney
├── apps/
│   └── service/
│       ├── frontend/          # Next.js 고객용 프론트엔드
│       └── backend/           # Spring Boot 백엔드
├── packages/
│   └── api-client/            # OpenAPI 기반 TypeScript API 클라이언트
├── specs/
│   └── openapi.yaml           # API 스펙 (SSoT)
├── docs/
│   └── PRD.md                 # 제품 요구사항 문서
├── deploy/
│   └── docker/                # Docker 설정
├── CLAUDE.md                  # Claude Code 프로젝트 지침
└── README.md                  # 프로젝트 개요 (현재 문서)
```

---

## Prerequisites

- **Node.js** 18+
- **pnpm** 8+
- **Java** 17+
- **Gradle** 8+

---

## Getting Started

### 1. Clone & Install

```bash
git clone <repository-url>
cd famoney
pnpm install
```

### 2. Start Backend

```bash
cd apps/service/backend
./gradlew bootRun
```

Backend runs at: `http://localhost:8080`
Swagger UI: `http://localhost:8080/swagger-ui.html`

### 3. Start Frontend

```bash
cd apps/service/frontend
pnpm dev
```

Frontend runs at: `http://localhost:3000`

---

## Development Workflow

```
┌─────────────────────────────────────────────────────────┐
│  1. OpenAPI 스펙 정의/수정                                │
│     specs/openapi.yaml                                   │
│     └─ SSoT: 모든 API 계약의 단일 진실 공급원              │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  2. 코드 생성                                            │
│     pnpm run generate:api                               │
│     ├─ Frontend: TypeScript 타입 + API 클라이언트        │
│     └─ Backend: Controller 인터페이스 + DTO              │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  3. 구현                                                 │
│     ├─ Backend: Service/Repository 구현                  │
│     └─ Frontend: UI 컴포넌트 + API 연동                  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  4. 테스트 & 검증                                        │
│     pnpm test                                           │
└─────────────────────────────────────────────────────────┘
```

---

## Available Scripts

### Root (Monorepo)

```bash
pnpm install          # 모든 패키지 의존성 설치
pnpm build            # 모든 패키지 빌드
pnpm test             # 모든 패키지 테스트
pnpm generate:api     # OpenAPI에서 API 클라이언트 생성
```

### Frontend

```bash
cd apps/service/frontend
pnpm dev              # 개발 서버 시작
pnpm build            # 프로덕션 빌드
pnpm start            # 프로덕션 서버 시작
pnpm lint             # ESLint 검사
```

### Backend

```bash
cd apps/service/backend
./gradlew bootRun     # 개발 서버 시작
./gradlew build       # 빌드
./gradlew test        # 테스트
./gradlew openApiGenerate  # OpenAPI 코드 생성
```

---

## API Documentation

개발 서버 실행 후 Swagger UI에서 API 문서를 확인할 수 있습니다:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

---

## MVP Features

### Phase 1 (MVP)
- [x] 사용자 인증/인가 (JWT)
- [ ] 원장(Ledger) CRUD
- [ ] 멤버 초대/권한 관리
- [ ] 지출 기록 CRUD

### Phase 2 (Planned)
- [ ] 정산(Settlement) 기능
- [ ] Backoffice 관리 페이지
- [ ] 실시간 알림

---

## Contributing

1. `feature/<issue-number>-<description>` 브랜치 생성
2. 변경 사항 구현
3. 테스트 통과 확인
4. Conventional Commits 형식으로 커밋
5. Pull Request 생성

### Commit Message Convention

```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, test, chore
Scopes: api, frontend, backend, infra
```

---

## License

Private - All rights reserved
