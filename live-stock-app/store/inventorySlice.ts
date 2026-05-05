import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

interface Inventory {
  _id: string;
  branchId: {
    _id: string;
    name: string;
    location?: string;
  } | string;
  totalAnimalsReceived: number;
  totalSlaughtered: number;
  meatStock: number;
  skinStock: number;
  payeStock: number;
  createdAt: string;
}

interface InventoryState {
  inventory: Inventory | null;
  inventories: Inventory[];
  loading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  inventory: null,
  inventories: [],
  loading: false,
  error: null,
};

export const fetchInventory = createAsyncThunk(
  'inventory/fetchInventory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/inventory');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch inventory');
    }
  }
);

export const fetchAllInventories = createAsyncThunk(
  'inventory/fetchAllInventories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/inventories');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch all inventories');
    }
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.inventory = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllInventories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllInventories.fulfilled, (state, action) => {
        state.loading = false;
        state.inventories = action.payload;
      })
      .addCase(fetchAllInventories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default inventorySlice.reducer;
