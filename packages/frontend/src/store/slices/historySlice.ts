import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../store';

interface HistoryState {
  currentPath: string | null;
  isDirectory: boolean;
}

const initialState: HistoryState = {
  currentPath: null,
  isDirectory: false,
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    setHistory: (
      state,
      action: PayloadAction<{ path: string | null; isDirectory: boolean }>
    ) => {
      state.currentPath = action.payload.path;
      state.isDirectory = action.payload.isDirectory;
    },
  },
});

export const { setHistory } = historySlice.actions;

export const updateHistoryFromLocation = (pathname: string) => (dispatch: AppDispatch): void => {
  const getPathFromUrl = () => {
    const path = pathname.substring(1);
    if (path === '') return { path: null, isDirectory: false };

    const fileExtensions = ['.md', '.markdown'];
    const isFile = fileExtensions.some((ext) =>
      path.toLowerCase().endsWith(ext)
    );

    return { path: decodeURIComponent(path), isDirectory: !isFile };
  };

  const { path, isDirectory } = getPathFromUrl();
  dispatch(setHistory({ path, isDirectory }));
};

export default historySlice.reducer;
