import { resolveGlobPatterns } from '../../../src/utils/glob';

jest.mock('glob', () => ({
  globSync: jest.fn((pattern: string) => {
    const mockResults: Record<string, string[]> = {
      'docs/*.md': ['docs/guide.md', 'docs/api.md'],
      '**/*.md': ['docs/guide.md', 'docs/api.md', 'src/readme.txt'],
      'notes/*.markdown': ['notes/todo.markdown'],
      'empty/*.md': [],
      'overlap/*.md': ['overlap/a.md', 'overlap/b.md'],
      'overlap/a.md': ['overlap/a.md'],
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

  it('should deduplicate files matched by overlapping patterns', () => {
    const result = resolveGlobPatterns('/mock/project', ['overlap/*.md', 'overlap/a.md']);
    expect(result.filePatterns).toEqual(['overlap/a.md', 'overlap/b.md']);
  });

  it('should include globPatterns in the returned context', () => {
    const result = resolveGlobPatterns('/mock/project', ['docs/*.md']);
    expect(result.globPatterns).toEqual(['docs/*.md']);
  });
});
