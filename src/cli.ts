import { Command } from 'commander';
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { serve } from './server/server';
import { logger } from './utils/logger';
import { resolveGlobPatterns } from './utils/glob';

const DEFAULT_PORT = 8521;
const DEFAULT_DIRECTORY = '.';

export class CLI {
  run(): Promise<void> {
    return this.requireOpen()
      .then((open) => {
        const program = new Command();

        const packageJsonPath = path.join(__dirname, '..', 'package.json');
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

        program
          .version(packageJson.version)
          .description('A zero-config CLI tool to preview local Markdown files in a browser')
          .option('-H, --host <host>', 'host to listen on', 'localhost')
          .option('-p, --port <port>', 'port to serve on', String(DEFAULT_PORT))
          .option('-s, --silent', 'suppress server logs', false)
          .option('--no-open', 'do not open the browser automatically')
          .option('-g, --glob <patterns...>', 'glob patterns to filter markdown files (e.g. "docs/*.md")')
          .argument('[directory]', 'directory to serve', DEFAULT_DIRECTORY)
          .action((directory, options) => {
            logger.setSilent(options.silent);

            logger.showLogo();
            logger.log('Announcement', '🎉 Thanks for using mdts!');
            logger.log('Announcement', '✨ Like it? Star it on GitHub: https://github.com/unhappychoice/mdts');

            logger.log('CLI', '⚙  Options: ' + JSON.stringify(options));
            const port = parseInt(options.port, 10);
            const host = options.host;
            const absoluteDirectory = path.resolve(process.cwd(), directory);
            const context = options.glob
              ? resolveGlobPatterns(absoluteDirectory, options.glob)
              : { directory: absoluteDirectory };
            serve(context, port, host);
            const readmePath = path.join(context.directory, 'README.md');
            const initialPath = existsSync(readmePath) ? '/README.md' : '';
            const displayHost = (host === '0.0.0.0' || host === '::') ? 'localhost' : host;
            if (options.open) {
              logger.log('CLI', `🌐 Opening browser at http://${displayHost}:${port}${initialPath}`);
              open(`http://${displayHost}:${port}${initialPath}`);
            } else {
              logger.log('CLI', `🌐 Server running at http://${displayHost}:${port}${initialPath}`);
            }
          });

        program.parse(process.argv);
      });
  }

  requireOpen(): Promise<(file: string) => void> {
    return import('open').then((module) => module.default);
  }
}
