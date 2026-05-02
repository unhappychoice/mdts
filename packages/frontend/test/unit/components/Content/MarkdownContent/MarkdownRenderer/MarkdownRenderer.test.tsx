import { createTheme, ThemeProvider } from '@mui/material/styles';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import MarkdownRenderer
  from '../../../../../../src/components/Content/MarkdownContent/MarkdownRenderer/MarkdownRenderer';

const mockStore = configureStore([thunk]);

// Mock react-router-dom's useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mock Mermaid component
jest.mock('../../../../../../src/components/Content/MarkdownContent/MarkdownRenderer/MermaidRenderer', () => ({
  __esModule: true,
  default: ({ chart }: { chart: string }) => <div data-testid="mock-mermaid-chart">{chart}</div>,
}));

// Mock ReactMarkdown to pass through children and allow inspection of components prop
jest.mock('react-markdown', () => {
  const React = jest.requireActual('react');
  const ActualReactMarkdown = jest.requireActual('react-markdown').default;
  const MockH1 = (props: React.ComponentProps<'h1'>) => <h1 data-testid="mock-h1" {...props}>{props.children}</h1>;
  const MockP = (props: React.ComponentProps<'p'>) => <p data-testid="mock-p" {...props}>{props.children}</p>;

  return {
    __esModule: true,
    default: ({ children, components, remarkPlugins, rehypePlugins }: {
      children: string;
      components?: Record<string, React.ComponentType<React.ComponentProps<React.ElementType>>>;
      remarkPlugins?: unknown[];
      rehypePlugins?: unknown[];
    }) => {
      const finalComponents = {
        ...components,
        h1: MockH1,
        p: MockP,
      };

      if (children === '__CODE__' && finalComponents.code) {
        return (
          <div data-testid="mock-react-markdown-root">
            {finalComponents.code({
              inline: false,
              className: 'language-javascript',
              children: 'console.log("Hello");',
            } as React.ComponentProps<'code'>)}
          </div>
        );
      }

      if (children === '__MERMAID__' && finalComponents.code) {
        return (
          <div data-testid="mock-react-markdown-root">
            {finalComponents.code({
              inline: false,
              className: 'language-mermaid',
              children: 'graph TD; A-->B;',
            } as React.ComponentProps<'code'>)}
          </div>
        );
      }

      if (children === '__TABLE__' && finalComponents.table) {
        return (
          <div data-testid="mock-react-markdown-root">
            {finalComponents.table({
              children: (
                <tbody>
                  <tr>
                    <td>mdts</td>
                  </tr>
                </tbody>
              ),
            } as React.ComponentProps<'table'>)}
          </div>
        );
      }

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
  PrismAsyncLight: (props: {
    children: React.ReactNode;
    language: string;
    className?: string;
    customStyle?: unknown;
    showLineNumbers?: boolean;
    codeTagProps?: unknown;
    PreTag?: unknown;
    [key: string]: unknown;
  }) => (
    <pre
      data-testid="mock-syntax-highlighter"
      className={props.className}
      data-language={props.language}
    >
      <code data-testid="mock-syntax-highlighter-code">{props.children}</code>
    </pre>
  ),
  nightOwl: {},
  prism: {},
}));


const renderWithProviders = (
  content: string,
  selectedFilePath: string | null = null,
  enableBreaks = false
) => {
  const theme = createTheme({
    palette: {
      mode: 'light',
    },
  });
  const store = mockStore({
    content: {
      content: '# Test Markdown',
      loading: false,
      error: null,
    },
    fileTree: {
      loading: false,
    },
    history: {
      currentPath: '/',
      isDirectory: false,
    },
    appSetting: {
      contentMode: 'compact',
    },
    config: {
      fontFamily: 'Roboto',
      fontFamilyMonospace: 'monospace',
      fontSize: 14,
    }
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <MarkdownRenderer
            content={content}
            selectedFilePath={selectedFilePath}
            enableBreaks={enableBreaks}
          />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
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
    const content = '__CODE__';
    renderWithProviders(content);
    expect(screen.getByTestId('mock-syntax-highlighter')).toBeInTheDocument();
    expect(screen.getByTestId('mock-syntax-highlighter-code')).toHaveTextContent('console.log("Hello");');
    expect(screen.getByTestId('mock-syntax-highlighter')).toHaveAttribute('data-language', 'javascript');
  });

  it('renders mermaid diagrams for mermaid code blocks', () => {
    const content = '__MERMAID__';
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

  it('renders single line breaks as breaks when enabled', () => {
    const { container } = renderWithProviders('First line\nSecond line', null, true);
    expect(container.querySelector('br')).toBeInTheDocument();
  });

  it('wraps markdown tables in a table wrapper', () => {
    const content = '__TABLE__';
    const { container } = renderWithProviders(content);
    expect(container.querySelector('.table-wrapper')).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('mdts')).toBeInTheDocument();
  });
});
