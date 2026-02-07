import { globSync } from 'glob';
import { ServerContext } from '../server/context';

export const resolveGlobPatterns = (directory: string, patterns: string[]): ServerContext => {
  const resolvedFiles = patterns.flatMap(pattern => globSync(pattern, { cwd: directory }));

  const filePatterns = [...new Set(
    resolvedFiles.filter(f => f.endsWith('.md') || f.endsWith('.markdown')),
  )];

  return { directory, globPatterns: patterns, filePatterns };
};
