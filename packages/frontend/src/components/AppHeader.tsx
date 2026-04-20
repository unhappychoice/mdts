import GitHubIcon from '@mui/icons-material/GitHub';
import MenuIcon from '@mui/icons-material/Menu';
import SegmentIcon from '@mui/icons-material/Segment';
import SettingsIcon from '@mui/icons-material/Settings';
import { AppBar, Box, IconButton, Link, Toolbar, Tooltip } from '@mui/material';
import React, { useCallback } from 'react';

import useIsMobile from '../hooks/useIsMobile';
import Logo from './Logo';

interface AppHeaderProps {
  handleFileSelect: (path: string) => void;
  onSettingsClick: () => void;
  onToggleFileTree?: () => void;
  onToggleOutline?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  handleFileSelect,
  onSettingsClick,
  onToggleFileTree,
  onToggleOutline,
}) => {
  const isMobile = useIsMobile();
  const handleFileSelectClick = useCallback(() => {
    handleFileSelect('');
  }, [handleFileSelect]);

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom: '1px solid ', borderColor: 'divider' }}
    >
      <Toolbar>
        {isMobile && onToggleFileTree && (
          <Tooltip title="Toggle file tree">
            <IconButton
              onClick={onToggleFileTree}
              edge="start"
              color="inherit"
              sx={{ mr: 1 }}
              aria-label="toggle file tree"
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>
        )}
        <Box sx={{ flexGrow: 1 }}>
          <Tooltip title="Top page">
            <IconButton disableRipple onClick={handleFileSelectClick} color="inherit">
              <div style={{ height: '56px', marginTop: '-8px', marginLeft: '-16px' }}>
                <Logo />
              </div>
            </IconButton>
          </Tooltip>
        </Box>
        {isMobile && onToggleOutline && (
          <Tooltip title="Toggle outline">
            <IconButton
              onClick={onToggleOutline}
              color="inherit"
              sx={{ mr: 1 }}
              aria-label="toggle outline"
            >
              <SegmentIcon />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Settings">
          <IconButton sx={{ mr: isMobile ? 0 : 2 }} onClick={onSettingsClick} color="inherit">
            <SettingsIcon />
          </IconButton>
        </Tooltip>
        {!isMobile && (
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
        )}
        {!isMobile && (
          <Box sx={{ fontSize: '0.9rem', pt: '2px', fontFamily: 'monospace' }}>
            <Tooltip title="Changelog">
              <Link href="https://github.com/unhappychoice/mdts/blob/main/CHANGELOG.md" target="_blank" rel="noopener">
                v{process.env.APP_VERSION}
              </Link>
            </Tooltip>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
