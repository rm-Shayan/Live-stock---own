import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

interface DashboardStats {
  warehouse: {
    totalAnimalsInSystem: number;
    availableInMainStock: number;
    totalSentToBranches: number;
  };
  globalInventory: {
    totalSlaughtered: number;
    totalMeatInStock: number;
    totalSkinsInStock: number;
    totalPayeInStock: number;
  };
  branchWiseReport: Array<{
    branchName: string;
    animalsSlaughtered: number;
    currentMeatStock: number;
    currentSkinStock: number;
    currentPayeStock: number;
    totalReceived: number;
  }>;
  statusCounts: {
    pending: number;
    received: number;
  };
}

interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  loading: false,
  error: null,
};

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/getStats');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;
