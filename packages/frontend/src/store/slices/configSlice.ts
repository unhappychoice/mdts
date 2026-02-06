import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchData } from '../../api';

export const fetchConfig = createAsyncThunk('config/fetchConfig', async () => {
  return await fetchData<ConfigState>('/api/config', 'json');
});

export const saveConfigToBackend = createAsyncThunk(
  'config/saveConfigToBackend',
  async (config: ConfigState, { dispatch }) => {
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      dispatch(fetchConfig()); // Re-fetch config after saving
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw error; // Re-throw to allow error handling in component
    }
  }
);

export interface ConfigState {
  theme: string;
  syntaxHighlighterTheme: string;
  fontFamily: string;
  fontFamilyMonospace: string;
  fontSize: number;
  enableBreaks: boolean;
}

const initialState: ConfigState = {
  theme: 'default',
  syntaxHighlighterTheme: 'auto',
  fontFamily: 'Roboto',
  fontFamilyMonospace: 'monospace',
  fontSize: 14,
  enableBreaks: false,
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchConfig.fulfilled, (state, action: PayloadAction<ConfigState>) => {
      state.theme = action.payload.theme;
      state.syntaxHighlighterTheme = action.payload.syntaxHighlighterTheme;
      state.fontFamily = action.payload.fontFamily;
      state.fontFamilyMonospace = action.payload.fontFamilyMonospace;
      state.fontSize = action.payload.fontSize;
      state.enableBreaks = action.payload.enableBreaks;
    });
  },
});

export default configSlice.reducer;
