import { spawn } from 'child_process';
import axios from 'axios';
import path from 'path';
import fs from 'fs';

const cliPath = path.resolve(__dirname, '../../bin/mdts');
const testDirectory = path.resolve(__dirname, '../fixtures/mountDirectory');
const port = 8522;

// Mock the 'open' module to prevent actual browser opening
jest.mock('open', () => jest.fn(() => Promise.resolve()));

describe('CLI e2e tests', () => {
  let cliProcess: any;

  beforeAll((done) => {
    cliProcess = spawn('node', [cliPath, '-p', String(port), testDirectory]);

    cliProcess.stdout.on('data', (data: Buffer) => {
      const output = data.toString();
      if (output.includes(`Server listening at http://localhost:${port}`)) {
        done();
      }
    });

    cliProcess.stderr.on('data', (data: Buffer) => {
      console.error(`CLI stderr: ${data}`);
    });

    cliProcess.on('error', (err: Error) => {
      console.error('Failed to start CLI process:', err);
      done(err);
    });
  }, 20000); // Increase timeout for beforeAll

  afterAll(() => {
    if (cliProcess) {
      cliProcess.kill();
    }
  });

  test('should serve content/test.md', async () => {
    const response = await axios.get(`http://localhost:${port}/api/markdown/content/test.md`);
    expect(response.status).toBe(200);
    expect(response.data).toContain('# Hello E2E');
  });

  test('should serve content/another.md', async () => {
    const response = await axios.get(`http://localhost:${port}/api/markdown/content/another.md`);
    expect(response.status).toBe(200);
    expect(response.data).toContain('## Another Markdown');
  });
});
