import chokidar from 'chokidar';
import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { WebSocketServer } from 'ws';
import * as http from 'http';
import { fileTreeRouter } from './routes/filetree';
import { outlineRouter } from './routes/outline';

export const serve = (directory: string, port: number): import('http').Server => {
  const app = createApp(directory);
  const server = app.listen(port, () => {
    console.log(`🚀 Server listening at http://localhost:${port}`);
  });

  setupWatcher(directory, server);

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
  app.use('/api/markdown', express.static(directory));

  // Catch-all route to serve index.html for any other requests
  app.get('*', async (req, res) => {
    const filePath = path.join(directory, req.path);
    let isDirectory = false;
    try {
      const stats = await fs.stat(filePath);
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
      return res.sendFile(req.path, { root: directory });
    }
  });

  return app;
};

const setupWatcher = (directory: string, server: http.Server) => {
  const wss = new WebSocketServer({ server });

  const isMarkdownOrSimpleAsset = (filePath: string) => {
    const ext = filePath.toLowerCase().split('.').pop();
    return (
      ext &&
      (ext === 'md' ||
        ext === 'markdown' ||
        ext === 'png' ||
        ext === 'jpg' ||
        ext === 'jpeg' ||
        ext === 'gif' ||
        ext === 'svg')
    );
  };

  let watcher;
  try {
    watcher = chokidar.watch(directory, {
      ignored: (watchedFilePath: string) => {
        if (watchedFilePath.includes('node_modules')) {
          return true;
        }
        return !isMarkdownOrSimpleAsset(watchedFilePath);
      },
      ignoreInitial: true,
    });
  } catch (e) {
    console.error('🚫 Error watching directory:', e);
    console.error('Livereload will be disabled');
  }

  watcher?.on('change', (filePath) => {
    console.log(`🔃 File changed: ${filePath}, reloading...`);
    wss.clients.forEach((client) => {
      client.send(JSON.stringify({ type: 'reload-content' }));
    });
  });

  watcher?.on('add', (filePath) => {
    console.log(`🌲 File added: ${filePath}, reloading tree...`);
    wss.clients.forEach((client) => {
      client.send(JSON.stringify({ type: 'reload-tree' }));
    });
  });

  watcher?.on('unlink', (filePath) => {
    console.log(`🌲 File removed: ${filePath}, reloading tree...`);
    wss.clients.forEach((client) => {
      client.send(JSON.stringify({ type: 'reload-tree' }));
    });
  });
};
