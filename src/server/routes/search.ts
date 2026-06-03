import { Router } from 'express';
import fs, { Dirent } from 'fs';
import path from 'path';
import { EXCLUDED_DIRECTORIES } from '../../constants';
import { resolveGlobPatterns } from '../../utils/glob';
import { ServerContext } from '../context';

type SearchResult = {
  path: string;
  line: number;
  preview: string;
};

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;
const MAX_PREVIEW_LENGTH = 240;

const toPosixPath = (filePath: string): string => filePath.replace(/\\/g, '/').split(path.sep).join('/');

const isMarkdownFile = (filePath: string): boolean => {
  const lowerPath = filePath.toLowerCase();
  return lowerPath.endsWith('.md') || lowerPath.endsWith('.markdown');
};

const shouldIncludeEntry = (entry: Dirent): boolean => {
  return !entry.name.startsWith('.') && !EXCLUDED_DIRECTORIES.includes(entry.name);
};

const collectMarkdownFiles = (baseDirectory: string, currentRelativePath: string = ''): string[] => {
  const fullPath = path.join(baseDirectory, currentRelativePath);
  let entries: Dirent[];

  try {
    entries = fs.readdirSync(fullPath, { withFileTypes: true });
  } catch {
    return [];
  }

  return entries.filter(shouldIncludeEntry).flatMap(entry => {
    const entryPath = path.join(currentRelativePath, entry.name);
    if (entry.isDirectory()) {
      return collectMarkdownFiles(baseDirectory, entryPath);
    }
    return isMarkdownFile(entry.name) ? [toPosixPath(entryPath)] : [];
  });
};

const getSearchableFiles = (context: ServerContext): string[] => {
  if (context.filePatterns) {
    return context.filePatterns.filter(isMarkdownFile).map(toPosixPath).sort();
  }

  if (context.globPatterns) {
    return (resolveGlobPatterns(context.directory, context.globPatterns).filePatterns || [])
      .filter(isMarkdownFile)
      .map(toPosixPath)
      .sort();
  }

  return collectMarkdownFiles(context.directory).sort();
};

const parseLimit = (value: unknown): number => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return DEFAULT_LIMIT;
  return Math.min(parsed, MAX_LIMIT);
};

const findMatchesInFile = (
  directory: string,
  filePath: string,
  query: string,
  remainingLimit: number,
): SearchResult[] => {
  let content: string;

  try {
    content = fs.readFileSync(path.join(directory, filePath), 'utf8');
  } catch {
    return [];
  }

  const lowerQuery = query.toLowerCase();
  const matches: SearchResult[] = [];

  content.split(/\r?\n/).some((line, index) => {
    if (line.toLowerCase().includes(lowerQuery)) {
      matches.push({
        path: filePath,
        line: index + 1,
        preview: line.trim().slice(0, MAX_PREVIEW_LENGTH),
      });
    }
    return matches.length >= remainingLimit;
  });

  return matches;
};

export const searchRouter = (context: ServerContext): Router => {
  const router = Router();

  router.get('/', (req, res) => {
    const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    if (!query) {
      return res.json({ results: [] });
    }

    const limit = parseLimit(req.query.limit);
    const results: SearchResult[] = [];

    for (const filePath of getSearchableFiles(context)) {
      const remainingLimit = limit - results.length;
      if (remainingLimit <= 0) break;
      results.push(...findMatchesInFile(context.directory, filePath, query, remainingLimit));
    }

    res.json({ results });
  });

  return router;
};
