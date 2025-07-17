
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchData } from '../../api';

interface ContentState {
  content: string;
  loading: boolean;
  error: string | null;
}

const initialState: ContentState = {
  content: '',
  loading: true,
  error: null,
};

export const fetchContent = createAsyncThunk(
  'content/fetchContent',
  async (path: string | null) => {
    const url = path ? `/api/markdown/${path}` : '/api/markdown/mdts-welcome-markdown.md';
    const data = await fetchData<string>(url, 'text');
    return data || '';
  }
);

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.loading = false;
        state.content = action.payload;
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch content';
      });
  },
});

export default contentSlice.reducer;
