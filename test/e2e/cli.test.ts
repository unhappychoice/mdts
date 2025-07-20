import axios from 'axios';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';

const cliPath = path.resolve(__dirname, '../../bin/mdts');
const testDirectory = path.resolve(__dirname, '../fixtures/mountDirectory');
const port = 8522;

describe('CLI e2e tests', () => {
  let cliProcess: any;
  let tempDir: string;
  let originalPath: string | undefined;

  beforeAll((done) => {
    // Create a temporary directory for our dummy 'open' executable
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mdts-test-'));

    // Create a dummy 'open' executable that does nothing
    const dummyOpenPath = path.join(tempDir, 'open');
    fs.writeFileSync(dummyOpenPath, '#!/bin/bash\nexit 0');
    fs.chmodSync(dummyOpenPath, '755'); // Make it executable

    // Store original PATH and prepend our temp directory to it
    originalPath = process.env.PATH;
    process.env.PATH = `${tempDir}${path.delimiter}${process.env.PATH}`;

    cliProcess = spawn('node', [cliPath, '-p', String(port), testDirectory], {
      env: { ...process.env, PATH: process.env.PATH }, // Pass the modified PATH to the child process
    });

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
    // Clean up the temporary directory and restore original PATH
    if (tempDir) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    if (originalPath !== undefined) {
      process.env.PATH = originalPath;
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
