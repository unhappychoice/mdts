import React from 'react';
import { useSelector } from 'react-redux';
import { PrismAsyncLight } from 'react-syntax-highlighter';
import { SYNTAX_HIGHLIGHTER_THEMES } from '../../../../constants';
import { useSyntaxHighlighterTheme } from '../../../../hooks/useSyntaxHighlighterTheme';
import { RootState } from '../../../../store/store';
import MermaidRenderer from './MermaidRenderer';

interface MarkdownCodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const MarkdownCode: React.FC<MarkdownCodeProps> = ({ inline, className, children, ...props }) => {
  const { fontFamilyMonospace, syntaxHighlighterTheme } = useSelector((state: RootState) => state.config);
  const syntaxHighlighterStyle = useSyntaxHighlighterTheme(syntaxHighlighterTheme);

  const match = /language-(\w+)/.exec(className || '');
  if (match && match[1] === 'mermaid') {
    return <MermaidRenderer chart={String(children).replace(/\n$/, '')} />;
  }

  return !inline && match ? (
    <PrismAsyncLight
      style={syntaxHighlighterStyle}
      className={'syntax-highlighter'}
      customStyle={{ margin: 0 }}
      showLineNumbers={true}
      language={match[1]}
      codeTagProps={{ style: { fontFamily: fontFamilyMonospace } }}
      PreTag="div"
      {...props}
    >
      {String(children).replace(/\n$/, '')}
    </PrismAsyncLight>
  ) : (
    <code
      {...props}
      className={className}
      style={{
        color: SYNTAX_HIGHLIGHTER_THEMES.find(theme => theme.value === syntaxHighlighterTheme)?.type === 'light'
          ? 'rgba(0, 0, 0, .87)'
          : '#fff',
        fontFamily: fontFamilyMonospace,
        backgroundColor: SYNTAX_HIGHLIGHTER_THEMES.find(theme => theme.value === syntaxHighlighterTheme)?.color,
        borderRadius: '4px',
      }}
    >
      {children}
    </code>
  );
};

export default MarkdownCode;
