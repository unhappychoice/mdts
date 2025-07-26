import { Command } from 'commander';
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { serve } from './server/server';
import { logger } from './utils/logger';

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
          .option('-p, --port <port>', 'Port to serve on', String(DEFAULT_PORT))
          .option('-s, --silent', 'Suppress server logs', false)
          .argument('[directory]', 'Directory to serve', DEFAULT_DIRECTORY)
          .action((directory, options) => {
            logger.setSilent(options.silent);

            logger.log('Announcement', '🎉 Thanks for using mdts!');
            logger.log('Announcement', '✨ Like it? Star it on GitHub: https://github.com/unhappychoice/mdts');

            logger.log('CLI', '⚙  Options: ' + JSON.stringify(options));
            const port = parseInt(options.port, 10);
            const absoluteDirectory = path.resolve(process.cwd(), directory);
            serve(absoluteDirectory, port);
            const readmePath = path.join(absoluteDirectory, 'README.md');
            const initialPath = existsSync(readmePath) ? '/README.md' : '';
            logger.log('CLI', `🌐 Opening browser at http://localhost:${port}${initialPath}`);
            open(`http://localhost:${port}${initialPath}`);
          });

        program.parse(process.argv);
      });
  }

  requireOpen(): Promise<(file: string) => void> {
    return import('open').then((module) => module.default);
  }
}
