import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Favorites Store using Zustand
 * Replaces Redux favorites slice with persistent state management
 * Stores product IDs of favorited items
 */

interface FavoritesState {
  items: string[]; // store product IDs

  // Actions
  addFavorite: (productId: string) => void;
  removeFavorite: (productId: string) => void;
  toggleFavorite: (productId: string) => void;
  setFavorites: (items: string[]) => void;
  clearFavorites: () => void;

  // Selectors
  isFavorited: (productId: string) => boolean;
  getFavoritesCount: () => number;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],

      // Actions
      addFavorite: (productId: string) =>
        set((state) => {
          if (!state.items.includes(productId)) {
            return { items: [...state.items, productId] };
          }
          return state;
        }),

      removeFavorite: (productId: string) =>
        set((state) => ({
          items: state.items.filter((id) => id !== productId),
        })),

      toggleFavorite: (productId: string) =>
        set((state) => {
          if (state.items.includes(productId)) {
            return { items: state.items.filter((id) => id !== productId) };
          }
          return { items: [...state.items, productId] };
        }),

      setFavorites: (items: string[]) => set({ items }),

      clearFavorites: () => set({ items: [] }),

      // Selectors
      isFavorited: (productId: string) => get().items.includes(productId),

      getFavoritesCount: () => get().items.length,
    }),
    {
      name: 'favorites_store', // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
