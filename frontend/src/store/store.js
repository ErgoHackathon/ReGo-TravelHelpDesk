import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import dashboardReducer from '../redux/slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;