import chokidar, { type FSWatcher } from 'chokidar';
import * as fs from 'fs';
import * as http from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { setupWatcher } from '../../../src/server/watcher';
import { logger } from '../../../src/utils/logger';

// Mock chokidar
jest.mock('chokidar');

// Mock fs.statSync
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  statSync: jest.fn(),
}));

// Mock WebSocketServer
const mockWss = {
  on: jest.fn(),
  clients: [] as WebSocket[],
};
jest.mock('ws', () => ({
  WebSocketServer: jest.fn(() => mockWss),
}));

// Mock logger
jest.mock('../../../src/utils/logger', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn(),
  },
}));

describe('watcher.ts unit tests', () => {
  let mockServer: http.Server;
  let mockChokidarWatcher: FSWatcher;

  beforeEach(() => {
    jest.clearAllMocks();

    mockServer = {} as http.Server;

    mockChokidarWatcher = {
      on: jest.fn().mockReturnThis(),
      close: jest.fn(),
    } as unknown as FSWatcher;
    (chokidar.watch as jest.Mock).mockReturnValue(mockChokidarWatcher);

    // Reset mockWss listeners for each test
    mockWss.on.mockClear();
    mockWss.clients = [];
  });

  it('should setup WebSocketServer and chokidar watcher', () => {
    setupWatcher('/mock/directory', mockServer, 3000);
    expect(WebSocketServer).toHaveBeenCalledWith({ server: mockServer });
    expect(chokidar.watch).toHaveBeenCalledWith('/mock/directory', expect.any(Object));
  });

  it('should log when WebSocket server is listening', () => {
    (mockWss.on as jest.Mock).mockImplementation((event, callback) => {
      if (event === 'listening') {
        callback();
      }
    });
    setupWatcher('/mock/directory', mockServer, 3000);
    expect(logger.log).toHaveBeenCalledWith('🚀 WebSocket server listening at ws://localhost:3000');
  });

  it('should handle new client connections', () => {
    const client = { send: jest.fn() } as unknown as WebSocket;
    mockWss.clients.push(client);
    (mockWss.on as jest.Mock).mockImplementation((event, callback) => {
      if (event === 'connection') {
        callback();
      }
    });

    setupWatcher('/mock/directory', mockServer, 3000);

    expect(logger.log).toHaveBeenCalledWith('🤝 Livereload Client connected');
  });

  it('should send reload-content message on file change', () => {
    const client = { send: jest.fn() } as unknown as WebSocket;
    mockWss.clients.push(client);
    (mockChokidarWatcher.on as jest.Mock).mockImplementation(
      (event: string, callback: (path: string) => void) => {
        if (event === 'change') {
          callback('file.md');
        }
        return mockChokidarWatcher;
      },
    );

    setupWatcher('/mock/directory', mockServer, 3000);

    expect(logger.log).toHaveBeenCalledWith('🔃 File changed: file.md, reloading...');
    expect(client.send).toHaveBeenCalledWith(JSON.stringify({ type: 'reload-content' }));
  });

  it('should send reload-tree message on file add', () => {
    const client = { send: jest.fn() } as unknown as WebSocket;
    mockWss.clients.push(client);
    (mockChokidarWatcher.on as jest.Mock).mockImplementation(
      (event: string, callback: (path: string) => void) => {
        if (event === 'add') {
          callback('new-file.md');
        }
        return mockChokidarWatcher;
      },
    );

    setupWatcher('/mock/directory', mockServer, 3000);

    expect(logger.log).toHaveBeenCalledWith('🌲 File added: new-file.md, reloading tree...');
    expect(client.send).toHaveBeenCalledWith(JSON.stringify({ type: 'reload-tree' }));
  });

  it('should send reload-tree message on file unlink', () => {
    const client = { send: jest.fn() } as unknown as WebSocket;
    mockWss.clients.push(client);
    (mockChokidarWatcher.on as jest.Mock).mockImplementation(
      (event: string, callback: (path: string) => void) => {
        if (event === 'unlink') {
          callback('deleted-file.md');
        }
        return mockChokidarWatcher;
      },
    );

    setupWatcher('/mock/directory', mockServer, 3000);

    expect(logger.log).toHaveBeenCalledWith('🌲 File removed: deleted-file.md, reloading tree...');
    expect(client.send).toHaveBeenCalledWith(JSON.stringify({ type: 'reload-tree' }));
  });

  it('should handle chokidar watch error', () => {
    (chokidar.watch as jest.Mock).mockImplementation(() => {
      throw new Error('Watch error');
    });

    setupWatcher('/mock/directory', mockServer, 3000);

    expect(logger.error).toHaveBeenCalledWith('🚫 Error watching directory:', expect.any(Error));
    expect(logger.error).toHaveBeenCalledWith('Livereload will be disabled');
  });

  describe('chokidar ignored option', () => {
    let ignoredFn: (path: string) => boolean;

    beforeEach(() => {
      setupWatcher('/mock/directory', mockServer, 3000);
      ignoredFn = (chokidar.watch as jest.Mock).mock.calls[0][1].ignored;
    });

    it('should ignore files in node_modules', () => {
      expect(ignoredFn('/mock/directory/node_modules/some-package/index.js')).toBe(true);
    });

    it('should not ignore directories', () => {
      (fs.statSync as jest.Mock).mockReturnValue({ isDirectory: () => true });
      expect(ignoredFn('/mock/directory/some_dir')).toBe(false);
    });

    it('should not ignore markdown files', () => {
      (fs.statSync as jest.Mock).mockReturnValue({ isDirectory: () => false });
      expect(ignoredFn('test.md')).toBe(false);
      expect(ignoredFn('test.markdown')).toBe(false);
    });

    it('should ignore non-markdown files', () => {
      (fs.statSync as jest.Mock).mockReturnValue({ isDirectory: () => false });
      expect(ignoredFn('test.txt')).toBe(true);
    });

    it('should not ignore files if statSync fails', () => {
      (fs.statSync as jest.Mock).mockImplementation(() => {
        throw new Error('stat sync error');
      });
      expect(ignoredFn('anyfile')).toBe(false);
    });
  });
});
