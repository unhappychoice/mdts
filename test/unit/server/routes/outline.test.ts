import express from 'express';
import request from 'supertest';
import fs from 'fs';
import MarkdownIt from 'markdown-it';
import path from 'path';
import { outlineRouter } from '../../../../src/server/routes/outline';

// Mock the fs module
jest.mock('fs', () => ({  readFileSync: jest.fn(),}));
jest.mock('markdown-it', () => {
  const originalModule = jest.requireActual('markdown-it');
  return jest.fn(() => ({
    parse: jest.fn((markdown, env) => {
      const md = new originalModule();
      return md.parse(markdown, env);
    }),
  }));
});
describe('outline.ts', () => {
  beforeEach(() => {
    (fs.readFileSync as jest.Mock).mockReset();
    (MarkdownIt as jest.Mock).mockClear();
  });

  describe('outlineRouter', () => {
    let app: express.Application;
    const mockDirectory = '/mock/base/dir';

    beforeEach(() => {
      app = express();
      app.use('/api/outline', outlineRouter(mockDirectory));
    });

    it('should return 400 if filePath is not provided', async () => {
      const response = await request(app).get('/api/outline');

      expect(response.statusCode).toBe(400);
      expect(response.text).toBe('filePath query parameter is required.');
    });

    it('should return outline for a valid markdown file', async () => {
      const markdownContent = `# Test Heading`;
      (fs.readFileSync as jest.Mock).mockReturnValueOnce(markdownContent);
      const response = await request(app).get('/api/outline?filePath=test.md');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([
        { level: 1, content: 'Test Heading', id: 'test-heading' },
      ]);
    });

    it('should handle mdts-welcome-markdown.md correctly', async () => {
      const welcomeMarkdownContent = `# Welcome`;
      (fs.readFileSync as jest.Mock).mockReturnValueOnce(welcomeMarkdownContent);
      const response = await request(app).get('/api/outline?filePath=mdts-welcome-markdown.md');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([
        { level: 1, content: 'Welcome', id: 'welcome' },
      ]);
      expect(fs.readFileSync).toHaveBeenCalledWith(expect.stringContaining(path.join('public', 'welcome.md')), 'utf-8');
    });

    it('should return 500 if file does not exist', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (fs.readFileSync as jest.Mock).mockImplementationOnce(() => {
        throw new Error('File not found');
      });
      const response = await request(app).get('/api/outline?filePath=nonexistent.md');

      expect(response.statusCode).toBe(500);
      expect(response.text).toBe('Error getting outline.');

      consoleErrorSpy.mockRestore();
    });

    it('should log an error message to console.error if file does not exist', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (fs.readFileSync as jest.Mock).mockImplementationOnce(() => {
        throw new Error('File not found');
      });

      await request(app).get('/api/outline?filePath=nonexistent.md');

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });
});
