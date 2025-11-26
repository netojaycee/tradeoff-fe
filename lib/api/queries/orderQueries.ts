/**
 * Order Queries
 * TanStack Query queries for order endpoints
 */

import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api/client';

/**
 * Get Order by Order Number query
 */
export function useGetOrderByOrderNoQuery(orderNo: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['order', orderNo],
    queryFn: async () => {
      const response = await apiRequest<any>(`/orders/number/${orderNo}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch order');
      }
      
      return response.data;
    },
    enabled: !!orderNo && options?.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
