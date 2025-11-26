import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
// Import other reducers here when created
// import travelRequestReducer from '../features/travelRequests/travelRequestSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add other reducers here as they are created in later stages
    // travelRequests: travelRequestReducer,
    // approvals: approvalReducer,
    // expenses: expenseReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});