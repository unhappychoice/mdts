import { ArticleOutlined, Clear as ClearIcon, FolderOutlined } from '@mui/icons-material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { Box, CircularProgress, IconButton, InputBase, InputAdornment, Typography } from '@mui/material';
import { TreeItem } from '@mui/x-tree-view';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import React, { useEffect, useMemo } from 'react';
import { useFileTree } from '../hooks/apis/useFileTree';

interface FileTreeItem {
  [key: string]: (FileTreeItem | string)[];
}

interface FileTreeComponentProps {
  onFileSelect: (path: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  selectedFilePath: string | null;
}

const FileTree: React.FC<FileTreeComponentProps> = ({ onFileSelect, isOpen, onToggle }) => {
  const { fileTree, loading, error } = useFileTree();
  const [expanded, setExpanded] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const filteredTree = useMemo(() => filterTree(fileTree, searchQuery), [fileTree, searchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleExpandAll = () => {
    const allItemIds: string[] = [];
    const collectIds = (items: (FileTreeItem | string)[], parentPath: string = '') => {
      items.forEach(item => {
        if (typeof item !== 'string') {
          const key = Object.keys(item)[0];
          const currentPath = parentPath ? `${parentPath}/${key}` : key;
          allItemIds.push(currentPath);
          collectIds(item[key] as FileTreeItem[] | string[], currentPath);
        }
      });
    };
    if (fileTree) {
      collectIds(fileTree);
    }
    setExpanded(allItemIds);
  };

  const handleCollapseAll = () => {
    setExpanded([]);
  };

  useEffect(() => {
    if (searchQuery) {
      const newExpanded: string[] = [];

      const collectExpandedPaths = (items: (FileTreeItem | string)[], parentPath: string = '') => {
        items.forEach(item => {
          if (typeof item !== 'string') { // It's a folder
            const key = Object.keys(item)[0];
            const value = item[key];
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

      if (filteredTree) {
        collectExpandedPaths(filteredTree);
      }
      
      setExpanded(newExpanded);
    } else {
      setExpanded([]);
    }
  }, [searchQuery, filteredTree]);

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
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ flex: 1, marginLeft: 1, marginBottom: 0 }}>
              File Tree
            </Typography>
            <IconButton onClick={handleExpandAll} size="small" aria-label="expand all">
              <UnfoldMoreIcon />
            </IconButton>
            <IconButton onClick={handleCollapseAll} size="small" aria-label="collapse all">
              <UnfoldLessIcon />
            </IconButton>
          </Box>
        )}
        <IconButton onClick={onToggle} size="small" sx={{ marginBottom: 0, marginLeft: isOpen ? '0' : '12px' }}>
          {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>
      <Box mb={2}>
        <InputBase
          placeholder="Search files..."
          inputProps={{ 'aria-label': 'search files' }}
          sx={{
            flex: 1,
            width: '100%',
            px: 2,
            py: 0,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '4px',
            fontSize: '0.875rem',
          }}
          value={searchQuery}
          onChange={handleSearchChange}
          endAdornment={
            searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setSearchQuery('')}
                  edge="end"
                  size="small"
                  aria-label="clear search"
                >
                  <ClearIcon sx={{ fontSize: '0.875rem', color: 'divider' }}/>
                </IconButton>
              </InputAdornment>
            )
          }
        />
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
              expandedItems={expanded}
              onExpandedItemsChange={(event, itemIds) => setExpanded(itemIds)}
              sx={{ flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
            >
              {renderTreeItems(filteredTree, onFileSelect)}
            </SimpleTreeView>
          )
      )}
    </Box>
  );
};

export default FileTree;

const renderTreeItems = (
  tree: (FileTreeItem | string)[],
  onFileSelect: (path: string) => void,
  parentPath: string = ''
) => {
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

const filterTree = (tree: (FileTreeItem | string)[], searchQuery: string): (FileTreeItem | string)[] => {
  if (!searchQuery) return tree; // If no search query, return the original tree

  return tree
    .reduce((acc: (FileTreeItem | string)[], item) => {
      if (typeof item === 'string') {
        const fileName = item.split('/').pop() || '';
        return fileName.toLowerCase().includes(searchQuery.toLowerCase())
          ? [...acc, item]
          : acc;
      } else {
        const key = Object.keys(item)[0];
        const value = item[key];

        const children = Array.isArray(value)
          ? filterTree(value, searchQuery)
          : [];

        return children.length > 0
          ? [...acc, { [key]: children } as FileTreeItem ]
          :acc;
      }
    }, []);
};
