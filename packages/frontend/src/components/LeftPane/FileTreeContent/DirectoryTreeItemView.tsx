import { FolderOutlined } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { TreeItem } from '@mui/x-tree-view';
import React from 'react';

interface DirectoryTreeItemViewProps {
  directoryName: string;
  children: React.ReactNode;
  currentPath: string;
}

export const DirectoryTreeItemView: React.FC<DirectoryTreeItemViewProps> = ({
  directoryName,
  children,
  currentPath
}) => (
  <TreeItem
    key={currentPath}
    itemId={currentPath}
    label={
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <FolderOutlined sx={{ mr: 1, fontSize: 'small' }} color="primary" />
        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
          {directoryName}
        </Typography>
      </Box>
    }
  >
    {children}
  </TreeItem>
);
