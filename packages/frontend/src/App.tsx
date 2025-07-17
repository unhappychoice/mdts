import { createTheme, CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import Layout from './components/Layout';
import { useFileTree } from './hooks/apis/useFileTree';
import { useWebSocket } from './hooks/useWebSocket';
import { AppDispatch } from './store/store';
import { fetchContent } from './store/slices/contentSlice';

const App = () => {
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(isDarkMode);

  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const [isCurrentPathDirectory, setIsCurrentPathDirectory] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const event = useWebSocket();

  useEffect(() => {
    if (event && event.type === 'reload-content') {
      dispatch(fetchContent(currentPath));
    }
  }, [event, dispatch, currentPath]);

  useEffect(() => {
    const getPathFromUrl = () => {
      const path = window.location.pathname.substring(1);
      if (path === '') return { path: null, isDirectory: false };

      const fileExtensions = ['.md', '.markdown'];
      const isFile = fileExtensions.some(ext => path.toLowerCase().endsWith(ext));

      return { path: decodeURIComponent(path), isDirectory: !isFile };
    };

    const { path, isDirectory } = getPathFromUrl();

    setCurrentPath(path);
    setIsCurrentPathDirectory(isDirectory);

    const handlePopState = () => {
      const { path: popPath, isDirectory: popIsDirectory } = getPathFromUrl();
      setCurrentPath(popPath);
      setIsCurrentPathDirectory(popIsDirectory);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentPath]);

  const handleFileSelect = (path: string) => {
    setCurrentPath(path);
    setIsCurrentPathDirectory(false);
    window.history.pushState({ path: path }, '', `/${path}`);
  };

  const handleDirectorySelect = (path: string) => {
    setCurrentPath(path);
    setIsCurrentPathDirectory(true);
    window.history.pushState({ path: path }, '', `/${path}`);
  };

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
        <Layout
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          currentPath={currentPath}
          isCurrentPathDirectory={isCurrentPathDirectory}
          handleFileSelect={handleFileSelect}
          handleDirectorySelect={handleDirectorySelect}
        />
    </ThemeProvider>
  );
};

export default App;
