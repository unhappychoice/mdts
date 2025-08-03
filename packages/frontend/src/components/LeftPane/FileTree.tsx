import { Box, useTheme } from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  expandAllNodes,
  fetchFileTree,
  FileTreeItem,
  setExpandedNodes,
  setSearchQuery
} from '../../store/slices/fileTreeSlice';
import { AppDispatch, RootState } from '../../store/store';
import FileTreeContent from './FileTreeContent/FileTreeContent';
import FileTreeHeader from './FileTreeHeader';
import FileTreeSearch from './FileTreeSearch';

interface FileTreeComponentProps {
  onFileSelect: (path: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  selectedFilePath: string | null;
}

const FileTree: React.FC<FileTreeComponentProps> = ({ onFileSelect, isOpen, onToggle }) => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const {
    fileTree,
    filteredFileTree,
    loading,
    error,
    searchQuery,
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

  useEffect(() => {
    if (!searchQuery) return;

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
  }, [searchQuery, filteredFileTree, dispatch]);

  const overlay = theme.palette.mode === 'dark' ? 'rgba(16, 16, 16, 0.01)' : 'rgba(192, 192, 192, 0.01)';

  return (
    <Box sx={{
      width: isOpen ? '300px' : '66px',
      background: `linear-gradient(135deg, ${overlay} 0%, ${theme.palette.background.paper} 100%)`,
      py: 2,
      borderRight: '1px solid',
      borderColor: 'divider',
      minHeight: '100%',
      flexShrink: 0,
    }}>
      <FileTreeHeader
        isOpen={isOpen}
        onToggle={onToggle}
        onExpandAllClick={handleExpandAllClick}
        onCollapseAll={handleCollapseAll}
      />
      {isOpen && (
        <FileTreeSearch
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onClearSearch={handleClearSearch}
        />
      )}
      {isOpen && (
        <FileTreeContent
          filteredFileTree={filteredFileTree}
          loading={loading}
          error={error}
          expandedNodes={expandedNodes}
          onFileSelect={onFileSelect}
          onExpandedItemsChange={handleExpandedItemsChange}
          dispatch={dispatch}
        />
      )}
    </Box>
  );
};

export default FileTree;

