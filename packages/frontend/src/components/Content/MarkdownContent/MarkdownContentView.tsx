import { Alert, Box, CircularProgress, List, ListItem, ListItemText, Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { ViewMode } from '../../../hooks/useViewMode';
import { RootState } from '../../../store/store';
import MarkdownRenderer from './MarkdownRenderer/MarkdownRenderer';

interface MarkdownContentViewProps {
  loading: boolean;
  viewMode: ViewMode;
  content: string | null;
  markdownContent: string;
  frontmatter: Record<string, unknown>;
}

const LoadingView: React.FC = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
    <CircularProgress />
  </Box>
);

const EmptyDiffView: React.FC<{ message: string }> = ({ message }) => (
  <Box sx={{ my: 4, textAlign: 'center' }}>
    <Typography variant="body1" color="text.secondary">
      {message}
    </Typography>
  </Box>
);

const MarkdownContentView: React.FC<MarkdownContentViewProps> = (
  { loading, viewMode, markdownContent, frontmatter, content }
) => {
  const { currentPath } = useSelector((state: RootState) => state.history);
  const { enableBreaks } = useSelector((state: RootState) => state.config);
  const {
    diff, diffPrev, diffLoading, diffPrevLoading, diffError, diffPrevError,
  } = useSelector((state: RootState) => state.diff);

  if (loading) {
    return <LoadingView />;
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
    case 'diff':
      if (diffLoading) return <LoadingView />;
      if (diffError) return <Alert severity="error">{diffError}</Alert>;
      if (!diff) return <EmptyDiffView message="No uncommitted changes" />;
      return (
        <MarkdownRenderer content={['`````diff', diff, '``````'].join('\n')} selectedFilePath={currentPath} enableBreaks={enableBreaks} />
      );
    case 'diff-prev':
      if (diffPrevLoading) return <LoadingView />;
      if (diffPrevError) return <Alert severity="error">{diffPrevError}</Alert>;
      if (!diffPrev) return <EmptyDiffView message="No previous changes found" />;
      return (
        <MarkdownRenderer content={['`````diff', diffPrev, '``````'].join('\n')} selectedFilePath={currentPath} enableBreaks={enableBreaks} />
      );
    default:
      return null;
  }
};

export default MarkdownContentView;
