import { Router } from 'express';
import fs from 'fs';
import MarkdownIt from 'markdown-it';
import path from 'path';
import { ServerContext } from '../context';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

const isInsideDirectory = (baseDirectory: string, targetPath: string): boolean => {
  const relativePath = path.relative(baseDirectory, targetPath);
  return relativePath === '' || (!relativePath.startsWith('..') && !path.isAbsolute(relativePath));
};

const isMarkdownFile = (filePath: string): boolean => {
  const lowerPath = filePath.toLowerCase();
  return lowerPath.endsWith('.md') || lowerPath.endsWith('.markdown');
};

const escapeHtml = (value: string): string => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const toHtmlFileName = (filePath: string): string => {
  const fileName = path.basename(filePath).replace(/\.(md|markdown)$/i, '.html');
  return fileName === path.basename(filePath) ? `${fileName}.html` : fileName;
};

interface HtmlDocumentOptions {
  autoPrint?: boolean;
}

const buildHtmlDocument = (filePath: string, markdown: string, options: HtmlDocumentOptions = {}): string => {
  const title = path.basename(filePath);
  const renderedMarkdown = md.render(markdown);
  const printScript = options.autoPrint
    ? [
      '  <script>',
      '    window.addEventListener("load", () => window.print());',
      '  </script>',
    ]
    : [];

  return [
    '<!doctype html>',
    '<html>',
    '<head>',
    '  <meta charset="utf-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1">',
    `  <title>${escapeHtml(title)}</title>`,
    '  <style>',
    '    body { box-sizing: border-box; max-width: 900px; margin: 40px auto; padding: 0 24px;',
    '      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;',
    '      line-height: 1.65; color: #24292f; }',
    '    pre { overflow: auto; padding: 16px; background: #f6f8fa; border-radius: 6px; }',
    '    code { font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, monospace; }',
    '    table { border-collapse: collapse; width: 100%; display: block; overflow: auto; }',
    '    th, td { border: 1px solid #d0d7de; padding: 6px 13px; }',
    '    blockquote { margin-left: 0; padding-left: 16px; color: #57606a; border-left: 4px solid #d0d7de; }',
    '    img { max-width: 100%; }',
    '  </style>',
    ...printScript,
    '</head>',
    '<body>',
    renderedMarkdown,
    '</body>',
    '</html>',
  ].join('\n');
};

interface LoadedMarkdown {
  filePath: string;
  markdown: string;
}

interface ExportError {
  error: string;
  statusCode: number;
}

const loadMarkdown = (directory: string, filePath: string): LoadedMarkdown | ExportError => {
  if (!filePath.trim()) {
    return { statusCode: 400, error: 'filePath is required' };
  }

  if (!isMarkdownFile(filePath)) {
    return { statusCode: 400, error: 'Only markdown files can be exported' };
  }

  const absoluteFilePath = path.resolve(directory, filePath);
  if (!isInsideDirectory(directory, absoluteFilePath)) {
    return { statusCode: 403, error: 'Forbidden' };
  }

  if (!fs.existsSync(absoluteFilePath)) {
    return { statusCode: 404, error: 'File not found' };
  }

  if (fs.statSync(absoluteFilePath).isDirectory()) {
    return { statusCode: 400, error: 'Cannot export a directory' };
  }

  return {
    filePath,
    markdown: fs.readFileSync(absoluteFilePath, 'utf8'),
  };
};

const isExportError = (result: LoadedMarkdown | ExportError): result is ExportError => {
  return 'error' in result;
};

export const exportRouter = (context: ServerContext): Router => {
  const router = Router();
  const { directory } = context;

  router.get('/html', (req, res) => {
    const filePath = typeof req.query.filePath === 'string' ? req.query.filePath : '';
    const result = loadMarkdown(directory, filePath);
    if (isExportError(result)) {
      return res.status(result.statusCode).json({ error: result.error });
    }

    const html = buildHtmlDocument(result.filePath, result.markdown);
    res.attachment(toHtmlFileName(filePath));
    res.type('html').send(html);
  });

  router.get('/print', (req, res) => {
    const filePath = typeof req.query.filePath === 'string' ? req.query.filePath : '';
    const result = loadMarkdown(directory, filePath);
    if (isExportError(result)) {
      return res.status(result.statusCode).json({ error: result.error });
    }

    const html = buildHtmlDocument(result.filePath, result.markdown, { autoPrint: true });
    res.type('html').send(html);
  });

  return router;
};
