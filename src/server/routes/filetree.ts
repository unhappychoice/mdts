import { Router } from 'express';
import fs, { Dirent } from 'fs';
import path from 'path';
import simpleGit, { SimpleGit, StatusResult, FileStatusResult } from 'simple-git';
import { EXCLUDED_DIRECTORIES } from '../../constants';
import { ServerContext } from '../context';
import { resolveGlobPatterns } from '../../utils/glob';
import { hasSupportedMarkdownExtension } from '../../utils/markdown';

type FileTreeItem = { path: string, status: string, isDirectory?: boolean } | { [key: string]: FileTree };
type FileTree = FileTreeItem[];

const toPosixPath = (p: string): string => p.split(path.sep).join('/');

export const fileTreeRouter = (context: ServerContext): Router => {
  const { directory } = context;
  const router = Router();
  const git: SimpleGit = simpleGit({ baseDir: directory });

  router.get('/', async (req, res) => {
    const isRepo = await git.checkIsRepo();
    const gitStatus = isRepo ? await git.status() : null;
    const filePatterns = context.globPatterns
      ? resolveGlobPatterns(directory, context.globPatterns).filePatterns
      : context.filePatterns;
    const fileTree = filePatterns
      ? buildFileTreeFromPatterns(filePatterns, gitStatus)
      : await getFileTree(directory, '', gitStatus);
    res.json({ fileTree, mountedDirectoryPath: directory, isGitRepository: isRepo });
  });

  return router;
};

const isDotFileOrDirectory = (entryName: string): boolean => {
  return entryName.startsWith('.');
};

const shouldIncludeEntry = (entry: Dirent): boolean => {
  if (EXCLUDED_DIRECTORIES.includes(entry.name)) return false;
  if (!isDotFileOrDirectory(entry.name)) return true;
  return entry.isDirectory();
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
    const posixPath = toPosixPath(filePath);
    const status = getGitStatus(posixPath, gitStatus);
    targetTree.push({ path: posixPath, status });
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
    } else if (hasSupportedMarkdownExtension(entry.name)) {
      const posixPath = toPosixPath(entryPath);
      const status = getGitStatus(posixPath, gitStatus);
      tree.push({ path: posixPath, status });
    }
  }
  return tree;
};

