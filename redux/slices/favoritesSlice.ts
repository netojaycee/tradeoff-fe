import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '@/lib/types';

interface FavoritesState {
  items: string[]; // store product IDs
}

const initialState: FavoritesState = {
  items: typeof window !== 'undefined' && localStorage.getItem('tradeoff_favorites')
    ? JSON.parse(localStorage.getItem('tradeoff_favorites') as string)
    : [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<string>) => {
      if (!state.items.includes(action.payload)) {
        state.items.push(action.payload);
        localStorage.setItem('tradeoff_favorites', JSON.stringify(state.items));
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(id => id !== action.payload);
      localStorage.setItem('tradeoff_favorites', JSON.stringify(state.items));
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      if (state.items.includes(action.payload)) {
        state.items = state.items.filter(id => id !== action.payload);
      } else {
        state.items.push(action.payload);
      }
      localStorage.setItem('tradeoff_favorites', JSON.stringify(state.items));
    },
    setFavorites: (state, action: PayloadAction<string[]>) => {
      state.items = action.payload;
      localStorage.setItem('tradeoff_favorites', JSON.stringify(state.items));
    },
    clearFavorites: (state) => {
      state.items = [];
      localStorage.removeItem('tradeoff_favorites');
    },
  },
});

export const { addFavorite, removeFavorite, toggleFavorite, setFavorites, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
