import { Box, CircularProgress, Tab, Tabs, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useContent } from '../hooks/useContent';
import MarkdownPreview from './MarkdownPreview';

interface ContentProps {
  selectedFilePath: string | null;
  contentMode?: 'fixed' | 'full';
  scrollToId: string | null;
}

const Content: React.FC<ContentProps> = ({ selectedFilePath, contentMode = 'fixed', scrollToId }) => {
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

  if (loading) return <p>Loading content...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 4,
        pt: 8,
        bgcolor: 'background.paper',
        ...(contentMode === 'fixed' && {
          maxWidth: '800px',
          margin: '0 auto',
        }),
      }}
    >
      <Typography variant="h5" gutterBottom mb={4}>
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
