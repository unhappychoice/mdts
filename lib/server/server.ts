import chokidar from 'chokidar';
import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';
import { promises as fs } from 'fs';
import { fileTreeRouter } from './routes/filetree.js';
import { outlineRouter } from './routes/outline.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const serve = (directory: string, port: number) => {
  const app = express();

  app.use(express.static(path.join(__dirname, '../../public')));
  app.use(express.static(path.join(__dirname, '../../dist/frontend')));

  app.use('/api/markdown', express.static(directory));
  app.use('/api/filetree', fileTreeRouter(directory));
  app.use('/api/outline', outlineRouter(directory));

  // Catch-all route to serve index.html for any other requests
  app.get('*', async (req, res) => {
    const filePath = path.join(directory, req.path);
    let isDirectory = false;
    try {
      const stats = await fs.stat(filePath);
      isDirectory = stats.isDirectory();
    } catch (error) {
      // File or directory does not exist, proceed as if it's a file
    }

    if (isDirectory || req.path.toLowerCase().endsWith('.md') || req.path.toLowerCase().endsWith('.markdown')) {
      return res.sendFile(path.join(__dirname, '../../public/index.html'));
    } else {
      return res.sendFile(req.path, { root: directory });
    }
  });

  const server = app.listen(port, () => {
    console.log(`🚀 Server listening at http://localhost:${port}`);
  });

  const wss = new WebSocketServer({ server });
  const watcher = chokidar.watch(directory, { ignored: /node_modules/, ignoreInitial: true });

  watcher.on('change', (filePath) => {
    console.log(`🔃 File changed: ${filePath}, reloading...`);
    wss.clients.forEach((client) => {
      client.send(JSON.stringify({ type: 'reload-content' }));
    });
  });

  watcher.on('add', (filePath) => {
    console.log(`🌲 File added: ${filePath}, reloading tree...`);
    wss.clients.forEach((client) => {
      client.send(JSON.stringify({ type: 'reload-tree' }));
    });
  });

  watcher.on('unlink', (filePath) => {
    console.log('🌲 File removed: ${filePath}, reloading tree...');
    wss.clients.forEach((client) => {
      client.send(JSON.stringify({ type: 'reload-tree' }));
    });
  });
}
