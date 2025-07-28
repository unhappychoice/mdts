import React from 'react';
import { Box, IconButton, InputAdornment, InputBase } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

interface FileTreeSearchProps {
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
}

const FileTreeSearch: React.FC<FileTreeSearchProps> = ({ searchQuery, onSearchChange, onClearSearch }) => {
  return (
    <Box mb={2} px={2}>
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
        onChange={onSearchChange}
        endAdornment={
          searchQuery && (
            <InputAdornment position="end">
              <IconButton
                onClick={onClearSearch}
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
  );
};

export default FileTreeSearch;
