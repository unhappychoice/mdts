import { SearchEngine } from '../../../src/server/search';
import * as fs from 'fs';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  statSync: jest.fn(),
  writeFileSync: jest.fn(),
  promises: {
    readFile: jest.fn(),
    stat: jest.fn(),
    writeFile: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('glob', () => ({
  glob: jest.fn().mockResolvedValue(['file1.md', 'file2.md', 'large.md']),
}));

describe('SearchEngine', () => {
  const mockDirectory = '/test/dir';
  let engine: SearchEngine;

  beforeEach(() => {
    jest.clearAllMocks();
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockImplementation((p: string) => {
      if (p.endsWith('file1.md')) return 'alpha content';
      if (p.endsWith('file2.md')) return 'beta content';
      if (p.endsWith('large.md')) return 'large content';
      return '';
    });
    (fs.promises.readFile as jest.Mock).mockImplementation((p: string) => {
      if (p.endsWith('file1.md')) return Promise.resolve('alpha content');
      if (p.endsWith('file2.md')) return Promise.resolve('beta content');
      if (p.endsWith('large.md')) return Promise.resolve('large content');
      return Promise.resolve('');
    });
    (fs.statSync as jest.Mock).mockImplementation((p: string) => ({
      size: p.endsWith('large.md') ? 10 * 1024 * 1024 : 1024,
    }));
    (fs.promises.stat as jest.Mock).mockImplementation((p: string) => Promise.resolve({
      size: p.endsWith('large.md') ? 10 * 1024 * 1024 : 1024,
    }));
  });

  it('should honor maxFiles option', async () => {
    engine = new SearchEngine(mockDirectory, { maxFiles: 1 });
    await engine.indexDirectory();
    
    const results = await engine.search('content');
    expect(results).toHaveLength(1);
    expect(results[0].path).toBe('file1.md');
  });

  it('should honor maxFileSize option', async () => {
    engine = new SearchEngine(mockDirectory, { maxFileSize: 5 * 1024 * 1024 });
    await engine.indexDirectory();
    
    const results = await engine.search('content');
    // large.md is 10MB, so it should be skipped
    expect(results.find(r => r.path === 'large.md')).toBeUndefined();
  });

  it('should return expected result shape', async () => {
    engine = new SearchEngine(mockDirectory);
    await engine.indexDirectory();
    
    const results = await engine.search('alpha');
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      id: 'file1.md',
      title: 'file1.md',
      path: 'file1.md',
      snippets: [
        { line: 1, text: 'alpha content' }
      ]
    });
  });

  it('should prevent path traversal in snippets', async () => {
    engine = new SearchEngine(mockDirectory);
    // Directly add a document with a malicious ID
    // @ts-expect-error: accessing private member for testing
    const miniSearch = engine.miniSearch;
    miniSearch.add({
      id: '../../secret.txt',
      title: 'Evil',
      content: 'evil',
      path: '../../secret.txt'
    });

    const results = await engine.search('evil');
    expect(results[0].snippets).toHaveLength(0);
  });
});
