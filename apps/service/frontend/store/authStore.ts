import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createAuthApi, createUserApi, ApiError } from '@/lib/api';
import type { AuthResponse, UserResponse, UpdateUserRequest, ChangePasswordRequest } from '@/lib/api';

interface AuthState {
  user: UserResponse | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  updateProfile: (request: UpdateUserRequest) => Promise<void>;
  changePassword: (request: ChangePasswordRequest) => Promise<void>;
  deleteAccount: () => Promise<void>;
  clearError: () => void;

  // Getters
  isAuthenticated: () => boolean;
  isTokenExpired: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const authApi = createAuthApi();
          const response = await authApi.login({ email, password });
          setAuthState(set, response);
        } catch (error) {
          const message = getErrorMessage(error);
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      signup: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null });
        try {
          const authApi = createAuthApi();
          const response = await authApi.signup({ email, password, name });
          setAuthState(set, response);
        } catch (error) {
          const message = getErrorMessage(error);
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      logout: async () => {
        const { accessToken } = get();
        try {
          if (accessToken) {
            const authApi = createAuthApi(accessToken);
            await authApi.logout();
          }
        } catch {
          // Ignore logout errors - clear state anyway
        } finally {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            expiresAt: null,
            isLoading: false,
            error: null,
          });
        }
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return false;

        try {
          const authApi = createAuthApi();
          const response = await authApi.refreshToken({ refreshToken });
          setAuthState(set, response);
          return true;
        } catch {
          // Refresh failed - clear auth state
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            expiresAt: null,
          });
          return false;
        }
      },

      clearError: () => set({ error: null }),

      updateProfile: async (request: UpdateUserRequest) => {
        const { accessToken } = get();
        if (!accessToken) throw new Error('인증이 필요합니다.');

        set({ isLoading: true, error: null });
        try {
          const userApi = createUserApi(accessToken);
          const updatedUser = await userApi.updateProfile(request);
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          const message = getErrorMessage(error);
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      changePassword: async (request: ChangePasswordRequest) => {
        const { accessToken } = get();
        if (!accessToken) throw new Error('인증이 필요합니다.');

        set({ isLoading: true, error: null });
        try {
          const userApi = createUserApi(accessToken);
          await userApi.changePassword(request);
          set({ isLoading: false });
        } catch (error) {
          const message = getErrorMessage(error);
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      deleteAccount: async () => {
        const { accessToken } = get();
        if (!accessToken) throw new Error('인증이 필요합니다.');

        set({ isLoading: true, error: null });
        try {
          const userApi = createUserApi(accessToken);
          await userApi.deleteAccount();
          // Clear all auth state after account deletion
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            expiresAt: null,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const message = getErrorMessage(error);
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      isAuthenticated: () => {
        const { user, accessToken } = get();
        return user !== null && accessToken !== null;
      },

      isTokenExpired: () => {
        const { expiresAt } = get();
        if (!expiresAt) return true;
        // Consider token expired 60 seconds before actual expiry
        return Date.now() >= expiresAt - 60000;
      },
    }),
    {
      name: 'famoney-auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        expiresAt: state.expiresAt,
      }),
    }
  )
);

/**
 * Helper to set auth state from API response.
 */
function setAuthState(
  set: (state: Partial<AuthState>) => void,
  response: AuthResponse
) {
  const expiresAt = Date.now() + (response.expiresIn || 3600) * 1000;
  set({
    user: response.user,
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    expiresAt,
    isLoading: false,
    error: null,
  });
}

/**
 * Extract error message from API error.
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        return '이메일 또는 비밀번호가 올바르지 않습니다.';
      case 409:
        return '이미 가입된 이메일입니다.';
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
