import express from 'express';
import * as fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger';
import { ServerContext } from './context';
import { fileTreeRouter } from './routes/filetree';
import { outlineRouter } from './routes/outline';
import { getConfig, saveConfig } from './config';
import { setupWatcher } from './watcher';
import { diffRouter, diffPrevRouter } from './routes/diff';
import { plantumlRouter } from './routes/plantuml';
import { SearchEngine } from './search';

const MAX_PORT_RETRIES = 10;

export const serve = async (
  context: ServerContext,
  port: number,
  host: string,
  autoPort: boolean = false,
): Promise<{ server: import('http').Server; port: number }> => {
  const searchEngine = new SearchEngine(context.directory, {
    maxFiles: context.searchMaxFiles,
    maxFileSize: context.searchMaxFileSize,
  });
  await searchEngine.initialize();
  context.searchEngine = searchEngine;

  const app = createApp(context);

  type ServeResult = { server: import('http').Server; port: number };
  const tryListen = (currentPort: number, retries: number): Promise<ServeResult> => {
    return new Promise((resolve, reject) => {
      const server = app.listen(currentPort, host);

      server.once('listening', () => {
        logger.log('Server', `📁 Mounted directory: ${context.directory}`);
        if (context.filePatterns) {
          logger.log('Server', `📄 Watching ${context.filePatterns.length} files from glob patterns`);
        }
        if (currentPort !== port) {
          logger.log('Server', `⚠️  Port ${port} was in use, using ${currentPort} instead`);
        }
        logger.log('Server', `🚀 Server listening at http://${host}:${currentPort}`);
        setupWatcher(context as ServerContext, server, currentPort);
        resolve({ server, port: currentPort });
      });

      server.once('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE' && autoPort && retries > 0) {
          logger.log('Server', `⚠️  Port ${currentPort} is in use, trying ${currentPort + 1}...`);
          resolve(tryListen(currentPort + 1, retries - 1));
        } else {
          reject(err);
        }
      });
    });
  };

  return tryListen(port, autoPort ? MAX_PORT_RETRIES : 0);
};

export const createApp = (
  context: ServerContext,
  currentLocation: string = __dirname,
): express.Express => {
  const { directory, searchEngine } = context;
  const app = express();

  // JSON middleware - must be before routes that need it
  app.use(express.json());

  // Mount library static files
  app.use(express.static(path.join(currentLocation, './public')));
  app.use(express.static(path.join(currentLocation, '../frontend')));

  // Define API
  app.use('/api/filetree', fileTreeRouter(context));
  app.use('/api/outline', outlineRouter(directory));
  app.use('/api/diff-prev', diffPrevRouter(context));
  app.use('/api/diff', diffRouter(context));
  app.use('/api/plantuml', plantumlRouter());
  
  app.get('/api/search', (req, res) => {
    /**
     * SECURITY NOTE: This endpoint allows full-text search over the indexed directory.
     * 
     * Design Intent:
     * - This is a local development tool. By default, it should only be accessible via localhost.
     * - Exposing this server to a public network (e.g., via a tunnel or public IP) carries risks.
     * 
     * Risks of Public Exposure:
     * 1. Data Scraping: An attacker could brute-force common words to extract sensitive content.
     * 2. Resource Exhaustion: Rapid-fire search queries can consume significant CPU/Memory.
     * 
     * Recommendations for Public Use:
     * - Implementation of a Rate Limiter (e.g., express-rate-limit).
     * - Implementation of Authentication (e.g., API keys or OAuth).
     * - Ensuring the server binds strictly to 127.0.0.1.
     */
    const query = req.query.q as string;
    if (!query || !searchEngine) {
      return res.json([]);
    }
    const results = searchEngine.search(query);
    res.json(results);
  });

  app.get('/api/config', (req, res) => {
    res.json(getConfig());
  });
  app.post('/api/config', (req, res) => {
    try {
      saveConfig(req.body);
      res.status(200).send('Config saved');
    } catch (error) {
      logger.error('Failed to save config:', error);
      res.status(500).send('Failed to save config');
    }
  });

  app.get('/api/markdown/mdts-welcome-markdown.md', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.sendFile('welcome.md', { root: path.join(currentLocation, './public') });
  });

  app.use('/api/markdown', (req, res, next) => {
    // Decode the URI component to handle encoded characters in the path
    const decodedPath = decodeURIComponent(req.path);
    // Normalize the path to resolve '..' and '.' segments
    const normalizedPath = path.normalize(decodedPath);

    // Construct the full file path
    const filePath = path.join(directory, normalizedPath);

    // Security check: Ensure the resolved path is within the designated directory
    // This prevents path traversal attacks (e.g., accessing files outside 'directory')
    if (!filePath.startsWith(directory)) {
      logger.error(`🚫 Attempted path traversal: ${filePath}`);
      return res.status(403).send('Forbidden');
    }

    if (!fs.existsSync(filePath)) {
      logger.error(`🚫 File not found: ${filePath}`);
      return res.status(404).send('File not found');
    }
    next();
  });
  app.use('/api/markdown', express.static(directory));

  // Catch-all route to serve index.html for any other requests
  app.get('*splat', async (req, res) => {
    const filePath = path.join(directory, req.path);
    let isDirectory = false;
    try {
      const stats = fs.statSync(filePath);
      isDirectory = stats.isDirectory();
    } catch {
      // File or directory does not exist, proceed as if it's a file
    }

    if (
      isDirectory ||
      req.path.toLowerCase().endsWith('.md') ||
      req.path.toLowerCase().endsWith('.markdown')
    ) {
      return res.sendFile('index.html', { root: path.join(currentLocation, '../frontend') });
    } else {
      return res.sendFile(req.path, { root: directory }, (err) => {
        if (err) {
          if ('code' in err && err.code === 'ENOENT') {
            logger.error(`🚫 File not found: ${path.join(directory, req.path)}`);
            res.status(404).send('File not found');
          } else {
            logger.error(`🚫 Error serving file ${path.join(directory, req.path)}:`, err);
            res.status(500).send('Internal Server Error');
          }
        }
      });
    }
  });

  return app;
};
