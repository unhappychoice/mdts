import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { AppBar, Box, IconButton, ToggleButton, ToggleButtonGroup, Toolbar, useMediaQuery } from '@mui/material';
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import Content from './Content';
import DirectoryContent from './DirectoryContent';
import FileTree from './FileTree';
import Outline from './Outline';

type LayoutProps = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

type ContentMode = 'fixed' | 'full';

const Layout = ({ darkMode, toggleDarkMode }: LayoutProps) => {
  const [contentMode, setContentMode] = useState<ContentMode>('fixed');
  const [fileTreeOpen, setFileTreeOpen] = useState(true); // ファイルツリーの開閉状態
  const [outlineOpen, setOutlineOpen] = useState(true); // アウトラインの開閉状態
  const [scrollToId, setScrollToId] = useState<string | null>(null);

  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const [isCurrentPathDirectory, setIsCurrentPathDirectory] = useState<boolean>(false);

  useEffect(() => {
    const getPathFromUrl = () => {
      const path = window.location.pathname.substring(1);
      if (path === '') return { path: null, isDirectory: false };

      const fileExtensions = ['.md', '.txt', '.js', '.ts', '.tsx', '.json', '.css', '.html', '.xml', '.yml', '.yaml', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.pdf'];
      const isFile = fileExtensions.some(ext => path.toLowerCase().endsWith(ext));

      return { path: decodeURIComponent(path), isDirectory: !isFile };
    };

    const { path, isDirectory } = getPathFromUrl();
    setCurrentPath(path);
    setIsCurrentPathDirectory(isDirectory);

    const handlePopState = () => {
      const { path: popPath, isDirectory: popIsDirectory } = getPathFromUrl();
      setCurrentPath(popPath);
      setIsCurrentPathDirectory(popIsDirectory);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleFileSelect = (path: string) => {
    setCurrentPath(path);
    setIsCurrentPathDirectory(false);
    window.history.pushState({ path: path }, '', `/${path}`);
  };

  const handleDirectorySelect = (path: string) => {
    setCurrentPath(path);
    setIsCurrentPathDirectory(true);
    window.history.pushState({ path: path }, '', `/${path}`);
  };

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
        <FileTree onFileSelect={handleFileSelect} isOpen={fileTreeOpen} onToggle={toggleFileTree} />
        {currentPath && isCurrentPathDirectory ? (
          <DirectoryContent selectedDirectoryPath={currentPath} onFileSelect={handleFileSelect} onDirectorySelect={handleDirectorySelect} contentMode={contentMode} />
        ) : (
          <Content selectedFilePath={currentPath} onDirectorySelect={handleDirectorySelect} contentMode={contentMode} scrollToId={scrollToId} />
        )}
        <Outline filePath={isCurrentPathDirectory ? null : currentPath} onItemClick={handleOutlineItemClick} isOpen={outlineOpen} onToggle={toggleOutline} />
      </Box>
    </Box>
  );
};

export default Layout;
