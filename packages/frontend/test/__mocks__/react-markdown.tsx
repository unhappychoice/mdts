import React from 'react';

const ReactMarkdown = ({ children }: { children: string }) => {
  return <div data-testid="mock-react-markdown">{children}</div>;
};

export default ReactMarkdown;