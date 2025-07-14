import { Box, CircularProgress, Tab, Tabs, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { fetchContent } from '../api';
import MarkdownPreview from './MarkdownPreview';
import { useWebSocketContext } from '../contexts/WebSocketContext';

interface ContentProps {
  selectedFilePath: string | null;
  contentMode?: 'fixed' | 'full';
  scrollToId: string | null;
}

const Content: React.FC<ContentProps> = ({ selectedFilePath, contentMode = 'fixed', scrollToId }) => {
  const [content, setContent] = useState<string>("");
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');
  const [loading, setLoading] = useState<boolean>(false);
  const { refresh, changedFilePath } = useWebSocketContext();

  useEffect(() => {
    const getContent = async () => {
      if (selectedFilePath && (refresh && selectedFilePath === changedFilePath)) {
        const fileContent = await fetchContent(selectedFilePath);
        setContent(fileContent);
      } else if (selectedFilePath) {
        setLoading(true);
        const fileContent = await fetchContent(selectedFilePath);
        setContent(fileContent);
        setLoading(false);
      } else {
        setContent("Please select a file from the tree.");
      }
    };
    getContent();
  }, [selectedFilePath, refresh, changedFilePath]);

  useEffect(() => {
    if (scrollToId) {
      const element = document.getElementById(scrollToId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [scrollToId]);

  const displayFileName = selectedFilePath ? selectedFilePath.split('/').pop() : "No file selected";

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
