import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

interface Branch {
  _id: string;
  name: string;
  location: string;
  capacity: number;
  managerId?: any; // Can be string or populated object
}

interface BranchState {
  branches: Branch[];
  loading: boolean;
  error: string | null;
}

const initialState: BranchState = {
  branches: [],
  loading: false,
  error: null,
};

export const fetchBranches = createAsyncThunk(
  'branches/fetchBranches',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/branch-get');
      return response.data.branches;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch branches');
    }
  }
);

export const createBranch = createAsyncThunk(
  'branches/createBranch',
  async (branchData: Omit<Branch, '_id'>, { rejectWithValue }) => {
    try {
      const response = await api.post('/branch-create', branchData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create branch');
    }
  }
);

export const updateBranch = createAsyncThunk(
  'branches/updateBranch',
  async ({ id, branchData }: { id: string; branchData: Partial<Branch> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/branch-update/${id}`, branchData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update branch');
    }
  }
);

export const deleteBranch = createAsyncThunk(
  'branches/deleteBranch',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/branch-delete/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete branch');
    }
  }
);

const branchSlice = createSlice({
  name: 'branches',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch branches
      .addCase(fetchBranches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.loading = false;
        state.branches = action.payload;
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create branch
      .addCase(createBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.branches.push(action.payload);
      })
      .addCase(createBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update branch
      .addCase(updateBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBranch.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.branches.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.branches[index] = action.payload;
        }
      })
      .addCase(updateBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete branch
      .addCase(deleteBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.branches = state.branches.filter(b => b._id !== action.payload);
      })
      .addCase(deleteBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default branchSlice.reducer;
