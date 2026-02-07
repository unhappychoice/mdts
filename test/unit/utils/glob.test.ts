import { resolveGlobPatterns } from '../../../src/utils/glob';

jest.mock('fs', () => ({
  existsSync: jest.fn((filePath: string) => {
    const existingPaths = [
      '/mock/project/docs/guide.md',
      '/mock/project/docs/api.md',
      '/mock/project/notes/todo.markdown',
    ];
    return existingPaths.includes(filePath);
  }),
}));

jest.mock('glob', () => ({
  globSync: jest.fn((pattern: string) => {
    const mockResults: Record<string, string[]> = {
      'docs/*.md': ['docs/guide.md', 'docs/api.md'],
      '**/*.md': ['docs/guide.md', 'docs/api.md', 'src/readme.txt'],
      'notes/*.markdown': ['notes/todo.markdown'],
      'empty/*.md': [],
    };
    return mockResults[pattern] || [];
  }),
}));

describe('resolveGlobPatterns', () => {
  it('should resolve a single glob pattern to matching markdown files', () => {
    const result = resolveGlobPatterns('/mock/project', ['docs/*.md']);
    expect(result.directory).toBe('/mock/project');
    expect(result.filePatterns).toEqual(['docs/guide.md', 'docs/api.md']);
  });

  it('should filter out non-markdown files from glob results', () => {
    const result = resolveGlobPatterns('/mock/project', ['**/*.md']);
    expect(result.filePatterns).toEqual(['docs/guide.md', 'docs/api.md']);
  });

  it('should support .markdown extension', () => {
    const result = resolveGlobPatterns('/mock/project', ['notes/*.markdown']);
    expect(result.filePatterns).toEqual(['notes/todo.markdown']);
  });

  it('should merge results from multiple patterns', () => {
    const result = resolveGlobPatterns('/mock/project', ['docs/*.md', 'notes/*.markdown']);
    expect(result.directory).toBe('/mock/project');
    expect(result.filePatterns).toEqual(['docs/guide.md', 'docs/api.md', 'notes/todo.markdown']);
  });

  it('should return empty filePatterns when no files match', () => {
    const result = resolveGlobPatterns('/mock/project', ['empty/*.md']);
    expect(result.directory).toBe('/mock/project');
    expect(result.filePatterns).toEqual([]);
  });

  it('should filter out files that do not exist on disk', () => {
    const glob = jest.requireMock('glob');
    (glob.globSync as jest.Mock).mockReturnValueOnce(['docs/missing.md']);

    const result = resolveGlobPatterns('/mock/project', ['docs/missing.md']);
    expect(result.filePatterns).toEqual([]);
  });
});
