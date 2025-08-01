import fs from 'fs';
import path from 'path';
import os from 'os';

export interface Config {
  fontFamily: string;
  fontFamilyMonospace: string;
  fontSize: number;
}

const defaultConfig: Config = {
  fontFamily: 'Roboto',
  fontFamilyMonospace: 'monospace',
  fontSize: 16,
};

const configPath = path.join(os.homedir(), '.config', 'mdts', 'config.json');

export const getConfig = (): Config => {
  if (!fs.existsSync(configPath)) {
    return defaultConfig;
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  return { ...defaultConfig, ...config };
};

export const saveConfig = (newConfig: Config): void => {
  const currentConfig = getConfig();
  const updatedConfig = { ...currentConfig, ...newConfig };
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(configPath, JSON.stringify(updatedConfig, null, 2));
};
