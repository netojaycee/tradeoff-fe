/**
 * Category & Subcategory Mutations
 * TanStack Query mutations for category endpoints
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api/client';
import { CategoryFormData, SubcategoryFormData } from '@/lib/schema';
import { Category, Subcategory } from '@/lib/types';

// CATEGORY MUTATIONS

/**
 * Create Category mutation
 */
export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CategoryFormData) => {
      const response = await apiRequest<Category>('/categories', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Category creation failed');
      }
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

/**
 * Update Category mutation
 */
export function useEditCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CategoryFormData> }) => {
      const response = await apiRequest<Category>(`/categories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Category update failed');
      }
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

/**
 * Delete Category mutation
 */
export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest<void>(`/categories/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Category deletion failed');
      }
      
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

// SUBCATEGORY MUTATIONS

/**
 * Create Subcategory mutation
 */
export function useCreateSubcategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SubcategoryFormData) => {
      const response = await apiRequest<Subcategory>('/subcategories', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Subcategory creation failed');
      }
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
    },
  });
}

/**
 * Update Subcategory mutation
 */
export function useEditSubcategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SubcategoryFormData> }) => {
      const response = await apiRequest<Subcategory>(`/subcategories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Subcategory update failed');
      }
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
    },
  });
}

/**
 * Delete Subcategory mutation
 */
export function useDeleteSubcategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest<void>(`/subcategories/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Subcategory deletion failed');
      }
      
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
    },
  });
}
