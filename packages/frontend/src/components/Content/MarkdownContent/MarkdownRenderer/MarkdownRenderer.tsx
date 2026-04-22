import { Box } from '@mui/material';
import React, { useMemo, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { rehypeGithubAlerts } from 'rehype-github-alerts';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { useLocation } from 'react-router-dom';
import MarkdownCode from './MarkdownCode';
import MarkdownLink from './MarkdownLink';

import 'rehype-github-alerts/styling/css/index.css';
import 'katex/dist/katex.css';

interface MarkdownRendererProps {
  content: string;
  selectedFilePath: string | null;
  enableBreaks?: boolean;
  lineOffset?: number;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  selectedFilePath, 
  enableBreaks = false,
  lineOffset = 0
}) => {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const remarkPlugins = useMemo(
    () => enableBreaks ? [remarkGfm, remarkMath, remarkBreaks] : [remarkGfm, remarkMath],
    [enableBreaks]
  );

  useEffect(() => {
    const hash = location.hash;
    if (hash && hash.startsWith('#L')) {
      const lineNum = parseInt(hash.substring(2), 10);
      if (isNaN(lineNum)) return;

      const attemptScroll = (retryCount = 0) => {
        const elements = document.querySelectorAll(`[data-line]`);
        let targetElement: HTMLElement | null = null;
        
        let closestLine = -1;
        elements.forEach((el) => {
          const elLine = parseInt((el as HTMLElement).getAttribute('data-line') || '0', 10);
          // The lineNum from hash is the absolute line in the file.
          // data-line is already offset by lineOffset.
          if (elLine <= lineNum && elLine > closestLine) {
            closestLine = elLine;
            targetElement = el as HTMLElement;
          }
        });

        if (targetElement) {
          (targetElement as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
          (targetElement as HTMLElement).classList.add('highlight-line-active');
          
          const timer = setTimeout(() => {
            (targetElement as HTMLElement).classList.remove('highlight-line-active');
          }, 3000);
          return () => clearTimeout(timer);
        } else if (retryCount < 15) { // Increase retries
          setTimeout(() => attemptScroll(retryCount + 1), 200);
        }
      };

      // Delay a bit to let the layout settle
      const timer = setTimeout(() => attemptScroll(), 300);
      return () => clearTimeout(timer);
    }
  }, [location.hash, content, lineOffset]);

  return (
    <Box 
      ref={containerRef}
      className={'markdown-body'} 
      sx={{ 
        py: 2, px: 0,
        '& .highlight-line-active': {
          backgroundColor: 'rgba(255, 235, 59, 0.45) !important',
          transition: 'background-color 0.5s ease',
          borderRadius: '4px',
          boxShadow: '0 0 10px rgba(255, 235, 59, 0.7)',
          position: 'relative',
          zIndex: 1,
        }
      }}
    >
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
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
          p: ({ node, children, ...props }) => (
            <p data-line={(node?.position?.start.line || 0) + lineOffset} {...props}>{children}</p>
          ),
          h1: ({ node, children, ...props }) => (
            <h1 data-line={(node?.position?.start.line || 0) + lineOffset} {...props}>{children}</h1>
          ),
          h2: ({ node, children, ...props }) => (
            <h2 data-line={(node?.position?.start.line || 0) + lineOffset} {...props}>{children}</h2>
          ),
          h3: ({ node, children, ...props }) => (
            <h3 data-line={(node?.position?.start.line || 0) + lineOffset} {...props}>{children}</h3>
          ),
          h4: ({ node, children, ...props }) => (
            <h4 data-line={(node?.position?.start.line || 0) + lineOffset} {...props}>{children}</h4>
          ),
          h5: ({ node, children, ...props }) => (
            <h5 data-line={(node?.position?.start.line || 0) + lineOffset} {...props}>{children}</h5>
          ),
          h6: ({ node, children, ...props }) => (
            <h6 data-line={(node?.position?.start.line || 0) + lineOffset} {...props}>{children}</h6>
          ),
          li: ({ node, children, ...props }) => (
            <li data-line={(node?.position?.start.line || 0) + lineOffset} {...props}>{children}</li>
          ),
          blockquote: ({ node, children, ...props }) => (
            <blockquote data-line={(node?.position?.start.line || 0) + lineOffset} {...props}>{children}</blockquote>
          ),
          pre: ({ node, children, ...props }) => (
            <pre data-line={(node?.position?.start.line || 0) + lineOffset} {...props}>{children}</pre>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
};

export default MarkdownRenderer;
