/**
 * Auth Queries
 * TanStack Query queries for auth endpoints
 */

import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api/client';
import { User } from '@/lib/types';
import { useAuthStore } from '@/lib/stores';

/**
 * Get Profile query
 */
export function useGetProfileQuery(options?: { enabled?: boolean }) {
  const { accessToken, setUserInfo } = useAuthStore();

  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await apiRequest<{ user: User }>('/auth/profile');
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch profile');
      }
      
      // Update store with user info
      if (response.data?.user) {
        setUserInfo(response.data.user);
      }
      
      return response.data;
    },
    enabled: !!accessToken && options?.enabled !== false,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
  });
}
