/**
 * 공통 상수 정의
 */

/**
 * 결제 수단 옵션
 */
export const PAYMENT_METHODS = [
  { value: 'card', label: '카드' },
  { value: 'cash', label: '현금' },
  { value: 'bank', label: '계좌이체' },
  { value: 'other', label: '기타' },
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number]['value'];

/**
 * 멤버 역할
 */
export const MEMBER_ROLES = [
  { value: 'OWNER', label: '소유자', description: '모든 권한 (삭제 포함)' },
  { value: 'ADMIN', label: '관리자', description: '멤버 관리, 설정 변경' },
  { value: 'MEMBER', label: '멤버', description: '지출 기록 및 수정' },
  { value: 'VIEWER', label: '열람자', description: '조회만 가능' },
] as const;

/**
 * 기본 통화
 */
export const DEFAULT_CURRENCY = 'KRW';

/**
 * 차트 색상 팔레트
 */
export const CHART_COLORS = [
  '#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
] as const;

/**
 * 페이지네이션 기본값
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  STATISTICS_PAGE_SIZE: 1000, // 통계용 대용량 조회
} as const;
