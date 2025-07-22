import { render } from '@testing-library/react';
import { useFrontmatter } from '../../../src/hooks/useFrontmatter';
import React from 'react';

describe('useFrontmatter', () => {
  interface TestComponentProps {
    content: string | null;
    setResult: (result: any) => void;
  }
  const TestComponent = ({ content, setResult }: TestComponentProps) => {
    const hookResult = useFrontmatter(content);
    React.useEffect(() => {
      setResult(hookResult);
    }, [hookResult, setResult]);
    return null;
  };

  test('should return empty frontmatter and content for null input', () => {
    let hookResult: any;
    render(<TestComponent content={null} setResult={(result: any) => (hookResult = result)} />);
    expect(hookResult.frontmatter).toEqual({});
    expect(hookResult.markdownContent).toBe('');
  });

  test('should return empty frontmatter and original content for empty string input', () => {
    let hookResult: any;
    render(<TestComponent content="" setResult={(result) => (hookResult = result)} />);
    expect(hookResult.frontmatter).toEqual({});
    expect(hookResult.markdownContent).toBe('');
  });

  test('should parse frontmatter and markdown content correctly', () => {
    const content = '---\ntitle: Test Title\nauthor: Test Author\n---\n# Markdown Content';
    let hookResult: any;
    render(<TestComponent content={content} setResult={(result) => (hookResult = result)} />);
    expect(hookResult.frontmatter).toEqual({ title: 'Test Title', author: 'Test Author' });
    expect(hookResult.markdownContent).toBe('# Markdown Content');
  });

  test('should handle content without frontmatter', () => {
    const content = '# Just Markdown Content';
    let hookResult: any;
    render(<TestComponent content={content} setResult={(result) => (hookResult = result)} />);
    expect(hookResult.frontmatter).toEqual({});
    expect(hookResult.markdownContent).toBe('# Just Markdown Content');
  });

  test('should handle malformed frontmatter by treating it as markdown', () => {
    const content = '---\nmalformed: [unclosed_array\n# Markdown Content';
    let hookResult: any;
    render(<TestComponent content={content} setResult={(result) => (hookResult = result)} />);
    expect(hookResult.frontmatter).toEqual({});
    expect(hookResult.markdownContent).toBe(content);
  });

  test('should handle complex frontmatter types', () => {
    const content = '---\ntags:\n  - tag1\n  - tag2\nnumbers: [1, 2, 3]\n---\nMarkdown';
    let hookResult: any;
    render(<TestComponent content={content} setResult={(result) => (hookResult = result)} />);
    expect(hookResult.frontmatter).toEqual({ tags: ['tag1', 'tag2'], numbers: [1, 2, 3] });
    expect(hookResult.markdownContent).toBe('Markdown');
  });
});
