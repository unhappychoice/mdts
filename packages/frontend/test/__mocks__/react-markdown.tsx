import React from 'react';

const ReactMarkdown = ({ children }: { children: string }) => {
  return <div data-testid="mock-react-markdown" dangerouslySetInnerHTML={{ __html: children }} />;
};

export default ReactMarkdown;
