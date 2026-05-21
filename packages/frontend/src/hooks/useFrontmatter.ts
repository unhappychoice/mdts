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
      // We find the index of the markdown content in the original string
      // and count the number of newlines before it.
      const index = content.indexOf(mdContent);
      const linesBefore = index !== -1 ? content.substring(0, index).split('\n').length - 1 : 0;
      
      return { frontmatter: data, markdownContent: mdContent, lineOffset: linesBefore };
    } catch (e) {
      console.error(e);
      // If parsing fails, treat the whole content as markdown
      return { frontmatter: {}, markdownContent: content, lineOffset: 0 };
    }
  }, [content]);

  return result;
};
