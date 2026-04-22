import matter from 'gray-matter';
import { useMemo } from 'react';

interface FrontmatterResult {
  frontmatter: { [key: string]: unknown };
  markdownContent: string;
  lineOffset: number;
}

export const useFrontmatter = (content: string | null): FrontmatterResult => {
  const result = useMemo(() => {
    if (!content) {
      return { frontmatter: {}, markdownContent: '', lineOffset: 0 };
    }
    try {
      const { data, content: mdContent } = matter(content);
      
      // Calculate how many lines of frontmatter were removed
      const offset = content.indexOf(mdContent);
      const linesBefore = content.substring(0, offset).split('\n').length - 1;
      
      return { frontmatter: data, markdownContent: mdContent, lineOffset: linesBefore };
    } catch (e) {
      console.error(e);
      // If parsing fails, treat the whole content as markdown
      return { frontmatter: {}, markdownContent: content, lineOffset: 0 };
    }
  }, [content]);

  return result;
};
