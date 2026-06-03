import express from 'express';
import fs from 'fs';
import path from 'path';
import request from 'supertest';
import { searchRouter } from '../../../../src/server/routes/search';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  readdirSync: jest.fn(),
  readFileSync: jest.fn(),
}));

jest.mock('glob', () => ({
  globSync: jest.fn(() => []),
}));

const mockDirent = (name: string, isDirectory: boolean) => ({
  name,
  isDirectory: () => isDirectory,
  isFile: () => !isDirectory,
});

describe('searchRouter', () => {
  const mockDirectory = path.resolve('D:/mock/base/dir');
  let app: express.Application;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use('/api/search', searchRouter({ directory: mockDirectory }));
  });

  it('should return no results for an empty query', async () => {
    const response = await request(app).get('/api/search?q=');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ results: [] });
    expect(fs.readdirSync).not.toHaveBeenCalled();
  });

  it('should search markdown files recursively', async () => {
    (fs.readdirSync as jest.Mock)
      .mockReturnValueOnce([
        mockDirent('docs', true),
        mockDirent('README.md', false),
        mockDirent('notes.txt', false),
        mockDirent('node_modules', true),
        mockDirent('.hidden', true),
      ])
      .mockReturnValueOnce([
        mockDirent('guide.markdown', false),
      ]);

    (fs.readFileSync as jest.Mock).mockImplementation((filePath: string) => {
      if (filePath.endsWith('README.md')) return 'Intro\nInstall mdts quickly';
      if (filePath.endsWith('guide.markdown')) return 'Usage\nMDTS supports live preview';
      return '';
    });

    const response = await request(app).get('/api/search?q=mdts');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      results: [
        { path: 'README.md', line: 2, preview: 'Install mdts quickly' },
        { path: 'docs/guide.markdown', line: 2, preview: 'MDTS supports live preview' },
      ],
    });
    expect(fs.readFileSync).toHaveBeenCalledTimes(2);
  });

  it('should honor the result limit', async () => {
    (fs.readdirSync as jest.Mock).mockReturnValueOnce([
      mockDirent('a.md', false),
      mockDirent('b.md', false),
    ]);
    (fs.readFileSync as jest.Mock).mockReturnValue('target\ntarget again');

    const response = await request(app).get('/api/search?q=target&limit=2');

    expect(response.statusCode).toBe(200);
    expect(response.body.results).toHaveLength(2);
    expect(response.body.results).toEqual([
      { path: 'a.md', line: 1, preview: 'target' },
      { path: 'a.md', line: 2, preview: 'target again' },
    ]);
  });

  it('should use file patterns when provided', async () => {
    app = express();
    app.use('/api/search', searchRouter({
      directory: mockDirectory,
      filePatterns: ['docs\\guide.md', 'docs\\skip.txt'],
    }));
    (fs.readFileSync as jest.Mock).mockReturnValue('find this line');

    const response = await request(app).get('/api/search?q=find');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      results: [
        { path: 'docs/guide.md', line: 1, preview: 'find this line' },
      ],
    });
    expect(fs.readdirSync).not.toHaveBeenCalled();
  });

  it('should skip unreadable files', async () => {
    (fs.readdirSync as jest.Mock).mockReturnValueOnce([
      mockDirent('README.md', false),
    ]);
    (fs.readFileSync as jest.Mock).mockImplementation(() => {
      throw new Error('cannot read');
    });

    const response = await request(app).get('/api/search?q=readme');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ results: [] });
  });
});
