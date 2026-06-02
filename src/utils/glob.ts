import { globSync } from 'glob';
import { ServerContext } from '../server/context';
import { hasSupportedMarkdownExtension } from './markdown';

export const resolveGlobPatterns = (directory: string, patterns: string[]): ServerContext => {
  const resolvedFiles = patterns.flatMap(pattern => globSync(pattern, { cwd: directory, dot: true }));

  const filePatterns = [...new Set(
    resolvedFiles.filter(hasSupportedMarkdownExtension),
  )];

  return { directory, globPatterns: patterns, filePatterns };
};
