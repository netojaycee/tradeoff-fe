import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '@/lib/types';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: typeof window !== 'undefined' && localStorage.getItem('tradeoff_cart')
    ? JSON.parse(localStorage.getItem('tradeoff_cart') as string)
    : [],
};

const setCartCookie = (items: CartItem[]) => {
  try {
    document.cookie = `tradeoff_cart=${encodeURIComponent(JSON.stringify(items))}; path=/; max-age=3600`;
  } catch {}
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(item => item.id === action.payload.id);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      localStorage.setItem('tradeoff_cart', JSON.stringify(state.items));
      setCartCookie(state.items);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('tradeoff_cart', JSON.stringify(state.items));
      setCartCookie(state.items);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        localStorage.setItem('tradeoff_cart', JSON.stringify(state.items));
        setCartCookie(state.items);
      }
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('tradeoff_cart');
      setCartCookie([]);
    },
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      localStorage.setItem('tradeoff_cart', JSON.stringify(state.items));
      setCartCookie(state.items);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;
