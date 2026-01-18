# FaMoney 종합 작업 계획서

**최종 업데이트**: 2026-01-18

---

## 작업 목표

FaMoney MVP 완성을 위한 남은 작업의 상세 계획서입니다.
- 프론트엔드, 백엔드, 테스트, 문서화 포함
- Sprint 단위로 구조화

---

## 프로젝트 현재 상태

```
Backend Auth:     ████████████████████ 100%
Backend Ledger:   ████████████████████ 100%
Backend Expense:  ████████████████████ 100% ← Sprint 3 완료!
Frontend Auth:    ████████████████████ 100%
Frontend Ledger:  ████████████████████ 100%
Frontend Expense: ████████████████░░░░  80% ← Edit 기능 미구현
Profile Page:     ░░░░░░░░░░░░░░░░░░░░   0%
Statistics Page:  ░░░░░░░░░░░░░░░░░░░░   0%
Testing:          ░░░░░░░░░░░░░░░░░░░░   0%
```

---

## 완료된 Sprint (1-3)

### ✅ Sprint 1: 인증 시스템
- Backend: JWT 인증, User CRUD, Auth endpoints
- Frontend: Login/Signup UI + API 연동

### ✅ Sprint 2: 원장 & 멤버 관리
- Backend: Ledger/Member CRUD, 역할 기반 권한
- Frontend: Ledger 목록/생성, Member 관리 API

### ✅ Sprint 3: 지출 & 카테고리 관리
- Backend: Expense/Category CRUD, 필터링, 페이지네이션
- Frontend: Expense 목록/생성/삭제, 필터 UI

---

## 📋 Sprint 4: Frontend 기능 완성

### 4.1 Expense 수정 기능
**상태**: 삭제는 작동, 수정 미구현
**우선순위**: 🔴 High
**규모**: Small

**대상 파일**:
- `components/expense/ExpenseEditDialog.tsx` (신규)
- `app/(dashboard)/ledgers/[ledgerId]/page.tsx` (수정)

**작업 내용**:
1. ExpenseEditDialog 컴포넌트 생성
   - ExpenseCreateDialog 기반으로 수정 모드 구현
   - 기존 expense 데이터로 폼 초기화
   - 날짜, 금액, 설명, 카테고리 수정 가능
2. updateExpense API 연동
   - PUT /api/v1/ledgers/{ledgerId}/expenses/{expenseId}
3. Context menu에서 Edit 클릭 시 다이얼로그 표시
4. 성공 시 목록 갱신 및 토스트 알림

**검증**:
- [ ] 기존 데이터가 폼에 올바르게 표시되는지
- [ ] 수정 후 목록에 반영되는지
- [ ] 에러 발생 시 적절한 메시지 표시

---

### 4.2 Profile 페이지 구현
**상태**: Placeholder only ("준비 중" 메시지)
**우선순위**: 🔴 High
**규모**: Medium

**대상 파일**:
- `app/(dashboard)/profile/page.tsx` (수정)
- `components/profile/ProfileEditForm.tsx` (신규)
- `components/profile/PasswordChangeDialog.tsx` (신규)
- `store/userStore.ts` (신규 or authStore 확장)

**작업 내용**:
1. 현재 사용자 정보 표시
   - 이름, 이메일, 프로필 이미지
   - GET /api/v1/users/me API 연동
2. 프로필 수정 폼
   - 이름 변경
   - 프로필 이미지 URL 변경
   - PATCH /api/v1/users/me API 연동
3. 비밀번호 변경 다이얼로그
   - **[선행작업] Backend API 구현 필요**:
     - PATCH /api/v1/users/me/password 엔드포인트 추가
     - ChangePasswordRequest DTO 생성
     - UserService.changePassword() 메서드 구현
     - OpenAPI 스펙 업데이트 (specs/openapi.yaml)
   - 현재 비밀번호 확인
   - 새 비밀번호 + 확인 입력
   - PATCH /api/v1/users/me/password API 연동
