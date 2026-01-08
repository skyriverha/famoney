import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User, token?: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setUser: (user: User, token?: string) => {
        set({ user, token: token || null });
      },
      logout: () => {
        set({ user: null, token: null });
      },
      isAuthenticated: () => {
        const { user } = get();
        return user !== null;
      },
    }),
    {
      name: 'famoney-auth-storage',
    }
  )
);

