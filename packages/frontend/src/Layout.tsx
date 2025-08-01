import { Box } from '@mui/material';
import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import Content from './components/Content/Content';
import FileTree from './components/LeftPane/FileTree';
import Outline from './components/RightPane/Outline';
import { toggleFileTree, toggleOutline, } from './store/slices/appSettingSlice';
import { RootState } from './store/store';

interface LayoutProps {
  onSettingsClick: () => void;
}

const Layout: React.FC<LayoutProps> = ({ onSettingsClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { fileTreeOpen, outlineOpen } = useSelector((state: RootState) => state.appSetting);
  const { currentPath, isDirectory } = useSelector((state: RootState) => state.history);
  const { fontFamily, fontFamilyMonospace } = useSelector((state: RootState) => state.config);
  const [scrollToId, setScrollToId] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.style.setProperty('--markdown-font-family', fontFamily);
  }, [fontFamily]);

  useEffect(() => {
    document.documentElement.style.setProperty('--markdown-monospace-font-family', fontFamilyMonospace);
  }, [fontFamilyMonospace]);

  const handleFileSelect = useCallback((path: string) => {
    navigate(`/${path}`);
  }, [navigate]);

  const handleToggleFileTree = useCallback(() => {
    dispatch(toggleFileTree());
  }, [dispatch, toggleFileTree]);

  const handleDirectorySelect = useCallback((path: string) => {
    navigate(`/${path}`);
  }, [navigate]);

  const handleOutlineItemClick = useCallback((id: string) => {
    setScrollToId(id);
  }, []);

  const handleToggleOutline = useCallback(() => {
    dispatch(toggleOutline());
  }, [dispatch, toggleOutline]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppHeader
        handleFileSelect={handleFileSelect}
        onSettingsClick={onSettingsClick}
      />
      <Box
        component="main"
        sx={{ flexGrow: 1, display: 'flex', overflowY: 'hidden', height: '100%' }}
      >
        <FileTree
          onFileSelect={handleFileSelect}
          isOpen={fileTreeOpen}
          onToggle={handleToggleFileTree}
          selectedFilePath={currentPath}
        />
        <Content
          onFileSelect={handleFileSelect}
          onDirectorySelect={handleDirectorySelect}
          scrollToId={scrollToId}
        />
        <Outline
          filePath={isDirectory ? null : currentPath}
          onItemClick={handleOutlineItemClick}
          isOpen={outlineOpen}
          onToggle={handleToggleOutline}
        />
      </Box>
    </Box>
  );
};

export default Layout;
