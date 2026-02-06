import { Box, CircularProgress, List, ListItem, ListItemText } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import MarkdownRenderer from './MarkdownRenderer/MarkdownRenderer';

interface MarkdownContentViewProps {
  loading: boolean;
  viewMode: 'preview' | 'frontmatter' | 'raw';
  content: string | null;
  markdownContent: string;
  frontmatter: Record<string, unknown>;
}

const MarkdownContentView: React.FC<MarkdownContentViewProps> = (
  { loading, viewMode, markdownContent, frontmatter, content }
) => {
  const { currentPath } = useSelector((state: RootState) => state.history);
  const { enableBreaks } = useSelector((state: RootState) => state.config);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  switch (viewMode) {
    case 'preview':
      return <MarkdownRenderer content={markdownContent} selectedFilePath={currentPath} enableBreaks={enableBreaks} />;
    case 'frontmatter':
      return (
        <Box sx={{ my: 4 }}>
          <List sx={{ p: 0 }}>
            {Object.entries(frontmatter).map(([key, value]) => (
              <ListItem key={key} sx={{ px: 0, py: 1 }}>
                <ListItemText primary={key} secondary={String(value)} />
              </ListItem>
            ))}
          </List>
        </Box>
      );
    case 'raw':
      return (
        <MarkdownRenderer content={['`````markdown', content, '``````'].join('\n')} selectedFilePath={currentPath} enableBreaks={enableBreaks} />
      );
    default:
      return null;
  }
};

export default MarkdownContentView;
