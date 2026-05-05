import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

interface Batch {
  _id: string;
  BatchNum: string;
  TotalAnimals: number;
  remainingAnimals: number;
  Category: string;
  ArrivalDate: string;
  costPrice?: number;
  supplier?: string;
  isAllocated?: boolean;
}

interface BatchState {
  batches: Batch[];
  loading: boolean;
  error: string | null;
}

const initialState: BatchState = {
  batches: [],
  loading: false,
  error: null,
};

export const fetchBatches = createAsyncThunk(
  'batches/fetchBatches',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/get-all-batches');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch batches');
    }
  }
);

export const createBatch = createAsyncThunk(
  'batches/createBatch',
  async (batchData: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/create-Batch', batchData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create batch');
    }
  }
);

export const updateBatch = createAsyncThunk(
  'batches/updateBatch',
  async ({ id, batchData }: { id: string; batchData: any }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/update-Batch/${id}`, batchData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update batch');
    }
  }
);

export const deleteBatch = createAsyncThunk(
  'batches/deleteBatch',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/delete-Batch/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete batch');
    }
  }
);

const batchSlice = createSlice({
  name: 'batches',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch batches
      .addCase(fetchBatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBatches.fulfilled, (state, action) => {
        state.loading = false;
        state.batches = action.payload;
      })
      .addCase(fetchBatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create batch
      .addCase(createBatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBatch.fulfilled, (state, action) => {
        state.loading = false;
        state.batches.push(action.payload);
      })
      .addCase(createBatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update batch
      .addCase(updateBatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBatch.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.batches.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.batches[index] = action.payload;
        }
      })
      .addCase(updateBatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete batch
      .addCase(deleteBatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBatch.fulfilled, (state, action) => {
        state.loading = false;
        state.batches = state.batches.filter(b => b._id !== action.payload);
      })
      .addCase(deleteBatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default batchSlice.reducer;
