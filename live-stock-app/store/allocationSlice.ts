import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

interface Allocation {
  _id: string;
  batchId: any;
  branchId: any;
  quantity: number;
  receivedAnimals: number;
  status: string;
  allocationDate: string;
  createdAt: string;
}

interface AllocationState {
  allocations: Allocation[];
  loading: boolean;
  error: string | null;
}

const initialState: AllocationState = {
  allocations: [],
  loading: false,
  error: null,
};

export const fetchAllocations = createAsyncThunk(
  'allocations/fetchAllocations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/get-all-allocations');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch allocations');
    }
  }
);

export const createAllocation = createAsyncThunk(
  'allocations/createAllocation',
  async (allocationData: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/create-allocation', allocationData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create allocation');
    }
  }
);

export const updateAllocation = createAsyncThunk(
  'allocations/updateAllocation',
  async ({ id, updateData }: { id: string; updateData: { status?: string; quantity?: number; branchId?: string } }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/update-allocation/${id}`, updateData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update allocation');
    }
  }
);

export const deleteAllocation = createAsyncThunk(
  'allocations/deleteAllocation',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/delete-allocation/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete allocation');
    }
  }
);

export const updateAllocationStatus = createAsyncThunk(
  'allocations/updateAllocationStatus',
  async ({ id, status, receivedAnimals }: { id: string; status: string; receivedAnimals: number }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/receive-animals/${id}`, { status, receivedAnimals });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

const allocationSlice = createSlice({
  name: 'allocations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch allocations
      .addCase(fetchAllocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllocations.fulfilled, (state, action) => {
        state.loading = false;
        state.allocations = action.payload;
      })
      .addCase(fetchAllocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create allocation
      .addCase(createAllocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAllocation.fulfilled, (state, action) => {
        state.loading = false;
        state.allocations.push(action.payload);
      })
      .addCase(createAllocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update allocation
      .addCase(updateAllocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAllocation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.allocations.findIndex(a => a._id === action.payload._id);
        if (index !== -1) {
          state.allocations[index] = action.payload;
        }
      })
      .addCase(updateAllocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete allocation
      .addCase(deleteAllocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAllocation.fulfilled, (state, action) => {
        state.loading = false;
        state.allocations = state.allocations.filter(a => a._id !== action.payload);
      })
      .addCase(deleteAllocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update allocation status (Receive)
      .addCase(updateAllocationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAllocationStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.allocations.findIndex(a => a._id === action.payload._id);
        if (index !== -1) {
          state.allocations[index] = action.payload;
        }
      })
      .addCase(updateAllocationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default allocationSlice.reducer;
