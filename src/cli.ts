import { Command } from 'commander';
import { existsSync } from 'fs';
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

        program
          .option('-p, --port <port>', 'Port to serve on', String(DEFAULT_PORT))
          .argument('[directory]', 'Directory to serve', DEFAULT_DIRECTORY)
          .action((directory, options) => {
            const port = parseInt(options.port, 10);
            const absoluteDirectory = path.resolve(process.cwd(), directory);
            serve(absoluteDirectory, port);
            const readmePath = path.join(absoluteDirectory, 'README.md');
            const initialPath = existsSync(readmePath) ? '/README.md' : '';
            logger.log(`🌐 Opening browser at http://localhost:${port}${initialPath}...`);
            open(`http://localhost:${port}${initialPath}`);
          });

        program.parse(process.argv);
      });
  }

  requireOpen(): Promise<(file: string) => void> {
    return import('open').then((module) => module.default);
  }
}
