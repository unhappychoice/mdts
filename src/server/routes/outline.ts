import { Router } from 'express';
import fs from 'fs';
import MarkdownIt from 'markdown-it';
import path from 'path';

const md = new MarkdownIt();

interface OutlineItem {
  level: number;
  content: string;
  id: string;
}

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '') // Remove non-alphanumeric, non-space, non-hyphen characters. \p{L} for unicode letters, \p{N} for unicode numbers. 'u' flag for unicode.
    .replace(/\s+/g, '-') // Replace spaces with single hyphen
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens
};

const getMarkdownOutline = (filePath: string): OutlineItem[] => {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const tokens = md.parse(fileContent, {});
  const outline: OutlineItem[] = [];

  for (const token of tokens) {
    if (token.type === 'heading_open') {
      const level = parseInt(token.tag.substring(1));
      const nextToken = tokens[tokens.indexOf(token) + 1];
      if (nextToken && nextToken.type === 'inline') {
        const content = nextToken.content;
        const id = slugify(content);
        outline.push({ level, content, id });
      }
    }
  }

  return outline;
};

export const outlineRouter = (directory: string): Router => {
  const router = Router();

  router.get('/', (req, res) => {
    const filePath = req.query.filePath as string;
    if (!filePath) {
      return res.status(400).send('filePath query parameter is required.');
    }
    try {
      const absolutePath = filePath === 'mdts-welcome-markdown.md'
        ? path.join(__dirname, '../public/welcome.md')
        : path.join(directory, filePath);
      const outline = getMarkdownOutline(absolutePath);
      res.json(outline);
    } catch (error) {
      console.error(`Error getting outline for ${filePath}:`, error);
      res.status(500).send('Error getting outline.');
    }
  });

  return router;
};
