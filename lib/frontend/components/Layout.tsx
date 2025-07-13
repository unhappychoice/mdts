import React, { useState } from 'react';
import { AppBar, Toolbar, Box, IconButton, ToggleButtonGroup, ToggleButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import Content from './Content';
import FileTree from './FileTree';

type LayoutProps = {
  children: React.ReactNode;
  onFileSelect: (path: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
};

type ContentMode = 'fixed' | 'full';

const Layout = ({ children, onFileSelect, darkMode, toggleDarkMode }: LayoutProps) => {
  const [contentMode, setContentMode] = useState<ContentMode>('fixed');
  const [fileTreeOpen, setFileTreeOpen] = useState(true); // ファイルツリーの開閉状態

  const handleContentModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: ContentMode | null,
  ) => {
    if (newMode !== null) {
      setContentMode(newMode);
    }
  };

  const toggleFileTree = () => {
    setFileTreeOpen(!fileTreeOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" elevation={0} sx={(theme) => ({ bgcolor: theme.palette.background.paper, color: theme.palette.text.primary, borderBottom: `1px solid ${theme.palette.divider}` })}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleFileTree}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <a href="/">
              <img src="/logo.svg" alt="mdts logo" style={{ height: '56px', marginLeft: '-36px' }} />
            </a>
          </Box>
          <ToggleButtonGroup
            value={contentMode}
            exclusive
            onChange={handleContentModeChange}
            aria-label="content alignment"
            size="small"
            sx={{ mr: 2 }}
          >
            <ToggleButton value="fixed" aria-label="fixed width">
              Fixed
            </ToggleButton>
            <ToggleButton value="full" aria-label="full width">
              Full
            </ToggleButton>
          </ToggleButtonGroup>
          <IconButton sx={{ ml: 1 }} onClick={toggleDarkMode} color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={(theme) => ({ flexGrow: 1, display: 'flex' })}>
        <FileTree onFileSelect={onFileSelect} isOpen={fileTreeOpen}/>
        {React.Children.map(children, child => {
          if (React.isValidElement(child) && child.type === Content) {
            return React.cloneElement(child, { contentMode });
          }
          return child;
        })}
      </Box>
    </Box>
  );
};

export default Layout;
