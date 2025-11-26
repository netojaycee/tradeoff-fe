/**
 * Order Mutations
 * TanStack Query mutations for order endpoints
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api/client';
import { CheckoutCredentials } from '@/lib/schema';

/**
 * Create Order mutation
 */
export function useCreateOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      items: Array<{ productId: string; quantity: number; selectedSize?: string; itemNotes?: string }>;
      shippingAddress: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        country: string;
        postalCode?: string;
      };
      shippingMethod?: string;
      buyerNotes?: string;
      couponCode?: string;
      paymentMethod?: string;
      paymentNote?: string;
    }) => {
      const response = await apiRequest<{
        data?: {
        payment?: {
          reference: string;
          authorizationUrl: string;
          amount: number;
          currency: string;
          paymentMethod: string;
        }};
      }>('/orders', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          paymentMethod: data.paymentMethod || 'paystack',
        }),
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Order creation failed');
      }
      
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

/**
 * Checkout mutation
 */
export function useCheckoutMutation() {
  return useMutation({
    mutationFn: async (data: CheckoutCredentials & {
      items: Array<{
        name: string;
        price: number;
        quantity: number;
      }>;
      subtotal: number;
      deliveryFee: number;
      tax: number;
      total: number;
    }) => {
      const response = await apiRequest<{
        authorization_url: string;
        access_code: string;
        reference: string;
      }>('/orders/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Checkout failed');
      }
      
      return response.data;
    },
    onSuccess: (data) => {
      // Redirect to Paystack authorization URL
      if (data.authorization_url && typeof window !== 'undefined') {
        window.location.href = data.authorization_url;
      }
    },
  });
}
