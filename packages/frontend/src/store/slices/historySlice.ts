import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../store';

interface HistoryState {
  currentPath: string | null;
  isDirectory: boolean;
}

export const parseHistoryFromPathname = (pathname: string): HistoryState => {
  const path = pathname.substring(1);
  if (path === '') {
    return { currentPath: null, isDirectory: false };
  }

  const fileExtensions = ['.md', '.markdown'];
  const isFile = fileExtensions.some((ext) => path.toLowerCase().endsWith(ext));

  return { currentPath: decodeURIComponent(path), isDirectory: !isFile };
};

const initialState: HistoryState = typeof window === 'undefined'
  ? { currentPath: null, isDirectory: false }
  : parseHistoryFromPathname(window.location.pathname);

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
  const { currentPath, isDirectory } = parseHistoryFromPathname(pathname);
  dispatch(setHistory({ path: currentPath, isDirectory }));
};

export default historySlice.reducer;
