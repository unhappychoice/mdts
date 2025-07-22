import { configureStore } from '@reduxjs/toolkit';
import historyReducer, { setHistory, updateHistoryFromLocation } from '../../../src/store/slices/historySlice';

describe('historySlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        history: historyReducer,
      },
    });
  });

  it('should return the initial state', () => {
    expect(store.getState().history.currentPath).toBeNull();
    expect(store.getState().history.isDirectory).toBe(false);
  });

  it('should handle setHistory', () => {
    store.dispatch(setHistory({ path: '/test/path', isDirectory: false }));
    expect(store.getState().history.currentPath).toEqual('/test/path');
    expect(store.getState().history.isDirectory).toBe(false);

    store.dispatch(setHistory({ path: '/another/path', isDirectory: true }));
    expect(store.getState().history.currentPath).toEqual('/another/path');
    expect(store.getState().history.isDirectory).toBe(true);

    store.dispatch(setHistory({ path: null, isDirectory: false }));
    expect(store.getState().history.currentPath).toBeNull();
    expect(store.getState().history.isDirectory).toBe(false);
  });

  describe('updateHistoryFromLocation', () => {
    it('should set history for root path', () => {
      store.dispatch(updateHistoryFromLocation('/'));
      expect(store.getState().history.currentPath).toBeNull();
      expect(store.getState().history.isDirectory).toBe(false);
    });

    it('should set history for a markdown file', () => {
      store.dispatch(updateHistoryFromLocation('/path/to/file.md'));
      expect(store.getState().history.currentPath).toEqual('path/to/file.md');
      expect(store.getState().history.isDirectory).toBe(false);
    });

    it('should set history for another markdown file extension', () => {
      store.dispatch(updateHistoryFromLocation('/path/to/another.markdown'));
      expect(store.getState().history.currentPath).toEqual('path/to/another.markdown');
      expect(store.getState().history.isDirectory).toBe(false);
    });

    it('should set history for a directory', () => {
      store.dispatch(updateHistoryFromLocation('/path/to/directory/'));
      expect(store.getState().history.currentPath).toEqual('path/to/directory/');
      expect(store.getState().history.isDirectory).toBe(true);
    });

    it('should set history for a directory without trailing slash', () => {
      store.dispatch(updateHistoryFromLocation('/path/to/directory'));
      expect(store.getState().history.currentPath).toEqual('path/to/directory');
      expect(store.getState().history.isDirectory).toBe(true);
    });

    it('should handle encoded URI components', () => {
      store.dispatch(updateHistoryFromLocation('/path/to/encoded%20file.md'));
      expect(store.getState().history.currentPath).toEqual('path/to/encoded file.md');
      expect(store.getState().history.isDirectory).toBe(false);
    });

    it('should handle encoded URI components for directory', () => {
      store.dispatch(updateHistoryFromLocation('/path/to/encoded%20directory/'));
      expect(store.getState().history.currentPath).toEqual('path/to/encoded directory/');
      expect(store.getState().history.isDirectory).toBe(true);
    });

    it('should handle mixed case file extensions', () => {
      store.dispatch(updateHistoryFromLocation('/path/to/file.MD'));
      expect(store.getState().history.currentPath).toEqual('path/to/file.MD');
      expect(store.getState().history.isDirectory).toBe(false);
    });

    it('should handle path with only file name', () => {
      store.dispatch(updateHistoryFromLocation('/file.md'));
      expect(store.getState().history.currentPath).toEqual('file.md');
      expect(store.getState().history.isDirectory).toBe(false);
    });

    it('should handle path with only directory name', () => {
      store.dispatch(updateHistoryFromLocation('/directory/'));
      expect(store.getState().history.currentPath).toEqual('directory/');
      expect(store.getState().history.isDirectory).toBe(true);
    });
  });
});
