import { Router } from 'express';
import fs, { Dirent } from 'fs';
import path from 'path';
import simpleGit, { SimpleGit, StatusResult, FileStatusResult } from 'simple-git';

type FileTreeItem = { path: string, status: string, isDirectory?: boolean } | { [key: string]: FileTree };
type FileTree = FileTreeItem[];

export const fileTreeRouter = (directory: string): Router => {
  const router = Router();
  const git: SimpleGit = simpleGit({ baseDir: directory });

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

const shouldIncludeEntry = (entry: Dirent): boolean => {
  return !isDotFileOrDirectory(entry.name) && !isLibraryDirectory(entry.name);
};

const getFileTree = async (
  baseDirectory: string,
  currentRelativePath: string,
  gitStatus: StatusResult
): Promise<FileTree> => {
  const fullPath = path.join(baseDirectory, currentRelativePath);
  const entriesInDir = fs.readdirSync(
    fullPath,
    { withFileTypes: true }
  );
  const entries = entriesInDir.filter(shouldIncludeEntry);

  const tree: FileTree = [];

  for (const entry of entries) {
    const entryPath = path.join(currentRelativePath, entry.name);
    if (entry.isDirectory()) {
      const subTree = await getFileTree(baseDirectory, entryPath, gitStatus);
      if (subTree.length > 0) {
        tree.push({ [entry.name]: subTree });
      }
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.markdown')) {
      const fileStatus = gitStatus.files.find((f: FileStatusResult) => f.path === entryPath);
      let status = ' ';
      if (fileStatus) {
        status = fileStatus.index !== ' ' ? fileStatus.index : fileStatus.working_dir;
      }
      tree.push({ path: entryPath, status });
    }
  }
  return tree;
};
