import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { CACHE_PRESETS } from '@/lib/providers/QueryProvider';

export type CachePresetType = keyof typeof CACHE_PRESETS;

/**
 * Hook for making optimized queries with preset cache strategies
 * Usage: useOptimizedQuery('PRODUCTS', 'products', () => fetchProducts())
 */
export function useOptimizedQuery<TData = unknown, TError = Error>(
  preset: CachePresetType,
  queryKey: string | readonly unknown[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) {
  const presetConfig = CACHE_PRESETS[preset];
  
  return useQuery({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn,
    staleTime: presetConfig.staleTime,
    gcTime: presetConfig.gcTime,
    ...options,
  });
}

/**
 * Custom hook for category queries with optimal caching
 */
export function useCategoryQuery(queryFn: () => Promise<any>) {
  return useOptimizedQuery('CATEGORIES', 'categories', queryFn);
}

/**
 * Custom hook for product queries with optimal caching
 */
export function useProductQuery(productId?: string) {
  return useOptimizedQuery(
    'PRODUCTS',
    productId ? ['product', productId] : 'products',
    () => Promise.resolve(null)
  );
}

/**
 * Custom hook for user data queries with optimal caching
 */
export function useUserDataQuery(queryKey: string, queryFn: () => Promise<any>) {
  return useOptimizedQuery('USER_DATA', ['userData', queryKey], queryFn);
}

/**
 * Custom hook for real-time data queries (cart, inventory)
 */
export function useRealTimeQuery(queryKey: string, queryFn: () => Promise<any>) {
  return useOptimizedQuery('REAL_TIME', ['realTime', queryKey], queryFn);
}

/**
 * Custom hook for search queries
 */
export function useSearchQuery(query: string, queryFn: () => Promise<any>) {
  return useOptimizedQuery('SEARCH', ['search', query], queryFn);
}
