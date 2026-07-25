const PERMISSION_ERROR_CODES = ['EACCES', 'EPERM'];

// ENOENT/ENOTDIR cover races where the entry vanishes or isn't a directory anymore.
const UNREADABLE_DIRECTORY_ERROR_CODES = [...PERMISSION_ERROR_CODES, 'ENOENT', 'ENOTDIR'];

export const hasErrnoCode = (error: unknown, codes: string[]): boolean => {
  return typeof error === 'object'
    && error !== null
    && 'code' in error
    && codes.includes((error as NodeJS.ErrnoException).code ?? '');
};

// A permission error on a single path is non-fatal: chokidar keeps watching
// everything else, so we just skip that path instead of tearing down the watcher.
export const isPermissionError = (error: unknown): boolean =>
  hasErrnoCode(error, PERMISSION_ERROR_CODES);

// Errors that mean "this directory can't be enumerated" - skip it and keep going
// rather than failing the whole file tree.
export const isUnreadableDirectoryError = (error: unknown): boolean =>
  hasErrnoCode(error, UNREADABLE_DIRECTORY_ERROR_CODES);
