import { isStaleRequest } from '../../../src/store/isStaleRequest';

describe('isStaleRequest', () => {
  it('returns false for the current request', () => {
    expect(isStaleRequest(
      { latestRequestId: 'requestId' },
      { meta: { requestId: 'requestId' } },
    )).toBe(false);
  });

  it('returns true when the request id no longer matches', () => {
    expect(isStaleRequest(
      { latestRequestId: 'newer-request' },
      { meta: { requestId: 'older-request' } },
    )).toBe(true);
  });

  it('returns true when the current request was aborted', () => {
    expect(isStaleRequest(
      { latestRequestId: 'requestId' },
      { meta: { requestId: 'requestId', aborted: true } },
    )).toBe(true);
  });
});
