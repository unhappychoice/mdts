import { Command } from 'commander';
import { existsSync } from 'fs';
import path from 'path';
import { serve } from './server/server';

const DEFAULT_PORT = 8521;
const DEFAULT_DIRECTORY = '.';

export class CLI {
  run() {
    return this.requireOpen()
      .then(open => {
        const program = new Command();

        program
          .option('-p, --port <port>', 'Port to serve on', String(DEFAULT_PORT))
          .argument('[directory]', 'Directory to serve', DEFAULT_DIRECTORY)
          .action((directory, options) => {
            const port = parseInt(options.port, 10);
            serve(directory, port);
            const readmePath = path.join(directory, 'README.md');
            const initialPath = existsSync(readmePath) ? '/README.md' : '';
            open(`http://localhost:${port}${initialPath}`);
          });

        program.parse(process.argv);
      });
  }

  requireOpen() {
    return import('open').then(module => module.default);
  }
}
