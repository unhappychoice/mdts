import { renderHook } from '@testing-library/react';
import { useFrontmatter } from '../../../src/hooks/useFrontmatter';

describe('useFrontmatter', () => {
  test('should return empty frontmatter and content for null input', () => {
    const { result } = renderHook(() => useFrontmatter(null));
    expect(result.current.frontmatter).toEqual({});
    expect(result.current.markdownContent).toBe('');
  });

  test('should return empty frontmatter and original content for empty string input', () => {
    const { result } = renderHook(() => useFrontmatter(''));
    expect(result.current.frontmatter).toEqual({});
    expect(result.current.markdownContent).toBe('');
  });

  test('should parse frontmatter and markdown content correctly', () => {
    const content = '---\ntitle: Test Title\nauthor: Test Author\n---\n# Markdown Content';
    const { result } = renderHook(() => useFrontmatter(content));
    expect(result.current.frontmatter).toEqual({ title: 'Test Title', author: 'Test Author' });
    expect(result.current.markdownContent).toBe('# Markdown Content');
  });

  test('should handle content without frontmatter', () => {
    const content = '# Just Markdown Content';
    const { result } = renderHook(() => useFrontmatter(content));
    expect(result.current.frontmatter).toEqual({});
    expect(result.current.markdownContent).toBe('# Just Markdown Content');
  });

  test('should handle malformed frontmatter by treating it as markdown', () => {
    const content = '---\nmalformed: [unclosed_array\n# Markdown Content';
    const { result } = renderHook(() => useFrontmatter(content));
    expect(result.current.frontmatter).toEqual({});
    expect(result.current.markdownContent).toBe(content);
  });

  test('should handle complex frontmatter types', () => {
    const content = '---\ntags:\n  - tag1\n  - tag2\nnumbers: [1, 2, 3]\n---\nMarkdown';
    const { result } = renderHook(() => useFrontmatter(content));
    expect(result.current.frontmatter).toEqual({ tags: ['tag1', 'tag2'], numbers: [1, 2, 3] });
    expect(result.current.markdownContent).toBe('Markdown');
  });

  test('should calculate correct lineOffset when there is a blank line after frontmatter', () => {
    // Line 1: ---
    // Line 2: title: Test
    // Line 3: ---
    // Line 4: (empty)
    // Line 5: # Header
    const content = '---\ntitle: Test\n---\n\n# Header';
    const { result } = renderHook(() => useFrontmatter(content));
    
    // gray-matter should return mdContent starting with the newline at line 4
    // So lines 1-3 are removed. lineOffset should be 3.
    expect(result.current.lineOffset).toBe(3);
    expect(result.current.markdownContent).toBe('\n# Header');
  });
});
