import GitHubIcon from '@mui/icons-material/GitHub';
import SettingsIcon from '@mui/icons-material/Settings';
import { AppBar, Box, IconButton, Link, Toolbar, Tooltip } from '@mui/material';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

interface AppHeaderProps {
  handleFileSelect: (path: string) => void;
  onSettingsClick: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  handleFileSelect,
  onSettingsClick,
}) => {
  const dispatch = useDispatch();

  const handleFileSelectClick = useCallback(() => {
    handleFileSelect('');
  }, [dispatch, handleFileSelect]);

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
        <Tooltip title="Settings">
          <IconButton sx={{ mr: 2 }} onClick={onSettingsClick} color="inherit">
            <SettingsIcon />
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
