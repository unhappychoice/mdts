import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { fileTreeRouter } from './routes/filetree.js';
import { outlineRouter } from './routes/outline.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const serve = (directory: string, port: number) => {
  const app = express();

  app.use(express.static(path.join(__dirname, '../../public')));
  app.use(express.static(path.join(__dirname, '../../dist/frontend')));
  app.use('/content', express.static(directory));

  app.use('/api/filetree', fileTreeRouter(directory));
  app.use('/api/outline', outlineRouter(directory));

  // Catch-all route to serve index.html for any other requests
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  });

  app.listen(port, () => {
    console.log(`🚀 Server listening at http://localhost:${port}`);
  });
}
