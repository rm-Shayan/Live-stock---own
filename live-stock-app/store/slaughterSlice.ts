import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

interface Slaughter {
  _id: string;
  branchId: string;
  date: string;
  count: number;
  createdAt: string;
}

interface SlaughterState {
  slaughters: Slaughter[];
  loading: boolean;
  error: string | null;
}

const initialState: SlaughterState = {
  slaughters: [],
  loading: false,
  error: null,
};

export const fetchSlaughters = createAsyncThunk(
  'slaughter/fetchSlaughters',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/getAllSlaughters');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch slaughter records');
    }
  }
);

export const createSlaughter = createAsyncThunk(
  'slaughter/createSlaughter',
  async (data: { count: number }, { rejectWithValue }) => {
    try {
      const response = await api.post('/createSlaughter', data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create slaughter record');
    }
  }
);
export const deleteSlaughter = createAsyncThunk(
  'slaughter/deleteSlaughter',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/deleteSlaughterRecord/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete slaughter record');
    }
  }
);
const slaughterSlice = createSlice({
  name: 'slaughter',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSlaughters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSlaughters.fulfilled, (state, action) => {
        state.loading = false;
        state.slaughters = action.payload;
      })
      .addCase(fetchSlaughters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createSlaughter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSlaughter.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createSlaughter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteSlaughter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSlaughter.fulfilled, (state, action) => {
        state.loading = false;
        state.slaughters = state.slaughters.filter(s => s._id !== action.payload);
      })
      .addCase(deleteSlaughter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default slaughterSlice.reducer;
