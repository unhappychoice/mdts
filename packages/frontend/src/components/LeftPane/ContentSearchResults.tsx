import React from 'react';
import { List, ListItem, ListItemText, Typography, Box, Divider } from '@mui/material';
import { ContentSearchResult } from '../../../store/slices/fileTreeSlice';

interface ContentSearchResultsProps {
  results: ContentSearchResult[];
  onFileSelect: (path: string, line?: number) => void;
  searchQuery: string;
}

const HighlightedText: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  if (!query) return <>{text}</>;
  
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() 
          ? <mark key={i} style={{ backgroundColor: '#ffeb3b', borderRadius: '2px', padding: '0 2px' }}>{part}</mark> 
          : part
      )}
    </>
  );
};

const ContentSearchResults: React.FC<ContentSearchResultsProps> = ({ results, onFileSelect, searchQuery }) => {
  if (results.length === 0) {
    return (
      <Box px={2} py={1}>
        <Typography variant="body2" color="textSecondary">
          No results found.
        </Typography>
      </Box>
    );
  }

  return (
    <List dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {results.map((result, index) => (
        <React.Fragment key={result.id}>
          <ListItem 
            component="div"
            sx={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ListItemText
              primary={result.title}
              secondary={result.path}
              primaryTypographyProps={{
                variant: 'body2',
                fontWeight: 'bold',
                noWrap: true,
                color: 'primary.main',
                style: { cursor: 'pointer' }
              }}
              secondaryTypographyProps={{
                variant: 'caption',
                noWrap: true,
              }}
              onClick={() => onFileSelect(result.path)}
            />
            
            <Box sx={{ width: '100%', mt: 1, pl: 1, borderLeft: '2px solid', borderColor: 'divider' }}>
              {result.snippets.map((snippet, sIdx) => (
                <Box 
                  key={sIdx} 
                  sx={{ 
                    mb: 0.5, 
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                  onClick={() => onFileSelect(result.path, snippet.line)}
                >
                  <Typography 
                    variant="caption" 
                    component="span" 
                    sx={{ 
                      color: 'text.secondary', 
                      mr: 1,
                      fontFamily: 'monospace',
                      display: 'inline-block',
                      minWidth: '20px'
                    }}
                  >
                    {snippet.line}:
                  </Typography>
                  <Typography 
                    variant="caption" 
                    component="span"
                    sx={{ 
                      fontFamily: 'monospace',
                      wordBreak: 'break-all',
                    }}
                  >
                    <HighlightedText text={snippet.text} query={searchQuery} />
                  </Typography>
                </Box>
              ))}
            </Box>
          </ListItem>
          {index < results.length - 1 && <Divider component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default ContentSearchResults;