4. 계정 삭제 기능
   - 확인 다이얼로그 (이메일 입력으로 확인)
   - DELETE /api/v1/users/me API 연동
   - 삭제 후 로그아웃 및 로그인 페이지 이동

**검증**:
- [ ] 사용자 정보가 올바르게 표시되는지
- [ ] 프로필 수정이 저장되는지
- [ ] 비밀번호 변경이 동작하는지
- [ ] 계정 삭제 후 로그아웃되는지

---

### 4.3 Statistics 페이지 구현
**상태**: Placeholder only
**우선순위**: 🟡 Medium
**규모**: Large

**대상 파일**:
- `app/(dashboard)/statistics/page.tsx` (수정)
- `components/statistics/ExpenseSummaryCard.tsx` (신규)
- `components/statistics/CategoryChart.tsx` (신규)
- `components/statistics/MonthlyTrendChart.tsx` (신규)
- `lib/api.ts` (통계 API 추가 필요시)

**전제조건**:
- recharts 설치: `pnpm add recharts`
- 타입 지원 포함 (recharts는 TypeScript 타입 내장)

**차트 라이브러리**: recharts 사용

**작업 내용**:
1. 원장 선택 UI
   - 사용자가 속한 원장 목록 드롭다운
   - 선택된 원장의 통계 표시
2. 기간별 지출 요약 카드
   - 이번 달 총 지출
   - 지난 달 대비 증감
   - 올해 총 지출
3. 카테고리별 지출 비율 (파이 차트)
   - 카테고리별 금액 및 비율
   - 클릭 시 해당 카테고리 지출 목록으로 이동
4. 월별 지출 추이 (라인/바 차트)
   - 최근 6개월 또는 12개월
   - 월별 총 지출 금액
5. 최근 지출 목록 (5-10개)

**데이터 계산**:
- 클라이언트에서 계산 (MVP)
- 향후 백엔드 통계 API 추가 고려

**검증**:
- [ ] 원장 선택 시 데이터 갱신
- [ ] 차트가 올바르게 렌더링되는지
- [ ] 모바일에서 차트가 깨지지 않는지

---

### 4.4 Member 관리 UI 구현
**상태**: API는 완료, UI 미구현
**우선순위**: 🔴 High
**규모**: Medium

**대상 파일**:
- `app/(dashboard)/ledgers/[ledgerId]/members/page.tsx` (신규)
- `components/member/MemberListItem.tsx` (신규)
- `components/member/InviteMemberDialog.tsx` (신규)
- `components/member/RoleChangeDialog.tsx` (신규)

**작업 내용**:
1. 멤버 목록 페이지
   - 역할별 정렬 (OWNER → ADMIN → MEMBER → VIEWER)
   - 각 멤버의 이름, 이메일, 역할 표시
   - GET /api/v1/ledgers/{ledgerId}/members API 연동
2. 멤버 초대 다이얼로그
   - 이메일 입력
   - 역할 선택 (ADMIN, MEMBER, VIEWER)
   - POST /api/v1/ledgers/{ledgerId}/members API 연동
3. 역할 변경 다이얼로그
   - OWNER만 접근 가능
   - PATCH /api/v1/ledgers/{ledgerId}/members/{memberId} API 연동
4. 멤버 제거 기능
   - OWNER/ADMIN만 접근 가능
   - DELETE /api/v1/ledgers/{ledgerId}/members/{memberId} API 연동
5. 자신이 나가기 기능
   - OWNER는 나갈 수 없음 (소유권 이전 필요)
   - DELETE /api/v1/ledgers/{ledgerId}/members/me API 연동

**검증**:
- [ ] 멤버 목록이 올바르게 표시되는지
- [ ] 역할에 따른 권한 제어가 동작하는지
- [ ] 멤버 초대/제거가 동작하는지

---

