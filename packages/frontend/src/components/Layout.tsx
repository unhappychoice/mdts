import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import CropFreeIcon from '@mui/icons-material/CropFree';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { AppBar, Box, IconButton, ToggleButton, ToggleButtonGroup, Toolbar, useMediaQuery } from '@mui/material';
import React, { useCallback, useState, useMemo } from 'react';

import MarkdownContent from './MarkdownContent';
import DirectoryContent from './DirectoryContent';
import FileTree from './FileTree';
import Outline from './Outline';

type LayoutProps = {
  darkMode: boolean;
  toggleDarkMode: () => void;
  currentPath: string | null;
  isCurrentPathDirectory: boolean;
  handleFileSelect: (path: string) => void;
  handleDirectorySelect: (path: string) => void;
};

type ContentMode = 'fixed' | 'full';

const Layout = ({ darkMode, toggleDarkMode, currentPath, isCurrentPathDirectory, handleFileSelect, handleDirectorySelect }: LayoutProps) => {
  const [contentMode, setContentMode] = useState<ContentMode>('fixed');
  const [fileTreeOpen, setFileTreeOpen] = useState(true); // ファイルツリーの開閉状態
  const [outlineOpen, setOutlineOpen] = useState(true); // アウトラインの開閉状態
  const [scrollToId, setScrollToId] = useState<string | null>(null);

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
            <IconButton onClick={() => handleFileSelect('')} color="inherit">
              <img src="/logo.svg" alt="mdts logo" style={{ height: '56px', marginLeft: '-36px' }} />
            </IconButton>
          </Box>
          <IconButton onClick={() => setContentMode(prevMode => prevMode === 'fixed' ? 'full' : 'fixed')} color="inherit" sx={{ mr: 2 }}>
            {contentMode === 'fixed' ? <CropFreeIcon /> : <FullscreenIcon />}
          </IconButton>
          <IconButton sx={{ ml: 1 }} onClick={toggleDarkMode} color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={(theme) => ({ flexGrow: 1, display: 'flex', overflowY: 'auto'})}>
        <FileTree onFileSelect={handleFileSelect} isOpen={fileTreeOpen} onToggle={toggleFileTree} selectedFilePath={currentPath} />
        {currentPath && isCurrentPathDirectory ? (
          <DirectoryContent selectedDirectoryPath={currentPath} onFileSelect={handleFileSelect} onDirectorySelect={handleDirectorySelect} contentMode={contentMode} />
        ) : (
          <MarkdownContent selectedFilePath={currentPath} onDirectorySelect={handleDirectorySelect} contentMode={contentMode} scrollToId={scrollToId} />
        )}
        <Outline filePath={isCurrentPathDirectory ? null : currentPath} onItemClick={handleOutlineItemClick} isOpen={outlineOpen} onToggle={toggleOutline} />
      </Box>
    </Box>
  );
};

export default Layout;
