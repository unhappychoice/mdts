import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchData } from '../../api';

export type OutlineItem = {
  id: string;
  content: string;
  level: number;
};

interface OutlineState {
  outline: OutlineItem[];
  loading: boolean;
  error: string | null;
}

const initialState: OutlineState = {
  outline: [],
  loading: true,
  error: null,
};

export const fetchOutline = createAsyncThunk(
  'outline/fetchOutline',
  async (path: string | null) => {
    const url = path
      ? `/api/outline?filePath=${encodeURIComponent(path)}`
      : '/api/outline?filePath=mdts-welcome-markdown.md';
    const data = await fetchData<OutlineItem[]>(url, 'json');
    return data || [];
  }
);

const outlineSlice = createSlice({
  name: 'outline',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOutline.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOutline.fulfilled, (state, action) => {
        state.loading = false;
        state.outline = action.payload;
      })
      .addCase(fetchOutline.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch outline';
      });
  },
});

export default outlineSlice.reducer;
