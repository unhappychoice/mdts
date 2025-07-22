import matter from 'gray-matter';
import { useMemo } from 'react';

interface FrontmatterResult {
  frontmatter: { [key: string]: unknown };
  markdownContent: string;
}

export const useFrontmatter = (content: string | null): FrontmatterResult => {
  const { data: frontmatter, content: markdownContent } = useMemo(() => {
    if (!content) {
      return { data: {}, content: '' };
    }
    try {
      const { data, content: mdContent } = matter(content);
      return { data, content: mdContent };
    } catch (e) {
      console.error(e);
      // If parsing fails, treat the whole content as markdown
      return { data: {}, content: content };
    }
  }, [content]);

  return { frontmatter, markdownContent };
};
