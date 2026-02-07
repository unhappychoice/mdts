import { resolveArguments } from '../../../src/utils/glob';
import path from 'path';

const cwd = process.cwd();

// Mock fs
jest.mock('fs', () => ({
  existsSync: jest.fn((filePath: string) => {
    const existingPaths = [
      '/mock/project/docs/guide.md',
      '/mock/project/docs/api.md',
      path.resolve(process.cwd(), '.'),
      path.resolve(process.cwd(), './my-dir'),
      path.join(process.cwd(), 'README.md'),
    ];
    return existingPaths.includes(filePath);
  }),
  statSync: jest.fn((filePath: string) => ({
    isDirectory: () => !filePath.endsWith('.md') && !filePath.endsWith('.markdown'),
  })),
}));

// Mock glob
jest.mock('glob', () => ({
  globSync: jest.fn((pattern: string) => {
    const mockResults: Record<string, string[]> = {
      [path.join(process.cwd(), 'docs', '*.md')]: [
        '/mock/project/docs/guide.md',
        '/mock/project/docs/api.md',
      ],
    };
    return mockResults[pattern] || [];
  }),
  hasMagic: jest.fn((pattern: string) => pattern.includes('*') || pattern.includes('?') || pattern.includes('{')),
}));

describe('resolveArguments', () => {
  it('should return cwd as directory when no arguments are provided', () => {
    const result = resolveArguments([]);
    expect(result).toEqual({ directory: path.resolve(cwd, '.') });
    expect(result.filePatterns).toBeUndefined();
  });

  it('should return directory mode for a single directory argument', () => {
    const result = resolveArguments(['.']);
    expect(result).toEqual({ directory: path.resolve(cwd, '.') });
    expect(result.filePatterns).toBeUndefined();
  });

  it('should return directory mode for a single directory path', () => {
    const result = resolveArguments(['./my-dir']);
    expect(result).toEqual({ directory: path.resolve(cwd, './my-dir') });
    expect(result.filePatterns).toBeUndefined();
  });

  it('should resolve glob patterns and return file patterns', () => {
    const result = resolveArguments(['./docs/*.md']);
    expect(result.filePatterns).toBeDefined();
    expect(result.filePatterns!.length).toBe(2);
    expect(result.directory).toBe('/mock/project/docs');
  });

  it('should resolve multiple arguments including globs and files', () => {
    const result = resolveArguments(['./docs/*.md', './README.md']);
    expect(result.filePatterns).toBeDefined();
    expect(result.filePatterns!.length).toBe(3);
  });

  it('should return default directory when no markdown files match', () => {
    const glob = jest.requireMock('glob');
    (glob.globSync as jest.Mock).mockReturnValueOnce([]);

    const result = resolveArguments(['./nonexistent/*.md']);
    expect(result).toEqual({ directory: path.resolve(cwd, '.') });
    expect(result.filePatterns).toBeUndefined();
  });
});
