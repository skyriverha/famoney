import { create } from 'zustand';
import { createExpenseApi, ApiError } from '@/lib/api';
import type {
  ExpenseResponse,
  ExpenseListResponse,
  CreateExpenseRequest,
  UpdateExpenseRequest,
  CategoryResponse,
  ExpenseFilters,
} from '@/lib/api';
import { useAuthStore } from './authStore';

interface ExpenseState {
  expenses: ExpenseResponse[];
  categories: CategoryResponse[];
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
  };
  filters: ExpenseFilters;
  isLoading: boolean;
  isCategoriesLoading: boolean;
  error: string | null;

  // Actions
  fetchExpenses: (ledgerId: string, filters?: ExpenseFilters) => Promise<void>;
  fetchCategories: (ledgerId: string) => Promise<void>;
  createExpense: (ledgerId: string, request: CreateExpenseRequest) => Promise<ExpenseResponse>;
  updateExpense: (ledgerId: string, expenseId: string, request: UpdateExpenseRequest) => Promise<ExpenseResponse>;
  deleteExpense: (ledgerId: string, expenseId: string) => Promise<void>;
  setFilters: (filters: ExpenseFilters) => void;
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

export const useExpenseStore = create<ExpenseState>()((set, get) => ({
  expenses: [],
  categories: [],
  pagination: {
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  },
  filters: {},
  isLoading: false,
  isCategoriesLoading: false,
  error: null,

  fetchExpenses: async (ledgerId: string, filters?: ExpenseFilters) => {
    set({ isLoading: true, error: null });
    try {
      const expenseApi = createExpenseApi(getAccessToken());
      const mergedFilters = { ...get().filters, ...filters };
      const response = await expenseApi.getExpenses(ledgerId, mergedFilters);
      set({
        expenses: response.content,
        pagination: {
          page: response.page,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          first: response.first,
          last: response.last,
        },
        filters: mergedFilters,
        isLoading: false,
      });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  fetchCategories: async (ledgerId: string) => {
    set({ isCategoriesLoading: true, error: null });
    try {
      const expenseApi = createExpenseApi(getAccessToken());
      const categories = await expenseApi.getCategories(ledgerId);
      set({ categories, isCategoriesLoading: false });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message, isCategoriesLoading: false });
      throw new Error(message);
    }
  },

  createExpense: async (ledgerId: string, request: CreateExpenseRequest) => {
    set({ isLoading: true, error: null });
    try {
      const expenseApi = createExpenseApi(getAccessToken());
      const newExpense = await expenseApi.createExpense(ledgerId, request);
      const { expenses, pagination } = get();
      set({
        expenses: [newExpense, ...expenses],
        pagination: { ...pagination, totalElements: pagination.totalElements + 1 },
        isLoading: false,
      });
      return newExpense;
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  updateExpense: async (ledgerId: string, expenseId: string, request: UpdateExpenseRequest) => {
    set({ isLoading: true, error: null });
    try {
      const expenseApi = createExpenseApi(getAccessToken());
      const updatedExpense = await expenseApi.updateExpense(ledgerId, expenseId, request);
      const { expenses } = get();
      set({
        expenses: expenses.map((e) => (e.id === expenseId ? updatedExpense : e)),
        isLoading: false,
      });
      return updatedExpense;
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  deleteExpense: async (ledgerId: string, expenseId: string) => {
    set({ isLoading: true, error: null });
    try {
      const expenseApi = createExpenseApi(getAccessToken());
      await expenseApi.deleteExpense(ledgerId, expenseId);
      const { expenses, pagination } = get();
      set({
        expenses: expenses.filter((e) => e.id !== expenseId),
        pagination: { ...pagination, totalElements: Math.max(0, pagination.totalElements - 1) },
        isLoading: false,
      });
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  setFilters: (filters: ExpenseFilters) => {
    set({ filters });
  },

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      expenses: [],
      categories: [],
      pagination: {
        page: 0,
        size: 20,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true,
      },
      filters: {},
      isLoading: false,
      isCategoriesLoading: false,
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
        return '지출 내역을 찾을 수 없습니다.';
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
