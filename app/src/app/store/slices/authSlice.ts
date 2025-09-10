import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: {
    username: string;
    fullname: string;
  } | null;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    setUser: (
      state,
      action: PayloadAction<{username: string; fullname: string}>,
    ) => {
      state.user = action.payload;
    },
    logout: state => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const {setToken, setUser, logout} = authSlice.actions;
export default authSlice.reducer;
