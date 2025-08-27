import { type Express, type NextFunction, type Request, type Response } from 'express';
import * as fs from 'fs';
import { createApp, serve } from '../../../src/server/server';
import { setupWatcher } from '../../../src/server/watcher';
import { getConfig, saveConfig } from '../../../src/server/config';

jest.mock('express', () => {
  const mockUse = jest.fn();
  const mockGet = jest.fn();
  const mockListen = jest.fn((port, host, callback) => {
    if (callback) {
      callback();
    }
    return { close: jest.fn() };
  });
  const mockPost = jest.fn();
  const mockExpress = jest.fn(() => ({
    use: mockUse,
    get: mockGet,
    post: mockPost,
    listen: mockListen,
  }));
  mockExpress.static = jest.fn().mockReturnValue(jest.fn());
  mockExpress.json = jest.fn(() => jest.fn());
  mockExpress.Router = jest.fn(() => ({
    json: jest.fn().mockReturnValue(jest.fn()),
    get: jest.fn(),
    post: jest.fn(),
  }));
  return mockExpress;
});

// Mock fs.existsSync and fs.statSync
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn(),
  statSync: jest.fn(),
}));

// Mock setupWatcher
jest.mock('../../../src/server/watcher');

// Mock config functions
jest.mock('../../../src/server/config', () => ({
  getConfig: jest.fn(),
  saveConfig: jest.fn(),
}));

