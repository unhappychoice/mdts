import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { AppBar, Box, IconButton, ToggleButton, ToggleButtonGroup, Toolbar } from '@mui/material';
import React, { useCallback, useState } from 'react';
import Content from './Content';
import FileTree from './FileTree';
import Outline from './Outline';

type LayoutProps = {
  children: React.ReactNode;
  onFileSelect: (path: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  selectedFilePath: string | null;
  isCurrentPathDirectory: boolean;
};

type ContentMode = 'fixed' | 'full';

const Layout = ({ children, onFileSelect, darkMode, toggleDarkMode, selectedFilePath, isCurrentPathDirectory }: LayoutProps) => {
  const [contentMode, setContentMode] = useState<ContentMode>('fixed');
  const [fileTreeOpen, setFileTreeOpen] = useState(true); // ファイルツリーの開閉状態
  const [outlineOpen, setOutlineOpen] = useState(true); // アウトラインの開閉状態
  const [scrollToId, setScrollToId] = useState<string | null>(null);

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

  const toggleOutline = () => {
    setOutlineOpen(!outlineOpen);
  };

  const handleOutlineItemClick = useCallback((id: string) => {
    setScrollToId(id);
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" elevation={0} sx={(theme) => ({ bgcolor: theme.palette.background.paper, color: theme.palette.text.primary, borderBottom: `1px solid ${theme.palette.divider}` })}>
        <Toolbar>
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
      <Box component="main" sx={(theme) => ({ flexGrow: 1, display: 'flex', overflowY: 'auto'})}>
        <FileTree onFileSelect={onFileSelect} isOpen={fileTreeOpen} onToggle={toggleFileTree} />
        {React.Children.map(children, child => {
          if (React.isValidElement(child) && child.type === Content) {
            return React.cloneElement(child, { contentMode, scrollToId });
          }
          return child;
        })}
        <Outline filePath={isCurrentPathDirectory ? null : selectedFilePath} onItemClick={handleOutlineItemClick} isOpen={outlineOpen} onToggle={toggleOutline} />
      </Box>
    </Box>
  );
};

export default Layout;