### 4.5 Ledger 설정 UI 구현
**상태**: 삭제만 가능, 수정 UI 미구현
**우선순위**: 🟢 Low
**규모**: Small

**대상 파일**:
- `app/(dashboard)/ledgers/[ledgerId]/settings/page.tsx` (신규)
- `components/ledger/LedgerEditDialog.tsx` (신규)

**작업 내용**:
1. 원장 정보 표시
   - 이름, 설명, 생성일, 멤버 수
2. 원장 정보 수정
   - 이름, 설명 변경
   - PATCH /api/v1/ledgers/{ledgerId} API 연동
3. 위험 구역 (Danger Zone)
   - 원장 삭제 버튼 (빨간색 강조)
   - 삭제 확인 다이얼로그 (원장 이름 입력으로 확인)
   - OWNER만 삭제 가능

**검증**:
- [ ] 원장 정보 수정이 저장되는지
- [ ] 삭제 확인이 동작하는지
- [ ] OWNER 외 사용자에게 삭제 버튼이 숨겨지는지

---

### 4.6 OpenAPI 스펙 보완 (선행 작업)
**상태**: 비밀번호 변경 API 누락
**우선순위**: 🔴 High (4.2 Profile 페이지 전에 완료)
**규모**: Small

**대상 파일**:
- `specs/openapi.yaml` (수정)
- `apps/service/backend/src/main/java/com/famoney/api/user/` (수정)

**작업 내용**:
1. 비밀번호 변경 엔드포인트 추가
   - `PATCH /api/v1/users/me/password`
   - ChangePasswordRequest 스키마 정의
   - 응답: 204 No Content (성공), 400 Bad Request (잘못된 현재 비밀번호)
2. 백엔드 구현
   - ChangePasswordRequest DTO 생성
   - UserController.changePassword() 엔드포인트 추가
   - UserService.changePassword() 메서드 구현
   - BCrypt를 사용한 비밀번호 검증 및 변경
3. 응답 스키마 일관성 검토

**검증**:
- [ ] OpenAPI 스펙이 유효한지 (lint 통과)
- [ ] 백엔드 API가 스펙과 일치하는지
- [ ] 현재 비밀번호가 틀릴 때 적절한 에러 반환하는지

---

## 📋 Sprint 5: 테스트 작성

### 5.1 Backend Unit Tests
**현재 상태**: 0% (context load 테스트만 존재)
**우선순위**: 🔴 High
**규모**: Large

**대상 파일**:
```
src/test/java/com/famoney/api/
├── auth/
│   ├── AuthServiceTest.java
│   └── AuthControllerTest.java
├── user/
│   ├── UserServiceTest.java
│   └── UserControllerTest.java
├── ledger/
│   ├── LedgerServiceTest.java
│   └── LedgerControllerTest.java
├── member/
│   ├── MemberServiceTest.java
│   └── MemberControllerTest.java
├── expense/
│   ├── ExpenseServiceTest.java
│   └── ExpenseControllerTest.java
└── category/
    ├── CategoryServiceTest.java
    └── CategoryControllerTest.java
```

**테스트 범위**:

#### Service Layer
- 비즈니스 로직 정확성
- 권한 검증 (역할별 접근 제어)
- 예외 처리 (ResourceNotFoundException, AccessDeniedException 등)
- 엣지 케이스 (빈 목록, 최대값 등)

#### Controller Layer
- MockMvc를 이용한 HTTP 요청/응답 검증
- 입력 검증 (@Valid 어노테이션)
- 응답 형식 및 상태 코드
- 인증/인가 필터 동작

#### Repository Layer
- 커스텀 쿼리 테스트
- 페이지네이션 동작
- 필터링 조건 검증

---

### 5.2 Backend Integration Tests
**우선순위**: 🔴 High
**규모**: Medium

**대상 파일**:
```
src/test/java/com/famoney/api/integration/
├── AuthIntegrationTest.java
├── LedgerMemberIntegrationTest.java
└── ExpenseIntegrationTest.java
```

