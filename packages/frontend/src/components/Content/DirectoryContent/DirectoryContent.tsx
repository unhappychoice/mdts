import { FolderOutlined } from '@mui/icons-material';
import { Box, CircularProgress, Divider, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import useIsMobile from '../../../hooks/useIsMobile';
import { selectFilteredFileTree } from '../../../store/slices/fileTreeSlice';
import { RootState } from '../../../store/store';
import ErrorView from '../../ErrorView';
import BreadCrumb from '../BreadCrumb';
import { FileTreeList } from './FileTreeList';

interface DirectoryContentProps {
  onFileSelect: (filePath: string) => void;
  onDirectorySelect: (directoryPath: string) => void;
}

const DirectoryContent: React.FC<DirectoryContentProps> = ({ onFileSelect, onDirectorySelect }) => {
  const { currentPath } = useSelector((state: RootState) => state.history);
  const { contentMode } = useSelector((state: RootState) => state.appSetting);
  const { fileTree: fullFileTree, loading, error } = useSelector((state: RootState) => state.fileTree);
  const isMobile = useIsMobile();

  const fileTree = selectFilteredFileTree(fullFileTree, currentPath);

  const handleItemClick = useCallback((itemPath: string, isDirectory: boolean) => {
    if (isDirectory) {
      onDirectorySelect(itemPath);
    } else {
      onFileSelect(itemPath);
    }
  }, [onDirectorySelect, onFileSelect]);

  if (error) {
    return <ErrorView error={error} />;
  }

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: 'calc(100vh - 64px)',
        m: 0,
        p: isMobile ? 2 : 4,
        bgcolor: 'background.paper',
        ...(contentMode === 'compact' && !isMobile && {
          width: '800px',
          margin: '0 auto',
        })
      }}
    >
      <BreadCrumb onDirectorySelect={onDirectorySelect} />
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <FolderOutlined sx={{ mr: 2 }} color="primary" fontSize={isMobile ? 'medium' : 'large'} />
        <Typography variant={isMobile ? 'h5' : 'h4'} gutterBottom sx={{ mb: 0, wordBreak: 'break-word' }}>
          {currentPath}
        </Typography>
      </Box>
      <Divider sx={{ paddingLeft: '24px', marginLeft: isMobile ? '-16px' : '-32px', marginRight: isMobile ? '-16px' : '-32px', borderBottom: 1, borderColor: 'divider' }} />
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
        </Box>
      )}
      <Box mt={4}>
        <FileTreeList fileTree={fileTree} handleItemClick={handleItemClick} />
      </Box>
    </Box>
  );
};

export default DirectoryContent;
