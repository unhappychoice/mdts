import React, { useCallback } from 'react';
import { Box, IconButton, InputAdornment, InputBase, Tooltip } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import DescriptionIcon from '@mui/icons-material/Description';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchMode } from '../../store/slices/fileTreeSlice';
import { RootState } from '../../store/store';

interface FileTreeSearchProps {
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
}

const FileTreeSearch: React.FC<FileTreeSearchProps> = ({ searchQuery, onSearchChange, onClearSearch }) => {
  const dispatch = useDispatch();
  const searchMode = useSelector((state: RootState) => state.fileTree.searchMode);

  const toggleSearchMode = useCallback(() => {
    dispatch(setSearchMode(searchMode === 'filename' ? 'content' : 'filename'));
  }, [dispatch, searchMode]);

  return (
    <Box mb={2} px={2}>
      <InputBase
        placeholder={searchMode === 'filename' ? 'Search files...' : 'Search content...'}
        inputProps={{ 'aria-label': searchMode === 'filename' ? 'search files' : 'search content' }}
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
        startAdornment={
          <InputAdornment position="start">
            <Tooltip title={searchMode === 'filename' ? 'Filename Search (click to switch to Content)' : 'Content Search (click to switch to Filename)'}>
              <IconButton 
                size="small" 
                onClick={toggleSearchMode}
                aria-label={searchMode === 'filename' ? 'switch to content search' : 'switch to filename search'}
              >
                {searchMode === 'filename' ? (
                  <DescriptionIcon sx={{ fontSize: '1rem' }} />
                ) : (
                  <TextSnippetIcon sx={{ fontSize: '1rem', color: 'primary.main' }} />
                )}
              </IconButton>
            </Tooltip>
          </InputAdornment>
        }
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
