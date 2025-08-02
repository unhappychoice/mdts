import { useTheme } from '@mui/material';
import React, { useCallback } from 'react';
import ErrorView from '../../ErrorView';
import { FileTreeView } from './FileTreeView';
import { LoadingIndicator } from './LoadingIndicator';
import { FileTree } from './types';

interface FileTreeContentProps {
  filteredFileTree: FileTree | null;
  loading: boolean;
  error: string | null;
  expandedNodes: string[];
  onFileSelect: (path: string) => void;
  onExpandedItemsChange: (event: React.SyntheticEvent, itemIds: string[]) => void;
}

const FileTreeContent: React.FC<FileTreeContentProps> = ({
  filteredFileTree,
  loading,
  error,
  expandedNodes,
  onFileSelect,
  onExpandedItemsChange,
}) => {
  const theme = useTheme();

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'M': return theme.palette.info.main;
      case '?':
      case 'A': return theme.palette.success.main;
      case 'D': return theme.palette.error.main;
      case 'R': return theme.palette.warning.main;
      case 'C': return theme.palette.secondary.main;
      default: return theme.palette.text.primary;
    }
  }, [theme]);

  if (loading && !(filteredFileTree && filteredFileTree.length > 0)) return <LoadingIndicator />;
  if (error) return <ErrorView error={error} />;

  return (
    <FileTreeView
      filteredFileTree={filteredFileTree}
      expandedNodes={expandedNodes}
      onFileSelect={onFileSelect}
      onExpandedItemsChange={onExpandedItemsChange}
      getStatusColor={getStatusColor}
    />
  );
};

export default FileTreeContent;
