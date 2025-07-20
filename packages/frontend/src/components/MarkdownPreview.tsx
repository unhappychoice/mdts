import { Box, useTheme } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nightOwl, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkSlug from 'remark-slug';
import Mermaid from './Mermaid';

interface MarkdownPreviewProps {
  content: string;
  selectedFilePath: string | null;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content, selectedFilePath }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const resolvePath = (href: string) => {
    if (!selectedFilePath || href.startsWith('http') || href.startsWith('//') || href.startsWith('/')) {
      return href;
    }
    const path = selectedFilePath.split('/');
    path.pop();
    return `/${path.join('/')}/${href}`.replace(/\/\.\//g, '/');
  };

  return (
    <Box className={["markdown-body", theme.palette.mode === 'dark' ? 'dark' : 'light'].join(' ')} sx={{ py: 2, px: 0, fontSize: '0.9rem' }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkSlug]}
        rehypePlugins={[rehypeRaw]}
        components={{
          a: ({ href, children }) => {
            if (!href) {
              return <a>{children}</a>;
            }
            if (href.startsWith('#')) {
              return <a href={href}>{children}</a>;
            }
            const resolvedHref = resolvePath(href);
            if (resolvedHref.startsWith('http') || resolvedHref.startsWith('//')) {
              return <a href={resolvedHref} target="_blank" rel="noopener noreferrer">{children}</a>;
            }
            return <a href={resolvedHref} onClick={(e) => { e.preventDefault(); navigate(resolvedHref); }}>{children}</a>;
          },
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            if (match && match[1] === 'mermaid') {
              return <Mermaid chart={String(children).replace(/\n$/, '')} />;
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

export default MarkdownPreview;
