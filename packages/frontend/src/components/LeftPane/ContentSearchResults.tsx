import SearchOutlined from '@mui/icons-material/SearchOutlined';
import { Box, CircularProgress, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { ContentSearchResult } from '../../store/slices/fileTreeSlice';

interface ContentSearchResultsProps {
  searchQuery: string;
  results: ContentSearchResult[];
  loading: boolean;
  error: string | null;
  onFileSelect: (path: string) => void;
}

const MIN_CONTENT_SEARCH_LENGTH = 2;

interface ContentSearchResultItemProps {
  result: ContentSearchResult;
  onFileSelect: (path: string) => void;
}

const ContentSearchResultItem: React.FC<ContentSearchResultItemProps> = ({ result, onFileSelect }) => {
  const handleClick = useCallback(() => {
    onFileSelect(result.path);
  }, [onFileSelect, result.path]);

  return (
    <ListItemButton
      onClick={handleClick}
      sx={{ borderRadius: 1, alignItems: 'flex-start', py: 0.5 }}
    >
      <SearchOutlined sx={{ fontSize: 16, mr: 1, mt: 0.25, color: 'text.secondary' }} />
      <ListItemText
        primary={
          <Typography variant="body2" noWrap sx={{ fontSize: '0.8125rem' }}>
            {result.path}
          </Typography>
        }
        secondary={
          <Box component="span" sx={{ display: 'block' }}>
            <Typography component="span" variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Line {result.line}
            </Typography>
            <Typography component="span" variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
              {result.preview}
            </Typography>
          </Box>
        }
      />
    </ListItemButton>
  );
};

const ContentSearchResults: React.FC<ContentSearchResultsProps> = ({
  searchQuery,
  results,
  loading,
  error,
  onFileSelect,
}) => {
  if (searchQuery.trim().length < MIN_CONTENT_SEARCH_LENGTH) return null;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pb: 1, gap: 1 }}>
        <CircularProgress size={14} />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography role="alert" variant="caption" color="error" sx={{ display: 'block', px: 2, pb: 1 }}>
        Search failed
      </Typography>
    );
  }

  if (results.length === 0) return null;

  return (
    <Box sx={{ px: 1, pb: 1 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', px: 1, pb: 0.5 }}>
        Content matches
      </Typography>
      <List dense disablePadding sx={{ maxHeight: 240, overflow: 'auto' }}>
        {results.map((result) => (
          <ContentSearchResultItem
            key={`${result.path}:${result.line}:${result.preview}`}
            result={result}
            onFileSelect={onFileSelect}
          />
        ))}
      </List>
    </Box>
  );
};

export default ContentSearchResults;
