import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: any | null;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  user: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ token: string; user: any }>) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.error = null; 
    },
    loginFailure: (state, action: PayloadAction<{ error: string }>) => {
      state.error = action.payload.error;
      state.isAuthenticated = false; 
      state.token = null; 
      state.user = null;
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
  },
});

export const { loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
