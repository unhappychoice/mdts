const fs = jest.createMockFromModule('fs');

let mockFiles = Object.create(null);

function __setMockFiles(newMockFiles: { [key: string]: string }) {
  mockFiles = Object.create(null);
  for (const file in newMockFiles) {
    mockFiles[file] = newMockFiles[file];
  }
}

function existsSync(filePath: string) {
  return !!mockFiles[filePath];
}

function readFileSync(filePath: string, encoding: string) {
  if (encoding === 'utf-8') {
    return mockFiles[filePath] || '';
  }
  throw new Error('Unsupported encoding');
}

Object.defineProperty(fs, '__esModule', { value: true });

module.exports = {
  ...fs,
  __setMockFiles,
  existsSync,
  readFileSync,
};
