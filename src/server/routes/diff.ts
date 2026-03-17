import { Router } from 'express';
import simpleGit, { SimpleGit } from 'simple-git';
import { ServerContext } from '../context';

const extractFilePath = (params: Record<string, unknown>): string => {
  const splat = params.splat;
  return Array.isArray(splat) ? splat.join('/') : String(splat);
};

export const diffRouter = (context: ServerContext): Router => {
  const { directory } = context;
  const router = Router();
  const git: SimpleGit = simpleGit({ baseDir: directory });

  // GET /api/diff/:path - current working tree diff
  router.get('/*splat', async (req, res) => {
    const filePath = extractFilePath(req.params);
    try {
      const isRepo = await git.checkIsRepo();
      if (!isRepo) {
        return res.status(404).json({ error: 'Not a git repository' });
      }
      const diff = await git.diff([filePath]);
      res.setHeader('Content-Type', 'text/plain');
      res.send(diff);
    } catch {
      res.status(500).json({ error: 'Failed to get diff' });
    }
  });

  return router;
};

export const diffPrevRouter = (context: ServerContext): Router => {
  const { directory } = context;
  const router = Router();
  const git: SimpleGit = simpleGit({ baseDir: directory });

  // GET /api/diff-prev/:path - diff between HEAD~1 and HEAD
  router.get('/*splat', async (req, res) => {
    const filePath = extractFilePath(req.params);
    try {
      const isRepo = await git.checkIsRepo();
      if (!isRepo) {
        return res.status(404).json({ error: 'Not a git repository' });
      }
      const diff = await git.diff(['HEAD~1', 'HEAD', '--', filePath]);
      res.setHeader('Content-Type', 'text/plain');
      res.send(diff);
    } catch {
      res.status(500).json({ error: 'Failed to get previous diff' });
    }
  });

  return router;
};
