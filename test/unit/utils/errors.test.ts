import { hasErrnoCode, isPermissionError, isUnreadableDirectoryError } from '../../../src/utils/errors';

const errorWithCode = (code: string): NodeJS.ErrnoException =>
  Object.assign(new Error(code), { code });

describe('hasErrnoCode', () => {
  it('should return true when the error carries one of the given codes', () => {
    expect(hasErrnoCode(errorWithCode('EMFILE'), ['EMFILE', 'EACCES'])).toBe(true);
  });

  it('should return false for a different code', () => {
    expect(hasErrnoCode(errorWithCode('EMFILE'), ['EACCES'])).toBe(false);
  });

  it('should return false for an error without a code', () => {
    expect(hasErrnoCode(new Error('boom'), ['EACCES'])).toBe(false);
  });

  it('should return false when the code property is undefined', () => {
    expect(hasErrnoCode(Object.assign(new Error('boom'), { code: undefined }), ['EACCES'])).toBe(false);
  });

  it('should return false for non-error values', () => {
    expect(hasErrnoCode(null, ['EACCES'])).toBe(false);
    expect(hasErrnoCode('EACCES', ['EACCES'])).toBe(false);
  });
});

describe('isPermissionError', () => {
  it.each(['EACCES', 'EPERM'])('should return true for %s', (code) => {
    expect(isPermissionError(errorWithCode(code))).toBe(true);
  });

  it.each(['ENOENT', 'ENOTDIR', 'EMFILE'])('should return false for %s', (code) => {
    expect(isPermissionError(errorWithCode(code))).toBe(false);
  });
});

describe('isUnreadableDirectoryError', () => {
  it.each(['EACCES', 'EPERM', 'ENOENT', 'ENOTDIR'])('should return true for %s', (code) => {
    expect(isUnreadableDirectoryError(errorWithCode(code))).toBe(true);
  });

  it('should return false for an unrelated code', () => {
    expect(isUnreadableDirectoryError(errorWithCode('EMFILE'))).toBe(false);
  });
});
