import request from 'supertest';
import { createApp } from '../../src/server/server';
import path from 'path';
import { promises as fs } from 'fs';

describe('Server E2E Tests', () => {
  let app: any;

  beforeAll(async () => {
    app = createApp(
      path.join(__dirname, '../fixtures/mountDirectory/content'),
      path.join(__dirname, '../fixtures/mountDirectory/dist/server')
    );
  });

  it('GET /api/filetree should return the file tree', async () => {
    const res = await request(app).get('/api/filetree');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        'test.md',
        'another.md',
        { 'nested': ['nested/nested.md'] }
      ])
    );
  });

  it('GET /api/markdown/mdts-welcome-markdown.md should return the welcome markdown', async () => {
    const res = await request(app).get('/api/markdown/mdts-welcome-markdown.md');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('# Welcome to mdts');
  });

  it('GET /api/markdown/test.md should return the content of test.md', async () => {
    const res = await request(app).get('/api/markdown/test.md');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('# Hello E2E');
  });

  it('GET /api/outline should return the outline for a markdown file', async () => {
    const res = await request(app).get('/api/outline?filePath=test.md');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          level: 1,
          content: 'Hello E2E',
          id: 'hello-e2e',
        }),
      ])
    );
  });

  it('GET /api/outline with non-existent file should return 500', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const res = await request(app).get('/api/outline?filePath=nonexistent.md');
    expect(res.statusCode).toEqual(500);

    consoleErrorSpy.mockRestore();
  });

  it('GET /api/outline without filePath should return 400', async () => {
    const res = await request(app).get('/api/outline');
    expect(res.statusCode).toEqual(400);
  });

  it('GET / should return index.html for root path', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('<title>mdts - Markdown file viewer</title>');
  });

  it('GET /some/path/to/file.md should return index.html for markdown paths', async () => {
    const res = await request(app).get('/test.md');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('<title>mdts - Markdown file viewer</title>');
  });

  it('GET /nonexistent-file should return 404 for non-existent files in the served directory', async () => {
    const res = await request(app).get('/nonexistent-file');
    // The server tries to serve the file from the directory, if not found, it falls through to index.html
    // This test might need adjustment based on the exact desired behavior for non-existent files.
    // Currently, it serves index.html for any path that doesn't match a static file or a markdown file.
    expect(res.statusCode).toEqual(404);
  });
});
