import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/lib/types";

interface AuthState {
  // User info
  user: User | null;
  
  // Authentication tokens
  accessToken: string | null;
  refreshToken: string | null;
  
  // Auth status
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },

    clearUserInfo: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
  },
});

export const { 
  setUserInfo, 
  setTokens, 
  clearUserInfo, 
  setLoading, 
  updateAccessToken 
} = authSlice.actions;

export default authSlice.reducer;
