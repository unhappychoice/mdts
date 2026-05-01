import { CLI } from '../../src/cli';
import path from 'path';
import { serve } from '../../src/server/server';
import { resolveGlobPatterns } from '../../src/utils/glob';
import { logger } from '../../src/utils/logger';

// Mock fs first, before any other imports that might use it
let mockExistingFiles: string[] = [];
jest.mock('fs', () => ({
  existsSync: jest.fn((p: string) => mockExistingFiles.some((name) => p.endsWith(name))),
  readFileSync: jest.fn(() => JSON.stringify({
    version: '0.0.0-test',
  })),
  statSync: jest.fn(() => ({
    isDirectory: () => true,
  })),
}));

// Helper to set the mock result for existsSync
const setExistsSyncResult = (result: boolean) => {
  mockExistingFiles = result ? ['README.md', 'index.md'] : [];
};
const setExistingFiles = (files: string[]) => {
  mockExistingFiles = files;
};

// Mock the 'open' module
jest.mock('open', () => ({ default: jest.fn(() => Promise.resolve()) }));

// Mock the 'serve' function to prevent actual server startup
jest.mock('../../src/server/server', () => ({
  serve: jest.fn((_context: unknown, port: number) => Promise.resolve({ server: {}, port })),
}));

jest.mock('../../src/utils/logger', () => ({
  logger: {
    setSilent: jest.fn(),
    showLogo: jest.fn(),
    log: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock resolveGlobPatterns
jest.mock('../../src/utils/glob', () => ({
  resolveGlobPatterns: jest.fn((directory: string) => ({
    directory,
    filePatterns: ['docs/guide.md'],
  })),
}));

describe('cli', () => {
  let cli: CLI;
  let originalArgv: string[];
  const mockOpen = jest.fn();
  let mockServe: jest.Mock;
  const mockLogger = logger as jest.Mocked<typeof logger>;

  beforeEach(() => {
    cli = new CLI();
    originalArgv = process.argv;
    mockServe = serve as jest.Mock;
    process.exitCode = undefined;
    // Reset the mock result for existsSync before each test
    setExistingFiles([]); // Default to empty for safety
    jest.clearAllMocks();

    jest.spyOn(cli, 'requireOpen')
      .mockImplementation(() => Promise.resolve(mockOpen));
  });

  afterEach(() => {
    process.argv = originalArgv;
  });

  it('should call open with default port and README.md if it exists', () => {
    setExistsSyncResult(true);
    process.argv = ['node', 'cli.ts', '.'];

    return cli.run()
      .then(() => {
        expect(mockServe).toHaveBeenCalledWith({ directory: path.resolve('.') }, 8521, 'localhost', false);
        expect(mockOpen).toHaveBeenCalledWith('http://localhost:8521/README.md');
      });
  });

  it('should call open with default port and empty path if README.md does not exist', () => {
    setExistsSyncResult(false);
    process.argv = ['node', 'cli.ts', '.'];

    return cli.run()
      .then(() => {
        expect(mockServe).toHaveBeenCalledWith({ directory: path.resolve('.') }, 8521, 'localhost', false);
        expect(mockOpen).toHaveBeenCalledWith('http://localhost:8521');
      });
  });

  it('should fall back to index.md when README.md does not exist', () => {
    setExistingFiles(['index.md']);
    process.argv = ['node', 'cli.ts', '.'];

    return cli.run()
      .then(() => {
        expect(mockOpen).toHaveBeenCalledWith('http://localhost:8521/index.md');
      });
  });

  it('should prefer README.md over index.md when both exist', () => {
    setExistingFiles(['README.md', 'index.md']);
    process.argv = ['node', 'cli.ts', '.'];

    return cli.run()
      .then(() => {
        expect(mockOpen).toHaveBeenCalledWith('http://localhost:8521/README.md');
      });
  });

  it('should call open with specified port', () => {
    setExistsSyncResult(true);
    process.argv = ['node', 'cli.ts', '-p', '9000', '.'];

    return cli.run()
      .then(() => {
        expect(mockServe).toHaveBeenCalledWith({ directory: path.resolve('.') }, 9000, 'localhost', false);
        expect(mockOpen).toHaveBeenCalledWith('http://localhost:9000/README.md');
      });
  });

  it('should call open with specified directory', () => {
    setExistsSyncResult(true);
    process.argv = ['node', 'cli.ts', './my-dir'];

    return cli.run()
      .then(() => {
        expect(mockServe).toHaveBeenCalledWith({ directory: path.resolve('./my-dir') }, 8521, 'localhost', false);
        expect(mockOpen).toHaveBeenCalledWith('http://localhost:8521/README.md');
      });
  });

  it('should call open with specified directory and port', () => {
    setExistsSyncResult(true);
    process.argv = ['node', 'cli.ts', '-p', '9000', './my-dir'];

    return cli.run()
      .then(() => {
        expect(mockServe).toHaveBeenCalledWith({ directory: path.resolve('./my-dir') }, 9000, 'localhost', false);
        expect(mockOpen).toHaveBeenCalledWith('http://localhost:9000/README.md');
      });
  });

  it('should call serve with autoPort=true when --port auto is specified', () => {
    setExistsSyncResult(false);
    process.argv = ['node', 'cli.ts', '-p', 'auto', '.'];

    return cli.run()
      .then(() => {
        expect(mockServe).toHaveBeenCalledWith({ directory: path.resolve('.') }, 8521, 'localhost', true);
      });
  });

  it('should log the server URL without opening the browser when --no-open is specified', () => {
    setExistsSyncResult(false);
    process.argv = ['node', 'cli.ts', '--no-open', '--host', '0.0.0.0', '.'];

    return cli.run()
      .then(() => {
        expect(mockServe).toHaveBeenCalledWith({ directory: path.resolve('.') }, 8521, '0.0.0.0', false);
        expect(mockLogger.log).toHaveBeenCalledWith('CLI', '🌐 Server running at http://localhost:8521');
        expect(mockOpen).not.toHaveBeenCalled();
      });
  });

  it('should log an error and set exitCode when serve fails', () => {
    setExistsSyncResult(false);
    mockServe.mockRejectedValueOnce(new Error('boom'));
    process.argv = ['node', 'cli.ts', '.'];

    return cli.run()
      .then(() => {
        expect(mockLogger.error).toHaveBeenCalledWith('❌ Failed to start server: boom');
        expect(process.exitCode).toBe(1);
        expect(mockOpen).not.toHaveBeenCalled();
      });
  });

  it('should call resolveGlobPatterns when --glob option is provided', () => {
    setExistsSyncResult(false);
    process.argv = ['node', 'cli.ts', './docs', '--glob', '*.md'];

    return cli.run()
      .then(() => {
        expect(resolveGlobPatterns).toHaveBeenCalledWith(path.resolve('./docs'), ['*.md']);
        expect(mockServe).toHaveBeenCalledWith(
          { directory: path.resolve('./docs'), filePatterns: ['docs/guide.md'] },
          8521,
          'localhost',
          false,
        );
      });
  });

  it('should pass multiple glob patterns with -g shorthand', () => {
    setExistsSyncResult(false);
    process.argv = ['node', 'cli.ts', '.', '-g', '*.md', 'notes/*.md'];

    return cli.run()
      .then(() => {
        expect(resolveGlobPatterns).toHaveBeenCalledWith(path.resolve('.'), ['*.md', 'notes/*.md']);
      });
  });

  it('should not call resolveGlobPatterns when --glob is not provided', () => {
    setExistsSyncResult(false);
    process.argv = ['node', 'cli.ts', '.'];

    return cli.run()
      .then(() => {
        expect(resolveGlobPatterns).not.toHaveBeenCalled();
        expect(mockServe).toHaveBeenCalledWith({ directory: path.resolve('.') }, 8521, 'localhost', false);
      });
  });

  it('should resolve open module in requireOpen', async () => {
    const anotherCli = new CLI();
    const openModule = await import('open');

    await expect(anotherCli.requireOpen()).resolves.toBe(openModule.default);
  });
});
