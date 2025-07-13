import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import MarkdownIt from 'markdown-it';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type FileTreeItem = string | { [key: string]: FileTree };
type FileTree = FileTreeItem[];

interface OutlineItem {
  level: number;
  content: string;
  id: string;
}

const md = new MarkdownIt();

export const serve = (directory: string, port: number) => {
  const app = express();

  app.use(express.static(path.join(__dirname, '../public')));
  app.use(express.static(path.join(__dirname, '../dist/frontend')));

  app.get('/filetree', (req, res) => {
    res.json(getFileTree(directory, '')); // Pass empty string as initial relative path
  });

  app.get('/outline', (req, res) => {
    const filePath = req.query.filePath as string;
    if (!filePath) {
      return res.status(400).send('filePath query parameter is required.');
    }
    try {
      const absolutePath = path.join(directory, filePath);
      const outline = getMarkdownOutline(absolutePath);
      res.json(outline);
    } catch (error) {
      console.error(`Error getting outline for ${filePath}:`, error);
      res.status(500).send('Error getting outline.');
    }
  });

  app.use('/content', express.static(directory));

  // Catch-all route to serve index.html for any other requests
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  app.listen(port, () => {
    console.log(`🚀 Server listening at http://localhost:${port}`);
  });
}

const isDotFileOrDirectory = (entryName: string): boolean => {
  return entryName.startsWith('.');
};

const isLibraryDirectory = (entryName: string): boolean => {
  const libraryDirs = ['node_modules', 'vendor', 'bundle', 'venv', 'env', 'site-packages'];
  return libraryDirs.includes(entryName);
};

const getFileTree = (baseDirectory: string, currentRelativePath: string): FileTree => {
  const entries = fs.readdirSync(path.join(baseDirectory, currentRelativePath), { withFileTypes: true })
    .filter(entry => !isDotFileOrDirectory(entry.name) && !isLibraryDirectory(entry.name));

  const tree: FileTree = [];

  for (const entry of entries) {
    const entryPath = path.join(currentRelativePath, entry.name);
    if (entry.isDirectory()) {
      const subTree = getFileTree(baseDirectory, entryPath);
      if (subTree.length > 0) { // Only include directory if it contains markdown files
        tree.push({ [entry.name]: subTree });
      }
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.markdown')) {
      tree.push(entryPath);
    }
  }
  return tree;
};

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
