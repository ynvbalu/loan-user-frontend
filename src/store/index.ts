import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import loanReducer from './slices/loanSlice';

export const store = configureStore({
  reducer: {
    users: userReducer,
    loans: loanReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Add type for useDispatch
declare module 'react-redux' {
  interface DefaultRootState extends RootState {}
} 