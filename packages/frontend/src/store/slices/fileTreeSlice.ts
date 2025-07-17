
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchData } from '../../api';

interface FileTreeItem {
  [key: string]: (FileTreeItem | string)[];
}

interface FileTreeState {
  fileTree: (FileTreeItem | string)[];
  loading: boolean;
  error: string | null;
}

const initialState: FileTreeState = {
  fileTree: [],
  loading: true,
  error: null,
};

export const fetchFileTree = createAsyncThunk(
  'fileTree/fetchFileTree',
  async () => {
    const data = await fetchData<FileTreeItem[]>('/api/filetree', 'json');
    return data || [];
  }
);

const fileTreeSlice = createSlice({
  name: 'fileTree',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFileTree.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFileTree.fulfilled, (state, action) => {
        state.loading = false;
        state.fileTree = action.payload;
      })
      .addCase(fetchFileTree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch file tree';
      });
  },
});

export default fileTreeSlice.reducer;
