import { Box, useTheme } from '@mui/material';
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
import { visit } from 'unist-util-visit';

interface MarkdownRendererProps {
  content: string;
  selectedFilePath: string | null;
  enableBreaks?: boolean;
  lineOffset?: number;
}

/**
 * Custom rehype plugin to add data-line attribute to all elements
 * based on their source position and the provided lineOffset.
 */
const rehypeLineNumbers = (lineOffset: number) => {
  return (tree: any) => {
    visit(tree, 'element', (node: any) => {
      if (node.position) {
        node.properties = node.properties || {};
        node.properties['data-line'] = node.position.start.line + lineOffset;
      }
    });
  };
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  selectedFilePath, 
  enableBreaks = false,
  lineOffset = 0
}) => {
  const location = useLocation();
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const remarkPlugins = useMemo(
    () => enableBreaks ? [remarkGfm, remarkMath, remarkBreaks] : [remarkGfm, remarkMath],
    [enableBreaks]
  );

  const rehypePlugins = useMemo(
    () => [
      rehypeRaw, 
      rehypeSlug, 
      rehypeKatex, 
      rehypeGithubAlerts,
      [rehypeLineNumbers, lineOffset]
    ],
    [lineOffset]
  );

  useEffect(() => {
    const hash = location.hash;
    if (hash && hash.startsWith('#L')) {
      const lineNum = parseInt(hash.substring(2), 10);
      if (isNaN(lineNum)) return;

      let isCanceled = false;
      let scrollTimer: ReturnType<typeof setTimeout>;
      let highlightTimer: ReturnType<typeof setTimeout>;

      const attemptScroll = (retryCount = 0) => {
        if (isCanceled || !containerRef.current) return;

        const elements = Array.from(containerRef.current.querySelectorAll<HTMLElement>('[data-line]'));
        let targetElement: HTMLElement | null = null;
        
        let closestLine = -1;
        elements.forEach((el) => {
          const elLine = parseInt(el.getAttribute('data-line') || '0', 10);
          // The lineNum from hash is the absolute line in the file.
          // data-line is already offset by lineOffset.
          // We use >= closestLine to prefer later elements (like a paragraph inside a list item)
          // if they start on the same line.
          if (elLine <= lineNum && elLine >= closestLine) {
            closestLine = elLine;
            targetElement = el;
          }
        });

        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          targetElement.classList.add('highlight-line-active');
          
          const currentTarget = targetElement;
          highlightTimer = setTimeout(() => {
            if (!isCanceled) {
              currentTarget.classList.remove('highlight-line-active');
            }
          }, 3000);
        } else if (retryCount < 15) { // Increase retries
          scrollTimer = setTimeout(() => attemptScroll(retryCount + 1), 200);
        }
      };

      // Delay a bit to let the layout settle
      scrollTimer = setTimeout(() => attemptScroll(), 300);
      return () => {
        isCanceled = true;
        clearTimeout(scrollTimer);
        clearTimeout(highlightTimer);
      };
    }
  }, [location.hash, content, lineOffset]);

  return (
    <Box 
      ref={containerRef}
      className={'markdown-body'} 
      sx={{ 
        py: 2, px: 0,
        '& .highlight-line-active': {
          backgroundColor: `${theme.palette.warning.light}73 !important`, // 73 is ~0.45 opacity
          transition: 'background-color 0.5s ease',
          borderRadius: '4px',
          boxShadow: `0 0 10px ${theme.palette.warning.main}B3`, // B3 is ~0.7 opacity
          position: 'relative',
          zIndex: 1,
        }
      }}
    >
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins as any}
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
