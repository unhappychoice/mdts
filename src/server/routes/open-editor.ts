import { Router } from 'express';
import * as fs from 'fs';
import path from 'path';
import { logger } from '../../utils/logger';
import { ServerContext } from '../context';

type EditorTarget = {
  file: string;
  line?: number;
  column?: number;
};

type OpenEditorFn = (files: readonly EditorTarget[]) => Promise<void>;

const defaultOpenEditor: OpenEditorFn = async (files) => {
  const { default: openEditor } = await import('open-editor');
  await openEditor(files);
};

const isInsideDirectory = (baseDirectory: string, targetPath: string): boolean => {
  const relativePath = path.relative(baseDirectory, targetPath);
  return relativePath === '' || (!relativePath.startsWith('..') && !path.isAbsolute(relativePath));
};

const normalizePositiveInteger = (value: unknown): number | undefined => {
  if (value === undefined || value === null) return undefined;
  const parsedValue = Number(value);
  if (!Number.isInteger(parsedValue) || parsedValue < 1) return undefined;
  return parsedValue;
};

export const openEditorRouter = (
  context: ServerContext,
  openEditor: OpenEditorFn = defaultOpenEditor,
): Router => {
  const { directory } = context;
  const router = Router();

  router.post('/', async (req, res) => {
    const { filePath } = req.body ?? {};
    if (typeof filePath !== 'string' || filePath.trim() === '') {
      return res.status(400).json({ error: 'filePath is required' });
    }

    const absoluteFilePath = path.resolve(directory, filePath);
    if (!isInsideDirectory(directory, absoluteFilePath)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (!fs.existsSync(absoluteFilePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    if (fs.statSync(absoluteFilePath).isDirectory()) {
      return res.status(400).json({ error: 'Cannot open a directory in editor' });
    }

    try {
      const line = normalizePositiveInteger(req.body.line);
      const column = normalizePositiveInteger(req.body.column);
      await openEditor([{ file: absoluteFilePath, line, column }]);
      res.status(204).send();
    } catch (error) {
      logger.error(`Failed to open ${absoluteFilePath} in editor:`, error);
      res.status(500).json({ error: 'Failed to open editor' });
    }
  });

  return router;
};
