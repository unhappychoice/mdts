import { Box, CircularProgress, List, ListItem, ListItemText } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { ViewMode } from '../../../hooks/useViewMode';
import { RootState } from '../../../store/store';
import DiffView from './DiffView';
import MarkdownRenderer from './MarkdownRenderer/MarkdownRenderer';

interface MarkdownContentViewProps {
  loading: boolean;
  viewMode: ViewMode;
  content: string | null;
  markdownContent: string;
  frontmatter: Record<string, unknown>;
}

const MarkdownContentView: React.FC<MarkdownContentViewProps> = (
  { loading, viewMode, markdownContent, frontmatter, content }
) => {
  const { currentPath } = useSelector((state: RootState) => state.history);
  const { enableBreaks } = useSelector((state: RootState) => state.config);
  const { diff, diffPrev, diffLoading, diffPrevLoading } = useSelector((state: RootState) => state.diff);

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
    case 'diff':
      if (diffLoading) {
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <CircularProgress />
          </Box>
        );
      }
      return <DiffView diff={diff} emptyMessage="No uncommitted changes" />;
    case 'diff-prev':
      if (diffPrevLoading) {
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <CircularProgress />
          </Box>
        );
      }
      return <DiffView diff={diffPrev} emptyMessage="No previous changes found" />;
    default:
      return null;
  }
};

export default MarkdownContentView;
