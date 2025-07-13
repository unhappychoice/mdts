import express from 'express';
import fs from 'fs';
import path from 'path';

type FileTreeItem = string | { [key: string]: FileTree };
type FileTree = FileTreeItem[];

export const serve = (directory: string, port: number) => {
  const app = express();

  app.use(express.static('public'));
  app.use('/content', express.static(directory));

  app.get('/filetree', (req, res) => {
    res.json(getFileTree(directory));
  });

  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}

const getFileTree = (directory: string): FileTree =>
  fs.readdirSync(directory, { withFileTypes: true })
    .map((entry) => {
      const resolved = path.resolve(directory, entry.name);
      return entry.isDirectory() ? { [entry.name]: getFileTree(resolved) } : entry.name;
    });
