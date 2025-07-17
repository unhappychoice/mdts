
import { configureStore } from '@reduxjs/toolkit';
import contentReducer from './slices/contentSlice';
import fileTreeReducer from './slices/fileTreeSlice';
import outlineReducer from './slices/outlineSlice';
import appSettingReducer from './slices/appSettingSlice';

export const store = configureStore({
  reducer: {
    content: contentReducer,
    fileTree: fileTreeReducer,
    outline: outlineReducer,
    appSetting: appSettingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