**테스트 시나리오**:

#### AuthIntegrationTest
1. 회원가입 → 로그인 → 액세스 토큰 발급
2. 토큰 갱신 플로우
3. 로그아웃 플로우
4. 잘못된 자격 증명 처리

#### LedgerMemberIntegrationTest
1. 원장 생성 → OWNER 자동 할당
2. 멤버 초대 → 역할 부여
3. 역할 변경 → 권한 확인
4. 멤버 제거 → 접근 제한

#### ExpenseIntegrationTest
1. 카테고리 생성 → 지출 추가
2. 지출 목록 조회 (필터링, 페이지네이션)
3. 지출 수정 → 변경 확인
4. 지출 삭제 → 목록에서 제거

---

### 5.3 Frontend Unit Tests
**현재 상태**: 0% (vitest 미설정)
**우선순위**: 🟡 Medium
**규모**: Medium

**설정 파일**:
- `vitest.config.ts` (신규)
- `vitest.setup.ts` (신규)
- `package.json` scripts 추가

**대상 파일**:
```
__tests__/
├── components/
│   ├── ExpenseCreateDialog.test.tsx
│   ├── ExpenseFilterDialog.test.tsx
│   ├── LedgerCreateDialog.test.tsx
│   └── PasswordChangeDialog.test.tsx
├── store/
│   ├── authStore.test.ts
│   ├── ledgerStore.test.ts
│   └── expenseStore.test.ts
└── lib/
    └── api.test.ts
```

**테스트 범위**:

#### Component Tests
- 렌더링 검증
- 사용자 인터랙션 (클릭, 입력)
- 폼 검증 메시지
- API 호출 모킹

#### Store Tests
- 상태 변경 검증
- 액션 실행 결과
- 비동기 작업 처리

#### API Tests
- 요청 형식 검증
- 에러 처리 로직

---

### 5.4 E2E Tests (Playwright)
**우선순위**: 🟢 Low
**규모**: Medium

**설정 파일**:
- `playwright.config.ts` (신규)
- `e2e/` 디렉토리 (신규)

**대상 파일**:
```
e2e/
├── auth.spec.ts
├── ledger.spec.ts
├── expense.spec.ts
└── member.spec.ts
```

**테스트 시나리오**:

#### auth.spec.ts
1. 회원가입 페이지 접근 → 폼 작성 → 제출 → 로그인 페이지 이동
2. 로그인 → 대시보드 접근
3. 잘못된 자격 증명 → 에러 메시지 표시
4. 로그아웃 → 로그인 페이지 이동

#### ledger.spec.ts
1. 원장 생성 → 목록에 표시
2. 원장 선택 → 상세 페이지 이동
3. 원장 수정 → 변경 반영
4. 원장 삭제 → 목록에서 제거

#### expense.spec.ts
1. 지출 추가 → 목록에 표시
2. 필터 적용 → 결과 확인
3. 지출 수정 → 변경 반영
4. 지출 삭제 → 목록에서 제거

#### member.spec.ts
1. 멤버 초대 → 목록에 표시
2. 역할 변경 → 권한 확인
3. 멤버 제거 → 목록에서 제거

---

## 📋 Sprint 6: 문서화

### 6.1 API 문서
**대상 파일**: `docs/API.md`
**우선순위**: 🟡 Medium
**규모**: Medium

**내용**:
1. API 개요
   - 기본 URL
   - 버전 정보
   - 인증 방법 (Bearer Token)
2. 엔드포인트 목록
   - Auth: 로그인, 회원가입, 토큰 갱신, 로그아웃
   - Users: 프로필 조회/수정, 비밀번호 변경
   - Ledgers: CRUD
   - Members: 초대, 역할 변경, 제거
   - Categories: CRUD
   - Expenses: CRUD, 필터링
3. 에러 응답 형식
   - 표준 에러 구조
   - 에러 코드 목록
