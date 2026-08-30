import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchData } from '../../api';
import { isStaleRequest } from '../isStaleRequest';

interface ContentState {
  content: string;
  loading: boolean;
  error: string | null;
  scrollPosition: number;
  latestRequestId: string | null;
}

const initialState: ContentState = {
  content: '',
  loading: true,
  error: null,
  scrollPosition: 0,
  latestRequestId: null,
};

const encodePath = (path: string): string =>
  path.split('/').map(encodeURIComponent).join('/');

const markdownApiUrl = (path: string | null): string => (
  path
    ? `/api/markdown/${encodePath(path)}`
    : '/api/markdown/mdts-welcome-markdown.md'
);

export const fetchContent = createAsyncThunk(
  'content/fetchContent',
  async (path: string | null, { signal }) => {
    const data = await fetchData<string>(markdownApiUrl(path), 'text', signal);
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
      .addCase(fetchContent.pending, (state, action) => {
        state.latestRequestId = action.meta.requestId;
        if (!state.content) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        if (isStaleRequest(state, action)) {
          return;
        }
        state.loading = false;
        state.content = action.payload;
      })
      .addCase(fetchContent.rejected, (state, action) => {
        if (isStaleRequest(state, action)) {
          return;
        }
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch content';
      });
  },
});

export const { setScrollPosition } = contentSlice.actions;

export default contentSlice.reducer;
