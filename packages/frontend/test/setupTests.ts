import '@testing-library/jest-dom';

// Mock fetch API
global.fetch = jest.fn((url) => {
  if (url.includes('/api/filetree')) {
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve([
        { 'folder1': ['file1.md', 'file2.txt'] },
        { 'folder2': ['file3.md'] }
      ]),
    });
  }
  if (url.includes('/api/markdown')) {
    return Promise.resolve({
      ok: true,
      status: 200,
      text: () => Promise.resolve('# Mock Markdown Content'),
    });
  }
  if (url.includes('/api/outline')) {
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve([{ level: 1, text: 'Mock Outline', id: 'mock-outline' }]),
    });
  }
  return Promise.reject(new Error(`Unhandled fetch for ${url}`));
});

// Polyfill TextEncoder and TextDecoder
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
