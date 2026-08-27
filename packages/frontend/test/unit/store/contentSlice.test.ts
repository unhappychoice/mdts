import contentReducer, { fetchContent, setScrollPosition } from '../../../src/store/slices/contentSlice';

jest.mock('../../../src/api', () => ({
  fetchData: jest.fn(),
}));

describe('contentSlice', () => {
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

  it('should handle setScrollPosition', () => {
    const previousState = { ...initialState };
    expect(contentReducer(previousState, setScrollPosition(100))).toEqual({
      ...initialState,
      scrollPosition: 100,
    });
  });
});
