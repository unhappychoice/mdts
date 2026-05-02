import axios from 'axios';
import { ChildProcess, spawn } from 'child_process';
import path from 'path';

const cliPath = path.resolve(__dirname, '../../bin/mdts');
const testDirectory = path.resolve(__dirname, '../fixtures/mountDirectory');
const port = 8522;

describe('CLI e2e tests', () => {
  let cliProcess: ChildProcess;

  beforeAll(async () => {
    cliProcess = spawn('node', [cliPath, '-p', String(port), '--no-open', testDirectory]);

    cliProcess.stderr?.on('data', (data: Buffer) => {
      console.error(`CLI stderr: ${data}`);
    });

    const maxAttempts = 30;
    const delayMs = 1000;
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const response = await axios.get(`http://localhost:${port}/api/markdown/content/test.md`);
        if (response.status === 200) {
          console.log(`Server is ready after ${i + 1} attempts.`);
          return;
        }
      } catch {
        // Server not ready yet, continue polling
      }
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
    throw new Error('Server did not become ready within the timeout.');
  }, 60000);

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

