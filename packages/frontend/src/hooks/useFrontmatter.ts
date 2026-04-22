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
      
      // Calculate how many lines of frontmatter were removed by locating the closing '---' delimiter.
      let linesBefore = 0;
      if (content.trimStart().startsWith('---')) {
        const lines = content.split('\n');
        let delimiterCount = 0;
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim() === '---') {
            delimiterCount++;
            if (delimiterCount === 2) {
              linesBefore = i + 1;
              break;
            }
          }
        }
      }
      
      return { frontmatter: data, markdownContent: mdContent, lineOffset: linesBefore };
    } catch (e) {
      console.error(e);
      // If parsing fails, treat the whole content as markdown
      return { frontmatter: {}, markdownContent: content, lineOffset: 0 };
    }
  }, [content]);

  return result;
};
