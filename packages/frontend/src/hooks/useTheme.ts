import { createTheme, Theme } from '@mui/material';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { themes } from '../styles/themes';

export const useTheme = (): Theme => {
  const { darkMode } = useSelector((state: RootState) => state.appSetting);
  const { theme: themeId } = useSelector((state: RootState) => state.config);

  const theme = useMemo(() => {
    const selectedTheme = themes.find(t => t.id === themeId) || themes[0];

    let mode: 'dark' | 'light';
    if (darkMode === 'dark' || darkMode === 'light') {
      mode = darkMode;
    } else {
      mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    const palette = selectedTheme[mode];

    return createTheme({
      palette: {
        mode: mode,
        primary: {
          main: palette.primary,
        },
        background: {
          default: palette.background,
          paper: palette.paper,
        },
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              background: `linear-gradient(180deg, ${palette.background} 0%, ${palette.paper} 100%)`,
              backgroundAttachment: 'fixed',
            },
          },
        },
      },
    });
  }, [darkMode, themeId]);

  return theme;
};
