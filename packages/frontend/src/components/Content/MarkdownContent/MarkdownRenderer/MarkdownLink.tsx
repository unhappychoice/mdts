import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface MarkdownLinkProps {
  href?: string;
  children?: React.ReactNode;
  selectedFilePath: string | null;
}

const MarkdownLink: React.FC<MarkdownLinkProps> = ({ href, children, selectedFilePath }) => {
  const navigate = useNavigate();

  const resolvePath = useCallback((href: string) => {
    if (!selectedFilePath || href.startsWith('http') || href.startsWith('//') || href.startsWith('/')) {
      return href;
    }
    const baseUrl = selectedFilePath.substring(0, selectedFilePath.lastIndexOf('/') + 1);
    return new URL(href, new URL(baseUrl, window.location.origin)).pathname;
  }, [selectedFilePath]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!href) return;
    const resolvedHref = resolvePath(href);
    e.preventDefault();
    navigate(resolvedHref);
  }, [href, resolvePath, navigate]);

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

  return <a data-testid="markdown-link" href={resolvedHref} onClick={handleClick}>{children}</a>;
};

export default MarkdownLink;
