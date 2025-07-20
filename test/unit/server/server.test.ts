import chokidar from 'chokidar';
import * as fs from 'fs';
import { createApp, serve } from '../../../src/server/server';
import { logger } from '../../../src/utils/logger';

jest.mock('express', () => {
  const mockUse = jest.fn();
  const mockGet = jest.fn();
  const mockExpress = jest.fn(() => ({
    use: mockUse,
    get: mockGet,
    listen: jest.fn(), // Add listen here for the serve tests
  }));
  mockExpress.static = jest.fn().mockReturnValue(jest.fn());
  mockExpress.Router = jest.fn(() => ({
    get: jest.fn(),
  }));
  return mockExpress;
});

// Mock chokidar
jest.mock('chokidar');

// Mock fs.existsSync and fs.statSync
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn(),
  statSync: jest.fn(),
}));

// Mock WebSocketServer
jest.mock('ws', () => ({
  WebSocketServer: jest.fn(() => ({
    on: jest.fn(),
    clients: [],
  })),
}));

// Mock logger
jest.mock('../../../src/utils/logger', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn(),
  },
}));

describe('server.ts unit tests', () => {
  let app: any;
  let mockChokidarWatcher: any;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Setup mock for chokidar.watch
    mockChokidarWatcher = {
      on: jest.fn().mockReturnThis(),
      add: jest.fn().mockReturnThis(),
      close: jest.fn(),
    };
    (chokidar.watch as jest.Mock).mockReturnValue(mockChokidarWatcher);

    // Setup mock for fs.existsSync and fs.statSync
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.statSync as jest.Mock).mockReturnValue({
      isDirectory: jest.fn().mockReturnValue(false),
    });

    app = createApp('/mock/directory');
  });

  describe('createApp', () => {
    it('should create an express app', () => {
      expect(app).toBeDefined();
    });

    it('should serve static files from public and frontend', () => {
      expect(app.use).toHaveBeenCalledWith(expect.any(Function)); // for express.static
      expect(app.use).toHaveBeenCalledWith(expect.any(Function)); // for express.static
    });

    it('should define /api/filetree and /api/outline routes', () => {
      expect(app.use).toHaveBeenCalledWith('/api/filetree', { get: expect.any(Function) });
      expect(app.use).toHaveBeenCalledWith('/api/outline', { get: expect.any(Function) });
    });

    it('should serve welcome markdown', async () => {
      const mockSendFile = jest.fn();
      app.get.mock.calls.find((call: any) => call[0] === '/api/markdown/mdts-welcome-markdown.md')[1]({},
        { setHeader: jest.fn(), sendFile: mockSendFile }
      );
      expect(mockSendFile).toHaveBeenCalledWith(expect.stringContaining('public/welcome.md'));
    });

    it('should prevent path traversal for /api/markdown', async () => {
      const mockStatus = jest.fn().mockReturnThis();
      const mockSend = jest.fn();
      const mockNext = jest.fn();
      const req = { path: '../package.json' };
      const res = { status: mockStatus, send: mockSend };

      // Find the middleware for /api/markdown
      const markdownMiddleware = app.use.mock.calls.find((call: any) => call[0] === '/api/markdown' && call.length === 2)[1];
      await markdownMiddleware(req, res, mockNext);

      expect(mockStatus).toHaveBeenCalledWith(403);
      expect(mockSend).toHaveBeenCalledWith('Forbidden');
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 404 for non-existent files in /api/markdown', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      const mockStatus = jest.fn().mockReturnThis();
      const mockSend = jest.fn();
      const mockNext = jest.fn();
      const req = { path: 'nonexistent.md' };
      const res = { status: mockStatus, send: mockSend };

      const markdownMiddleware = app.use.mock.calls.find((call: any) => call[0] === '/api/markdown' && call.length === 2)[1];
      await markdownMiddleware(req, res, mockNext);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockSend).toHaveBeenCalledWith('File not found');
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next for existing files in /api/markdown', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      const mockStatus = jest.fn().mockReturnThis();
      const mockSend = jest.fn();
      const mockNext = jest.fn();
      const req = { path: 'existing.md' };
      const res = { status: mockStatus, send: mockSend };

      const markdownMiddleware = app.use.mock.calls.find((call: any) => call[0] === '/api/markdown' && call.length === 2)[1];
      await markdownMiddleware(req, res, mockNext);

      expect(mockStatus).not.toHaveBeenCalled();
      expect(mockSend).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });

    it('should serve index.html for markdown paths', async () => {
      const mockSendFile = jest.fn();
      const req = { path: 'test.md' };
      const res = { sendFile: mockSendFile };

      const catchAllRoute = app.get.mock.calls.find((call: any) => call[0] === '*')[1];
      await catchAllRoute(req, res);

      expect(mockSendFile).toHaveBeenCalledWith(expect.stringContaining('frontend/index.html'));
    });

    it('should serve index.html for directory paths', async () => {
      (fs.statSync as jest.Mock).mockReturnValue({
        isDirectory: jest.fn().mockReturnValue(true),
      });
      const mockSendFile = jest.fn();
      const req = { path: '/some/directory' };
      const res = { sendFile: mockSendFile };

      const catchAllRoute = app.get.mock.calls.find((call: any) => call[0] === '*')[1];
      await catchAllRoute(req, res);

      expect(mockSendFile).toHaveBeenCalledWith(expect.stringContaining('frontend/index.html'));
    });

    it('should serve non-markdown files with root option', async () => {
      (fs.statSync as jest.Mock).mockImplementation(() => {
        throw new Error('File not found'); // Simulate file not found for statSync
      });
      const mockSendFile = jest.fn((filePath, options, callback) => {
        callback(null); // Simulate success
      });
      const req = { path: 'image.png' };
      const res = { sendFile: mockSendFile };

      const catchAllRoute = app.get.mock.calls.find((call: any) => call[0] === '*')[1];
      await catchAllRoute(req, res);

      expect(mockSendFile).toHaveBeenCalledWith('image.png', { root: '/mock/directory' }, expect.any(Function));
    });

    it('should handle error when serving non-markdown files', async () => {
      (fs.statSync as jest.Mock).mockImplementation(() => {
        throw new Error('File not found'); // Simulate file not found for statSync
      });
      const mockStatus = jest.fn().mockReturnThis();
      const mockSend = jest.fn();
      const mockSendFile = jest.fn((filePath, options, callback) => {
        callback({ code: 'ENOENT' }); // Simulate ENOENT error
      });
      const req = { path: 'nonexistent.png' };
      const res = { status: mockStatus, send: mockSend, sendFile: mockSendFile };

      const catchAllRoute = app.get.mock.calls.find((call: any) => call[0] === '*')[1];
      await catchAllRoute(req, res);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockSend).toHaveBeenCalledWith('File not found');
    });

    it('should handle generic error when serving non-markdown files', async () => {
      (fs.statSync as jest.Mock).mockImplementation(() => {
        throw new Error('File not found'); // Simulate file not found for statSync
      });
      const mockStatus = jest.fn().mockReturnThis();
      const mockSend = jest.fn();
      const mockSendFile = jest.fn((filePath, options, callback) => {
        callback(new Error('Generic error')); // Simulate generic error
      });
      const req = { path: 'error.png' };
      const res = { status: mockStatus, send: mockSend, sendFile: mockSendFile };

      const catchAllRoute = app.get.mock.calls.find((call: any) => call[0] === '*')[1];
      await catchAllRoute(req, res);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockSend).toHaveBeenCalledWith('Internal Server Error');
    });
  });

  describe('serve', () => {
    it('should start a server and setup watcher', () => {
      serve('/mock/directory', 3000);
      expect(chokidar.watch).toHaveBeenCalledWith('/mock/directory', expect.any(Object));
    });

    it('should handle chokidar watch error', () => {
      (chokidar.watch as jest.Mock).mockImplementation(() => {
        throw new Error('Watch error');
      });
      serve('/mock/directory', 3000);

      expect(logger.error).toHaveBeenCalledWith('🚫 Error watching directory:', expect.any(Error));
      expect(logger.error).toHaveBeenCalledWith('Livereload will be disabled');
    });
  });
});
