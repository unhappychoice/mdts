import express from 'express';
import fs from 'fs';
import path from 'path';
import request from 'supertest';
import { exportRouter } from '../../../../src/server/routes/export';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  statSync: jest.fn(),
}));

describe('exportRouter', () => {
  const mockDirectory = path.resolve('D:/mock/base/dir');
  let app: express.Application;

  beforeEach(() => {
    jest.clearAllMocks();
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.statSync as jest.Mock).mockReturnValue({ isDirectory: () => false });
    (fs.readFileSync as jest.Mock).mockReturnValue('# Hello\n\nExport this markdown.');

    app = express();
    app.use('/api/export', exportRouter({ directory: mockDirectory }));
  });

  it('should require filePath', async () => {
    const response = await request(app).get('/api/export/html');

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: 'filePath is required' });
  });

  it('should only export markdown files', async () => {
    const response = await request(app).get('/api/export/html?filePath=notes.txt');

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: 'Only markdown files can be exported' });
  });

  it('should prevent path traversal', async () => {
    const response = await request(app).get('/api/export/html?filePath=../secret.md');

    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({ error: 'Forbidden' });
  });

  it('should return 404 for missing files', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    const response = await request(app).get('/api/export/html?filePath=missing.md');

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ error: 'File not found' });
  });

  it('should reject directories', async () => {
    (fs.statSync as jest.Mock).mockReturnValue({ isDirectory: () => true });

    const response = await request(app).get('/api/export/html?filePath=docs.md');

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: 'Cannot export a directory' });
  });

  it('should export markdown as an HTML attachment', async () => {
    const response = await request(app).get('/api/export/html?filePath=docs/guide.md');

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toContain('text/html');
    expect(response.headers['content-disposition']).toContain('attachment; filename="guide.html"');
    expect(response.text).toContain('<!doctype html>');
    expect(response.text).toContain('<h1>Hello</h1>');
    expect(response.text).toContain('<p>Export this markdown.</p>');
    expect(fs.readFileSync).toHaveBeenCalledWith(path.resolve(mockDirectory, 'docs/guide.md'), 'utf8');
  });

  it('should serve printable HTML for browser PDF export', async () => {
    const response = await request(app).get('/api/export/print?filePath=docs/guide.md');

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toContain('text/html');
    expect(response.headers['content-disposition']).toBeUndefined();
    expect(response.text).toContain('<h1>Hello</h1>');
    expect(response.text).toContain('window.print()');
    expect(fs.readFileSync).toHaveBeenCalledWith(path.resolve(mockDirectory, 'docs/guide.md'), 'utf8');
  });
});
