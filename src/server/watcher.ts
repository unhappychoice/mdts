import chokidar, { FSWatcher } from 'chokidar';
import * as fs from 'fs';
import * as http from 'http';
import { WebSocketServer } from 'ws';
import { logger } from '../utils/logger';

export const setupWatcher = (directory: string, server: http.Server, port: number): void => {
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

const isMarkdownOrSimpleAsset = (filePath: string) => {
  const ext = filePath.toLowerCase().split('.').pop();
  return ext && (ext === 'md' || ext === 'markdown');
};
