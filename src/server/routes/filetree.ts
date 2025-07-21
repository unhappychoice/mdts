import { Router } from 'express';
import fs from 'fs';
import path from 'path';

type FileTreeItem = string | { [key: string]: FileTree };
type FileTree = FileTreeItem[];

export const fileTreeRouter = (directory: string): Router => {
  const router = Router();

  router.get('/', (req, res) => {
    res.json({ fileTree: getFileTree(directory, ''), mountedDirectoryPath: directory });
  });

  return router;
};

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
