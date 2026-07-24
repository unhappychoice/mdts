import chokidar, { FSWatcher } from 'chokidar';
import * as fs from 'fs';
import * as http from 'http';
import path from 'path';
import { WebSocket, WebSocketServer } from 'ws';
import { logger } from '../utils/logger';
import { EXCLUDED_DIRECTORIES } from '../constants';
import { ServerContext } from './context';

let contentWatcher: FSWatcher | null = null;
let currentWatchedFile: string | null = null;

export const setupWatcher = (context: ServerContext, server: http.Server, port: number): void => {
  const wss = new WebSocketServer({ server });

  wss.on('listening', () => {
    logger.log('Livereload', `🚀 WebSocket server listening at ws://localhost:${port}`);
  });

  wss.on('connection', (ws) => {
    logger.log('Livereload', '🤝 Livereload Client connected');
    ws.on('message', (message) => handleWebSocketMessage(ws, context, message.toString()));
    ws.on('close', () => handleWebSocketClose(wss));
    ws.on('error', (e) => logger.error('🚫 Error on WebSocket client:', e));
  });

  if (context.filePatterns) {
    setupFilePatternWatcher(context, wss);
  } else {
    setupDirectoryWatcher(context, wss);
  }
};

const handleWebSocketMessage = (ws: WebSocket, context: ServerContext, message: string): void => {
  try {
    const data = JSON.parse(message);
    if (data.type === 'watch-file' && typeof data.filePath === 'string') {
      setupContentWatcher(ws, context, data.filePath);
    }
  } catch (e) {
    logger.error('🚫 Error parsing WebSocket message:', e);
  }
};

const handleWebSocketClose = (wss: WebSocketServer): void => {
  logger.log('Livereload', '👋 Livereload Client closed');
  if (wss.clients.size === 0) {
    contentWatcher?.close();
    contentWatcher = null;
    currentWatchedFile = null;
  }
};

const attachTreeReloadHandlers = (context: ServerContext, watcher: FSWatcher, wss: WebSocketServer): void => {
  const { searchEngine, directory } = context;
  
  watcher.on('add', (filePath) => {
    const relativePath = path.relative(directory, filePath);
    logger.log('Livereload', `🌲 File added: ${relativePath}, reloading tree...`);
    searchEngine?.updateFile(relativePath);
    wss.clients.forEach((client) => {
      client.send(JSON.stringify({ type: 'reload-tree' }));
    });
  });

  watcher.on('unlink', (filePath) => {
    const relativePath = path.relative(directory, filePath);
    logger.log('Livereload', `🌲 File removed: ${relativePath}, reloading tree...`);
    searchEngine?.updateFile(relativePath);
    wss.clients.forEach((client) => {
      client.send(JSON.stringify({ type: 'reload-tree' }));
    });
  });

  watcher.on('change', (filePath) => {
    const relativePath = path.relative(directory, filePath);
    logger.log('Livereload', `🌲 File changed: ${relativePath}, updating search index...`);
    searchEngine?.updateFile(relativePath);
  });
};

const setupDirectoryWatcher = (context: ServerContext, wss: WebSocketServer): FSWatcher | null => {
  const { directory } = context;
  try {
    const watcher = chokidar.watch(directory, {
      ignored: (watchedFilePath: string, stats?: fs.Stats) => {
        if (EXCLUDED_DIRECTORIES.some(p => watchedFilePath.includes(`/${p}`))) {
          return true;
        }

        if (stats) {
          return !stats.isDirectory() && !watchedFilePath.endsWith('.md') && !watchedFilePath.endsWith('.markdown');
        } else {
          return false;
        }
      },
      ignoreInitial: true,
    });

    attachTreeReloadHandlers(context, watcher, wss);

    watcher.on('error', (error) => {
      watcher.unwatch(directory);
      watcher.close()
        .then(() => logger.log('Livereload', 'Directory watcher closed'));

      logger.error('🚫 Error watching directory:', error);
      logger.error('Livereload will be disabled');

      if (error && typeof error === 'object' && 'code' in error && error.code === 'EMFILE')
        logger.error('This error is likely caused by too many open files. Try increasing the ulimit.');
    });

    return watcher;
  } catch (e) {
    logger.error('🚫 Error watching directory:', e);
    logger.error('Livereload will be disabled');
    return null;
  }
};

const setupFilePatternWatcher = (context: ServerContext, wss: WebSocketServer): FSWatcher | null => {
  const { directory, filePatterns } = context;
  if (!filePatterns || filePatterns.length === 0) return null;

  try {
    const absolutePaths = filePatterns.map(f => path.join(directory, f));
    const watcher = chokidar.watch(absolutePaths, { ignoreInitial: true });

    attachTreeReloadHandlers(context, watcher, wss);

    watcher.on('error', (error) => {
      watcher.close()
        .then(() => logger.log('Livereload', 'File pattern watcher closed'));
      logger.error('🚫 Error watching files:', error);
      logger.error('Livereload will be disabled');
    });

    return watcher;
  } catch (e) {
    logger.error('🚫 Error watching files:', e);
    logger.error('Livereload will be disabled');
    return null;
  }
};

const setupContentWatcher = (ws: WebSocket, context: ServerContext, filePath: string): void => {
  const { directory, searchEngine } = context;
  if (filePath !== currentWatchedFile) {
    logger.log('Livereload', `👀 Watching file: ${filePath}`);
    currentWatchedFile = filePath;

    contentWatcher?.close(); // Close existing content watcher if any

    contentWatcher = chokidar.watch(path.join(directory, currentWatchedFile), { ignoreInitial: true });
    contentWatcher.on('change', (changedFilePath) => {
      const relativePath = path.relative(directory, changedFilePath);
      logger.log('Livereload', `🔃 File changed: ${relativePath}, reloading content...`);
      searchEngine?.updateFile(relativePath);
      ws.send(JSON.stringify({ type: 'reload-content' }));
    });
    contentWatcher.on('error', (e) => {
      logger.error(`🚫 Error watching content file ${currentWatchedFile}:`, e);
    });
  }
};
