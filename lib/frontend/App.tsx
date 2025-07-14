import { createTheme, CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import React, { useMemo, useState } from 'react';
import Layout from './components/Layout';

const App = () => {
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(isDarkMode);

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
    [darkMode],
  );

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
    </ThemeProvider>
  );
};

export default App;
