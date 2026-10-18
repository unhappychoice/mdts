import React, { useCallback } from 'react';
import { List, ListItem, ListItemText, Typography, Box, Divider, ButtonBase, useTheme } from '@mui/material';
import { ContentSearchResult, SearchSnippet } from '../../../../../src/shared/searchTypes';

interface ContentSearchResultsProps {
  results: ContentSearchResult[];
  onFileSelect: (path: string, line?: number) => void;
  searchQuery: string;
}

const HighlightedText: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  const theme = useTheme();
  if (!query) return <>{text}</>;
  
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() 
          ? <mark key={i} style={{ backgroundColor: theme.palette.warning.light, borderRadius: '2px', padding: '0 2px' }}>{part}</mark> 
          : part
      )}
    </>
  );
};

interface SnippetItemProps {
  path: string;
  snippet: SearchSnippet;
  searchQuery: string;
  onFileSelect: (path: string, line?: number) => void;
}

const SnippetItem: React.FC<SnippetItemProps> = ({ path, snippet, searchQuery, onFileSelect }) => {
  const handleClick = useCallback(() => {
    onFileSelect(path, snippet.line);
  }, [onFileSelect, path, snippet.line]);

  return (
    <ButtonBase
      sx={{ 
        mb: 0.5, 
        width: '100%',
        textAlign: 'left',
        display: 'block',
        '&:hover': { textDecoration: 'underline' }
      }}
      onClick={handleClick}
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
    </ButtonBase>
  );
};

interface ResultItemProps {
  result: ContentSearchResult;
  searchQuery: string;
  onFileSelect: (path: string, line?: number) => void;
}

const ResultItem: React.FC<ResultItemProps> = ({ result, searchQuery, onFileSelect }) => {
  const handleClick = useCallback(() => {
    onFileSelect(result.path);
  }, [onFileSelect, result.path]);

  return (
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
      <ButtonBase
        onClick={handleClick}
        sx={{ 
          width: '100%', 
          textAlign: 'left',
          display: 'block',
          '&:hover .MuiListItemText-primary': {
            textDecoration: 'underline'
          }
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
          }}
          secondaryTypographyProps={{
            variant: 'caption',
            noWrap: true,
          }}
        />
      </ButtonBase>
      
      <Box sx={{ width: '100%', mt: 1, pl: 1, borderLeft: '2px solid', borderColor: 'divider' }}>
        {result.snippets.map((snippet, sIdx) => (
          <SnippetItem 
            key={sIdx} 
            path={result.path} 
            snippet={snippet} 
            searchQuery={searchQuery} 
            onFileSelect={onFileSelect} 
          />
        ))}
      </Box>
    </ListItem>
  );
};

const ContentSearchResults: React.FC<ContentSearchResultsProps> = ({ results = [], onFileSelect, searchQuery }) => {
  if (!searchQuery.trim()) {
    return null;
  }

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
          <ResultItem 
            result={result} 
            searchQuery={searchQuery} 
            onFileSelect={onFileSelect} 
          />
          {index < results.length - 1 && <Divider component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default ContentSearchResults;
