import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import CropFreeIcon from '@mui/icons-material/CropFree';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import GitHubIcon from '@mui/icons-material/GitHub';
import { AppBar, Box, IconButton, Link, Toolbar, Tooltip } from '@mui/material';
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
          <Tooltip title="Top page">
            <IconButton disableRipple onClick={handleFileSelectClick} color="inherit">
              <img
                src="/logo.svg"
                alt="mdts logo"
                style={{ height: '56px', marginTop: '-8px', marginLeft: '-36px' }}
              />
            </IconButton>
          </Tooltip>
        </Box>
        <Tooltip title={contentMode === 'fixed' ? 'Exit Fullscreen' : 'Fullscreen'}>
          <IconButton onClick={handleContentModeClick} color="inherit" sx={{ mr: 2 }}>
            {contentMode === 'fixed' ? <CropFreeIcon /> : <FullscreenIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          <IconButton sx={{ mr: 2 }} onClick={handleDarkModeClick} color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>
        <Tooltip title="GitHub Repository">
          <IconButton
            color="inherit"
            href="https://github.com/unhappychoice/mdts"
            target="_blank"
            rel="noopener"
            sx={{ mr: 2 }}
          >
            <GitHubIcon />
          </IconButton>
        </Tooltip>
        <Box sx={{ fontSize: '0.9rem', pt: '2px', fontFamily: 'monospace' }}>
          <Tooltip title="Changelog">
            <Link href="https://github.com/unhappychoice/mdts/blob/main/CHANGELOG.md" target="_blank" rel="noopener">
              v{process.env.APP_VERSION}
            </Link>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
