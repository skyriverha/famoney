# FaMoney - Product Requirements Document (PRD)

**Version**: 1.0
**Last Updated**: 2025-01-07
**Status**: Draft

---

## 1. Vision & Goals

### 1.1 Product Vision
가족, 친구, 동료 등 그룹 구성원들이 공동 지출을 쉽고 투명하게 기록하고 관리할 수 있는 웹 애플리케이션

### 1.2 Goals
1. **투명성**: 모든 멤버가 지출 내역을 실시간으로 확인
2. **편의성**: 간편한 지출 기록 및 카테고리 관리
3. **협업**: 다중 사용자가 하나의 원장을 공동 관리
4. **접근성**: 웹 기반으로 어디서나 접근 가능

### 1.3 Success Metrics
| Metric | Target |
|--------|--------|
| 사용자 가입 전환율 | > 30% |
| 월간 활성 사용자 (MAU) | > 1,000 (6개월 내) |
| 일간 지출 기록 수 | > 100/day |
| 사용자 만족도 (NPS) | > 50 |

---

## 2. User Personas

### 2.1 Primary: 가족 가계부 관리자
- **이름**: 김민수 (35세)
- **역할**: 4인 가족의 가계부 담당
- **니즈**:
  - 가족 구성원 모두가 지출을 기록하고 확인
  - 월별/카테고리별 지출 현황 파악
  - 식비, 교육비 등 카테고리 분류
- **Pain Points**:
  - 엑셀로 관리하면 실시간 공유 어려움
  - 기존 앱은 개인용으로 공동 작성 불가

### 2.2 Secondary: 모임/동아리 회계 담당자
- **이름**: 이수진 (28세)
- **역할**: 독서 모임 회계 담당
- **니즈**:
  - 모임비 수입/지출 투명하게 관리
  - 멤버별 지출 기록 확인
  - 월말 정산 내역 공유
- **Pain Points**:
  - 카카오톡으로 영수증 공유하면 관리 힘듦
  - 누가 얼마 냈는지 추적 어려움

### 2.3 Tertiary: 룸메이트/공동생활자
- **이름**: 박준호 (24세)
- **역할**: 3명 공동거주 생활비 관리
- **니즈**:
  - 공과금, 생필품 비용 분담 기록
  - 누가 얼마를 부담했는지 추적
- **Pain Points**:
  - 매달 정산 시 분쟁 발생
  - 기억에 의존한 정산

---

## 3. Functional Requirements

### 3.1 User Management

#### FR-001: 회원가입
- 이메일/비밀번호 기반 가입
- 이메일 인증 (선택적, Phase 2)
- 프로필 정보: 이름, 프로필 이미지 (선택)

#### FR-002: 로그인/로그아웃
- 이메일/비밀번호 로그인
- JWT 기반 인증
- 자동 로그인 (Remember me)
- 비밀번호 재설정 (Phase 2)

#### FR-003: 프로필 관리
- 프로필 정보 수정
- 비밀번호 변경
- 계정 삭제

### 3.2 Ledger Management

#### FR-010: 원장 생성
- 원장 이름 설정
- 설명 (선택)
- 통화 설정 (기본: KRW)
- 생성자는 자동으로 OWNER 역할

#### FR-011: 원장 조회
- 내가 속한 원장 목록 조회
- 원장 상세 정보 조회
- 최근 지출 요약

#### FR-012: 원장 수정
- 원장 이름/설명 수정 (OWNER, ADMIN만)
- 통화 변경 불가 (데이터 정합성)

#### FR-013: 원장 삭제
- OWNER만 삭제 가능
- Soft delete (복구 가능)
- 삭제 시 모든 멤버에게 알림

### 3.3 Member Management

#### FR-020: 멤버 초대
- 이메일로 초대
- 초대 링크 생성 (만료 시간 설정)
- 초대 시 역할 지정

#### FR-021: 멤버 역할
| Role | 권한 |
|------|------|
| OWNER | 모든 권한 + 원장 삭제 + 권한 관리 |
| ADMIN | 지출 CRUD + 멤버 초대 + 설정 변경 |
| MEMBER | 지출 CRUD |
| VIEWER | 조회만 가능 |

