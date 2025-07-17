import { ArticleOutlined, FolderOutlined } from '@mui/icons-material';
import {
  Box,
  Breadcrumbs,
  CircularProgress,
  Divider,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { selectFilteredFileTree } from '../store/slices/fileTreeSlice';

interface DirectoryContentProps {
  selectedDirectoryPath: string;
  onFileSelect: (filePath: string) => void;
  onDirectorySelect: (directoryPath: string) => void;
  contentMode?: 'fixed' | 'full';
}

const DirectoryContent: React.FC<DirectoryContentProps> = ({ selectedDirectoryPath, onFileSelect, onDirectorySelect, contentMode = 'fixed' }) => {
  const { fileTree: fullFileTree, loading, error } = useSelector((state: RootState) => state.fileTree);
  const fileTree = selectFilteredFileTree(fullFileTree, selectedDirectoryPath);

  const pathSegments = selectedDirectoryPath
    ? selectedDirectoryPath.split('/').filter(segment => segment !== '')
    : [];

  if (error) return <p>Error: {error}</p>;

  const handleItemClick = (itemPath: string, isDirectory: boolean) => {
    if (isDirectory) {
      onDirectorySelect(itemPath);
    } else {
      onFileSelect(itemPath);
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 4,
        bgcolor: 'background.paper',
        ...(contentMode === 'fixed' && {
          maxWidth: '800px',
          margin: '0 auto',
        }),
      }}
    >
      {selectedDirectoryPath && (
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4 }}>
          {pathSegments.map((segment, index) => {
            const isLast = index === pathSegments.length - 1;
            const path = pathSegments.slice(0, index + 1).join('/');
            return isLast ? (
              <Typography key={path} color="text.primary">
                {segment}
              </Typography>
            ) : (
              <Link key={path} color="inherit" href="#" onClick={() => onDirectorySelect && onDirectorySelect(path)}>
                {segment}
              </Link>
            );
          })}
        </Breadcrumbs>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 8 }}>
        <FolderOutlined sx={{ mr: 2 }} color="primary" fontSize="large"/>
        <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
          {selectedDirectoryPath}
        </Typography>
      </Box>
      <Divider sx={{ paddingLeft: '24px', marginLeft: '-32px', marginRight: '-32px', borderBottom: 1, borderColor: 'divider' }} />
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
        </Box>
      )}
      <Box mt={4}>
        {fileTree && (
          <List sx={{ mr: -2, ml: -2 }}>
            {fileTree.map((item) => {
              let name: string;
              let itemPath: string;
              let isDirectory: boolean;

              if (typeof item === 'string') {
                // It's a file
                name = item;
                itemPath = selectedDirectoryPath === '' ? item : `${selectedDirectoryPath}/${item}`;
                isDirectory = false;
              } else {
                // It's a directory object { [key: string]: FileTreeItem[] | string; }
                const key = Object.keys(item)[0];
                name = key;
                itemPath = selectedDirectoryPath === '' ? key : `${selectedDirectoryPath}/${key}`;
                isDirectory = true;
              }

              return (
                <ListItem button key={itemPath} onClick={() => handleItemClick(itemPath, isDirectory)}>
                  <ListItemIcon sx={{ minWidth: "38px" }}>
                    {isDirectory ? <FolderOutlined color="primary" /> : <ArticleOutlined />}
                  </ListItemIcon>
                  <ListItemText primary={name} />
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default DirectoryContent;
