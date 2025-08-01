import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import contentReducer from './slices/contentSlice';
import fileTreeReducer from './slices/fileTreeSlice';
import outlineReducer from './slices/outlineSlice';
import appSettingReducer, { saveAppSetting } from './slices/appSettingSlice';
import historyReducer from './slices/historySlice';
import configReducer from './slices/configSlice';

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

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: saveAppSetting,
  effect: (action, listenerApi) => {
    const darkMode = action.payload.darkMode;
    const applyTheme = (mode: 'dark' | 'light') => {
      document.body.setAttribute('data-theme', mode);
    };

    if (darkMode === 'auto') {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(prefersDarkMode.matches ? 'dark' : 'light');

      const listener = (e: MediaQueryListEvent) => {
        applyTheme(e.matches ? 'dark' : 'light');
      };
      prefersDarkMode.addEventListener('change', listener);
      listenerApi.signal.addEventListener('abort', () => {
        prefersDarkMode.removeEventListener('change', listener);
      });
    } else {
      applyTheme(darkMode);
    }
  },
});

export const store = configureStore({
  reducer: {
    content: contentReducer,
    fileTree: fileTreeReducer,
    outline: outlineReducer,
    appSetting: appSettingReducer,
    history: historyReducer,
    config: configReducer,
  },
  preloadedState: loadState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
