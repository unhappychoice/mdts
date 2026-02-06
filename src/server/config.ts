import fs from 'fs';
import path from 'path';
import os from 'os';

export interface Config {
  fontFamily: string;
  fontFamilyMonospace: string;
  fontSize: number;
  theme: string
  syntaxHighlighterTheme: string;
  enableBreaks: boolean;
}

const defaultConfig: Config = {
  fontFamily: 'Roboto',
  fontFamilyMonospace: 'Roboto Mono',
  fontSize: 16,
  theme: 'default',
  syntaxHighlighterTheme: 'auto',
  enableBreaks: false,
};

const configPath = path.join(os.homedir(), '.config', 'mdts', 'config.json');

export const getConfig = (): Config => {
  if (!fs.existsSync(configPath)) {
    return defaultConfig;
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  return { ...defaultConfig, ...config };
};

export const saveConfig = (newConfig: Partial<Config>): void => {
  const currentConfig = getConfig();
  const updatedConfig = { ...currentConfig, ...newConfig };
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(configPath, JSON.stringify(updatedConfig, null, 2));
};
