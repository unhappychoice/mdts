import chokidar, { type FSWatcher } from 'chokidar';
import * as fs from 'fs';
import * as http from 'http';
import path from 'path';
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
let mockWss: {
  on: jest.Mock;
  clients: Set<WebSocket>;
};
jest.mock('ws', () => ({
  WebSocket: jest.fn(() => ({
    on: jest.fn(),
    send: jest.fn(),
    close: jest.fn(),
  })),
  WebSocketServer: jest.fn(() => mockWss),
}));

// Mock logger
jest.mock('../../../src/utils/logger', () => ({
  logger: {
    showLogo: jest.fn(),
    log: jest.fn(),
    error: jest.fn(),
  },
}));

describe('watcher.ts unit tests', () => {
  let mockServer: http.Server;
  let mockDirectoryWatcher: FSWatcher;
  let mockContentWatcher: FSWatcher;
  let mockClient: WebSocket;

  let onClientMessage: (message: string) => void;
  let onClientClose: () => void;
  let onClientError: (error: Error) => void;

  beforeEach(() => {
    jest.clearAllMocks();

    mockServer = {} as http.Server;

    mockDirectoryWatcher = {
      on: jest.fn().mockReturnThis(),
      close: jest.fn(),
    } as unknown as FSWatcher;
    (chokidar.watch as jest.Mock).mockReturnValue(mockDirectoryWatcher);

    mockContentWatcher = {
      on: jest.fn().mockReturnThis(),
      close: jest.fn(),
    } as unknown as FSWatcher;

    mockWss = {
      on: jest.fn(),
      clients: new Set<WebSocket>(),
    };

    mockClient = new WebSocket('');
    mockWss.clients.add(mockClient);

    (mockWss.on as jest.Mock).mockImplementation((event, callback) => {
      if (event === 'listening') {
        callback();
      } else if (event === 'connection') {
        callback(mockClient);
      }
    });

    // Capture client's on message/close/error handlers
    (mockClient.on as jest.Mock).mockImplementation((event, callback) => {
      if (event === 'message') {
        onClientMessage = callback;
      } else if (event === 'close') {
        onClientClose = callback;
      } else if (event === 'error') {
        onClientError = callback;
      }
    });
  });

  it('should setup WebSocketServer and directory watcher', () => {
    setupWatcher({ directory: '/mock/directory' }, mockServer, 3000);
    expect(WebSocketServer).toHaveBeenCalledWith({ server: mockServer });
    expect(chokidar.watch).toHaveBeenCalledWith('/mock/directory', expect.any(Object));
  });

  it('should log when WebSocket server is listening', () => {
    (mockWss.on as jest.Mock).mockImplementation((event, callback) => {
      if (event === 'listening') {
        callback();
      }
    });
    setupWatcher({ directory: '/mock/directory' }, mockServer, 3000);
    expect(logger.log).toHaveBeenCalledWith('Livereload', '🚀 WebSocket server listening at ws://localhost:3000');
  });

  describe('WebSocket client interactions', () => {
    beforeEach(() => {
      setupWatcher({ directory: '/mock/directory' }, mockServer, 3000);
      // Manually trigger connection to set up client handlers
      (mockWss.on as jest.Mock).mock.calls.find(call => call[0] === 'connection')[1](mockClient);
    });

    it('should log when Livereload Client connected', () => {
      expect(logger.log).toHaveBeenCalledWith('Livereload', '🤝 Livereload Client connected');
    });

    it('should log when Livereload Client closed and close content watcher if no other clients', () => {
      // Ensure content watcher is set up before closing
      (chokidar.watch as jest.Mock).mockReturnValueOnce(mockContentWatcher);
      onClientMessage(JSON.stringify({ type: 'watch-file', filePath: '/mock/initial.md' }));

      // Simulate the client being removed from the set on close
      mockWss.clients.delete(mockClient);
      expect(mockContentWatcher.close).not.toHaveBeenCalled(); // Should not be called initially
      onClientClose();
      expect(logger.log).toHaveBeenCalledWith('Livereload', '👋 Livereload Client closed');
      expect(mockContentWatcher.close).toHaveBeenCalled();
    });

    it('should not close content watcher if other clients exist', () => {
      // Ensure content watcher is set up before closing
      (chokidar.watch as jest.Mock).mockReturnValueOnce(mockContentWatcher);
      onClientMessage(JSON.stringify({ type: 'watch-file', filePath: '/mock/initial.md' }));

      const anotherClient = new WebSocket('');
      mockWss.clients.add(anotherClient);
      onClientClose();
      expect(mockContentWatcher.close).not.toHaveBeenCalled();
    });

    it('should log WebSocket client errors', () => {
      const error = new Error('Client error');
      onClientError(error);
      expect(logger.error).toHaveBeenCalledWith('🚫 Error on WebSocket client:', error);
    });

    it('should handle watch-file message and setup content watcher', () => {
      (chokidar.watch as jest.Mock).mockReturnValueOnce(mockContentWatcher); // For content watcher
      onClientMessage(JSON.stringify({ type: 'watch-file', filePath: '/mock/file.md' }));

      expect(logger.log).toHaveBeenCalledWith('Livereload', '👀 Watching file: /mock/file.md');
      expect(chokidar.watch)
        .toHaveBeenCalledWith(path.join('/mock/directory', '/mock/file.md'), { ignoreInitial: true });
      expect(mockContentWatcher.on).toHaveBeenCalledWith('change', expect.any(Function));
      expect(mockContentWatcher.on).toHaveBeenCalledWith('error', expect.any(Function));
    });

    it('should send reload-content message when watched file changes', () => {
      (chokidar.watch as jest.Mock).mockReturnValueOnce(mockContentWatcher);
      onClientMessage(JSON.stringify({ type: 'watch-file', filePath: '/mock/file2.md' }));

      expect(mockContentWatcher.on).toHaveBeenCalledWith('change', expect.any(Function));
      expect(mockContentWatcher.on).toHaveBeenCalledWith('error', expect.any(Function));

      const onChangeCallback = (mockContentWatcher.on as jest.Mock).mock.calls.find(call => call[0] === 'change')[1];
      onChangeCallback('/mock/file.md');

      expect(logger.log).toHaveBeenCalledWith('Livereload', '🔃 File changed: /mock/file.md, reloading content...');
      expect(mockClient.send).toHaveBeenCalledWith(JSON.stringify({ type: 'reload-content' }));
    });

    it('should close previous content watcher when new watch-file message received', () => {
      const firstContentWatcher = { on: jest.fn(), close: jest.fn() } as unknown as FSWatcher;
      const secondContentWatcher = { on: jest.fn(), close: jest.fn() } as unknown as FSWatcher;

      (chokidar.watch as jest.Mock)
        .mockReturnValueOnce(firstContentWatcher) // First call for content watcher
        .mockReturnValueOnce(secondContentWatcher); // Second call for content watcher

      onClientMessage(JSON.stringify({ type: 'watch-file', filePath: '/mock/file1.md' }));
      expect(firstContentWatcher.close).not.toHaveBeenCalled();

      onClientMessage(JSON.stringify({ type: 'watch-file', filePath: '/mock/file2.md' }));
      expect(firstContentWatcher.close).toHaveBeenCalled();
      expect(secondContentWatcher.close).not.toHaveBeenCalled();
    });

    it('should not call setupContentWatcher if watch-file message has invalid filePath type', () => {
      // Clear previous calls to chokidar.watch to accurately test this scenario
      (chokidar.watch as jest.Mock).mockClear();
      onClientMessage(JSON.stringify({ type: 'watch-file', filePath: 123 })); // Invalid filePath
      expect(chokidar.watch).not.toHaveBeenCalled();
    });

    it('should log error if content watcher encounters an error', () => {
      (chokidar.watch as jest.Mock).mockReturnValueOnce(mockContentWatcher);
      onClientMessage(JSON.stringify({ type: 'watch-file', filePath: '/mock/file.md' }));

      const onErrorCallback = (mockContentWatcher.on as jest.Mock).mock.calls.find(call => call[0] === 'error')[1];
      const error = new Error('Content watch error');
      onErrorCallback(error);

      expect(logger.error).toHaveBeenCalledWith('🚫 Error watching content file /mock/file.md:', error);
    });
  });

  describe('Directory watcher interactions', () => {
    beforeEach(() => {
      setupWatcher({ directory: '/mock/directory' }, mockServer, 3000);
    });

    it('should send reload-tree message on file add', () => {
      const client = { send: jest.fn() } as unknown as WebSocket;
      mockWss.clients.add(client);

      const onAddCallback = (mockDirectoryWatcher.on as jest.Mock).mock.calls.find(call => call[0] === 'add')[1];
      onAddCallback('new-file.md');

      expect(logger.log).toHaveBeenCalledWith('Livereload', '🌲 File added: new-file.md, reloading tree...');
      expect(client.send).toHaveBeenCalledWith(JSON.stringify({ type: 'reload-tree' }));
    });

    it('should send reload-tree message on file unlink', () => {
      const client = { send: jest.fn() } as unknown as WebSocket;
      mockWss.clients.add(client);

      const onUnlinkCallback = (mockDirectoryWatcher.on as jest.Mock).mock.calls.find(call => call[0] === 'unlink')[1];
      onUnlinkCallback('deleted-file.md');

      expect(logger.log).toHaveBeenCalledWith('Livereload', '🌲 File removed: deleted-file.md, reloading tree...');
      expect(client.send).toHaveBeenCalledWith(JSON.stringify({ type: 'reload-tree' }));
    });

    it('should handle chokidar watch error for directory watcher', () => {
      (chokidar.watch as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Directory watch error');
      });

      setupWatcher({ directory: '/mock/directory' }, mockServer, 3000);

      expect(logger.error).toHaveBeenCalledWith('🚫 Error watching directory:', expect.any(Error));
      expect(logger.error).toHaveBeenCalledWith('Livereload will be disabled');
    });
  });

  describe('chokidar ignored option', () => {
    let ignoredFn: (path: string, stats?: { isDirectory: () => boolean; isFile?: () => boolean }) => boolean;

    beforeEach(() => {
      setupWatcher({ directory: '/mock/directory' }, mockServer, 3000);
      ignoredFn = (chokidar.watch as jest.Mock).mock.calls.find(call => call[0] === '/mock/directory')[1].ignored;
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
      (fs.statSync as jest.Mock).mockReturnValue({ isDirectory: () => false, isFile: () => true });
      expect(ignoredFn('test.txt', { isDirectory: () => false, isFile: () => true })).toBe(true);
    });

    it('should not ignore files if statSync fails', () => {
      (fs.statSync as jest.Mock).mockImplementation(() => {
        throw new Error('stat sync error');
      });
      expect(ignoredFn('anyfile')).toBe(false);
    });
  });

  describe('File pattern watcher interactions', () => {
    let mockPatternWatcher: FSWatcher;

    beforeEach(() => {
      mockPatternWatcher = {
        on: jest.fn().mockReturnThis(),
        close: jest.fn().mockResolvedValue(undefined),
      } as unknown as FSWatcher;
      (chokidar.watch as jest.Mock).mockReturnValue(mockPatternWatcher);
    });

    it('should watch resolved absolute paths when filePatterns are provided', () => {
      setupWatcher(
        { directory: '/mock/directory', filePatterns: ['a.md', 'sub/b.md'] },
        mockServer,
        3000,
      );

      expect(chokidar.watch).toHaveBeenCalledWith(
        ['/mock/directory/a.md', '/mock/directory/sub/b.md'],
        { ignoreInitial: true },
      );
    });

    it('should send reload-tree on add event', () => {
      const client = { send: jest.fn() } as unknown as WebSocket;
      mockWss.clients.add(client);

      setupWatcher(
        { directory: '/mock/directory', filePatterns: ['a.md'] },
        mockServer,
        3000,
      );

      const onAddCallback = (mockPatternWatcher.on as jest.Mock).mock.calls
        .find(call => call[0] === 'add')[1];
      onAddCallback('/mock/directory/a.md');

      expect(logger.log).toHaveBeenCalledWith(
        'Livereload',
        '🌲 File added: /mock/directory/a.md, reloading tree...',
      );
      expect(client.send).toHaveBeenCalledWith(JSON.stringify({ type: 'reload-tree' }));
    });

    it('should send reload-tree on unlink event', () => {
      const client = { send: jest.fn() } as unknown as WebSocket;
      mockWss.clients.add(client);

      setupWatcher(
        { directory: '/mock/directory', filePatterns: ['a.md'] },
        mockServer,
        3000,
      );

      const onUnlinkCallback = (mockPatternWatcher.on as jest.Mock).mock.calls
        .find(call => call[0] === 'unlink')[1];
      onUnlinkCallback('/mock/directory/a.md');

      expect(logger.log).toHaveBeenCalledWith(
        'Livereload',
        '🌲 File removed: /mock/directory/a.md, reloading tree...',
      );
      expect(client.send).toHaveBeenCalledWith(JSON.stringify({ type: 'reload-tree' }));
    });

    it('should handle error and disable livereload', () => {
      setupWatcher(
        { directory: '/mock/directory', filePatterns: ['a.md'] },
        mockServer,
        3000,
      );

      const onErrorCallback = (mockPatternWatcher.on as jest.Mock).mock.calls
        .find(call => call[0] === 'error')[1];
      onErrorCallback(new Error('watch error'));

      expect(logger.error).toHaveBeenCalledWith('🚫 Error watching files:', expect.any(Error));
      expect(logger.error).toHaveBeenCalledWith('Livereload will be disabled');
    });

    it('should handle chokidar watch exception for file patterns', () => {
      (chokidar.watch as jest.Mock).mockImplementationOnce(() => {
        throw new Error('File pattern watch error');
      });

      setupWatcher(
        { directory: '/mock/directory', filePatterns: ['a.md'] },
        mockServer,
        3000,
      );

      expect(logger.error).toHaveBeenCalledWith('🚫 Error watching files:', expect.any(Error));
      expect(logger.error).toHaveBeenCalledWith('Livereload will be disabled');
    });
  });
});
