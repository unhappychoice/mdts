import { CssBaseline, ThemeProvider } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import { useWebSocket } from './hooks/useWebSocket';
import Layout from './Layout';
import { fetchFileTree } from './store/slices/fileTreeSlice';
import { updateHistoryFromLocation } from './store/slices/historySlice';
import { AppDispatch, RootState } from './store/store';

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  const { currentPath } = useSelector((state: RootState) => state.history);
  const { darkMode } = useSelector((state: RootState) => state.appSetting);
  const theme = useTheme();

  useWebSocket(currentPath);

  useEffect(() => {
    document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    dispatch(fetchFileTree());
  }, [dispatch, location]);

  useEffect(() => {
    dispatch(updateHistoryFromLocation(location.pathname));
  }, [location, dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout />
    </ThemeProvider>
  );
};

export default App;
