import React, { useState, useEffect } from 'react';
import { fetchContent } from '../api';
import MarkdownPreview from './MarkdownPreview';
import { Box, Typography, Button, ButtonGroup, CircularProgress } from '@mui/material';

interface ContentProps {
  selectedFilePath: string | null;
}

const Content: React.FC<ContentProps> = ({ selectedFilePath }) => {
  const [content, setContent] = useState<string>("");
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getContent = async () => {
      if (selectedFilePath) {
        setLoading(true);
        const fileContent = await fetchContent(selectedFilePath);
        setContent(fileContent);
        setLoading(false);
      } else {
        setContent("Please select a file from the tree.");
      }
    };
    getContent();
  }, [selectedFilePath]);

  const displayFileName = selectedFilePath ? selectedFilePath.split('/').pop() : "No file selected";

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {displayFileName}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <ButtonGroup variant="outlined" aria-label="view mode buttons">
          <Button
            onClick={() => setViewMode('preview')}
            variant={viewMode === 'preview' ? 'contained' : 'outlined'}
          >
            Preview
          </Button>
          <Button
            onClick={() => setViewMode('raw')}
            variant={viewMode === 'raw' ? 'contained' : 'outlined'}
          >
            Raw
          </Button>
        </ButtonGroup>
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
