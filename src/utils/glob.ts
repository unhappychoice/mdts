import { existsSync, statSync } from 'fs';
import { globSync, hasMagic } from 'glob';
import path from 'path';
import { ServerContext } from '../server/context';

const isGlobPattern = (pattern: string): boolean => hasMagic(pattern);

const isDirectory = (filePath: string): boolean => {
  try {
    return existsSync(filePath) && statSync(filePath).isDirectory();
  } catch {
    return false;
  }
};

const findCommonParent = (filePaths: string[]): string => {
  if (filePaths.length === 0) return process.cwd();
  if (filePaths.length === 1) return path.dirname(filePaths[0]);

  const segments = filePaths.map(f => path.dirname(f).split(path.sep));
  const minLength = Math.min(...segments.map(s => s.length));

  const commonParts: string[] = [];
  for (let i = 0; i < minLength; i++) {
    const segment = segments[0][i];
    if (segments.every(s => s[i] === segment)) {
      commonParts.push(segment);
    } else {
      break;
    }
  }

  return commonParts.length > 0 ? commonParts.join(path.sep) : path.sep;
};

export const resolveArguments = (args: string[]): ServerContext => {
  if (args.length === 0) {
    return { directory: path.resolve(process.cwd(), '.') };
  }

  if (args.length === 1 && !isGlobPattern(args[0]) && isDirectory(path.resolve(process.cwd(), args[0]))) {
    return { directory: path.resolve(process.cwd(), args[0]) };
  }

  const resolvedFiles = args.flatMap(pattern => {
    const absolutePattern = path.isAbsolute(pattern) ? pattern : path.join(process.cwd(), pattern);
    return isGlobPattern(absolutePattern)
      ? globSync(absolutePattern)
      : [absolutePattern];
  });

  const markdownFiles = resolvedFiles
    .filter(f => f.endsWith('.md') || f.endsWith('.markdown'))
    .filter(f => existsSync(f));

  if (markdownFiles.length === 0) {
    return { directory: path.resolve(process.cwd(), '.') };
  }

  const directory = findCommonParent(markdownFiles);
  const filePatterns = markdownFiles.map(f => path.relative(directory, f));

  return { directory, filePatterns };
};
