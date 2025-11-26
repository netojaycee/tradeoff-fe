/**
 * Product Queries
 * TanStack Query queries for product endpoints
 */

import { useQuery } from '@tanstack/react-query';
import { apiRequest, buildQueryParams } from '@/lib/api/client';
import { Product } from '@/lib/types';

interface ProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  condition?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  status?: string;
}

interface ProductsResponse {
  success: boolean;
  message: string;
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  timestamp: string;
}

/**
 * Get Products query
 */
export function useGetProductsQuery(params: ProductsParams = {}, options: { enabled?: boolean } = {}) {
  const { page = 1, limit = 20, category, search, condition, brand, minPrice, maxPrice, sortBy = 'newest', status = 'active' } = params;
  const { enabled = true } = options;

  return useQuery({
    queryKey: ['products', { page, limit, category, search, condition, brand, minPrice, maxPrice, sortBy, status }],
    queryFn: async () => {
      const queryParams = buildQueryParams({
        page,
        limit,
        ...(category && { category }),
        ...(search && { search }),
        ...(condition && { condition }),
        ...(brand && { brand }),
        ...(minPrice !== undefined && { minPrice }),
        ...(maxPrice !== undefined && { maxPrice }),
        ...(sortBy && { sortBy }),
        ...(status && { status }),
      });

      const response = await apiRequest<ProductsResponse['data']>(`/products?${queryParams.toString()}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch products');
      }
      
      return response as ProductsResponse;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Get Product by ID query
 */
export function useGetProductByIdQuery(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await apiRequest<Product>(`/products/${id}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch product');
      }
      
      return response.data;
    },
    enabled: !!id && options?.enabled !== false,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Get Product by Slug query
 */
export function useGetProductBySlugQuery(slug: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['product-slug', slug],
    queryFn: async () => {
      const response = await apiRequest<Product>(`/products/slug/${slug}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch product');
      }
      
      return response.data;
    },
    enabled: !!slug && options?.enabled !== false,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Get User Products query
 */
export function useGetUserProductsQuery(params: { page?: number; limit?: number } = {}) {
  const { page = 1, limit = 20 } = params;

  return useQuery({
    queryKey: ['my-products', { page, limit }],
    queryFn: async () => {
      const queryParams = buildQueryParams({ page, limit });
      const response = await apiRequest<{ products: Product[]; total: number }>(`/products/user/my-products?${queryParams.toString()}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch your products');
      }
      
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