#### FR-022: 멤버 관리
- 멤버 목록 조회
- 멤버 역할 변경 (OWNER만)
- 멤버 제거 (OWNER, ADMIN)
- 원장 나가기 (본인)

### 3.4 Expense Management

#### FR-030: 지출 기록 생성
- 필수 항목:
  - 금액 (양수)
  - 설명/메모
  - 지출일
- 선택 항목:
  - 카테고리
  - 결제 수단
  - 영수증 이미지 (Phase 2)

#### FR-031: 지출 기록 조회
- 원장별 지출 목록
- 필터링: 기간, 카테고리, 작성자
- 정렬: 날짜, 금액
- 페이지네이션

#### FR-032: 지출 기록 수정
- 본인 작성 기록 수정 가능
- ADMIN 이상은 모든 기록 수정 가능
- 수정 이력 기록 (Phase 2)

#### FR-033: 지출 기록 삭제
- 본인 작성 기록 삭제 가능
- ADMIN 이상은 모든 기록 삭제 가능
- Soft delete

### 3.5 Category Management

#### FR-040: 카테고리 관리
- 기본 카테고리 제공:
  - 식비, 교통비, 생활용품, 공과금, 의료비, 문화/여가, 기타
- 커스텀 카테고리 생성 (원장별)
- 카테고리 색상 지정

---

## 4. Non-Functional Requirements

### 4.1 Performance
| Metric | Target |
|--------|--------|
| 페이지 로드 시간 | < 2초 (3G 네트워크) |
| API 응답 시간 | < 500ms (p95) |
| 동시 사용자 | > 100명 |

### 4.2 Security
- HTTPS 필수
- JWT 토큰 만료 시간: 1시간 (Refresh: 7일)
- 비밀번호 해싱: bcrypt
- SQL Injection, XSS 방지
- Rate Limiting: 100 req/min per user

### 4.3 Availability
- 서비스 가용성: 99.5%
- 데이터 백업: 일 1회
- 장애 복구 시간: < 4시간

### 4.4 Scalability
- 수평 확장 가능한 아키텍처
- Stateless API 서버
- 데이터베이스 레플리카 지원

### 4.5 Usability
- 반응형 디자인 (Desktop, Tablet, Mobile)
- 한국어 지원 (다국어 확장 고려)
- 접근성 준수 (WCAG 2.1 AA)

---

## 5. Domain Model

### 5.1 Entity Relationship

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │       │   Member    │       │   Ledger    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id          │───1:M─│ id          │─M:1───│ id          │
│ email       │       │ userId      │       │ name        │
│ password    │       │ ledgerId    │       │ description │
│ name        │       │ role        │       │ currency    │
│ profileImage│       │ joinedAt    │       │ createdAt   │
│ createdAt   │       │ invitedBy   │       │ createdBy   │
└─────────────┘       └─────────────┘       └─────────────┘
                                                   │
                                                   1
                                                   │
                                                   M
                                            ┌─────────────┐
                                            │   Expense   │
                                            ├─────────────┤
                                            │ id          │
                                            │ ledgerId    │
                                            │ amount      │
                                            │ description │
                                            │ category    │
                                            │ expenseDate │
                                            │ createdBy   │
                                            │ createdAt   │
                                            └─────────────┘
