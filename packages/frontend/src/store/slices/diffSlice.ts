import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchData } from '../../api';
import { isStaleRequest } from '../isStaleRequest';

interface DiffState {
  diff: string;
  diffPrev: string;
  diffLoading: boolean;
  diffPrevLoading: boolean;
  diffError: string | null;
  diffPrevError: string | null;
  latestDiffRequestId: string | null;
  latestDiffPrevRequestId: string | null;
}

const initialState: DiffState = {
  diff: '',
  diffPrev: '',
  diffLoading: false,
  diffPrevLoading: false,
  diffError: null,
  diffPrevError: null,
  latestDiffRequestId: null,
  latestDiffPrevRequestId: null,
};

const encodePath = (path: string): string =>
  path.split('/').map(encodeURIComponent).join('/');

export const fetchDiff = createAsyncThunk(
  'diff/fetchDiff',
  async (path: string | null, { signal }) => {
    if (!path) return '';
    const data = await fetchData<string>(`/api/diff/${encodePath(path)}`, 'text', signal);
    return data || '';
  }
);

export const fetchDiffPrev = createAsyncThunk(
  'diff/fetchDiffPrev',
  async (path: string | null, { signal }) => {
    if (!path) return '';
    const data = await fetchData<string>(`/api/diff-prev/${encodePath(path)}`, 'text', signal);
    return data || '';
  }
);

const diffSlice = createSlice({
  name: 'diff',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiff.pending, (state, action) => {
        state.latestDiffRequestId = action.meta.requestId;
        state.diffLoading = true;
        state.diffError = null;
      })
      .addCase(fetchDiff.fulfilled, (state, action) => {
        if (isStaleRequest({ latestRequestId: state.latestDiffRequestId }, action)) {
          return;
        }
        state.diffLoading = false;
        state.diff = action.payload;
      })
      .addCase(fetchDiff.rejected, (state, action) => {
        if (isStaleRequest({ latestRequestId: state.latestDiffRequestId }, action)) {
          return;
        }
        state.diffLoading = false;
        state.diff = '';
        state.diffError = action.error.message || 'Failed to fetch diff';
      })
      .addCase(fetchDiffPrev.pending, (state, action) => {
        state.latestDiffPrevRequestId = action.meta.requestId;
        state.diffPrevLoading = true;
        state.diffPrevError = null;
      })
      .addCase(fetchDiffPrev.fulfilled, (state, action) => {
        if (isStaleRequest({ latestRequestId: state.latestDiffPrevRequestId }, action)) {
          return;
        }
        state.diffPrevLoading = false;
        state.diffPrev = action.payload;
      })
      .addCase(fetchDiffPrev.rejected, (state, action) => {
        if (isStaleRequest({ latestRequestId: state.latestDiffPrevRequestId }, action)) {
          return;
        }
        state.diffPrevLoading = false;
        state.diffPrev = '';
        state.diffPrevError = action.error.message || 'Failed to fetch previous diff';
      });
  },
});

export default diffSlice.reducer;
