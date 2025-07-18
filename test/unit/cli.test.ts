import { CLI } from '../../src/cli';
import path from 'path';

// Mock fs first, before any other imports that might use it
let mockExistsSyncResult = false;
jest.mock('fs', () => ({
  existsSync: jest.fn((path: string) => mockExistsSyncResult),
}));

// Helper to set the mock result for existsSync
const setExistsSyncResult = (result: boolean) => {
  mockExistsSyncResult = result;
};

// Mock the 'open' module
jest.mock('open', () => ({ default: jest.fn(() => Promise.resolve()) }));

// Mock the 'serve' function to prevent actual server startup
jest.mock('../../src/server/server', () => ({
  serve: jest.fn(),
}));

describe('cli', () => {
  let cli: CLI;
  let originalArgv: string[];
  let mockOpen = jest.fn();
  let mockServe: jest.Mock;

  beforeEach(() => {
    cli = new CLI();
    originalArgv = process.argv;
    mockServe = require('../../src/server/server').serve as jest.Mock;
    // Reset the mock result for existsSync before each test
    setExistsSyncResult(false); // Default to false for safety
    jest.clearAllMocks();

    jest.spyOn(cli, 'requireOpen')
      .mockImplementation(() => Promise.resolve(mockOpen));
  });

  afterEach(() => {
    process.argv = originalArgv;
  });

  test('should call open with default port and README.md if it exists', () => {
    setExistsSyncResult(true);
    process.argv = ['node', 'cli.ts', '.'];

    return cli.run()
      .then(() => {
        expect(mockServe).toHaveBeenCalledWith(path.resolve('.'), 8521);
        expect(mockOpen).toHaveBeenCalledWith('http://localhost:8521/README.md');
      })
  });

  test('should call open with default port and empty path if README.md does not exist', () => {
    setExistsSyncResult(false);
    process.argv = ['node', 'cli.ts', '.'];

    return cli.run()
      .then(() => {
        expect(mockServe).toHaveBeenCalledWith(path.resolve('.'), 8521);
        expect(mockOpen).toHaveBeenCalledWith('http://localhost:8521');
      });
  });

  test('should call open with specified port', () => {
    setExistsSyncResult(true);
    process.argv = ['node', 'cli.ts', '-p', '9000', '.'];

    return cli.run()
      .then(() => {
        expect(mockServe).toHaveBeenCalledWith(path.resolve('.'), 9000);
        expect(mockOpen).toHaveBeenCalledWith('http://localhost:9000/README.md');
      });
  });

  test('should call open with specified directory', () => {
    setExistsSyncResult(true);
    process.argv = ['node', 'cli.ts', './my-dir'];

    return cli.run()
      .then(() => {
        expect(mockServe).toHaveBeenCalledWith(path.resolve('./my-dir'), 8521);
        expect(mockOpen).toHaveBeenCalledWith('http://localhost:8521/README.md');
      });
  });

  test('should call open with specified directory and port', () => {
    setExistsSyncResult(true);
    process.argv = ['node', 'cli.ts', '-p', '9000', './my-dir'];

    return cli.run()
      .then(() => {
        expect(mockServe).toHaveBeenCalledWith(path.resolve('./my-dir'), 9000);
        expect(mockOpen).toHaveBeenCalledWith('http://localhost:9000/README.md');
      });
  });
});
