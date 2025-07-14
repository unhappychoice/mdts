import { Box, CircularProgress, Tab, Tabs, Typography, Breadcrumbs, Link } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useContent } from '../hooks/apis/useContent';
import MarkdownPreview from './MarkdownPreview';

interface ContentProps {
  selectedFilePath: string | null;
  contentMode?: 'fixed' | 'full';
  scrollToId: string | null;
  onDirectorySelect?: (directoryPath: string) => void;
}

const Content: React.FC<ContentProps> = ({ selectedFilePath, contentMode = 'fixed', scrollToId, onDirectorySelect }) => {
  const { content, loading, error } = useContent(selectedFilePath);
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');

  useEffect(() => {
    if (scrollToId) {
      const element = document.getElementById(scrollToId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [scrollToId]);

  const displayFileName = selectedFilePath ? selectedFilePath.split('/').pop() : "No file selected";

  const pathSegments = selectedFilePath
    ? selectedFilePath.split('/').filter(segment => segment !== '')
    : [];

  if (error) return <p>Error: {error}</p>;

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
      {selectedFilePath && (
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4 }}>
          {pathSegments.map((segment, index) => {
            const isLast = index === pathSegments.length - 1;
            const path = pathSegments.slice(0, index + 1).join('/');
            return isLast ? (
              <Typography key={path} color="text.primary">
                {segment}
              </Typography>
            ) : (
              <Link key={path} color="inherit" href="#" onClick={() => onDirectorySelect && onDirectorySelect(path)}>
                {segment}
              </Link>
            );
          })}
        </Breadcrumbs>
      )}
      <Typography variant="h4" gutterBottom mb={4}>
        {displayFileName}
      </Typography>
      <Box sx={{ paddingLeft: '24px', marginLeft: '-32px', marginRight: '-32px', borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={viewMode} onChange={(event, newValue) => setViewMode(newValue)} aria-label="view mode tabs">
          <Tab value="preview" label="Preview" />
          <Tab value="raw" label="Raw" />
        </Tabs>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
        </Box>
      ) : viewMode === 'preview' ? (
        <MarkdownPreview content={content} />
      ) : (
        <Box component="pre" sx={{ whiteSpace: 'pre-wrap', p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          {content}
        </Box>
      )}
    </Box>
  );
};

export default Content;
