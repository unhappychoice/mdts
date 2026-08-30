import { configureStore } from '@reduxjs/toolkit';
import { fetchData } from '../../../src/api';
import contentReducer, { fetchContent, setScrollPosition } from '../../../src/store/slices/contentSlice';

jest.mock('../../../src/api', () => ({
  fetchData: jest.fn(),
}));

const mockFetchData = fetchData as jest.MockedFunction<typeof fetchData>;

const aborted = <T extends { meta: { aborted?: boolean } }>(action: T): T => ({
  ...action,
  meta: { ...action.meta, aborted: true },
});

describe('contentSlice', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const initialState = {
    content: '',
    loading: true,
    error: null,
    scrollPosition: 0,
    latestRequestId: null,
  };

  it('should return the initial state', () => {
    expect(contentReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('fetchContent.pending', () => {
    it('should set loading to true when content is empty', () => {
      const previousState = { ...initialState, loading: false, content: '' };
      expect(contentReducer(previousState, fetchContent.pending('requestId', null))).toEqual({
        ...initialState,
        loading: true,
        content: '',
        latestRequestId: 'requestId',
      });
    });

    it('should not set loading to true when content exists', () => {
      const previousState = {
        ...initialState,
        loading: false,
        content: 'old content',
      };
      expect(contentReducer(previousState, fetchContent.pending('requestId', null))).toEqual({
        ...initialState,
        loading: false,
        content: 'old content',
        latestRequestId: 'requestId',
      });
    });
  });

  it('should handle fetchContent.fulfilled', () => {
    const previousState = {
      ...initialState,
      content: 'old content',
      loading: true,
      latestRequestId: 'requestId',
    };
    expect(contentReducer(previousState, fetchContent.fulfilled('new content', 'requestId', null))).toEqual({
      ...initialState,
      content: 'new content',
      loading: false,
      latestRequestId: 'requestId',
    });
  });

  it('should handle fetchContent.rejected', () => {
    const previousState = {
      ...initialState,
      content: 'old content',
      loading: true,
      latestRequestId: 'requestId',
    };
    const error = new Error('Failed to fetch');
    expect(contentReducer(previousState, fetchContent.rejected(error, 'requestId', null))).toEqual({
      ...initialState,
      content: 'old content',
      loading: false,
      error: 'Failed to fetch',
      latestRequestId: 'requestId',
    });
  });

  it('should ignore stale fetchContent.fulfilled results', () => {
    const previousState = {
      ...initialState,
      content: 'current file',
      loading: false,
      latestRequestId: 'newer-request',
    };
    expect(contentReducer(
      previousState,
      fetchContent.fulfilled('# Welcome to mdts! 🚀', 'older-request', null),
    )).toEqual(previousState);
  });

  it('should ignore aborted fetchContent.rejected results', () => {
    const previousState = {
      ...initialState,
      content: 'current file',
      loading: false,
      latestRequestId: 'requestId',
    };
    expect(contentReducer(
      previousState,
      aborted(fetchContent.rejected(new Error('Aborted'), 'requestId', null)),
    )).toEqual(previousState);
  });

  it('fetches the selected file instead of welcome markdown', async () => {
    mockFetchData.mockResolvedValue('# selected file');
    const store = configureStore({ reducer: { content: contentReducer } });

    await store.dispatch(fetchContent('audit-review.md'));

    expect(mockFetchData).toHaveBeenCalledWith(
      '/api/markdown/audit-review.md',
      'text',
      expect.any(AbortSignal),
    );
    expect(store.getState().content.content).toBe('# selected file');
  });

  it('encodes markdown path segments when fetching content', async () => {
    mockFetchData.mockResolvedValue('# encoded');
    const store = configureStore({ reducer: { content: contentReducer } });

    await store.dispatch(fetchContent('docs/my file.md'));

    expect(mockFetchData).toHaveBeenCalledWith(
      '/api/markdown/docs/my%20file.md',
      'text',
      expect.any(AbortSignal),
    );
  });

  it('fetches welcome markdown when no file is selected', async () => {
    mockFetchData.mockResolvedValue('# Welcome');
    const store = configureStore({ reducer: { content: contentReducer } });

    await store.dispatch(fetchContent(null));

    expect(mockFetchData).toHaveBeenCalledWith(
      '/api/markdown/mdts-welcome-markdown.md',
      'text',
      expect.any(AbortSignal),
    );
  });

  it('should handle setScrollPosition', () => {
    const previousState = { ...initialState };
    expect(contentReducer(previousState, setScrollPosition(100))).toEqual({
      ...initialState,
      scrollPosition: 100,
    });
  });
});
