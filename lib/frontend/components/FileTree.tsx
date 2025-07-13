import React, { useState, useEffect } from 'react';
import { fetchFileTree } from '../api';
import { Box, Typography } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';

interface FileTreeItem {
  [key: string]: FileTreeItem[] | string;
}

interface FileTreeProps {
  tree: FileTreeItem[] | string[];
  onFileSelect: (path: string) => void;
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
        <TreeItem key={currentPath} itemId={currentPath} label={key} icon={<FolderIcon />}>
          {Array.isArray(value) && renderTreeItems(value, onFileSelect, currentPath)}
        </TreeItem>
      );
    }
  });
};

interface FileTreeComponentProps {
  onFileSelect: (path: string) => void;
}

const FileTree: React.FC<FileTreeComponentProps> = ({ onFileSelect }) => {
  const [fileTree, setFileTree] = useState<FileTreeItem[] | string[]>([]);

  useEffect(() => {
    const getFileTree = async () => {
      const tree = await fetchFileTree();
      setFileTree(tree);
    };
    getFileTree();
  }, []);

  return (
    <Box sx={{ width: '25%', bgcolor: 'background.paper', p: 2, borderRight: '1px solid #eee' }}>
      <Typography variant="h6" gutterBottom>
        File Tree
      </Typography>
      <SimpleTreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        sx={{ flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
      >
        {renderTreeItems(fileTree, onFileSelect)}
      </SimpleTreeView>
    </Box>
  );
};

export default FileTree;