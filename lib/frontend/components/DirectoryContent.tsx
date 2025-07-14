import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
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
import { useFileTreeContext } from '../contexts/FileTreeContext';

interface DirectoryContentProps {
  selectedDirectoryPath: string;
  onFileSelect: (filePath: string) => void;
  onDirectorySelect: (directoryPath: string) => void;
}

interface FileTreeItem {
  [key: string]: FileTreeItem[] | string;
}

const filterFileTree = (tree: FileTreeItem[] | string[], targetPath: string): FileTreeItem[] | string[] => {
  if (targetPath === '') {
    const result: FileTreeItem[] | string[] = [];
    tree.forEach(item => {
      if (typeof item === 'string') {
        result.push(item.split('/').pop() || item);
      } else {
        const key = Object.keys(item)[0];
        const newObject: FileTreeItem = {};
        newObject[key.split('/').pop() || key] = item[key];
        result.push(newObject);
      }
    });
    return result;
  }

  const findChildren = (currentTree: FileTreeItem[] | string[], pathSegments: string[], currentSegmentIndex: number): FileTreeItem[] | string[] | null => {
    if (currentSegmentIndex === pathSegments.length) {
      return currentTree;
    }

    const segment = pathSegments[currentSegmentIndex];

    for (const item of currentTree) {
      if (typeof item !== 'string') {
        const key = Object.keys(item)[0];
        const itemSegments = key.split('/');
        if (itemSegments[itemSegments.length - 1] === segment) {
          const children = item[key];
          if (Array.isArray(children)) {
            return findChildren(children, pathSegments, currentSegmentIndex + 1);
          }
        }
      }
    }
    return null;
  };

  const pathSegments = targetPath.split('/').filter(s => s !== '');
  const children = findChildren(tree, pathSegments, 0);

  if (children) {
    const result: FileTreeItem[] | string[] = [];
    children.forEach(item => {
      if (typeof item === 'string') {
        result.push(item.split('/').pop() || item);
      } else {
        const key = Object.keys(item)[0];
        const newObject: FileTreeItem = {};
        newObject[key.split('/').pop() || key] = item[key];
        result.push(newObject);
      }
    });
    return result;
  }

  return [];
};

const DirectoryContent: React.FC<DirectoryContentProps> = ({ selectedDirectoryPath, onFileSelect, onDirectorySelect }) => {
  const { fileTree: fullFileTree, loading, error } = useFileTreeContext();
  const fileTree = filterFileTree(fullFileTree, selectedDirectoryPath);


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
        maxWidth: '800px',
        margin: '0 auto',
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
      <Typography variant="h4" gutterBottom mb={8}>
        Directory: {selectedDirectoryPath}
      </Typography>
      <Divider sx={{ paddingLeft: '24px', marginLeft: '-32px', marginRight: '-32px', borderBottom: 1, borderColor: 'divider' }} />
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
        </Box>
      )}
      <Box mt={4}>
        {fileTree && (
          <List>
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
                  <ListItemIcon>
                    {isDirectory ? <FolderIcon color="primary" /> : <InsertDriveFileIcon />}
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
