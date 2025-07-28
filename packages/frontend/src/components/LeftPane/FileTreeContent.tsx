import { ArticleOutlined, FolderOutlined } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import { TreeItem } from '@mui/x-tree-view';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import React from 'react';
import { AppDispatch } from '../../store/store';

interface FileTreeItem {
  path: string;
  status: string;
}

interface FileTreeContentProps {
  filteredFileTree: (FileTreeItem | { [key: string]: (FileTreeItem | object)[] })[] | null;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'M':
        return theme.palette.info.main;
      case '?':
      case 'A':
        return theme.palette.success.main;
      case 'D':
        return theme.palette.error.main;
      case 'R':
        return theme.palette.warning.main;
      case 'C':
        return theme.palette.secondary.main;
      default:
        return theme.palette.text.primary;
    }
  };

  const renderTreeItems = (
    tree: (FileTreeItem | { [key: string]: (FileTreeItem | object)[] })[] | null,
    onFileSelect: (path: string) => void,
    parentPath: string = ''
  ) => {
    if (!tree) {
      return null;
    }
    return tree.map((item) => {
      if ('path' in item) {
        const fileItem = item as FileTreeItem;
        const fileName = fileItem.path.split('/').pop();
        return (
          <TreeItem
            key={fileItem.path}
            itemId={fileItem.path}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ArticleOutlined sx={{ mr: 1, fontSize: 'small' }} />
                <Typography variant="body2" sx={{ fontSize: '0.875rem', color: getStatusColor(fileItem.status) }}>
                  {fileName}
                </Typography>
                {fileItem.status && fileItem.status !== ' ' && (
                  <Typography variant="body2" sx={{ fontSize: '0.75rem', color: getStatusColor(fileItem.status), ml: 1, }}>
                    {fileItem.status}
                  </Typography>
                )}
              </Box>
            }
            onClick={() => onFileSelect(fileItem.path)}
          />
        );
      } else {
        const key = Object.keys(item)[0];
        const value = (item as any)[key];
        const currentPath = parentPath ? `${parentPath}/${key}` : key;
        return (
          <TreeItem
            key={currentPath}
            itemId={currentPath}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FolderOutlined sx={{ mr: 1, fontSize: 'small' }} color="primary" />
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                  {key}
                </Typography>
              </Box>
            }
          >
            {Array.isArray(value) && value.length > 0 && renderTreeItems(value, onFileSelect, currentPath)}
          </TreeItem>
        );
      }
    });
  };

  return (
    <>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 180px)' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">Error: {error}</Typography>
      ) : (
        <SimpleTreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          expandedItems={expandedNodes}
          onExpandedItemsChange={onExpandedItemsChange}
          sx={{ flexGrow: 1, maxWidth: 400, overflowY: 'auto', height: 'calc(100vh - 180px)' }}
        >
          {renderTreeItems(filteredFileTree, onFileSelect)}
        </SimpleTreeView>
      )}
    </>
  );
};

export default FileTreeContent;
