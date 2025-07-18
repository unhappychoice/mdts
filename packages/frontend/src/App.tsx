import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import { useWebSocket } from './hooks/useWebSocket';
import { AppDispatch, RootState } from './store/store';
import { fetchContent } from './store/slices/contentSlice';
import { fetchFileTree } from './store/slices/fileTreeSlice';
import { fetchOutline } from './store/slices/outlineSlice';

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { darkMode } = useSelector((state: RootState) => state.appSetting);
  const navigate = useNavigate();
  const location = useLocation();

  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const [isCurrentPathDirectory, setIsCurrentPathDirectory] = useState<boolean>(false);

  const event = useWebSocket();

  useEffect(() => {
    if (event?.type === 'reload-content') {
      dispatch(fetchContent(currentPath));
      dispatch(fetchOutline(currentPath));
    } else if (event?.type === 'reload-tree') {
      dispatch(fetchFileTree());
    }
  }, [event, dispatch, currentPath]);

  useEffect(() => {
    const getPathFromUrl = () => {
      const path = location.pathname.substring(1);
      if (path === '') return { path: null, isDirectory: false };

      const fileExtensions = ['.md', '.markdown'];
      const isFile = fileExtensions.some(ext => path.toLowerCase().endsWith(ext));

      return { path: decodeURIComponent(path), isDirectory: !isFile };
    };

    const { path, isDirectory } = getPathFromUrl();

    setCurrentPath(path);
    setIsCurrentPathDirectory(isDirectory);
  }, [location]);

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <Layout
          currentPath={currentPath}
          isCurrentPathDirectory={isCurrentPathDirectory}
        />
    </ThemeProvider>
  );
};

export default App;
