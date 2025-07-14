import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FolderIcon from '@mui/icons-material/Folder';
import { Box, CircularProgress, IconButton, Typography } from '@mui/material';
import { TreeItem } from '@mui/x-tree-view';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import React from 'react';
import { useFileTree } from '../hooks/useFileTree';

interface FileTreeItem {
  [key: string]: FileTreeItem[] | string;
}

const renderTreeItems = (tree: FileTreeItem[] | string[], onFileSelect: (path: string) => void, parentPath: string = '') => {
  return tree.map((item) => {
    if (typeof item === 'string') {
      const fileName = item.split('/').pop();
      return (
        <TreeItem
          key={item}
          itemId={item}
          label={fileName}
          icon={<DescriptionIcon />}
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
              <FolderIcon sx={{ mr: 1, fontSize: 'medium' }} color="primary" />
              {key}
            </Box>
          }
        >
          {Array.isArray(value) && renderTreeItems(value, onFileSelect, currentPath)}
        </TreeItem>
      );
    }
  });
};

interface FileTreeComponentProps {
  onFileSelect: (path: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const FileTree: React.FC<FileTreeComponentProps> = ({ onFileSelect, isOpen, onToggle }) => {
  const { fileTree, loading, error } = useFileTree();

  return (
    <Box sx={{
      width: isOpen ? '300px' : '66px',
      bgcolor: 'background.paper',
      p: isOpen ? 2 : 0.5,
      borderRight: '1px solid',
      borderColor: 'divider',
      minHeight: '100%',
      flexShrink: 0,
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '34px', marginTop: isOpen ? '0' : '16px', marginBottom: 2 }}>
        {isOpen && (
          <Typography variant="h6" gutterBottom sx={{ marginLeft: 1, marginBottom: 0 }}>
            File Tree
          </Typography>
        )}
        <IconButton onClick={onToggle} size="small" sx={{ marginBottom: 0, marginLeft: isOpen ? '0' : '12px' }}>
          {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>
      {isOpen && (
          loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">Error: {error}</Typography>
          ) : (
            <SimpleTreeView
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
              sx={{ flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
            >
              {renderTreeItems(fileTree, onFileSelect)}
            </SimpleTreeView>
          )
      )}
    </Box>
  );
};

export default FileTree;
