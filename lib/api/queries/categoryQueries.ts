/**
 * Category & Subcategory Queries
 * TanStack Query queries for category endpoints
 */

import { useQuery } from '@tanstack/react-query';
import { apiRequest, buildQueryParams } from '@/lib/api/client';
import { Category, Subcategory } from '@/lib/types';

interface CategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  timestamp: string;
}

interface SubcategoriesResponse {
  success: boolean;
  message: string;
  data: Subcategory[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  timestamp: string;
}

// CATEGORY QUERIES

/**
 * Get Categories query
 */
export function useGetCategoriesQuery() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiRequest<CategoriesResponse['data']>('/categories');
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch categories');
      }
      
      return response as CategoriesResponse;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 60 minutes
  });
}

/**
 * Get Category by ID query
 */
export function useGetCategoryByIdQuery(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      const response = await apiRequest<Category>(`/categories/${id}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch category');
      }
      
      return response.data;
    },
    enabled: !!id && options?.enabled !== false,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 60 minutes
  });
}

/**
 * Get Category by Slug query
 */
export function useGetCategoryBySlugQuery(slug: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['category-slug', slug],
    queryFn: async () => {
      const response = await apiRequest<Category>(`/categories/slug/${slug}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch category');
      }
      
      return response.data;
    },
    enabled: !!slug && options?.enabled !== false,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 60 minutes
  });
}

// SUBCATEGORY QUERIES

/**
 * Get Subcategories query
 */
export function useGetSubcategoriesQuery(params?: { categoryId?: string }) {
  return useQuery({
    queryKey: ['subcategories', params?.categoryId],
    queryFn: async () => {
      const url = params?.categoryId 
        ? `/subcategories?categoryId=${params.categoryId}`
        : '/subcategories';

      const response = await apiRequest<SubcategoriesResponse['data']>(url);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch subcategories');
      }
      
      return response as SubcategoriesResponse;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 60 minutes
  });
}

/**
 * Get Subcategory by ID query
 */
export function useGetSubcategoryByIdQuery(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['subcategory', id],
    queryFn: async () => {
      const response = await apiRequest<Subcategory>(`/subcategories/${id}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch subcategory');
      }
      
      return response.data;
    },
    enabled: !!id && options?.enabled !== false,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 60 minutes
  });
}

/**
 * Get Subcategory by Slug query
 */
export function useGetSubcategoryBySlugQuery(slug: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['subcategory-slug', slug],
    queryFn: async () => {
      const response = await apiRequest<Subcategory>(`/subcategories/slug/${slug}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch subcategory');
      }
      
      return response.data;
    },
    enabled: !!slug && options?.enabled !== false,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 60 minutes
  });
}
