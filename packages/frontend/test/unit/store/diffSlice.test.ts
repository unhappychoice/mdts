import { configureStore } from '@reduxjs/toolkit';
import diffReducer, { fetchDiff, fetchDiffPrev } from '../../../src/store/slices/diffSlice';
import { fetchData } from '../../../src/api';

jest.mock('../../../src/api', () => ({
  fetchData: jest.fn(),
}));

const mockFetchData = fetchData as jest.MockedFunction<typeof fetchData>;

describe('diffSlice', () => {
  const initialState = {
    diff: '',
    diffPrev: '',
    diffLoading: false,
    diffPrevLoading: false,
    diffError: null,
    diffPrevError: null,
  };

  const createTestStore = () =>
    configureStore({ reducer: { diff: diffReducer } });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the initial state', () => {
    expect(diffReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('fetchDiff', () => {
    it('should set diffLoading to true on pending', () => {
      const state = diffReducer(initialState, fetchDiff.pending('requestId', 'test.md'));
      expect(state.diffLoading).toBe(true);
      expect(state.diffError).toBeNull();
    });

    it('should clear previous error on pending', () => {
      const prev = { ...initialState, diffError: 'old error' };
      const state = diffReducer(prev, fetchDiff.pending('requestId', 'test.md'));
      expect(state.diffError).toBeNull();
    });

    it('should set diff content on fulfilled', () => {
      const prev = { ...initialState, diffLoading: true };
      const state = diffReducer(prev, fetchDiff.fulfilled('+added line', 'requestId', 'test.md'));
      expect(state.diffLoading).toBe(false);
      expect(state.diff).toBe('+added line');
    });

    it('should set error and clear diff on rejected', () => {
      const prev = { ...initialState, diffLoading: true, diff: 'stale diff' };
      const error = new Error('Network error');
      const state = diffReducer(prev, fetchDiff.rejected(error, 'requestId', 'test.md'));
      expect(state.diffLoading).toBe(false);
      expect(state.diff).toBe('');
      expect(state.diffError).toBe('Network error');
    });

    it('should set error message when error has no custom message', () => {
      const prev = { ...initialState, diffLoading: true };
      const state = diffReducer(prev, fetchDiff.rejected(null, 'requestId', 'test.md'));
      expect(state.diffError).toBeTruthy();
    });

    it('should return empty string when path is null', async () => {
      const store = createTestStore();
      await store.dispatch(fetchDiff(null));
      expect(store.getState().diff.diff).toBe('');
      expect(mockFetchData).not.toHaveBeenCalled();
    });

    it('should fetch diff with encoded path', async () => {
      mockFetchData.mockResolvedValue('+added');
      const store = createTestStore();
      await store.dispatch(fetchDiff('docs/my file.md'));
      expect(mockFetchData).toHaveBeenCalledWith('/api/diff/docs/my%20file.md', 'text');
      expect(store.getState().diff.diff).toBe('+added');
    });

    it('should return empty string when fetchData returns null', async () => {
      mockFetchData.mockResolvedValue(null);
      const store = createTestStore();
      await store.dispatch(fetchDiff('test.md'));
      expect(store.getState().diff.diff).toBe('');
    });
  });

  describe('fetchDiffPrev', () => {
    it('should set diffPrevLoading to true on pending', () => {
      const state = diffReducer(initialState, fetchDiffPrev.pending('requestId', 'test.md'));
      expect(state.diffPrevLoading).toBe(true);
      expect(state.diffPrevError).toBeNull();
    });

    it('should clear previous error on pending', () => {
      const prev = { ...initialState, diffPrevError: 'old error' };
      const state = diffReducer(prev, fetchDiffPrev.pending('requestId', 'test.md'));
      expect(state.diffPrevError).toBeNull();
    });

    it('should set diffPrev content on fulfilled', () => {
      const prev = { ...initialState, diffPrevLoading: true };
      const state = diffReducer(prev, fetchDiffPrev.fulfilled('-old\n+new', 'requestId', 'test.md'));
      expect(state.diffPrevLoading).toBe(false);
      expect(state.diffPrev).toBe('-old\n+new');
    });

    it('should set error and clear diffPrev on rejected', () => {
      const prev = { ...initialState, diffPrevLoading: true, diffPrev: 'stale diff' };
      const error = new Error('Server error');
      const state = diffReducer(prev, fetchDiffPrev.rejected(error, 'requestId', 'test.md'));
      expect(state.diffPrevLoading).toBe(false);
      expect(state.diffPrev).toBe('');
      expect(state.diffPrevError).toBe('Server error');
    });

    it('should set error message when error has no custom message', () => {
      const prev = { ...initialState, diffPrevLoading: true };
      const state = diffReducer(prev, fetchDiffPrev.rejected(null, 'requestId', 'test.md'));
      expect(state.diffPrevError).toBeTruthy();
    });

    it('should return empty string when path is null', async () => {
      const store = createTestStore();
      await store.dispatch(fetchDiffPrev(null));
      expect(store.getState().diff.diffPrev).toBe('');
      expect(mockFetchData).not.toHaveBeenCalled();
    });

    it('should fetch diff-prev with encoded path', async () => {
      mockFetchData.mockResolvedValue('-old\n+new');
      const store = createTestStore();
      await store.dispatch(fetchDiffPrev('docs/my file.md'));
      expect(mockFetchData).toHaveBeenCalledWith('/api/diff-prev/docs/my%20file.md', 'text');
      expect(store.getState().diff.diffPrev).toBe('-old\n+new');
    });

    it('should return empty string when fetchData returns null', async () => {
      mockFetchData.mockResolvedValue(null);
      const store = createTestStore();
      await store.dispatch(fetchDiffPrev('test.md'));
      expect(store.getState().diff.diffPrev).toBe('');
    });
  });
});
