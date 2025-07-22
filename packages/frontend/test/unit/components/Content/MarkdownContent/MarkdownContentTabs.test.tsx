import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter, useSearchParams } from 'react-router-dom';
import MarkdownContentTabs from '../../../../../src/components/Content/MarkdownContent/MarkdownContentTabs';

// Mock useSearchParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: jest.fn(),
}));

describe('MarkdownContentTabs', () => {
  const mockSetSearchParams = jest.fn();
  const mockSearchParams = new URLSearchParams();

  beforeEach(() => {
    (useSearchParams as jest.Mock).mockReturnValue([
      mockSearchParams,
      mockSetSearchParams,
    ]);
    mockSearchParams.delete('tab'); // Reset search params for each test
    mockSetSearchParams.mockClear();
  });

  test('renders preview and raw tabs by default', () => {
    const { asFragment } = render(
      <BrowserRouter>
        <MarkdownContentTabs viewMode="preview" hasFrontmatter={false} />
      </BrowserRouter>
    );
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByRole('tab', { name: /preview/i })).toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: /frontmatter/i })).not.toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /raw/i })).toBeInTheDocument();
  });

  test('renders frontmatter tab when hasFrontmatter is true', () => {
    render(
      <BrowserRouter>
        <MarkdownContentTabs viewMode="preview" hasFrontmatter={true} />
      </BrowserRouter>
    );
    expect(screen.getByRole('tab', { name: /preview/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /frontmatter/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /raw/i })).toBeInTheDocument();
  });

  test('sets search param to "frontmatter" when frontmatter tab is clicked', () => {
    render(
      <BrowserRouter>
        <MarkdownContentTabs viewMode="preview" hasFrontmatter={true} />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByRole('tab', { name: /frontmatter/i }));
    expect(mockSetSearchParams).toHaveBeenCalledWith(expect.any(URLSearchParams));
    expect(mockSetSearchParams.mock.calls[0][0].get('tab')).toBe('frontmatter');
  });

  test('sets search param to "raw" when raw tab is clicked', () => {
    render(
      <BrowserRouter>
        <MarkdownContentTabs viewMode="preview" hasFrontmatter={false} />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByRole('tab', { name: /raw/i }));
    expect(mockSetSearchParams).toHaveBeenCalledWith(expect.any(URLSearchParams));
    expect(mockSetSearchParams.mock.calls[0][0].get('tab')).toBe('raw');
  });

  test('sets search param to "preview" when preview tab is clicked', () => {
    render(
      <BrowserRouter>
        <MarkdownContentTabs viewMode="raw" hasFrontmatter={false} />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByRole('tab', { name: /preview/i }));
    expect(mockSetSearchParams).toHaveBeenCalledWith(expect.any(URLSearchParams));
    expect(mockSetSearchParams.mock.calls[0][0].get('tab')).toBe('preview');
  });
});
