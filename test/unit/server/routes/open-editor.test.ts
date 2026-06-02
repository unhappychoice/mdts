import express from 'express';
import * as fs from 'fs';
import path from 'path';
import request from 'supertest';
import { openEditorRouter } from '../../../../src/server/routes/open-editor';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn(),
  statSync: jest.fn(),
}));

describe('openEditorRouter', () => {
  const mockDirectory = path.resolve('D:/mock/base/dir');
  const mockOpenEditor = jest.fn();
  let app: express.Application;

  beforeEach(() => {
    jest.clearAllMocks();
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.statSync as jest.Mock).mockReturnValue({ isDirectory: () => false });

    app = express();
    app.use(express.json());
    app.use('/api/open-editor', openEditorRouter({ directory: mockDirectory }, mockOpenEditor));
  });

  it('should require filePath', async () => {
    const response = await request(app).post('/api/open-editor').send({});

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: 'filePath is required' });
    expect(mockOpenEditor).not.toHaveBeenCalled();
  });

  it('should prevent path traversal', async () => {
    const response = await request(app).post('/api/open-editor').send({ filePath: '../secret.md' });

    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({ error: 'Forbidden' });
    expect(mockOpenEditor).not.toHaveBeenCalled();
  });

  it('should return 404 for missing files', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    const response = await request(app).post('/api/open-editor').send({ filePath: 'missing.md' });

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ error: 'File not found' });
    expect(mockOpenEditor).not.toHaveBeenCalled();
  });

  it('should reject directories', async () => {
    (fs.statSync as jest.Mock).mockReturnValue({ isDirectory: () => true });

    const response = await request(app).post('/api/open-editor').send({ filePath: 'docs' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: 'Cannot open a directory in editor' });
    expect(mockOpenEditor).not.toHaveBeenCalled();
  });

  it('should open files in the editor', async () => {
    mockOpenEditor.mockResolvedValue(undefined);

    const response = await request(app)
      .post('/api/open-editor')
      .send({ filePath: 'docs/readme.md', line: 4, column: 2 });

    expect(response.statusCode).toBe(204);
    expect(mockOpenEditor).toHaveBeenCalledWith([{
      file: path.resolve(mockDirectory, 'docs/readme.md'),
      line: 4,
      column: 2,
    }]);
  });

  it('should ignore invalid line and column values', async () => {
    mockOpenEditor.mockResolvedValue(undefined);

    const response = await request(app)
      .post('/api/open-editor')
      .send({ filePath: 'docs/readme.md', line: 0, column: 'invalid' });

    expect(response.statusCode).toBe(204);
    expect(mockOpenEditor).toHaveBeenCalledWith([{
      file: path.resolve(mockDirectory, 'docs/readme.md'),
      line: undefined,
      column: undefined,
    }]);
  });

  it('should return 500 when opening the editor fails', async () => {
    mockOpenEditor.mockRejectedValue(new Error('editor failed'));

    const response = await request(app).post('/api/open-editor').send({ filePath: 'docs/readme.md' });

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to open editor' });
  });
});
