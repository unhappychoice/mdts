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

  return (
    <Box
      sx={{
        display: 'flex',
        height: 'calc(100vh - 64px)',
        flexGrow: 1,
        justifyContent: 'center',
        ...(contentMode === 'full' && { bgcolor: 'background.paper' }),
      }}
    >
      <Box
        className="custom-scrollbar"
        sx={{
          overflowY: 'scroll',
          width: '100%',
        }}
      >
        {currentPath && isDirectory ? (
          <DirectoryContent onFileSelect={onFileSelect} onDirectorySelect={onDirectorySelect} />
        ) : (
          <MarkdownContent onDirectorySelect={onDirectorySelect} scrollToId={scrollToId} />
        )}
      </Box>
    </Box>
  );
};

export default Content;
