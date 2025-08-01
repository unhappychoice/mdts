import fs from 'fs';
import os from 'os';
import path from 'path';
import { getConfig, saveConfig } from '../../../src/server/config';

describe('config', () => {
  const originalFsReadFile = fs.readFileSync;
  const originalFsExistsSync = fs.existsSync;
  const originalFsMkdirSync = fs.mkdirSync;
  const originalFsWriteFileSync = fs.writeFileSync;
  const configPath = path.join(os.homedir(), '.config', 'mdts', 'config.json');

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock fs functions
    fs.readFileSync = jest.fn();
    fs.existsSync = jest.fn();
    fs.mkdirSync = jest.fn();
    fs.writeFileSync = jest.fn();
  });

  afterEach(() => {
    // Restore original fs functions
    fs.readFileSync = originalFsReadFile;
    fs.existsSync = originalFsExistsSync;
    fs.mkdirSync = originalFsMkdirSync;
    fs.writeFileSync = originalFsWriteFileSync;
  });

  it('getConfig should return default config if file does not exist', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    const config = getConfig();
    expect(config).toEqual({
      fontFamily: 'Roboto',
      fontFamilyMonospace: 'monospace',
      fontSize: 16,
    });
    expect(fs.existsSync).toHaveBeenCalledWith(configPath);
    expect(fs.readFileSync).not.toHaveBeenCalled();
  });

  it('getConfig should return config from file if it exists', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({
      fontFamily: 'CustomFont',
      fontFamilyMonospace: 'CustomMono',
      fontSize: 20,
    }));
    const config = getConfig();
    expect(config).toEqual({
      fontFamily: 'CustomFont',
      fontFamilyMonospace: 'CustomMono',
      fontSize: 20,
    });
    expect(fs.existsSync).toHaveBeenCalledWith(configPath);
    expect(fs.readFileSync).toHaveBeenCalledWith(configPath, 'utf-8');
  });

  it('getConfig should merge default config with file config', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({
      fontFamily: 'PartialFont',
    }));
    const config = getConfig();
    expect(config).toEqual({
      fontFamily: 'PartialFont',
      fontFamilyMonospace: 'monospace',
      fontSize: 16,
    });
  });

  it('saveConfig should create directory and write config to file', () => {
    const newConfig = {
      fontFamily: 'NewFont',
      fontFamilyMonospace: 'NewMono',
      fontSize: 22,
    };
    saveConfig(newConfig);
    expect(fs.mkdirSync).toHaveBeenCalledWith(path.dirname(configPath), { recursive: true });
    expect(fs.writeFileSync).toHaveBeenCalledWith(configPath, JSON.stringify(newConfig, null, 2));
  });

  it('saveConfig should merge new config with existing config before writing', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({
      fontFamily: 'ExistingFont',
      fontSize: 18,
    }));
    const newConfig = {
      fontFamilyMonospace: 'NewMono',
    };
    saveConfig(newConfig);
    expect(fs.writeFileSync).toHaveBeenCalledWith(configPath, JSON.stringify({
      fontFamily: 'ExistingFont',
      fontFamilyMonospace: 'NewMono',
      fontSize: 18,
    }, null, 2));
  });
});
