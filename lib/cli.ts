import { serve } from './server/server.js';
import open from 'open';
import { Command } from 'commander';

const DEFAULT_PORT = 8521;
const DEFAULT_DIRECTORY = '.';

export const cli = () => {
  const program = new Command();

  program
    .option('-p, --port <port>', 'Port to serve on', String(DEFAULT_PORT))
    .argument('[directory]', 'Directory to serve', DEFAULT_DIRECTORY)
    .action((directory, options) => {
      const port = parseInt(options.port, 10);
      serve(directory, port);
      open(`http://localhost:${port}`);
    });

  program.parse(process.argv);
};
