import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import simpleGit, { SimpleGit } from 'simple-git';

type FileTreeItem = { path: string, status: string, isDirectory?: boolean } | { [key: string]: FileTree };
type FileTree = FileTreeItem[];

export const fileTreeRouter = (directory: string): Router => {
  const router = Router();
  const git: SimpleGit = simpleGit({ baseDir: directory })

  router.get('/', async (req, res) => {
    const gitStatus = await git.status();
    const fileTree = await getFileTree(directory, '', gitStatus);
    res.json({ fileTree, mountedDirectoryPath: directory });
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

const getFileTree = async (baseDirectory: string, currentRelativePath: string, gitStatus: any): Promise<FileTree> => {
  const entries = fs.readdirSync(path.join(baseDirectory, currentRelativePath), { withFileTypes: true })
    .filter(entry => !isDotFileOrDirectory(entry.name) && !isLibraryDirectory(entry.name));

  const tree: FileTree = [];

  for (const entry of entries) {
    const entryPath = path.join(currentRelativePath, entry.name);
    if (entry.isDirectory()) {
      const subTree = await getFileTree(baseDirectory, entryPath, gitStatus);
      if (subTree.length > 0) {
        tree.push({ [entry.name]: subTree });
      }
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.markdown')) {
      const fileStatus = gitStatus.files.find((f: any) => f.path === entryPath);
      let status = ' ';
      if (fileStatus) {
        status = fileStatus.index !== ' ' ? fileStatus.index : fileStatus.working_dir;
      }
      tree.push({ path: entryPath, status });
    }
  }
  return tree;
};