```

### 5.2 Entity Details

#### User
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary Key |
| email | String | Unique, Not Null |
| password | String | Hashed, Not Null |
| name | String | Display name |
| profileImage | String | URL (nullable) |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

#### Ledger
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary Key |
| name | String | Not Null |
| description | String | Nullable |
| currency | String | Default: KRW |
| createdBy | UUID | FK → User |
| createdAt | DateTime | Auto |
| deletedAt | DateTime | Soft delete |

#### Member
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary Key |
| userId | UUID | FK → User |
| ledgerId | UUID | FK → Ledger |
| role | Enum | OWNER, ADMIN, MEMBER, VIEWER |
| joinedAt | DateTime | Auto |
| invitedBy | UUID | FK → User |

#### Expense
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary Key |
| ledgerId | UUID | FK → Ledger |
| amount | Decimal | Positive, Not Null |
| description | String | Not Null |
| category | String | Nullable |
| expenseDate | Date | Not Null |
| createdBy | UUID | FK → User |
| createdAt | DateTime | Auto |
| deletedAt | DateTime | Soft delete |

---

## 6. API Endpoints (Draft)

### 6.1 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/auth/signup | 회원가입 |
| POST | /api/v1/auth/login | 로그인 |
| POST | /api/v1/auth/refresh | 토큰 갱신 |
| POST | /api/v1/auth/logout | 로그아웃 |

### 6.2 Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/users/me | 내 정보 조회 |
| PATCH | /api/v1/users/me | 내 정보 수정 |
| DELETE | /api/v1/users/me | 계정 삭제 |

### 6.3 Ledgers
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/ledgers | 원장 생성 |
| GET | /api/v1/ledgers | 내 원장 목록 |
| GET | /api/v1/ledgers/{id} | 원장 상세 |
| PATCH | /api/v1/ledgers/{id} | 원장 수정 |
| DELETE | /api/v1/ledgers/{id} | 원장 삭제 |

### 6.4 Members
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/ledgers/{id}/members/invite | 멤버 초대 |
| GET | /api/v1/ledgers/{id}/members | 멤버 목록 |
| PATCH | /api/v1/ledgers/{id}/members/{memberId} | 역할 변경 |
| DELETE | /api/v1/ledgers/{id}/members/{memberId} | 멤버 제거 |

### 6.5 Expenses
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/ledgers/{id}/expenses | 지출 생성 |
| GET | /api/v1/ledgers/{id}/expenses | 지출 목록 |
| GET | /api/v1/ledgers/{id}/expenses/{expenseId} | 지출 상세 |
| PATCH | /api/v1/ledgers/{id}/expenses/{expenseId} | 지출 수정 |
| DELETE | /api/v1/ledgers/{id}/expenses/{expenseId} | 지출 삭제 |

---

## 7. Milestones

### Phase 1: MVP (4-6 weeks)
**Goal**: 핵심 기능 구현 및 베타 출시

| Week | Deliverable |
|------|-------------|
| 1-2 | 프로젝트 셋업, 인증 시스템 |
| 3-4 | 원장 & 멤버 관리 |
| 5-6 | 지출 기록, 테스트, 배포 |

**MVP Scope**:
- 회원가입/로그인
- 원장 CRUD
- 멤버 초대/관리
- 지출 기록 CRUD
- 기본 카테고리

### Phase 2: Enhancement (4 weeks)
**Goal**: 사용성 개선 및 추가 기능

- 정산 기능 (누가 누구에게 얼마)
- 영수증 이미지 첨부
- 이메일 인증
- 비밀번호 재설정
- 통계/차트

### Phase 3: Scale (TBD)
**Goal**: 확장 및 관리 기능

- Backoffice 관리 페이지
- 실시간 알림 (WebSocket)
- 다국어 지원
- 모바일 앱 (PWA)

---

## 8. Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| 기술 스택 학습 곡선 | Medium | Medium | 충분한 문서화, 페어 프로그래밍 |
| 일정 지연 | High | Medium | MVP 범위 최소화, 애자일 스프린트 |
| 보안 취약점 | High | Low | 코드 리뷰, 보안 테스트 |
| 데이터 손실 | Critical | Low | 정기 백업, 트랜잭션 관리 |

---

## 9. Open Questions

1. 소셜 로그인 지원 범위? (Google, Kakao, Apple)
2. 다중 통화 지원 필요성?
3. 오프라인 지원 필요성? (PWA)
4. 데이터 내보내기 형식? (CSV, Excel)

---

## Appendix

### A. Glossary
- **원장 (Ledger)**: 공동 지출을 기록하는 공유 장부
- **멤버 (Member)**: 원장에 참여하는 사용자
- **지출 (Expense)**: 개별 지출 기록

### B. References
- OpenAPI 3.0 Specification
- Spring Boot Documentation
- Next.js Documentation
