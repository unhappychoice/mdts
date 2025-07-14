import { createTheme, CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import React, { useEffect, useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import Content from './components/Content';
import Layout from './components/Layout';
import { useWebSocket } from './hooks/useWebSocket';
import { WebSocketProvider } from './contexts/WebSocketContext';

const App = () => {
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(isDarkMode);
  const { refresh, refreshTree, changedFilePath } = useWebSocket();

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
    // Function to get file path from URL
    const getFilePathFromUrl = () => {
      const path = window.location.pathname.substring(1); // Remove leading slash
      return path === '' ? null : decodeURIComponent(path);
    };

    // Set initial file path from URL
    setSelectedFilePath(getFilePathFromUrl());

    // Handle browser back/forward buttons
    const handlePopState = () => {
      setSelectedFilePath(getFilePathFromUrl());
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleFileSelect = (path: string) => {
    setSelectedFilePath(path);
    // Update browser history
    window.history.pushState({ path: path }, '', `/${path}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <WebSocketProvider refresh={refresh} refreshTree={refreshTree} changedFilePath={changedFilePath}>
        <Layout onFileSelect={handleFileSelect} darkMode={darkMode} toggleDarkMode={toggleDarkMode} selectedFilePath={selectedFilePath}>
          <Content selectedFilePath={selectedFilePath} />
        </Layout>
      </WebSocketProvider>
    </ThemeProvider>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
