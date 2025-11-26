/**
 * Authentication Mutations
 * TanStack Query mutations for all auth endpoints
 * Replaces RTK Query auth mutations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest, type ApiResponse } from '@/lib/api/client';
import { useAuthStore } from '@/lib/stores';
import { setAuthCookies, clearAuthCookies } from '@/lib/utils/cookies';
import {
  LoginCredentials,
  RegisterCredentials,
  VerifyEmailCredentials,
  ResendVerificationCredentials,
  ForgotPasswordCredentials,
  ResetPasswordCredentials,
  RefreshTokenCredentials,
} from '@/lib/schema';
import { AuthData, TokenResponse, User } from '@/lib/types';

/**
 * Register mutation
 */
export function useRegisterMutation() {
  const { setTokens, setUserInfo } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const response = await apiRequest<AuthData>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }
      
      return response.data;
    },
    onSuccess: (data) => {
      if (data) {
        const { user, accessToken, refreshToken } = data;
        
        // Store tokens
        setAuthCookies(accessToken, refreshToken);
        setTokens(accessToken, refreshToken);
        
        // Store user info
        setUserInfo(user);
        
        // Invalidate profile query
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      }
    },
  });
}

/**
 * Login mutation
 */
export function useLoginMutation() {
  const { setTokens, setUserInfo } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await apiRequest<AuthData>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }
      
      return response.data;
    },
    onSuccess: (data) => {
      if (data) {
        const { user, accessToken, refreshToken } = data;
        
        // Store tokens
        setAuthCookies(accessToken, refreshToken);
        setTokens(accessToken, refreshToken);
        
        // Store user info
        setUserInfo(user);
        
        // Invalidate profile query
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      }
    },
  });
}

/**
 * Verify Email mutation (POST with code)
 */
export function useVerifyEmailMutation() {
  return useMutation({
    mutationFn: async (credentials: VerifyEmailCredentials) => {
      const response = await apiRequest<any>('/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Email verification failed');
      }
      
      return response;
    },
  });
}

/**
 * Verify Email by URL mutation (GET with code in URL)
 */
export function useVerifyEmailByUrlMutation() {
  return useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest<any>(`/auth/verify-email/${code}`, {
        method: 'GET',
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Email verification failed');
      }
      
      return response;
    },
  });
}

/**
 * Resend Verification Code mutation
 */
export function useResendVerificationMutation() {
  return useMutation({
    mutationFn: async (credentials: ResendVerificationCredentials) => {
      const response = await apiRequest<any>('/auth/resend-verification', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Resend verification failed');
      }
      
      return response;
    },
  });
}

/**
 * Forgot Password mutation
 */
export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: async (credentials: ForgotPasswordCredentials) => {
      const response = await apiRequest<any>('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Forgot password request failed');
      }
      
      return response;
    },
  });
}

/**
 * Reset Password mutation
 */
export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: async (credentials: ResetPasswordCredentials) => {
      const response = await apiRequest<any>('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Password reset failed');
      }
      
      return response;
    },
  });
}

/**
 * Refresh Token mutation
 */
export function useRefreshTokenMutation() {
  const { setTokens } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: RefreshTokenCredentials) => {
      const response = await apiRequest<TokenResponse>('/auth/refresh-token', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Token refresh failed');
      }
      
      return response.data;
    },
    onSuccess: (data) => {
      if (data) {
        const { accessToken, refreshToken } = data;
        
        // Store new tokens
        setAuthCookies(accessToken, refreshToken);
        setTokens(accessToken, refreshToken);
      }
    },
  });
}

/**
 * Logout mutation
 */
export function useLogoutMutation() {
  const { clearAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiRequest<any>('/auth/logout', {
        method: 'POST',
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Logout failed');
      }
      
      return response;
    },
    onSuccess: () => {
      // Clear auth state
      clearAuth();
      clearAuthCookies();
      
      // Clear all queries
      queryClient.clear();
    },
    onSettled: () => {
      // Clear auth data even if request fails
      clearAuth();
      clearAuthCookies();
    },
  });
}
