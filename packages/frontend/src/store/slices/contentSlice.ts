
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchData } from '../../api';

interface ContentState {
  content: string;
  loading: boolean;
  error: string | null;
  scrollPosition: number;
}

const initialState: ContentState = {
  content: '',
  loading: true,
  error: null,
  scrollPosition: 0,
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
  reducers: {
    setScrollPosition: (state, action: PayloadAction<number>) => {
      state.scrollPosition = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContent.pending, (state) => {
        if (!state.content) {
          state.loading = true;
        }
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

export const { setScrollPosition } = contentSlice.actions;

export default contentSlice.reducer;
