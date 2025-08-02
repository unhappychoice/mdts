import { createTheme, Theme } from '@mui/material';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export const useTheme = (): Theme => {
  const { darkMode } = useSelector((state: RootState) => state.appSetting);

  const theme = useMemo(() => {
    let mode: 'dark' | 'light';
    if (darkMode === 'dark' || darkMode === 'light') {
      mode = darkMode;
    } else {
      mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    return createTheme({
      palette: {
        mode: mode,
        primary: {
          main: '#1976d2',
          light: '#1976d2',
          dark: '#1976d2',
        },
        background: {
          default: mode === 'dark' ? '#161819' : '#f4f5f7',
          paper: mode === 'dark' ? '#0f1214' : '#ffffff',
        },
      },
    });
  }, [darkMode]);

  return theme;
};
