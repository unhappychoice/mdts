import { ArticleOutlined, FolderOutlined } from '@mui/icons-material';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { FileTreeItem } from '../../../store/slices/fileTreeSlice';
import { RootState } from '../../../store/store';

export interface FileTreeListProps {
  fileTree: (FileTreeItem | string)[];
  handleItemClick: (itemPath: string, isDirectory: boolean) => void;
}

export const FileTreeList: React.FC<FileTreeListProps> = ({ fileTree, handleItemClick }) => {
  const { currentPath } = useSelector((state: RootState) => state.history);

  return (
    <List sx={{ mr: -2, ml: -2 }}>
      {fileTree.map((item) => {
        const isDirectory = typeof item !== 'string';
        const name = isDirectory ? Object.keys(item)[0] : item;
        const itemPath = currentPath === '' ? name : `${currentPath}/${name}`;

        const handleClick = () => {
          handleItemClick(itemPath, isDirectory);
        };

        return (
          <ListItem key={itemPath} button={true} onClick={handleClick}>
            <ListItemIcon sx={{ minWidth: "38px" }}>
              {isDirectory ? <FolderOutlined color="primary" /> : <ArticleOutlined />}
            </ListItemIcon>
            <ListItemText primary={name} />
          </ListItem>
        );
      })}
    </List>
  );
};
