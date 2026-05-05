import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/api';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth', credentials);
      const { token, user, role } = response.data;
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userInfo', JSON.stringify({ ...user, role }));
      return { token, user: { ...user, role } };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      // We try to call the API, but we ALWAYS clear local storage
      await api.post('/logout').catch(() => {}); 
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userInfo');
      return null;
    } catch (error: any) {
      // Still remove items even if something weird happens
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userInfo');
      return null;
    }
  }
);

export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/profile');
      return response.data.data;
    } catch (error: any) {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userInfo');
      return rejectWithValue(error.response?.data?.message || 'Session expired');
    }
  }
);

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userInfoStr = await AsyncStorage.getItem('userInfo');
      if (token && userInfoStr) {
        // Await the profile fetch so the loading state stays true until finished
        const profileResult = await dispatch(getProfile());
        if (getProfile.rejected.match(profileResult)) {
          return rejectWithValue('Session expired');
        }
        return { token, user: JSON.parse(userInfoStr) };
      }
      return rejectWithValue('No user found');
    } catch (error) {
      return rejectWithValue('Error loading user');
    }
  }
);

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  } | null;
  token: string | null;
  loading: boolean;
  isAppLoading: boolean; // Initial app sync state
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  isAppLoading: true,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.loading = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.loading = false;
      })
      // Load User
      .addCase(loadUser.pending, (state) => {
        state.isAppLoading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.isAppLoading = false;
        state.isAuthenticated = true; // Explicitly set this
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loadUser.rejected, (state) => {
        state.isAppLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(getProfile.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
