import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import CropFreeIcon from '@mui/icons-material/CropFree';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { AppBar, Box, IconButton, Toolbar } from '@mui/material';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { toggleContentMode, toggleDarkMode, } from '../store/slices/appSettingSlice';

interface AppHeaderProps {
  darkMode: boolean;
  contentMode: string;
  handleFileSelect: (path: string) => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  darkMode,
  contentMode,
  handleFileSelect,
}) => {
  const dispatch = useDispatch();

  const handleFileSelectClick = useCallback(() => {
    handleFileSelect('');
  }, [dispatch, handleFileSelect]);

  const handleContentModeClick = useCallback(() => {
    dispatch(toggleContentMode());
  }, [dispatch, toggleContentMode]);

  const handleDarkModeClick = useCallback(() => {
    dispatch(toggleDarkMode());
  }, [dispatch, toggleDarkMode]);

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={(theme) => ({
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
      })}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <IconButton onClick={handleFileSelectClick} color="inherit">
            <img
              src="/logo.svg"
              alt="mdts logo"
              style={{ height: '56px', marginLeft: '-36px' }}
            />
          </IconButton>
        </Box>
        <IconButton onClick={handleContentModeClick} color="inherit" sx={{ mr: 2 }}>
          {contentMode === 'fixed' ? <CropFreeIcon /> : <FullscreenIcon />}
        </IconButton>
        <IconButton sx={{ ml: 1 }} onClick={handleDarkModeClick} color="inherit">
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
