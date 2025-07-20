import contentReducer, { fetchContent } from '../../src/store/slices/contentSlice';
import { fetchData } from '../../src/api';

jest.mock('../../src/api', () => ({
  fetchData: jest.fn(),
}));

describe('contentSlice', () => {
  it('should return the initial state', () => {
    expect(contentReducer(undefined, { type: '' })).toEqual({
      content: '',
      loading: true,
      error: null,
    });
  });

  it('should handle fetchContent.pending', () => {
    const previousState = {
      content: 'old content',
      loading: false,
      error: 'some error',
    };
    expect(contentReducer(previousState, fetchContent.pending('requestId', null))).toEqual({
      content: 'old content',
      loading: true,
      error: null,
    });
  });

  it('should handle fetchContent.fulfilled', () => {
    const previousState = {
      content: 'old content',
      loading: true,
      error: null,
    };
    expect(contentReducer(previousState, fetchContent.fulfilled('new content', 'requestId', null))).toEqual({
      content: 'new content',
      loading: false,
      error: null,
    });
  });

  it('should handle fetchContent.rejected', () => {
    const previousState = {
      content: 'old content',
      loading: true,
      error: null,
    };
    const error = new Error('Failed to fetch');
    expect(contentReducer(previousState, fetchContent.rejected(error, 'requestId', null))).toEqual({
      content: 'old content',
      loading: false,
      error: 'Failed to fetch',
    });
  });
});