import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type FileTreeItem = string | { [key: string]: FileTree };
type FileTree = FileTreeItem[];

export const serve = (directory: string, port: number) => {
  const app = express();

  app.use(express.static(path.join(__dirname, '../public')));
  app.use(express.static(path.join(__dirname, '../dist/frontend')));

  app.get('/filetree', (req, res) => {
    res.json(getFileTree(directory, '')); // Pass empty string as initial relative path
  });

  app.use('/content', express.static(directory));

  // Catch-all route to serve index.html for any other requests
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
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
