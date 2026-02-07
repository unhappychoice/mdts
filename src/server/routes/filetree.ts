import { Router } from 'express';
import fs, { Dirent } from 'fs';
import path from 'path';
import simpleGit, { SimpleGit, StatusResult, FileStatusResult } from 'simple-git';
import { EXCLUDED_DIRECTORIES } from '../../constants';
import { ServerContext } from '../context';

type FileTreeItem = { path: string, status: string, isDirectory?: boolean } | { [key: string]: FileTree };
type FileTree = FileTreeItem[];

export const fileTreeRouter = (context: ServerContext): Router => {
  const { directory } = context;
  const router = Router();
  const git: SimpleGit = simpleGit({ baseDir: directory });

  router.get('/', async (req, res) => {
    const isRepo = await git.checkIsRepo();
    const gitStatus = isRepo ? await git.status() : null;
    const fileTree = context.filePatterns
      ? buildFileTreeFromPatterns(context.filePatterns, gitStatus)
      : await getFileTree(directory, '', gitStatus);
    res.json({ fileTree, mountedDirectoryPath: directory });
  });

  return router;
};

const isDotFileOrDirectory = (entryName: string): boolean => {
  return entryName.startsWith('.');
};

const shouldIncludeEntry = (entry: Dirent): boolean => {
  return !isDotFileOrDirectory(entry.name) && !EXCLUDED_DIRECTORIES.includes(entry.name);
};

const buildFileTreeFromPatterns = (
  filePatterns: string[],
  gitStatus: StatusResult | null,
): FileTree => {
  const root: FileTree = [];
  const dirMap = new Map<string, FileTree>();
  dirMap.set('', root);

  const getOrCreateDir = (dirPath: string): FileTree => {
    if (dirMap.has(dirPath)) return dirMap.get(dirPath)!;

    const parentPath = path.dirname(dirPath);
    const dirName = path.basename(dirPath);
    const parentTree = parentPath === '.' ? root : getOrCreateDir(parentPath);

    const existing = parentTree.find(
      (item): item is { [key: string]: FileTree } =>
        typeof item === 'object' && !('path' in item) && dirName in item,
    );

    if (existing) {
      dirMap.set(dirPath, existing[dirName]);
      return existing[dirName];
    }

    const newTree: FileTree = [];
    parentTree.push({ [dirName]: newTree });
    dirMap.set(dirPath, newTree);
    return newTree;
  };

  const sorted = [...filePatterns].sort();
  sorted.forEach(filePath => {
    const dirPath = path.dirname(filePath);
    const targetTree = dirPath === '.' ? root : getOrCreateDir(dirPath);
    const status = getGitStatus(filePath, gitStatus);
    targetTree.push({ path: filePath, status });
  });

  return root;
};

const getGitStatus = (filePath: string, gitStatus: StatusResult | null): string => {
  if (!gitStatus) return ' ';
  const fileStatus = gitStatus.files.find((f: FileStatusResult) => f.path === filePath);
  if (!fileStatus) return ' ';
  return fileStatus.index !== ' ' ? fileStatus.index : fileStatus.working_dir;
};

const getFileTree = async (
  baseDirectory: string,
  currentRelativePath: string,
  gitStatus: StatusResult | null
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
      const status = getGitStatus(entryPath, gitStatus);
      tree.push({ path: entryPath, status });
    }
  }
  return tree;
};

