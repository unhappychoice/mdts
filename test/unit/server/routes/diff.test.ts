import express from 'express';
import request from 'supertest';
import simpleGit from 'simple-git';
import { diffRouter, diffPrevRouter } from '../../../../src/server/routes/diff';

jest.mock('simple-git');

describe('diff routes', () => {
  const mockDirectory = '/mock/base/dir';

  describe('diffRouter', () => {
    let app: express.Application;
    const mockDiff = jest.fn();
    const mockCheckIsRepo = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
      (simpleGit as unknown as jest.Mock).mockReturnValue({
        diff: mockDiff,
        checkIsRepo: mockCheckIsRepo,
      });
      app = express();
      app.use('/api/diff', diffRouter({ directory: mockDirectory }));
    });

    it('should return diff for a file', async () => {
      mockCheckIsRepo.mockResolvedValue(true);
      mockDiff.mockResolvedValue('--- a/test.md\n+++ b/test.md\n@@ -1 +1 @@\n-old\n+new');

      const response = await request(app).get('/api/diff/test.md');
      expect(response.statusCode).toBe(200);
      expect(response.text).toContain('-old');
      expect(response.text).toContain('+new');
      expect(mockDiff).toHaveBeenCalledWith(['test.md']);
    });

    it('should return 404 when not a git repository', async () => {
      mockCheckIsRepo.mockResolvedValue(false);

      const response = await request(app).get('/api/diff/test.md');
      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({ error: 'Not a git repository' });
    });

    it('should return 500 when git diff fails', async () => {
      mockCheckIsRepo.mockResolvedValue(true);
      mockDiff.mockRejectedValue(new Error('git error'));

      const response = await request(app).get('/api/diff/test.md');
      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to get diff' });
    });

    it('should return empty string when no changes', async () => {
      mockCheckIsRepo.mockResolvedValue(true);
      mockDiff.mockResolvedValue('');

      const response = await request(app).get('/api/diff/test.md');
      expect(response.statusCode).toBe(200);
      expect(response.text).toBe('');
    });
  });

  describe('diffPrevRouter', () => {
    let app: express.Application;
    const mockDiff = jest.fn();
    const mockLog = jest.fn();
    const mockCheckIsRepo = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
      (simpleGit as unknown as jest.Mock).mockReturnValue({
        diff: mockDiff,
        log: mockLog,
        checkIsRepo: mockCheckIsRepo,
      });
      app = express();
      app.use('/api/diff-prev', diffPrevRouter({ directory: mockDirectory }));
    });

    it('should return diff of the last commit that changed the file', async () => {
      mockCheckIsRepo.mockResolvedValue(true);
      mockLog.mockResolvedValue({ latest: { hash: 'abc123' } });
      mockDiff.mockResolvedValue('--- a/test.md\n+++ b/test.md\n@@ -1 +1 @@\n-previous\n+current');

      const response = await request(app).get('/api/diff-prev/test.md');
      expect(response.statusCode).toBe(200);
      expect(response.text).toContain('-previous');
      expect(response.text).toContain('+current');
      expect(mockLog).toHaveBeenCalledWith({ maxCount: 1, file: 'test.md' });
      expect(mockDiff).toHaveBeenCalledWith(['abc123~1', 'abc123', '--', 'test.md']);
    });

    it('should return empty string when file has no git history', async () => {
      mockCheckIsRepo.mockResolvedValue(true);
      mockLog.mockResolvedValue({ latest: null });

      const response = await request(app).get('/api/diff-prev/test.md');
      expect(response.statusCode).toBe(200);
      expect(response.text).toBe('');
    });

    it('should return 404 when not a git repository', async () => {
      mockCheckIsRepo.mockResolvedValue(false);

      const response = await request(app).get('/api/diff-prev/test.md');
      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({ error: 'Not a git repository' });
    });

    it('should return 500 when git command fails', async () => {
      mockCheckIsRepo.mockResolvedValue(true);
      mockLog.mockRejectedValue(new Error('git error'));

      const response = await request(app).get('/api/diff-prev/test.md');
      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to get previous diff' });
    });

    it('should fallback to empty tree diff for initial commit', async () => {
      mockCheckIsRepo.mockResolvedValue(true);
      mockLog.mockResolvedValue({ latest: { hash: 'first123' } });
      mockDiff
        .mockRejectedValueOnce(new Error('unknown revision first123~1'))
        .mockResolvedValueOnce('+initial content');

      const response = await request(app).get('/api/diff-prev/test.md');
      expect(response.statusCode).toBe(200);
      expect(response.text).toBe('+initial content');
      expect(mockDiff).toHaveBeenCalledWith(['first123~1', 'first123', '--', 'test.md']);
      expect(mockDiff).toHaveBeenCalledWith([
        '4b825dc642cb6eb9a060e54bf899d69f7cb46252', 'first123', '--', 'test.md',
      ]);
    });

    it('should handle nested file paths', async () => {
      mockCheckIsRepo.mockResolvedValue(true);
      mockLog.mockResolvedValue({ latest: { hash: 'def456' } });
      mockDiff.mockResolvedValue('diff content');

      const response = await request(app).get('/api/diff-prev/docs/guide.md');
      expect(response.statusCode).toBe(200);
      expect(mockLog).toHaveBeenCalledWith({ maxCount: 1, file: 'docs/guide.md' });
      expect(mockDiff).toHaveBeenCalledWith(['def456~1', 'def456', '--', 'docs/guide.md']);
    });
  });
});