describe('server.ts unit tests', () => {
  let app: Express;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

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
      expect(app.use).toHaveBeenCalledWith('/api/filetree', expect.objectContaining({ get: expect.any(Function) }));
      expect(app.use).toHaveBeenCalledWith('/api/outline', expect.objectContaining({ get: expect.any(Function) }));
    });

    it('should define /api/config GET route', async () => {
      const mockConfig = { fontFamily: 'Test', fontSize: 16 };
      (getConfig as jest.Mock).mockReturnValue(mockConfig);
      const mockJson = jest.fn();
      const configGetHandler = (app.get as jest.Mock).mock.calls.find(
        (call: [string, (req: Request, res: Response) => void]) =>
          call[0] === '/api/config' && call.length === 2,
      )[1];
      configGetHandler({} as Request, { json: mockJson } as unknown as Response);
      expect(getConfig).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(mockConfig);
    });

    it('should define /api/config POST route', async () => {
      const mockBody = { fontFamily: 'NewFont', fontSize: 18 };
      const mockStatus = jest.fn().mockReturnThis();
      const mockSend = jest.fn();
      const configPostCall = (app.post as jest.Mock).mock.calls.find(
        (call: [string, (req: Request, res: Response) => void]) =>
          call[0] === '/api/config',
      );
      const configPostHandler = configPostCall[1];
      configPostHandler({ body: mockBody } as Request, { status: mockStatus, send: mockSend } as unknown as Response);
      expect(saveConfig).toHaveBeenCalledWith(mockBody);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockSend).toHaveBeenCalledWith('Config saved');
    });

    it('should handle errors in /api/config POST route', async () => {
      (saveConfig as jest.Mock).mockImplementation(() => {
        throw new Error('Save failed');
      });
      const mockBody = { fontFamily: 'NewFont', fontSize: 18 };
      const mockStatus = jest.fn().mockReturnThis();
      const mockSend = jest.fn();
      const configPostCall = (app.post as jest.Mock).mock.calls.find(
        (call: [string, (req: Request, res: Response) => void]) =>
          call[0] === '/api/config',
      );
      const configPostHandler = configPostCall[1];
      configPostHandler({ body: mockBody } as Request, { status: mockStatus, send: mockSend } as unknown as Response);
      expect(saveConfig).toHaveBeenCalledWith(mockBody);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockSend).toHaveBeenCalledWith('Failed to save config');
    });

    it('should serve welcome markdown', async () => {
      const mockSendFile = jest.fn();
      const welcomeRouteHandler = (app.get as jest.Mock).mock.calls.find(
        (call: [string, (req: Request, res: Response) => void]) =>
          call[0] === '/api/markdown/mdts-welcome-markdown.md',
      )[1];
      welcomeRouteHandler(
        {} as Request,
        { setHeader: jest.fn(), sendFile: mockSendFile } as unknown as Response,
      );
      expect(mockSendFile).toHaveBeenCalledWith(
        expect.stringContaining('welcome.md'),
        expect.any(Object),
      );
    });

    it('should prevent path traversal for /api/markdown', async () => {
      const mockStatus = jest.fn().mockReturnThis();
      const mockSend = jest.fn();
      const mockNext = jest.fn();
      const req = { path: '../package.json' } as Request;
      const res = { status: mockStatus, send: mockSend } as unknown as Response;

      const markdownMiddleware = (app.use as jest.Mock).mock.calls.find(
        (call: [string, (req: Request, res: Response, next: NextFunction) => void]) =>
          call[0] === '/api/markdown' && call.length === 2,
      )[1];
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
      const req = { path: 'nonexistent.md' } as Request;
      const res = { status: mockStatus, send: mockSend } as unknown as Response;

      const markdownMiddleware = (app.use as jest.Mock).mock.calls.find(
        (call: [string, (req: Request, res: Response, next: NextFunction) => void]) =>
          call[0] === '/api/markdown' && call.length === 2,
      )[1];
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
      const req = { path: 'existing.md' } as Request;
      const res = { status: mockStatus, send: mockSend } as unknown as Response;

      const markdownMiddleware = (app.use as jest.Mock).mock.calls.find(
        (call: [string, (req: Request, res: Response, next: NextFunction) => void]) =>
          call[0] === '/api/markdown' && call.length === 2,
      )[1];
      await markdownMiddleware(req, res, mockNext);

      expect(mockStatus).not.toHaveBeenCalled();
      expect(mockSend).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });

    it('should serve index.html for markdown paths', async () => {
      const mockSendFile = jest.fn();
      const req = { path: 'test.md' } as Request;
      const res = { sendFile: mockSendFile } as unknown as Response;

      const catchAllRoute = (app.get as jest.Mock).mock.calls.find(
        (call: [string, (req: Request, res: Response) => void]) => call[0] === '*splat',
      )[1];
      await catchAllRoute(req, res);

      expect(mockSendFile).toHaveBeenCalledWith(
        expect.stringContaining('index.html'),
        expect.any(Object),
      );
    });

    it('should serve index.html for directory paths', async () => {
      (fs.statSync as jest.Mock).mockReturnValue({
        isDirectory: jest.fn().mockReturnValue(true),
      });
      const mockSendFile = jest.fn();
      const req = { path: '/some/directory' } as Request;
      const res = { sendFile: mockSendFile } as unknown as Response;

      const catchAllRoute = (app.get as jest.Mock).mock.calls.find(
        (call: [string, (req: Request, res: Response) => void]) => call[0] === '*splat',
      )[1];
      await catchAllRoute(req, res);

      expect(mockSendFile).toHaveBeenCalledWith(
        expect.stringContaining('index.html'),
        expect.any(Object),
      );
    });

    it('should serve non-markdown files with root option', async () => {
      (fs.statSync as jest.Mock).mockImplementation(() => {
        throw new Error('File not found'); // Simulate file not found for statSync
      });
      const mockSendFile = jest.fn((filePath, options, callback) => {
        callback(null); // Simulate success
      });
      const req = { path: 'image.png' } as Request;
      const res = { sendFile: mockSendFile } as unknown as Response;

      const catchAllRoute = (app.get as jest.Mock).mock.calls.find(
        (call: [string, (req: Request, res: Response) => void]) => call[0] === '*splat',
      )[1];
      await catchAllRoute(req, res);

      expect(mockSendFile).toHaveBeenCalledWith(
        'image.png',
        { root: '/mock/directory' },
        expect.any(Function),
      );
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
      const req = { path: 'nonexistent.png' } as Request;
      const res = {
        status: mockStatus,
        send: mockSend,
        sendFile: mockSendFile,
      } as unknown as Response;

      const catchAllRoute = (app.get as jest.Mock).mock.calls.find(
        (call: [string, (req: Request, res: Response) => void]) => call[0] === '*splat',
      )[1];
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
      const req = { path: 'error.png' } as Request;
      const res = {
        status: mockStatus,
        send: mockSend,
        sendFile: mockSendFile,
      } as unknown as Response;

      const catchAllRoute = (app.get as jest.Mock).mock.calls.find(
        (call: [string, (req: Request, res: Response) => void]) => call[0] === '*splat',
      )[1];
      await catchAllRoute(req, res);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockSend).toHaveBeenCalledWith('Internal Server Error');
    });
  });

  describe('serve', () => {
    it('should start a server and setup watcher', () => {
      const server = serve('/mock/directory', 3000, 'localhost');
      expect(app.listen).toHaveBeenCalledWith(3000, 'localhost', expect.any(Function));
      expect(setupWatcher).toHaveBeenCalledWith('/mock/directory', server, 3000);
    });
  });
});
