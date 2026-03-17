import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchData } from '../../api';

interface DiffState {
  diff: string;
  diffPrev: string;
  diffLoading: boolean;
  diffPrevLoading: boolean;
  diffError: string | null;
  diffPrevError: string | null;
}

const initialState: DiffState = {
  diff: '',
  diffPrev: '',
  diffLoading: false,
  diffPrevLoading: false,
  diffError: null,
  diffPrevError: null,
};

export const fetchDiff = createAsyncThunk(
  'diff/fetchDiff',
  async (path: string | null) => {
    if (!path) return '';
    const data = await fetchData<string>(`/api/diff/${path}`, 'text');
    return data || '';
  }
);

export const fetchDiffPrev = createAsyncThunk(
  'diff/fetchDiffPrev',
  async (path: string | null) => {
    if (!path) return '';
    const data = await fetchData<string>(`/api/diff-prev/${path}`, 'text');
    return data || '';
  }
);

const diffSlice = createSlice({
  name: 'diff',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiff.pending, (state) => {
        state.diffLoading = true;
        state.diffError = null;
      })
      .addCase(fetchDiff.fulfilled, (state, action) => {
        state.diffLoading = false;
        state.diff = action.payload;
      })
      .addCase(fetchDiff.rejected, (state, action) => {
        state.diffLoading = false;
        state.diffError = action.error.message || 'Failed to fetch diff';
      })
      .addCase(fetchDiffPrev.pending, (state) => {
        state.diffPrevLoading = true;
        state.diffPrevError = null;
      })
      .addCase(fetchDiffPrev.fulfilled, (state, action) => {
        state.diffPrevLoading = false;
        state.diffPrev = action.payload;
      })
      .addCase(fetchDiffPrev.rejected, (state, action) => {
        state.diffPrevLoading = false;
        state.diffPrevError = action.error.message || 'Failed to fetch previous diff';
      });
  },
});

export default diffSlice.reducer;
