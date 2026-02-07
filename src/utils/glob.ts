import { existsSync } from 'fs';
import { globSync } from 'glob';
import path from 'path';
import { ServerContext } from '../server/context';

export const resolveGlobPatterns = (directory: string, patterns: string[]): ServerContext => {
  const resolvedFiles = patterns.flatMap(pattern => globSync(pattern, { cwd: directory }));

  const filePatterns = resolvedFiles
    .filter(f => f.endsWith('.md') || f.endsWith('.markdown'))
    .filter(f => existsSync(path.join(directory, f)));

  return { directory, filePatterns };
};
