import React from 'react';

export const Light = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="mock-syntax-highlighter-light">{children}</div>;
};

export const Prism = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="mock-syntax-highlighter-prism">{children}</div>;
};

export const darcula = {};
export const prism = {};