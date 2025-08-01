import { CssBaseline, ThemeProvider } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import SettingsDialog from './components/SettingsDialog/SettingsDialog';
import { useTheme } from './hooks/useTheme';
import { useWebSocket } from './hooks/useWebSocket';
import Layout from './Layout';
import { saveAppSetting } from './store/slices/appSettingSlice';
import { fetchConfig } from './store/slices/configSlice';
import { fetchFileTree } from './store/slices/fileTreeSlice';
import { updateHistoryFromLocation } from './store/slices/historySlice';
import { AppDispatch, RootState } from './store/store';

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  const { currentPath } = useSelector((state: RootState) => state.history);
  const { darkMode, contentMode } = useSelector((state: RootState) => state.appSetting);
  const { fontSize } = useSelector((state: RootState) => state.config);
  const theme = useTheme();

  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);

  const handleSettingsClick = useCallback(() => {
    setIsSettingsDialogOpen(true);
  }, []);

  const handleCloseSettingsDialog = useCallback(() => {
    setIsSettingsDialogOpen(false);
  }, []);

  useWebSocket(currentPath);

  useEffect(() => {
    dispatch(fetchFileTree());
  }, [dispatch, location]);

  useEffect(() => {
    dispatch(updateHistoryFromLocation(location.pathname));
  }, [location, dispatch]);

  useEffect(() => {
    dispatch(fetchConfig());
  }, [dispatch]);

  useEffect(() => {
    const actualSize = Math.floor(fontSize / 0.875);
    document.documentElement.style.fontSize = `${actualSize}px`;
  }, [fontSize]);

  useEffect(() => {
    dispatch(saveAppSetting({ darkMode, contentMode }));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout onSettingsClick={handleSettingsClick} />
      <SettingsDialog open={isSettingsDialogOpen} onClose={handleCloseSettingsDialog} />
    </ThemeProvider>
  );
};

export default App;
