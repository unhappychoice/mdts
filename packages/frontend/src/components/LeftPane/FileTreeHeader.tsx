import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

interface FileTreeHeaderProps {
  isOpen: boolean;
  onToggle: () => void;
  onExpandAllClick: () => void;
  onCollapseAll: () => void;
}

const FileTreeHeader: React.FC<FileTreeHeaderProps> = ({ isOpen, onToggle, onExpandAllClick, onCollapseAll }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '34px', marginTop: isOpen ? '0' : '16px', marginBottom: 2 }}>
      {isOpen && (
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Typography variant="h6" gutterBottom sx={{ flex: 1, marginLeft: 1, marginBottom: 0 }}>
            File Tree
          </Typography>
          <IconButton onClick={onExpandAllClick} size="small" aria-label="expand all">
            <UnfoldMoreIcon />
          </IconButton>
          <IconButton onClick={onCollapseAll} size="small" aria-label="collapse all">
            <UnfoldLessIcon />
          </IconButton>
        </Box>
      )}
      <IconButton onClick={onToggle} size="small" sx={{ marginBottom: 0, marginLeft: isOpen ? '0' : '12px' }} aria-label="toggle file tree">
        {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>
    </Box>
  );
};

export default FileTreeHeader;
