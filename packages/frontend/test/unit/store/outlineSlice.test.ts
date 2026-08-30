import outlineReducer, { fetchOutline } from '../../../src/store/slices/outlineSlice';

jest.mock('../../../src/api', () => ({
  fetchData: jest.fn(),
}));

const aborted = <T extends { meta: { aborted?: boolean } }>(action: T): T => ({
  ...action,
  meta: { ...action.meta, aborted: true },
});

describe('outlineSlice', () => {
  it('should return the initial state', () => {
    expect(outlineReducer(undefined, { type: '' })).toEqual({
      outline: [],
      loading: true,
      error: null,
      latestRequestId: null,
    });
  });

  it('should handle fetchOutline.pending', () => {
    const previousState = {
      outline: [{ id: '1', content: 'old outline', level: 1 }],
      loading: false,
      error: 'some error',
      latestRequestId: null,
    };
    expect(outlineReducer(previousState, fetchOutline.pending('requestId', null))).toEqual({
      outline: [{ id: '1', content: 'old outline', level: 1 }],
      loading: true,
      error: null,
      latestRequestId: 'requestId',
    });
  });

  it('should handle fetchOutline.fulfilled', () => {
    const previousState = {
      outline: [{ id: '1', content: 'old outline', level: 1 }],
      loading: true,
      error: null,
      latestRequestId: 'requestId',
    };
    const newOutline = [{ id: '2', content: 'new outline', level: 1 }];
    expect(outlineReducer(previousState, fetchOutline.fulfilled(newOutline, 'requestId', null))).toEqual({
      outline: newOutline,
      loading: false,
      error: null,
      latestRequestId: 'requestId',
    });
  });

  it('should handle fetchOutline.rejected', () => {
    const previousState = {
      outline: [{ id: '1', content: 'old outline', level: 1 }],
      loading: true,
      error: null,
      latestRequestId: 'requestId',
    };
    const error = new Error('Failed to fetch');
    expect(outlineReducer(previousState, fetchOutline.rejected(error, 'requestId', null))).toEqual({
      outline: [{ id: '1', content: 'old outline', level: 1 }],
      loading: false,
      error: 'Failed to fetch',
      latestRequestId: 'requestId',
    });
  });

  it('should ignore stale fetchOutline.fulfilled results', () => {
    const previousState = {
      outline: [{ id: '1', content: 'current outline', level: 1 }],
      loading: false,
      error: null,
      latestRequestId: 'newer-request',
    };
    expect(outlineReducer(
      previousState,
      fetchOutline.fulfilled([{ id: '2', content: 'stale outline', level: 1 }], 'older-request', null),
    )).toEqual(previousState);
  });

  it('should ignore aborted fetchOutline.rejected results', () => {
    const previousState = {
      outline: [{ id: '1', content: 'current outline', level: 1 }],
      loading: false,
      error: null,
      latestRequestId: 'requestId',
    };
    expect(outlineReducer(
      previousState,
      aborted(fetchOutline.rejected(new Error('Aborted'), 'requestId', null)),
    )).toEqual(previousState);
  });
});
