import { createTheme, CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import React, { useEffect, useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import Content from './components/Content';
import DirectoryContent from './components/DirectoryContent';
import Layout from './components/Layout';
import { FileTreeProvider } from './contexts/FileTreeContext';

const App = () => {
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const [isCurrentPathDirectory, setIsCurrentPathDirectory] = useState<boolean>(false);
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

  useEffect(() => {
    const getPathFromUrl = () => {
      const path = window.location.pathname.substring(1);
      if (path === '') return { path: null, isDirectory: false };

      const fileExtensions = ['.md', '.txt', '.js', '.ts', '.tsx', '.json', '.css', '.html', '.xml', '.yml', '.yaml', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.pdf'];
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
  }, []);

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <Layout onFileSelect={handleFileSelect} darkMode={darkMode} toggleDarkMode={toggleDarkMode} selectedFilePath={currentPath} isCurrentPathDirectory={isCurrentPathDirectory}>
          {currentPath && isCurrentPathDirectory ? (
            <DirectoryContent selectedDirectoryPath={currentPath} onFileSelect={handleFileSelect} onDirectorySelect={handleDirectorySelect} />
          ) : (
            <Content selectedFilePath={currentPath} onDirectorySelect={handleDirectorySelect} />
          )}
        </Layout>
    </ThemeProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <FileTreeProvider>
      <App />
    </FileTreeProvider>
  </React.StrictMode>
);
