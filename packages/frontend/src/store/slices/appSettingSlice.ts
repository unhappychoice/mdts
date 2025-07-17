import { createSlice } from '@reduxjs/toolkit';

type ContentMode = 'fixed' | 'full';

interface AppSettingState {
  darkMode: boolean;
  contentMode: ContentMode;
  fileTreeOpen: boolean;
  outlineOpen: boolean;
}

const initialState: AppSettingState = {
  darkMode: true,
  contentMode: 'fixed',
  fileTreeOpen: true,
  outlineOpen: true,
};

const appSettingSlice = createSlice({
  name: 'appSetting',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    toggleContentMode: (state) => {
      state.contentMode = state.contentMode === 'fixed' ? 'full' : 'fixed';
    },
    toggleFileTree: (state) => {
      state.fileTreeOpen = !state.fileTreeOpen;
    },
    toggleOutline: (state) => {
      state.outlineOpen = !state.outlineOpen;
    },
  },
});

export const { toggleDarkMode, toggleContentMode, toggleFileTree, toggleOutline } = appSettingSlice.actions;

export default appSettingSlice.reducer;
