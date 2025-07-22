import outlineReducer, { fetchOutline } from '../../../src/store/slices/outlineSlice';

jest.mock('../../../src/api', () => ({
  fetchData: jest.fn(),
}));

describe('outlineSlice', () => {
  it('should return the initial state', () => {
    expect(outlineReducer(undefined, { type: '' })).toEqual({
      outline: [],
      loading: true,
      error: null,
    });
  });

  it('should handle fetchOutline.pending', () => {
    const previousState = {
      outline: [{ id: '1', content: 'old outline', level: 1 }],
      loading: false,
      error: 'some error',
    };
    expect(outlineReducer(previousState, fetchOutline.pending('requestId', null))).toEqual({
      outline: [{ id: '1', content: 'old outline', level: 1 }],
      loading: true,
      error: null,
    });
  });

  it('should handle fetchOutline.fulfilled', () => {
    const previousState = {
      outline: [{ id: '1', content: 'old outline', level: 1 }],
      loading: true,
      error: null,
    };
    const newOutline = [{ id: '2', content: 'new outline', level: 1 }];
    expect(outlineReducer(previousState, fetchOutline.fulfilled(newOutline, 'requestId', null))).toEqual({
      outline: newOutline,
      loading: false,
      error: null,
    });
  });

  it('should handle fetchOutline.rejected', () => {
    const previousState = {
      outline: [{ id: '1', content: 'old outline', level: 1 }],
      loading: true,
      error: null,
    };
    const error = new Error('Failed to fetch');
    expect(outlineReducer(previousState, fetchOutline.rejected(error, 'requestId', null))).toEqual({
      outline: [{ id: '1', content: 'old outline', level: 1 }],
      loading: false,
      error: 'Failed to fetch',
    });
  });
});
