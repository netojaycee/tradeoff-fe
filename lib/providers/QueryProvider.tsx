'use client';

/**
 * Query Provider Component
 * Wraps the application with TanStack Query client provider
 * Optimized with data-type specific caching strategies
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Create a client for the app with optimized cache strategies
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default: moderate cache for general queries
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: 'stale' as any, // Only refetch if data is stale
    },
    mutations: {
      retry: 1,
    },
  },
});

/**
 * Cache configuration presets for different data types
 * Use these in useQuery with queryKey and queryFn
 */
export const CACHE_PRESETS = {
  // Static data that rarely changes (categories, static pages)
  CATEGORIES: {
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
  // Dynamic product data (prices, availability)
  PRODUCTS: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  },
  // User-specific data (profile, orders, wishlist)
  USER_DATA: {
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  },
  // Real-time data (cart, inventory)
  REAL_TIME: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  },
  // Search results (moderate cache)
  SEARCH: {
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  },
};

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

// Export queryClient for use in other parts of the app if needed
export { queryClient };
