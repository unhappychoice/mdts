import { configureStore } from '@reduxjs/toolkit';
import historyReducer, {
  parseHistoryFromPathname,
  setHistory,
  updateHistoryFromLocation,
} from '../../../src/store/slices/historySlice';

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

  describe('parseHistoryFromPathname', () => {
    it('returns an empty history for the root path', () => {
      expect(parseHistoryFromPathname('/')).toEqual({
        currentPath: null,
        isDirectory: false,
      });
    });

    it('treats a markdown file as a file', () => {
      expect(parseHistoryFromPathname('/a.md')).toEqual({
        currentPath: 'a.md',
        isDirectory: false,
      });
    });

    it('treats a path without a markdown extension as a directory', () => {
      expect(parseHistoryFromPathname('/dir')).toEqual({
        currentPath: 'dir',
        isDirectory: true,
      });
    });

    it('decodes encoded path segments', () => {
      expect(parseHistoryFromPathname('/docs/my%20file.md')).toEqual({
        currentPath: 'docs/my file.md',
        isDirectory: false,
      });
    });

    it('classifies an encoded markdown extension as a file', () => {
      expect(parseHistoryFromPathname('/docs/readme%2Emd')).toEqual({
        currentPath: 'docs/readme.md',
        isDirectory: false,
      });
    });

    it('falls back to the raw path when decoding fails', () => {
      expect(parseHistoryFromPathname('/%')).toEqual({
        currentPath: '%',
        isDirectory: true,
      });
      expect(parseHistoryFromPathname('/%E0%A4%A')).toEqual({
        currentPath: '%E0%A4%A',
        isDirectory: true,
      });
    });
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
