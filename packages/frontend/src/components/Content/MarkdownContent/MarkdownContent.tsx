import { ArticleOutlined } from '@mui/icons-material';
import { Box, Chip, Typography, } from '@mui/material';
import React, { useEffect } from 'react';
import { useFrontmatter } from '../../../hooks/useFrontmatter';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContent } from '../../../store/slices/contentSlice';
import { AppDispatch, RootState } from '../../../store/store';
import BreadCrumb from '../BreadCrumb';
import ErrorView from '../ErrorView';
import MarkdownContentTabs from './MarkdownContentTabs';
import MarkdownContentView from './MarkdownContentView';
import { useViewMode } from '../../../hooks/useViewMode';

interface MarkdownContentProps {
  scrollToId: string | null;
  onDirectorySelect?: (directoryPath: string) => void;
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({ scrollToId, onDirectorySelect }) => {
  const dispatch = useDispatch<AppDispatch>();

  const { currentPath } = useSelector((state: RootState) => state.history);
  const { contentMode } = useSelector((state: RootState) => state.appSetting);
  const { content, loading: contentLoading, error } = useSelector((state: RootState) => state.content);
  const { loading: fileTreeLoading } = useSelector((state: RootState) => state.fileTree);

  const { frontmatter, markdownContent } = useFrontmatter(content);
  const viewMode = useViewMode();
  const loading = contentLoading || fileTreeLoading;

  useEffect(() => {
    dispatch(fetchContent(currentPath));
  }, [dispatch, currentPath]);

  useEffect(() => {
    if (scrollToId) {
      const element = document.getElementById(scrollToId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [scrollToId, content]);
  const displayFileName = frontmatter.title
    ? String(frontmatter.title)
    : currentPath
      ? currentPath.split('/').pop()
      : loading
        ? ''
        : '🎉 Welcome to mdts!';

  const hasFrontmatter = Object.keys(frontmatter).length > 0;

  if (error) {
    return <ErrorView error={error} />;
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 4,
        bgcolor: 'background.paper',
        ...(contentMode === 'fixed' && {
          maxWidth: '800px',
          margin: '0 auto',
        }),
      }}
    >
      <BreadCrumb onDirectorySelect={onDirectorySelect} />
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <ArticleOutlined sx={{ mr: 2 }} fontSize="large" />
        <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
          {displayFileName}
        </Typography>
      </Box>
      {frontmatter.tags && Array.isArray(frontmatter.tags) && frontmatter.tags.length > 0 && (
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          {frontmatter.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" />
          ))}
        </Box>
      )}
      {frontmatter.categories && Array.isArray(frontmatter.categories) && frontmatter.categories.length > 0 && (
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          {frontmatter.categories.map((category) => (
            <Chip key={category} label={category} size="small" />
          ))}
        </Box>
      )}
      <MarkdownContentTabs viewMode={viewMode} hasFrontmatter={hasFrontmatter} />
      <MarkdownContentView
        loading={loading}
        viewMode={viewMode}
        content={content}
        frontmatter={frontmatter}
        markdownContent={markdownContent}
      />
    </Box>
  );
};

export default MarkdownContent;
