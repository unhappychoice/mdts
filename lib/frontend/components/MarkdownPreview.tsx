import React from 'react';
import { Box, useTheme } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkSlug from 'remark-slug';
import rehypeRaw from 'rehype-raw';

interface MarkdownPreviewProps {
  content: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
  const theme = useTheme();

  return (
    <Box className={["markdown-body", theme.palette.mode === 'dark' ? 'dark' : 'light'].join(' ')} sx={{ fontSize: '0.9rem' }}>
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkSlug]} rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
    </Box>
  );
};

export default MarkdownPreview;
