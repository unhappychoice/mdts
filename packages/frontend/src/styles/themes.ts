interface ThemePalette {
  primary: string;
  background: string;
  paper: string;
}

export interface AppTheme {
  id: string;
  name: string;
  light: ThemePalette;
  dark: ThemePalette;
}

export const themes: AppTheme[] = [
  {
    id: 'default',
    name: 'Default',
    light: {
      primary: '#1976d2',
      background: '#f5f7fa',
      paper: '#eef1f5',
    },
    dark: {
      primary: '#1976d2',
      background: '#161819',
      paper: '#0f1214',
    },
  },
  {
    id: 'aurora',
    name: 'Aurora',
    light: {
      primary: '#00796b',
      background: '#e0f2f1',
      paper: '#d0eceb',
    },
    dark: {
      primary: '#80cbc4',
      background: '#00251a',
      paper: '#012a4a',
    },
  },
  {
    id: 'autumn',
    name: 'Autumn',
    light: {
      primary: '#bf360c',
      background: '#fff3e0',
      paper: '#ffe0b2',
    },
    dark: {
      primary: '#ff8a65',
      background: '#3e2723',
      paper: '#2a1a1a',
    },
  },
  {
    id: 'cafe',
    name: 'Café Mocha',
    light: {
      primary: '#795548',
      background: '#f9f3ef',
      paper: '#f3ebe5',
    },
    dark: {
      primary: '#a1887f',
      background: '#2e1f1a',
      paper: '#1e1510',
    },
  },
  {
    id: 'deepsea',
    name: 'Deep Sea',
    light: {
      primary: '#01579b',
      background: '#e1f1fa',
      paper: '#d4ebf6',
    },
    dark: {
      primary: '#0288d1',
      background: '#0b1e2b',
      paper: '#10222f',
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    light: {
      primary: '#2e7d32',
      background: '#eef5f0',
      paper: '#e6f2eb',
    },
    dark: {
      primary: '#4caf50',
      background: '#1a2a1a',
      paper: '#111f11',
    },
  },
  {
    id: 'glacier',
    name: 'Glacier',
    light: {
      primary: '#00acc1',
      background: '#e0f7fa',
      paper: '#d1eef2',
    },
    dark: {
      primary: '#4dd0e1',
      background: '#0d2b2f',
      paper: '#112a2d',
    },
  },
  {
    id: 'inkblue',
    name: 'Ink Blue',
    light: {
      primary: '#3f51b5',
      background: '#e8eaf6',
      paper: '#dee1f3',
    },
    dark: {
      primary: '#7986cb',
      background: '#1a1c2b',
      paper: '#121522',
    },
  },
  {
    id: 'inkstone',
    name: 'Inkstone',
    light: {
      primary: '#37474f',
      background: '#f3f6f8',
      paper: '#e6ebee',
    },
    dark: {
      primary: '#90a4ae',
      background: '#1c1f22',
      paper: '#121518',
    },
  },
  {
    id: 'lavender',
    name: 'Lavender',
    light: {
      primary: '#9c27b0',
      background: '#f5ecfb',
      paper: '#f1e3f8',
    },
    dark: {
      primary: '#ba68c8',
      background: '#2a1a2f',
      paper: '#1c1023',
    },
  },
  {
    id: 'moss',
    name: 'Moss',
    light: {
      primary: '#558b2f',
      background: '#eef5e4',
      paper: '#e2efdc',
    },
    dark: {
      primary: '#9ccc65',
      background: '#1a2d1a',
      paper: '#152215',
    },
  },
  {
    id: 'nightfox',
    name: 'Nightfox',
    light: {
      primary: '#546e7a',
      background: '#f0f4f8',
      paper: '#e6edf2',
    },
    dark: {
      primary: '#8faac2',
      background: '#0d1117',
      paper: '#161b22',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    light: {
      primary: '#00838f',
      background: '#e0f4f7',
      paper: '#d6f0f2',
    },
    dark: {
      primary: '#00bcd4',
      background: '#1a2a2d',
      paper: '#111f22',
    },
  },
  {
    id: 'rosequartz',
    name: 'Rose Quartz',
    light: {
      primary: '#e91e63',
      background: '#fce4ec',
      paper: '#f9dce7',
    },
    dark: {
      primary: '#f06292',
      background: '#2c1823',
      paper: '#1a0e15',
    },
  },
  {
    id: 'sakura',
    name: 'Sakura',
    light: {
      primary: '#e65a67',
      background: '#fef1f2',
      paper: '#ffeef0',
    },
    dark: {
      primary: '#e65a67',
      background: '#2a1a1f',
      paper: '#1f1115',
    },
  },
  {
    id: 'sandstone',
    name: 'Sandstone',
    light: {
      primary: '#c77966',
      background: '#fdf4ec',
      paper: '#f9eae0',
    },
    dark: {
      primary: '#e57373',
      background: '#3e2a25',
      paper: '#291b17',
    },
  },
  {
    id: 'solarized',
    name: 'Solarized',
    light: {
      primary: '#268bd2',
      background: '#fdf6e3',
      paper: '#f4efdc',
    },
    dark: {
      primary: '#b58900',
      background: '#002b36',
      paper: '#073642',
    },
  },
  {
    id: 'storm',
    name: 'Storm',
    light: {
      primary: '#455a64',
      background: '#e9edf0',
      paper: '#dde3e7',
    },
    dark: {
      primary: '#90a4ae',
      background: '#1e262b',
      paper: '#13191e',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    light: {
      primary: '#d84315',
      background: '#fff1e6',
      paper: '#fde8dd',
    },
    dark: {
      primary: '#ff8a65',
      background: '#2c1e1a',
      paper: '#2a1a2f',
    },
  },
  {
    id: 'tropical',
    name: 'Tropical',
    light: {
      primary: '#ef6c00',
      background: '#fff9e5',
      paper: '#fff0dd',
    },
    dark: {
      primary: '#ffb74d',
      background: '#3e2723',
      paper: '#00363a',
    },
  },
  {
    id: 'wisteria',
    name: 'Wisteria',
    light: {
      primary: '#7e57c2',
      background: '#f3e5f5',
      paper: '#e9dcf0',
    },
    dark: {
      primary: '#9575cd',
      background: '#291b3a',
      paper: '#1b1027',
    },
  },
];
