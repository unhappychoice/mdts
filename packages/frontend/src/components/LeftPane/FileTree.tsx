import { Box, Drawer, useTheme } from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useIsMobile from '../../hooks/useIsMobile';
import {
  expandAllNodes,
  fetchFileTree,
  FileTreeItem,
  setExpandedNodes,
  setSearchQuery,
  fetchContentSearchResults
} from '../../store/slices/fileTreeSlice';
import { AppDispatch, RootState } from '../../store/store';
import FileTreeContent from './FileTreeContent/FileTreeContent';
import FileTreeHeader from './FileTreeHeader';
import FileTreeSearch from './FileTreeSearch';
import ContentSearchResults from './ContentSearchResults';

interface FileTreeComponentProps {
  onFileSelect: (path: string, line?: number) => void;
  isOpen: boolean;
  onToggle: () => void;
  selectedFilePath: string | null;
}

const FileTree: React.FC<FileTreeComponentProps> = ({ onFileSelect, isOpen, onToggle }) => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const isMobile = useIsMobile();
  const {
    fileTree,
    filteredFileTree,
    loading,
    error,
    searchQuery,
    searchMode,
    contentSearchResults,
    expandedNodes
  } = useSelector((state: RootState) => state.fileTree);

  useEffect(() => {
    dispatch(fetchFileTree());
  }, [dispatch]);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(event.target.value));
  }, [dispatch]);

  const handleClearSearch = useCallback(() => {
    dispatch(setSearchQuery(''));
  }, [dispatch]);

  const handleExpandAllClick = useCallback(() => {
    dispatch(expandAllNodes(fileTree));
  }, [dispatch, fileTree]);

  const handleCollapseAll = useCallback(() => {
    dispatch(setExpandedNodes([]));
  }, [dispatch]);

  const handleExpandedItemsChange = useCallback((event: React.SyntheticEvent, itemIds: string[]) => {
    dispatch(setExpandedNodes(itemIds));
  }, [dispatch]);

  // Trigger content search
  useEffect(() => {
    if (searchMode === 'content') {
      const timeoutId = setTimeout(() => {
        dispatch(fetchContentSearchResults(searchQuery));
      }, 300); // 300ms debounce
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, searchMode, dispatch]);

  useEffect(() => {
    if (!searchQuery || searchMode !== 'filename') return;

    const newExpanded: string[] = [];

    const collectExpandedPaths = (items: (FileTreeItem | { [key: string]: (FileTreeItem | object)[] })[], parentPath: string = '') => {
      items.forEach(item => {
        if (!('path' in item)) { // It's a folder
          const key = Object.keys(item)[0];
          const value = (item as { [key: string]: (FileTreeItem | object)[] })[key];
          const currentPath = parentPath ? `${parentPath}/${key}` : key;
          if (!newExpanded.includes(currentPath)) {
            newExpanded.push(currentPath);
          }
          if (Array.isArray(value)) {
            collectExpandedPaths(value, currentPath);
          }
        }
      });
    };

    if (filteredFileTree) {
      collectExpandedPaths(filteredFileTree);
    }

    dispatch(setExpandedNodes(newExpanded));
  }, [searchQuery, searchMode, filteredFileTree, dispatch]);

  const overlay = theme.palette.mode === 'dark' ? 'rgba(16, 16, 16, 0.01)' : 'rgba(192, 192, 192, 0.01)';
  const background = `linear-gradient(135deg, ${overlay} 0%, ${theme.palette.background.paper} 100%)`;

  const handleFileSelectWithClose = useCallback((path: string) => {
    onFileSelect(path);
    if (isMobile) onToggle();
  }, [onFileSelect, isMobile, onToggle]);

  const panelContent = (
    <>
      <FileTreeHeader
        isOpen={isMobile ? true : isOpen}
        onToggle={onToggle}
        onExpandAllClick={handleExpandAllClick}
        onCollapseAll={handleCollapseAll}
      />
      {(isMobile || isOpen) && (
        <FileTreeSearch
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onClearSearch={handleClearSearch}
        />
      )}
      {(isMobile || isOpen) && (
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          {searchMode === 'filename' ? (
            <FileTreeContent
              filteredFileTree={filteredFileTree}
              loading={loading}
              error={error}
              expandedNodes={expandedNodes}
              onFileSelect={isMobile ? handleFileSelectWithClose : onFileSelect}
              onExpandedItemsChange={handleExpandedItemsChange}
              dispatch={dispatch}
            />
          ) : (
            <ContentSearchResults
              results={contentSearchResults}
              onFileSelect={isMobile ? handleFileSelectWithClose : onFileSelect}
              searchQuery={searchQuery}
            />
          )}
        </Box>
      )}
    </>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        anchor="left"
        open={isOpen}
        onClose={onToggle}
        ModalProps={{ keepMounted: true }}
        slotProps={{ paper: { sx: { width: '280px', bgcolor: 'background.paper', py: 2, borderRight: '1px solid', borderColor: 'divider' } } }}
      >
        {panelContent}
      </Drawer>
    );
  }

  return (
    <Box sx={{
      width: isOpen ? '300px' : '66px',
      background,
      py: 2,
      borderRight: '1px solid',
      borderColor: 'divider',
      minHeight: '100%',
      flexShrink: 0,
      overflowX: 'hidden',
    }}>
      {panelContent}
    </Box>
  );
};

export default FileTree;
