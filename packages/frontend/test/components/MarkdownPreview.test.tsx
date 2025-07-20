import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import MarkdownPreview from '../../src/components/MarkdownPreview';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Mock react-router-dom's useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mock Mermaid component
jest.mock('../../src/components/Mermaid', () => ({
  __esModule: true,
  default: ({ chart }: { chart: string }) => <div data-testid="mock-mermaid-chart">{chart}</div>,
}));

// Mock ReactMarkdown to pass through children and allow inspection of components prop
jest.mock('react-markdown', () => {
  const React = jest.requireActual('react');
  const ActualReactMarkdown = jest.requireActual('react-markdown').default;

  const MockA = (props: any) => <a data-testid="mock-link" {...props}>{props.children}</a>;
  const MockCode = (props: any) => {
    if (props.className && props.className.includes('language-mermaid')) {
      return <div data-testid="mock-mermaid-chart">{props.children}</div>;
    }
    const { Prism } = jest.requireMock('react-syntax-highlighter');
    return (
      <Prism.SyntaxHighlighter language={props.className?.replace('language-', '')}>
        {props.children}
      </Prism.SyntaxHighlighter>
    );
  };
  const MockH1 = (props: any) => <h1 data-testid="mock-h1" {...props}>{props.children}</h1>;
  const MockP = (props: any) => <p data-testid="mock-p" {...props}>{props.children}</p>;

  return {
    __esModule: true,
    default: ({ children, components, ...props }: { children: string; components?: any }) => {
      const finalComponents = {
        ...components,
        a: MockA,
        code: MockCode,
        h1: MockH1,
        p: MockP,
      };
      return (
        <div data-testid="mock-react-markdown-root">
          <ActualReactMarkdown components={finalComponents} {...props}>
            {children}
          </ActualReactMarkdown>
        </div>
      );
    },
  };
});

// Mock SyntaxHighlighter
jest.mock('react-syntax-highlighter', () => ({
  Prism: {
    SyntaxHighlighter: ({ children, language, ...props }: any) => (
      <pre data-testid="mock-syntax-highlighter" className={`language-${language}`} {...props}>
        <code data-testid="mock-syntax-highlighter-code">{children}</code>
      </pre>
    ),
  },
  nightOwl: {},
  prism: {},
}));


const renderWithProviders = (content: string, selectedFilePath: string | null = null) => {
  const theme = createTheme({
    palette: {
      mode: 'light',
    },
  });
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <MarkdownPreview content={content} selectedFilePath={selectedFilePath} />
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('MarkdownPreview', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it('renders markdown content correctly', () => {
    const content = '# Hello World\n\nThis is a paragraph.';
    renderWithProviders(content);
    expect(screen.getByRole('heading', { name: 'Hello World' })).toBeInTheDocument();
    expect(screen.getByText('This is a paragraph.')).toBeInTheDocument();
  });

  it('renders code blocks with syntax highlighting', () => {
    const content = '```javascript\nconsole.log(\"Hello\");\n```';
    renderWithProviders(content);
    expect(screen.getByTestId('mock-syntax-highlighter')).toBeInTheDocument();
    expect(screen.getByTestId('mock-syntax-highlighter-code')).toHaveTextContent('console.log(\"Hello\");');
    expect(screen.getByTestId('mock-syntax-highlighter')).toHaveClass('language-javascript');
  });

  it('renders mermaid diagrams for mermaid code blocks', () => {
    const content = '```mermaid\ngraph TD; A-->B;\n```';
    renderWithProviders(content);
    expect(screen.getByTestId('mock-mermaid-chart')).toBeInTheDocument();
    expect(screen.getByTestId('mock-mermaid-chart')).toHaveTextContent('graph TD; A-->B;');
  });
});
