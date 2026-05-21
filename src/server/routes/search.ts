import { Router } from 'express';
import { ServerContext } from '../context';
import { logger } from '../../utils/logger';

export const searchRouter = (context: ServerContext): Router => {
  const router = Router();
  const { searchEngine } = context;

  router.get('/', async (req, res) => {
    /**
     * NOTE: For security considerations regarding full-text search exposure,
     * see docs/configuration.md#full-text-search
     */
    const query = req.query.q;

    if (typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter "q" must be a string' });
    }

    if (!query || !searchEngine) {
      return res.json([]);
    }

    try {
      const results = await searchEngine.search(query);
      res.json(results);
    } catch (error) {
      logger.error('Search', 'Error during search:', error);
      res.status(500).json({ error: 'Internal server error during search' });
    }
  });

  return router;
};
