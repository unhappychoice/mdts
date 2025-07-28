import { Box, useTheme } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nightOwl, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkSlug from 'remark-slug';
import MermaidRenderer from './MermaidRenderer';

interface MarkdownRendererProps {
  content: string;
  selectedFilePath: string | null;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, selectedFilePath }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const resolvePath = (href: string) => {
    if (!selectedFilePath || href.startsWith('http') || href.startsWith('//') || href.startsWith('/')) {
      return href;
    }
    const baseUrl = selectedFilePath.substring(0, selectedFilePath.lastIndexOf('/') + 1);
    return new URL(href, new URL(baseUrl, window.location.origin)).pathname;
  };

  return (
    <Box className={"markdown-body"} sx={{ py: 2, px: 0, fontSize: '0.9rem' }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkSlug]}
        rehypePlugins={[rehypeRaw]}
        components={{
          a: ({ href, children }) => {
            if (!href) {
              return <a data-testid="markdown-link">{children}</a>;
            }
            if (href.startsWith('#')) {
              return <a data-testid="markdown-link" href={href}>{children}</a>;
            }
            const resolvedHref = resolvePath(href);
            if (resolvedHref.startsWith('http') || resolvedHref.startsWith('//')) {
              return <a data-testid="markdown-link" href={resolvedHref} target="_blank" rel="noopener noreferrer">{children}</a>;
            }
            return <a data-testid="markdown-link" href={resolvedHref} onClick={(e) => { e.preventDefault(); navigate(resolvedHref); }}>{children}</a>;
          },
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            if (match && match[1] === 'mermaid') {
              return <MermaidRenderer chart={String(children).replace(/\n$/, '')} />;
            }

            return !inline && match ? (
              <SyntaxHighlighter
                style={theme.palette.mode === 'dark' ? nightOwl : prism}
                className={'syntax-highlighter'}
                customStyle={{  margin: 0, background: 'transparent' }}
                showLineNumbers={true}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
};

export default MarkdownRenderer;
