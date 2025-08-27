import { Box } from '@mui/material';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { rehypeGithubAlerts } from 'rehype-github-alerts';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import MarkdownCode from './MarkdownCode';
import MarkdownLink from './MarkdownLink';

import 'rehype-github-alerts/styling/css/index.css';
import 'katex/dist/katex.css';

interface MarkdownRendererProps {
  content: string;
  selectedFilePath: string | null;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, selectedFilePath }) => {
  return (
    <Box className={'markdown-body'} sx={{ py: 2, px: 0 }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeSlug, rehypeKatex, rehypeGithubAlerts]}
        components={{
          a: ({ href, children }) =>
            <MarkdownLink href={href} selectedFilePath={selectedFilePath}>{children}</MarkdownLink>,
          code: ({ inline, className, children, ...props }) => (
            <MarkdownCode inline={inline} className={className} {...props}>
              {children}
            </MarkdownCode>
          ),
          table: ({ children, ...props }) => (
            <div className="table-wrapper">
              <table {...props}>{children}</table>
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
};

export default MarkdownRenderer;
