import { createTheme, ThemeProvider } from '@mui/material/styles';
import { act, render, screen, waitFor } from '@testing-library/react';
import mermaid from 'mermaid';
import React from 'react';
import MermaidRenderer from '../../../../../src/components/Content/MarkdownContent/MermaidRenderer';

// Mock the mermaid library
jest.mock('mermaid', () => ({
  initialize: jest.fn(),
  render: jest.fn((id, chart) => {
    return Promise.resolve({ svg: `<svg data-testid="mermaid-svg">${chart}</svg>` });
  }),
}));

const renderWithTheme = async (component: React.ReactElement, themeMode: 'light' | 'dark' = 'light') => {
  const theme = createTheme({
    palette: {
      mode: themeMode,
    },
  });
  let rendered;
  await act(async () => {
    rendered = render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
  });
  return rendered;
};

describe('Mermaid', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    // Spy on console.error and mock its implementation to prevent it from logging during tests
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore the original console.error implementation after each test
    consoleErrorSpy.mockRestore();
  });

  it('should initialize mermaid with correct theme based on light mode', async () => {
    const { asFragment } = await renderWithTheme(<MermaidRenderer chart="graph TD; A-->B;" />, 'light');
    expect(asFragment()).toMatchSnapshot();
    expect(mermaid.initialize).toHaveBeenCalledWith({
      startOnLoad: false,
      theme: 'neutral',
      securityLevel: 'loose',
    });
  });

  it('should initialize mermaid with correct theme based on dark mode', async () => {
    await renderWithTheme(<MermaidRenderer chart="graph TD; A-->B;" />, 'dark');
    expect(mermaid.initialize).toHaveBeenCalledWith({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose',
    });
  });

  it('should render the mermaid chart when chart prop is provided', async () => {
    const chartContent = 'graph TD; A-->B;';
    await renderWithTheme(<MermaidRenderer chart={chartContent} />);

    await waitFor(() => {
      expect(mermaid.render).toHaveBeenCalledWith(expect.any(String), chartContent);
      expect(screen.getByTestId('mermaid-svg')).toBeInTheDocument();
      expect(screen.getByTestId('mermaid-svg')).toHaveTextContent(chartContent);
    });
  });

  it('should display raw chart content if rendering fails', async () => {
    (mermaid.render as jest.Mock).mockImplementationOnce(() => Promise.reject(new Error('Render error')));
    const chartContent = 'graph TD; A-->B;';
    await renderWithTheme(<MermaidRenderer chart={chartContent} />);

    await waitFor(() => {
      expect(screen.getByText(chartContent)).toBeInTheDocument();
    });
    expect(screen.queryByTestId('mermaid-svg')).not.toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error rendering mermaid chart:', expect.any(Error));
  });

  it('should not render if chart prop is empty', async () => {
    await renderWithTheme(<MermaidRenderer chart="" />);
    // Use waitFor to ensure any potential async calls (even if not expected) have a chance to resolve
    await waitFor(() => {
      expect(mermaid.initialize).not.toHaveBeenCalled();
      expect(mermaid.render).not.toHaveBeenCalled();
      expect(screen.queryByTestId('mermaid-svg')).not.toBeInTheDocument();
    }, { timeout: 100 }); // Small timeout to allow microtasks to run
  });
});
