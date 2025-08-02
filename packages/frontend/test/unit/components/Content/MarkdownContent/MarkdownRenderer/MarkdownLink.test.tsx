import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import MarkdownLink from '../../../../../../src/components/Content/MarkdownContent/MarkdownRenderer/MarkdownLink';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('MarkdownLink', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('should render correctly with no href', () => {
    const { getByTestId } = render(<MarkdownLink>Test Link</MarkdownLink>);
    expect(getByTestId('markdown-link')).toHaveTextContent('Test Link');
    expect(getByTestId('markdown-link').tagName).toBe('A');
    expect(getByTestId('markdown-link')).not.toHaveAttribute('href');
  });

  it('should render correctly with hash href', () => {
    const { getByTestId } = render(<MarkdownLink href="#section">Test Link</MarkdownLink>);
    expect(getByTestId('markdown-link')).toHaveAttribute('href', '#section');
  });

  it('should render correctly with external href', () => {
    const { getByTestId } = render(<MarkdownLink href="https://example.com">External Link</MarkdownLink>);
    expect(getByTestId('markdown-link')).toHaveAttribute('href', 'https://example.com');
    expect(getByTestId('markdown-link')).toHaveAttribute('target', '_blank');
    expect(getByTestId('markdown-link')).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should navigate to internal link when clicked', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <MarkdownLink href="/path/to/page" selectedFilePath="/current/file.md">Internal Link</MarkdownLink>
      </BrowserRouter>
    );
    fireEvent.click(getByTestId('markdown-link'));
    expect(mockNavigate).toHaveBeenCalledWith('/path/to/page');
  });

  it('should resolve relative path correctly', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <MarkdownLink href="../another.md" selectedFilePath="/current/dir/file.md">Relative Link</MarkdownLink>
      </BrowserRouter>
    );
    fireEvent.click(getByTestId('markdown-link'));
    expect(mockNavigate).toHaveBeenCalledWith('/current/another.md');
  });
});
