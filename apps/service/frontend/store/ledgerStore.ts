import { create } from 'zustand';
import { createLedgerApi, ApiError } from '@/lib/api';
import type { LedgerResponse, CreateLedgerRequest, UpdateLedgerRequest, MemberResponse, InviteMemberRequest, UpdateMemberRoleRequest } from '@/lib/api';
import { useAuthStore } from './authStore';

interface LedgerState {
  ledgers: LedgerResponse[];
  currentLedger: LedgerResponse | null;
  members: MemberResponse[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchLedgers: () => Promise<void>;
  fetchLedger: (ledgerId: string) => Promise<void>;
  createLedger: (request: CreateLedgerRequest) => Promise<LedgerResponse>;
  updateLedger: (ledgerId: string, request: UpdateLedgerRequest) => Promise<LedgerResponse>;
  deleteLedger: (ledgerId: string) => Promise<void>;
  fetchMembers: (ledgerId: string) => Promise<void>;
  inviteMember: (ledgerId: string, request: InviteMemberRequest) => Promise<MemberResponse>;
  updateMemberRole: (ledgerId: string, memberId: string, request: UpdateMemberRoleRequest) => Promise<MemberResponse>;
  removeMember: (ledgerId: string, memberId: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

const getAccessToken = (): string => {
  const token = useAuthStore.getState().accessToken;
  if (!token) {
    throw new Error('인증이 필요합니다.');
  }
  return token;
};

export const useLedgerStore = create<LedgerState>()((set, get) => ({
  ledgers: [],
  currentLedger: null,
  members: [],
  isLoading: false,
  error: null,

  fetchLedgers: async () => {
    set({ isLoading: true, error: null });
    try {
      const ledgerApi = createLedgerApi(getAccessToken());
      const ledgers = await ledgerApi.getLedgers();
      set({ ledgers, isLoading: false });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  fetchLedger: async (ledgerId: string) => {
    set({ isLoading: true, error: null });
    try {
      const ledgerApi = createLedgerApi(getAccessToken());
      const ledger = await ledgerApi.getLedger(ledgerId);
      set({ currentLedger: ledger, isLoading: false });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  createLedger: async (request: CreateLedgerRequest) => {
    set({ isLoading: true, error: null });
    try {
      const ledgerApi = createLedgerApi(getAccessToken());
      const newLedger = await ledgerApi.createLedger(request);
      const { ledgers } = get();
      set({ ledgers: [newLedger, ...ledgers], isLoading: false });
      return newLedger;
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  updateLedger: async (ledgerId: string, request: UpdateLedgerRequest) => {
    set({ isLoading: true, error: null });
    try {
      const ledgerApi = createLedgerApi(getAccessToken());
      const updatedLedger = await ledgerApi.updateLedger(ledgerId, request);
      const { ledgers } = get();
      set({
        ledgers: ledgers.map((l) => (l.id === ledgerId ? updatedLedger : l)),
        currentLedger: updatedLedger,
        isLoading: false,
      });
      return updatedLedger;
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  deleteLedger: async (ledgerId: string) => {
    set({ isLoading: true, error: null });
    try {
      const ledgerApi = createLedgerApi(getAccessToken());
      await ledgerApi.deleteLedger(ledgerId);
      const { ledgers } = get();
      set({
        ledgers: ledgers.filter((l) => l.id !== ledgerId),
        currentLedger: null,
        isLoading: false,
      });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  fetchMembers: async (ledgerId: string) => {
    set({ isLoading: true, error: null });
    try {
      const ledgerApi = createLedgerApi(getAccessToken());
      const members = await ledgerApi.getMembers(ledgerId);
      set({ members, isLoading: false });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  inviteMember: async (ledgerId: string, request: InviteMemberRequest) => {
    set({ isLoading: true, error: null });
    try {
      const ledgerApi = createLedgerApi(getAccessToken());
      const newMember = await ledgerApi.inviteMember(ledgerId, request);
      const { members } = get();
      set({ members: [...members, newMember], isLoading: false });
      return newMember;
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  updateMemberRole: async (ledgerId: string, memberId: string, request: UpdateMemberRoleRequest) => {
    set({ isLoading: true, error: null });
    try {
      const ledgerApi = createLedgerApi(getAccessToken());
      const updatedMember = await ledgerApi.updateMemberRole(ledgerId, memberId, request);
      const { members } = get();
      set({
        members: members.map((m) => (m.id === memberId ? updatedMember : m)),
        isLoading: false,
      });
      return updatedMember;
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  removeMember: async (ledgerId: string, memberId: string) => {
    set({ isLoading: true, error: null });
    try {
      const ledgerApi = createLedgerApi(getAccessToken());
      await ledgerApi.removeMember(ledgerId, memberId);
      const { members } = get();
      set({
        members: members.filter((m) => m.id !== memberId),
        isLoading: false,
      });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      ledgers: [],
      currentLedger: null,
      members: [],
      isLoading: false,
      error: null,
    }),
}));

/**
 * Extract error message from API error.
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        return '인증이 만료되었습니다. 다시 로그인해주세요.';
      case 403:
        return '접근 권한이 없습니다.';
      case 404:
        return '원장을 찾을 수 없습니다.';
      case 400:
        return '입력 정보를 확인해주세요.';
      default:
        return error.message || '서버 오류가 발생했습니다.';
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return '알 수 없는 오류가 발생했습니다.';
}