4. 예제 요청/응답
   - curl 명령어 예시
   - 응답 JSON 예시

---

### 6.2 배포 가이드
**대상 파일**: `docs/DEPLOYMENT.md`
**우선순위**: 🟡 Medium
**규모**: Medium

**내용**:
1. 사전 요구사항
   - Docker & Docker Compose
   - PostgreSQL (또는 컨테이너)
   - Node.js 18+ (개발용)
   - Java 17+ (개발용)
2. 환경 변수 설정
   - Backend: DB 연결, JWT 시크릿, CORS 설정
   - Frontend: API URL
3. Docker 빌드 및 실행
   - 개발 환경: `docker-compose up`
   - 프로덕션 환경: `docker-compose -f docker-compose.prod.yml up`
4. 리버스 프록시 설정
   - Nginx 설정 예시
   - Traefik 설정 예시
5. HTTPS 설정
   - Let's Encrypt 인증서
   - SSL 설정

---

### 6.3 사용자 가이드
**대상 파일**: `docs/USER_GUIDE.md`
**우선순위**: 🟢 Low
**규모**: Small

**내용**:
1. 시작하기
   - 회원가입
   - 로그인
2. 원장 관리
   - 원장 생성
   - 원장 설정 변경
   - 원장 삭제
3. 멤버 관리
   - 멤버 초대
   - 역할 설명 (OWNER, ADMIN, MEMBER, VIEWER)
   - 역할 변경
   - 멤버 제거
4. 지출 기록
   - 지출 추가
   - 카테고리 관리
   - 지출 수정/삭제
   - 필터링 및 검색
5. 통계 확인
   - 기간별 요약
   - 카테고리별 분석
   - 추이 확인

---

## 📋 Sprint 7: 배포 및 인프라

### 7.1 Docker 설정
**우선순위**: 🟢 Low
**규모**: Medium

**대상 파일**:
- `deploy/docker/Dockerfile.backend`
- `deploy/docker/Dockerfile.frontend`
- `deploy/docker/docker-compose.yml`
- `deploy/docker/docker-compose.prod.yml`
- `deploy/docker/.env.example`

**작업 내용**:
1. Backend Dockerfile
   - Multi-stage 빌드 (빌드 → 실행)
   - JRE 최적화 이미지
2. Frontend Dockerfile
   - Multi-stage 빌드 (빌드 → Nginx 서빙)
   - 정적 파일 최적화
3. docker-compose.yml (개발)
   - Backend, Frontend, PostgreSQL, Redis (선택)
   - Volume 마운트 (개발 편의)
4. docker-compose.prod.yml (프로덕션)
   - 환경 변수 분리
   - 리소스 제한
   - Health check

---

### 7.2 CI/CD 파이프라인
**우선순위**: 🟢 Low
**규모**: Medium

**대상 파일**:
- `.github/workflows/ci.yml`
- `.github/workflows/deploy.yml`

**CI 파이프라인** (ci.yml):
```yaml
triggers: push, pull_request

jobs:
  backend-test:
    - Checkout
    - Setup Java 17
    - Run Gradle tests
    - Upload coverage report

  frontend-test:
    - Checkout
    - Setup Node 18
    - Install dependencies
    - Run Vitest
    - Upload coverage report

  e2e-test:
    - Checkout
    - Setup services (DB, Backend, Frontend)
    - Run Playwright tests
    - Upload artifacts (screenshots)

  build:
    - Build Docker images
    - Push to registry (on main branch)
```

**Deploy 파이프라인** (deploy.yml):
```yaml
triggers: push to main, manual

jobs:
  deploy:
    - Pull latest images
    - Run database migrations
    - Deploy with docker-compose
    - Health check
    - Notify (Slack/Discord)
```

---

## 작업 우선순위 요약

