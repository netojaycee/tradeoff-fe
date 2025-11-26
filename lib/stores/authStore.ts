import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/lib/types';

/**
 * Auth Store using Zustand
 * Replaces Redux auth slice with persistent state management
 * Stores user info, tokens, and auth status
 */

interface AuthState {
  // User info
  user: User | null;
  
  // Authentication tokens
  accessToken: string | null;
  refreshToken: string | null;
  
  // Auth status
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUserInfo: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  setLoading: (isLoading: boolean) => void;
  updateAccessToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setUserInfo: (user: User) =>
        set({
          user,
          isAuthenticated: true,
        }),

      setTokens: (accessToken: string, refreshToken: string) =>
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),

      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      setLoading: (isLoading: boolean) =>
        set({ isLoading }),

      updateAccessToken: (token: string) =>
        set({ accessToken: token }),
    }),
    {
      name: 'auth_store', // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
