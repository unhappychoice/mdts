import { configureStore } from '@reduxjs/toolkit';
import contentReducer from './slices/contentSlice';
import fileTreeReducer from './slices/fileTreeSlice';
import outlineReducer from './slices/outlineSlice';
import appSettingReducer from './slices/appSettingSlice';

// Helper to load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('appSetting');
    if (serializedState === null) {
      return undefined;
    }
    return { appSetting: JSON.parse(serializedState) };
  } catch (err) {
    console.error('Could not load state from localStorage', err);
    return undefined;
  }
};

export const store = configureStore({
  reducer: {
    content: contentReducer,
    fileTree: fileTreeReducer,
    outline: outlineReducer,
    appSetting: appSettingReducer,
  },
  preloadedState: loadState(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;