| 우선순위 | Sprint | 작업 | 규모 | 예상 복잡도 |
|---------|--------|------|------|------------|
| 🔴 High | 4.1 | Expense 수정 기능 | Small | Low |
| 🔴 High | 4.2 | Profile 페이지 | Medium | Medium |
| 🟡 Medium | 4.3 | Statistics 페이지 | Large | High |
| 🔴 High | 4.4 | Member 관리 UI | Medium | Medium |
| 🟢 Low | 4.5 | Ledger 설정 UI | Small | Low |
| 🔴 High | 4.6 | OpenAPI 스펙 보완 | Small | Low |
| 🔴 High | 5.1 | Backend Unit Tests | Large | Medium |
| 🔴 High | 5.2 | Backend Integration Tests | Medium | Medium |
| 🟡 Medium | 5.3 | Frontend Unit Tests | Medium | Medium |
| 🟢 Low | 5.4 | E2E Tests | Medium | High |
| 🟡 Medium | 6.1 | API 문서 | Medium | Low |
| 🟡 Medium | 6.2 | 배포 가이드 | Medium | Medium |
| 🟢 Low | 6.3 | 사용자 가이드 | Small | Low |
| 🟢 Low | 7.1 | Docker 설정 | Medium | Medium |
| 🟢 Low | 7.2 | CI/CD 파이프라인 | Medium | Medium |

---

## 권장 작업 순서

### Phase 1: MVP 기능 완성 (Sprint 4)
1. **4.1 Expense 수정** - 기본 CRUD 완성
2. **4.6 OpenAPI 스펙 보완** - 비밀번호 변경 API 백엔드 구현 (4.2 선행)
3. **4.2 Profile 페이지** - 사용자 관리 완성
4. **4.4 Member 관리 UI** - 협업 기능 완성
5. **4.5 Ledger 설정 UI** - 원장 관리 완성
6. **4.3 Statistics 페이지** - 분석 기능 추가

### Phase 2: 품질 보증 (Sprint 5)
1. **5.1 Backend Unit Tests** - 핵심 로직 검증
2. **5.2 Backend Integration Tests** - 플로우 검증
3. **5.3 Frontend Unit Tests** - 컴포넌트 검증
4. **5.4 E2E Tests** - 전체 플로우 검증

### Phase 3: 문서화 및 배포 (Sprint 6-7)
1. **6.1 API 문서** - 개발자 문서
2. **6.2 배포 가이드** - 운영 문서
3. **7.1 Docker 설정** - 배포 준비
4. **7.2 CI/CD** - 자동화
5. **6.3 사용자 가이드** - 최종 문서

---

## 검증 계획

### 로컬 테스트
```bash
# Backend 실행
cd apps/service/backend && ./gradlew bootRun

# Frontend 실행
cd apps/service/frontend && npm run dev

# Backend 테스트
cd apps/service/backend && ./gradlew test

# Frontend 테스트
cd apps/service/frontend && npm run test

# E2E 테스트
cd apps/service/frontend && npm run test:e2e
```

### 기능 체크리스트
- [ ] Auth: 회원가입, 로그인, 토큰 갱신, 로그아웃
- [ ] Profile: 조회, 수정, 비밀번호 변경, 계정 삭제
- [ ] Ledger: CRUD, 설정
- [ ] Member: 초대, 역할 변경, 제거
- [ ] Category: CRUD
- [ ] Expense: CRUD, 필터링, 페이지네이션
- [ ] Statistics: 요약, 차트

### 품질 체크리스트
- [ ] 모든 API 엔드포인트 동작 확인
- [ ] 권한별 접근 제어 동작 확인
- [ ] 에러 처리 및 메시지 표시 확인
- [ ] 모바일 반응형 UI 확인
- [ ] 한글 지원 완료 확인

---

## 참고 자료

- `docs/PRD.md` - 제품 요구사항
- `docs/ARCHITECTURE.md` - 시스템 아키텍처
- `docs/WORKFLOW.md` - 개발 워크플로우
- `specs/openapi.yaml` - API 스펙 (SSoT)
