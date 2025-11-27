// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from '../features/authSlice';
// // Import other reducers here when created
// // import travelRequestReducer from '../features/travelRequests/travelRequestSlice';

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     // Add other reducers here as they are created in later stages
//     // travelRequests: travelRequestReducer,
//     // approvals: approvalReducer,
//     // expenses: expenseReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         // Ignore these action types
//         ignoredActions: ['persist/PERSIST'],
//       },
//     }),
//   devTools: process.env.NODE_ENV !== 'production',
// });

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice'; 
// (Make sure this path is correct based on your folder structure)

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,   // <-- Add this line
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});
