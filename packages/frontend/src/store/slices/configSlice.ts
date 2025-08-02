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
  fontFamily: string;
  fontFamilyMonospace: string;
  fontSize: number;
  syntaxHighlighterTheme: string;
}

const initialState: ConfigState = {
  fontFamily: 'Roboto',
  fontFamilyMonospace: 'monospace',
  fontSize: 14,
  syntaxHighlighterTheme: 'auto',
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchConfig.fulfilled, (state, action: PayloadAction<ConfigState>) => {
      state.fontFamily = action.payload.fontFamily;
      state.fontFamilyMonospace = action.payload.fontFamilyMonospace;
      state.fontSize = action.payload.fontSize;
      state.syntaxHighlighterTheme = action.payload.syntaxHighlighterTheme;
    });
  },
});

export default configSlice.reducer;
