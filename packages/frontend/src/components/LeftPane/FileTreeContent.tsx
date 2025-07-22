import { ArticleOutlined, FolderOutlined } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, CircularProgress, Typography } from '@mui/material';
import { TreeItem } from '@mui/x-tree-view';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import React from 'react';
import { AppDispatch } from '../../store/store';

interface FileTreeItem {
  [key: string]: (FileTreeItem | string)[];
}

interface FileTreeContentProps {
  filteredFileTree: (FileTreeItem | string)[] | null;
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
  const renderTreeItems = (
    tree: (FileTreeItem | string)[] | null,
    onFileSelect: (path: string) => void,
    parentPath: string = ''
  ) => {
    if (!tree) {
      return null;
    }
    return tree.map((item) => {
      if (typeof item === 'string') {
        const fileName = item.split('/').pop();
        return (
          <TreeItem
            key={item}
            itemId={item}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ArticleOutlined sx={{ mr: 1, fontSize: 'small' }} />
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                  {fileName}
                </Typography>
              </Box>
            }
            onClick={() => onFileSelect(item)}
          />
        );
      } else {
        const key = Object.keys(item)[0];
        const value = item[key];
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
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
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
          sx={{ flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
        >
          {renderTreeItems(filteredFileTree, onFileSelect)}
        </SimpleTreeView>
      )}
    </>
  );
};

export default FileTreeContent;
