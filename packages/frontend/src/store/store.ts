
import { configureStore } from '@reduxjs/toolkit';
import contentReducer from './slices/contentSlice';
import fileTreeReducer from './slices/fileTreeSlice';

export const store = configureStore({
  reducer: {
    content: contentReducer,
    fileTree: fileTreeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
