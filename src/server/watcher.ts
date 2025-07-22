import chokidar, { FSWatcher } from 'chokidar';
import * as fs from 'fs';
import * as http from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { logger } from '../utils/logger';

let contentWatcher: FSWatcher | null = null;
let currentWatchedFile: string | null = null;

export const setupWatcher = (directory: string, server: http.Server, port: number): void => {
  const wss = new WebSocketServer({ server });

  wss.on('listening', () => {
    logger.log(`🚀 WebSocket server listening at ws://localhost:${port}`);
  });

  wss.on('connection', (ws) => {
    logger.log('🤝 Livereload Client connected');
    ws.on('message', (message) => handleWebSocketMessage(ws, message.toString()));
    ws.on('close', () => handleWebSocketClose(wss));
    ws.on('error', (e) => logger.error('🚫 Error on WebSocket client:', e));
  });

  setupDirectoryWatcher(directory, wss);
};

const handleWebSocketMessage = (ws: WebSocket, message: string): void => {
  try {
    const data = JSON.parse(message);
    if (data.type === 'watch-file' && typeof data.filePath === 'string') {
      setupContentWatcher(ws, data.filePath);
    }
  } catch (e) {
    logger.error('🚫 Error parsing WebSocket message:', e);
  }
};

const handleWebSocketClose = (wss: WebSocketServer): void => {
  logger.log('👋 Livereload Client closed');
  if (wss.clients.size === 0) {
    contentWatcher?.close();
    contentWatcher = null;
    currentWatchedFile = null;
  }
};

const setupDirectoryWatcher = (directory: string, wss: WebSocketServer): FSWatcher | null => {
  try {
    const watcher = chokidar.watch(directory, {
      ignored: (watchedFilePath: string) => {
        if (watchedFilePath.includes('node_modules')) {
          return true;
        }
        try {
          if (fs.statSync(watchedFilePath).isDirectory()) {
            return false;
          }
        } catch {
          return false;
        }
        return !isMarkdownOrSimpleAsset(watchedFilePath);
      },
      ignoreInitial: true,
    });

    watcher.on('add', (filePath) => {
      logger.log(`🌲 File added: ${filePath}, reloading tree...`);
      wss.clients.forEach((client) => {
        client.send(JSON.stringify({ type: 'reload-tree' }));
      });
    });

    watcher.on('unlink', (filePath) => {
      logger.log(`🌲 File removed: ${filePath}, reloading tree...`);
      wss.clients.forEach((client) => {
        client.send(JSON.stringify({ type: 'reload-tree' }));
      });
    });

    return watcher;
  } catch (e) {
    logger.error('🚫 Error watching directory:', e);
    logger.error('Livereload will be disabled');
    return null;
  }
};

const setupContentWatcher = (ws: WebSocket, filePath: string): void => {
  if (filePath !== currentWatchedFile) {
    logger.log(`👀 Watching file: ${filePath}`);
    currentWatchedFile = filePath;

    contentWatcher?.close(); // Close existing content watcher if any

    contentWatcher = chokidar.watch(filePath, { ignoreInitial: true });
    contentWatcher.on('change', (changedFilePath) => {
      logger.log(`🔃 File changed: ${changedFilePath}, reloading content...`);
      ws.send(JSON.stringify({ type: 'reload-content' }));
    });
    contentWatcher.on('error', (e) => {
      logger.error(`🚫 Error watching content file ${filePath}:`, e);
    });
  }
};

const isMarkdownOrSimpleAsset = (filePath: string): boolean => {
  const ext = filePath.toLowerCase().split('.').pop();
  return !!ext && (ext === 'md' || ext === 'markdown');
};
