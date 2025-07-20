import chokidar, { FSWatcher } from 'chokidar';
import express from 'express';
import * as fs from 'fs';
import path from 'path';
import { WebSocketServer } from 'ws';
import * as http from 'http';
import { fileTreeRouter } from './routes/filetree';
import { outlineRouter } from './routes/outline';
import { logger } from '../utils/logger';

export const serve = (directory: string, port: number): import('http').Server => {
  const app = createApp(directory);
  const server = app.listen(port, () => {
    logger.log(`🚀 Server listening at http://localhost:${port}`);
  });

  setupWatcher(directory, server, port);

  return server;
};

export const createApp = (
  directory: string,
  currentLocation: string = __dirname,
): express.Express => {
  const app = express();

  // Mount library static files
  app.use(express.static(path.join(currentLocation, './public')));
  app.use(express.static(path.join(currentLocation, '../frontend')));

  // Define API
  app.use('/api/filetree', fileTreeRouter(directory));
  app.use('/api/outline', outlineRouter(directory));

  app.get('/api/markdown/mdts-welcome-markdown.md', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.sendFile(path.join(currentLocation, './public/welcome.md'));
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
  app.get('*', async (req, res) => {
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
      return res.sendFile(path.join(currentLocation, '../frontend/index.html'));
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

const setupWatcher = (directory: string, server: http.Server, port: number) => {
  const wss = new WebSocketServer({ server });

  wss.on('listening', () => {
    logger.log(`🚀 WebSocket server listening at ws://localhost:${port}`);
  });

  wss.on('connection', () => {
    logger.log('🤝 Livereload Client connected');

    wss.on('close', () => {
      logger.log('👋 Livereload Client closed');
    });

    wss.on('wsClientError', (e) => {
      logger.error('🚫 Error on WebSocket server:', e);
    });

    wss.on('error', (e) => {
      logger.error('🚫 Error on WebSocket server:', e);
    });
  });

  const isMarkdownOrSimpleAsset = (filePath: string) => {
    const ext = filePath.toLowerCase().split('.').pop();
    return ext && (ext === 'md' || ext === 'markdown');
  };

  let watcher: FSWatcher | null = null;

  try {
    watcher = chokidar.watch(directory, {
      ignored: (watchedFilePath: string) => {
        if (watchedFilePath.includes('node_modules')) {
          return true;
        }
        try {
          if (fs.statSync(watchedFilePath).isDirectory()) {
            return false; // Don't ignore directories
          }
        } catch {
          // On error (e.g., file not found), let chokidar handle it
          return false;
        }
        return !isMarkdownOrSimpleAsset(watchedFilePath);
      },
      ignoreInitial: true,
    });
  } catch (e) {
    logger.error('🚫 Error watching directory:', e);
    logger.error('Livereload will be disabled');
  }

  watcher?.on('change', (filePath) => {
    logger.log(`🔃 File changed: ${filePath}, reloading...`);
    wss.clients.forEach((client) => {
      client.send(JSON.stringify({ type: 'reload-content' }));
    });
  });

  watcher?.on('add', (filePath) => {
    logger.log(`🌲 File added: ${filePath}, reloading tree...`);
    wss.clients.forEach((client) => {
      client.send(JSON.stringify({ type: 'reload-tree' }));
    });
  });

  watcher?.on('unlink', (filePath) => {
    logger.log(`🌲 File removed: ${filePath}, reloading tree...`);
    wss.clients.forEach((client) => {
      client.send(JSON.stringify({ type: 'reload-tree' }));
    });
  });
};

