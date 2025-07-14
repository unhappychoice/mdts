import React, { createContext, useContext } from 'react';
import { useFileTree } from '../hooks/useFileTree';

interface FileTreeItem {
  [key: string]: FileTreeItem[] | string;
}

interface FileTreeContextType {
  fileTree: FileTreeItem[] | string[];
  loading: boolean;
  error: string | null;
}

const FileTreeContext = createContext<FileTreeContextType | undefined>(undefined);

export const FileTreeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { fileTree, loading, error } = useFileTree(); // useFileTree will now fetch the full tree
  return (
    <FileTreeContext.Provider value={{ fileTree, loading, error }}>
      {children}
    </FileTreeContext.Provider>
  );
};

export const useFileTreeContext = () => {
  const context = useContext(FileTreeContext);
  if (context === undefined) {
    throw new Error('useFileTreeContext must be used within a FileTreeProvider');
  }
  return context;
};
