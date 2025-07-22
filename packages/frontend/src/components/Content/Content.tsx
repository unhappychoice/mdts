import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import DirectoryContent from './DirectoryContent/DirectoryContent';
import MarkdownContent from './MarkdownContent/MarkdownContent';

interface ContentProps {
  onFileSelect: (path: string) => void;
  onDirectorySelect: (path: string) => void;
  scrollToId: string | null;
}

const Content: React.FC<ContentProps> = ({ onFileSelect, onDirectorySelect, scrollToId }) => {
  const { currentPath, isDirectory } = useSelector((state: RootState) => state.history);

  return currentPath && isDirectory ? (
    <DirectoryContent onFileSelect={onFileSelect} onDirectorySelect={onDirectorySelect} />
  ) : (
    <MarkdownContent onDirectorySelect={onDirectorySelect} scrollToId={scrollToId} />
  );
};

export default Content;
