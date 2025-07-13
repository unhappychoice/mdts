import React, { useState, useEffect } from 'react';
import { fetchFileTree } from '../api';

interface FileTreeItem {
  [key: string]: FileTreeItem[] | string;
}

interface FileTreeProps {
  tree: FileTreeItem[] | string[];
  onFileSelect: (path: string) => void;
}

const FileTreeRenderer: React.FC<FileTreeProps> = ({ tree, onFileSelect }) => {
  return (
    <ul>
      {tree.map((item, index) => {
        if (typeof item === 'string') {
          const fileName = item.split('/').pop(); // Extract just the file name
          return (
            <li key={index}>
              <a
                href={`/${item}`}
                className="text-blue-600 hover:underline dark:text-blue-400"
                onClick={(e) => {
                  e.preventDefault(); // Prevent full page reload
                  onFileSelect(item);
                }}
              >
                {fileName}
              </a>
            </li>
          );
        } else {
          const key = Object.keys(item)[0];
          const value = item[key];
          return (
            <li key={index}>
              <strong>{key}/</strong>
              {Array.isArray(value) && <FileTreeRenderer tree={value} onFileSelect={onFileSelect} />}
            </li>
          );
        }
      })}
    </ul>
  );
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
    <div className="w-1/4 bg-gray-200 dark:bg-gray-800 p-4">
      <h2 className="text-lg font-semibold mb-4">File Tree</h2>
      <FileTreeRenderer tree={fileTree} onFileSelect={onFileSelect} />
    </div>
  );
};

export default FileTree;