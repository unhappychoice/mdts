import { Box } from '@mui/material';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkSlug from 'remark-slug';
import MarkdownLink from './MarkdownLink';
import MarkdownCode from './MarkdownCode';

interface MarkdownRendererProps {
  content: string;
  selectedFilePath: string | null;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, selectedFilePath }) => {
  return (
    <Box className={'markdown-body'} sx={{ py: 2, px: 0 }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkSlug]}
        rehypePlugins={[rehypeRaw]}
        components={{
          a: ({ href, children }) =>
            <MarkdownLink href={href} selectedFilePath={selectedFilePath}>{children}</MarkdownLink>,
          code: ({ inline, className, children, ...props }) => (
            <MarkdownCode inline={inline} className={className} {...props}>
              {children}
            </MarkdownCode>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
};

export default MarkdownRenderer;
