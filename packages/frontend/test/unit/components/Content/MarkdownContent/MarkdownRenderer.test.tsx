import { createTheme, ThemeProvider } from '@mui/material/styles';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import MarkdownRenderer from '../../../../../src/components/Content/MarkdownContent/MarkdownRenderer';

// Mock react-router-dom's useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mock Mermaid component
jest.mock('../../../../../src/components/Content/MarkdownContent/MermaidRenderer', () => ({
  __esModule: true,
  default: ({ chart }: { chart: string }) => <div data-testid="mock-mermaid-chart">{chart}</div>,
}));

// Mock ReactMarkdown to pass through children and allow inspection of components prop
jest.mock('react-markdown', () => {
  const React = jest.requireActual('react');
  const ActualReactMarkdown = jest.requireActual('react-markdown').default;

  
  const MockCode = (props: any) => {
    if (props.className && props.className.includes('language-mermaid')) {
      return <div data-testid="mock-mermaid-chart">{props.children}</div>;
    }
    return (
      <pre data-testid="mock-syntax-highlighter" className={props.className}>
        <code data-testid="mock-syntax-highlighter-code">{props.children}</code>
      </pre>
    );
  };
  const MockH1 = (props: any) => <h1 data-testid="mock-h1" {...props}>{props.children}</h1>;
  const MockP = (props: any) => <p data-testid="mock-p" {...props}>{props.children}</p>;

  return {
    __esModule: true,
    default: ({ children, components, remarkPlugins, rehypePlugins }: { children: string; components?: any; remarkPlugins?: any[]; rehypePlugins?: any[] }) => {
      const finalComponents = {
        ...components,
        
        code: MockCode,
        h1: MockH1,
        p: MockP,
      };
      return (
        <div data-testid="mock-react-markdown-root">
          <ActualReactMarkdown components={finalComponents} remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}>
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
        <MarkdownRenderer content={content} selectedFilePath={selectedFilePath} />
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('MarkdownRenderer', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it('renders markdown content correctly', () => {
    const content = '# Hello World\n\nThis is a paragraph.';
    const { asFragment } = renderWithProviders(content);
    expect(asFragment()).toMatchSnapshot();
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

  it('resolves relative paths correctly for internal links', () => {
    const content = '[Link to another file](another.md)';
    renderWithProviders(content, '/path/to/current.md');
    const link = screen.getByTestId('markdown-link');
    expect(link).toHaveAttribute('href', '/path/to/another.md');
  });

  it('navigates to the correct path on internal link click', () => {
    const content = '[Link to another file](another.md)';
    renderWithProviders(content, '/path/to/current.md');
    const link = screen.getByTestId('markdown-link');
    fireEvent.click(link);
    expect(mockNavigate).toHaveBeenCalledWith('/path/to/another.md');
  });

  it('opens external links in a new tab', () => {
    const content = '[External Link](https://example.com)';
    renderWithProviders(content, '/path/to/current.md');
    const link = screen.getByTestId('markdown-link');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('handles absolute paths correctly', () => {
    const content = '[Absolute Link](/absolute/path.md)';
    renderWithProviders(content, '/path/to/current.md');
    const link = screen.getByTestId('markdown-link');
    expect(link).toHaveAttribute('href', '/absolute/path.md');
  });

  it('handles root path correctly', () => {
    const content = '[Root Link](/)';
    renderWithProviders(content, '/path/to/current.md');
    const link = screen.getByTestId('markdown-link');
    expect(link).toHaveAttribute('href', '/');
  });

  it('handles hash links correctly', () => {
    const content = '[Hash Link](#section)';
    renderWithProviders(content, '/path/to/current.md');
    const link = screen.getByTestId('markdown-link');
    expect(link).toHaveAttribute('href', '#section');
  });
});
