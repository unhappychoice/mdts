import { createTheme, Theme } from '@mui/material';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export const useTheme = (): Theme => {
  const { darkMode } = useSelector((state: RootState) => state.appSetting);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: '#1976d2',
            light: '#1976d2',
            dark: '#1976d2',
          },
          background: {
            default: darkMode ? '#161819' : '#f4f5f7',
            paper: darkMode ? '#0f1214' : '#ffffff',
          },
        },
      }),
    [darkMode]
  );

  return theme;
};
