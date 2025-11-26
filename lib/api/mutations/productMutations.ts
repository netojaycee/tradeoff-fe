/**
 * Product Mutations
 * TanStack Query mutations for product endpoints
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api/client';
import { ProductFormData } from '@/lib/schema';
import { Product } from '@/lib/types';

/**
 * Create Product mutation
 */
export function useCreateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProductFormData) => {
      const response = await apiRequest<Product>('/products', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Product creation failed');
      }
      
      return response.data;
    },
    onSuccess: () => {
      // Invalidate products queries
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['my-products'] });
    },
  });
}

/**
 * Update Product mutation
 */
export function useUpdateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ProductFormData> }) => {
      const response = await apiRequest<Product>(`/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Product update failed');
      }
      
      return response.data;
    },
    onSuccess: () => {
      // Invalidate products queries
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
  });
}

/**
 * Delete Product mutation
 */
export function useDeleteProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest<void>(`/products/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Product deletion failed');
      }
      
      return response;
    },
    onSuccess: () => {
      // Invalidate products queries
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['my-products'] });
    },
  });
}
