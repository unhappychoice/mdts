import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import DirectoryContent from './DirectoryContent/DirectoryContent';
import MarkdownContent from './MarkdownContent/MarkdownContent';
import { Box } from '@mui/material';

interface ContentProps {
  onFileSelect: (path: string) => void;
  onDirectorySelect: (path: string) => void;
  scrollToId: string | null;
}

const Content: React.FC<ContentProps> = ({ onFileSelect, onDirectorySelect, scrollToId }) => {
  const { currentPath, isDirectory } = useSelector((state: RootState) => state.history);
  const { contentMode } = useSelector((state: RootState) => state.appSetting);

  const contentWidth = contentMode === 'compact' ? '800px' : '100%';

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        display: 'flex',
        justifyContent: 'center',
        width: contentWidth,
        maxWidth: contentWidth,
        mx: 'auto',
      }}
    >
      {currentPath && isDirectory ? (
        <DirectoryContent onFileSelect={onFileSelect} onDirectorySelect={onDirectorySelect} />
      ) : (
        <MarkdownContent onDirectorySelect={onDirectorySelect} scrollToId={scrollToId} />
      )}
    </Box>
  );
};

export default Content;
