import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Cart Store using Zustand
 * Replaces Redux cart slice with persistent state management
 * Handles cart items, quantities, and local persistence
 */

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedSize?: string;
  itemNotes?: string;
}

interface CartState {
  items: CartItem[];

  // Actions
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateItem: (id: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  setCart: (items: CartItem[]) => void;

  // Selectors/Computed
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],

      // Actions
      addToCart: (item: CartItem) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            existing.quantity += item.quantity;
            return { items: [...state.items] };
          }
          return { items: [...state.items, item] };
        }),

      removeFromCart: (id: string) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateQuantity: (id: string, quantity: number) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })),

      updateItem: (id: string, updates: Partial<CartItem>) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),

      clearCart: () => set({ items: [] }),

      setCart: (items: CartItem[]) => set({ items }),

      // Selectors
      getTotalItems: () => {
        const items = get().items;
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        const items = get().items;
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'cart_store', // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
