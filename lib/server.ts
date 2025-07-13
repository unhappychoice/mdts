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

const getFileTree = (baseDirectory: string, currentRelativePath: string): FileTree =>
  fs.readdirSync(path.join(baseDirectory, currentRelativePath), { withFileTypes: true })
    .map((entry) => {
      const entryPath = path.join(currentRelativePath, entry.name);
      return entry.isDirectory()
        ? { [entry.name]: getFileTree(baseDirectory, entryPath) }
        : entryPath; // Return full relative path for files
    });
