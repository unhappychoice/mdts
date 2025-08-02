import { Box } from '@mui/material';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import MarkdownCode from './MarkdownCode';
import MarkdownLink from './MarkdownLink';

interface MarkdownRendererProps {
  content: string;
  selectedFilePath: string | null;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, selectedFilePath }) => {
  return (
    <Box className={'markdown-body'} sx={{ py: 2, px: 0 }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug]}
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
