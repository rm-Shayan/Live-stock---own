import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import branchReducer from './branchSlice';
import batchReducer from './batchSlice';
import allocationReducer from './allocationSlice';
import inventoryReducer from './inventorySlice';
import slaughterReducer from './slaughterSlice';
import dashboardReducer from './dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    branches: branchReducer,
    batches: batchReducer,
    allocations: allocationReducer,
    inventory: inventoryReducer,
    slaughter: slaughterReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
