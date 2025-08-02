import React from 'react';
import { DirectoryTreeItemView } from './DirectoryTreeItemView';
import { FileTreeItemView } from './FileTreeItemView';
import { FileTreeItem, FileTree } from './types';

interface RecursiveTreeItemsProps {
  tree: FileTree | null;
  onFileSelect: (path: string) => void;
  parentPath?: string;
  getStatusColor: (status: string) => string;
}

export const RecursiveTreeItems: React.FC<RecursiveTreeItemsProps> = ({ tree, onFileSelect, parentPath = '', getStatusColor }) => {
  if (!tree) return null;

  return tree.map((item) => {
    if ('path' in item) {
      return <FileTreeItemView
        key={item.path}
        fileItem={item as FileTreeItem}
        getStatusColor={getStatusColor}
        onFileSelect={onFileSelect} />;
    } else {
      const key = Object.keys(item)[0];
      const value = item[key];
      const currentPath = parentPath ? `${parentPath}/${key}` : key;
      return (
        <DirectoryTreeItemView key={key} directoryName={key} currentPath={currentPath}>
          {Array.isArray(value) && value.length > 0 && (
            <RecursiveTreeItems
              tree={value}
              parentPath={currentPath}
              getStatusColor={getStatusColor}
              onFileSelect={onFileSelect} />
          )}
        </DirectoryTreeItemView>
      );
    }
  });
};
