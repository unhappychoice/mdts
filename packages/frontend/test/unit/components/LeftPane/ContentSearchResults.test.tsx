import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import ContentSearchResults from '../../../../src/components/LeftPane/ContentSearchResults';

describe('ContentSearchResults', () => {
  const results = [
    { path: 'docs/guide.md', line: 12, preview: 'Use mdts to preview markdown files' },
  ];

  it('does not render for short search queries', () => {
    render(
      <ContentSearchResults
        searchQuery="m"
        results={results}
        loading={false}
        error={null}
        onFileSelect={jest.fn()}
      />
    );

    expect(screen.queryByText('Content matches')).not.toBeInTheDocument();
  });

  it('renders content matches and opens the selected file', () => {
    const onFileSelect = jest.fn();
    render(
      <ContentSearchResults
        searchQuery="mdts"
        results={results}
        loading={false}
        error={null}
        onFileSelect={onFileSelect}
      />
    );

    expect(screen.getByText('Content matches')).toBeInTheDocument();
    expect(screen.getByText('docs/guide.md')).toBeInTheDocument();
    expect(screen.getByText('Line 12')).toBeInTheDocument();
    fireEvent.click(screen.getByText('docs/guide.md'));
    expect(onFileSelect).toHaveBeenCalledWith('docs/guide.md');
  });

  it('renders a loading indicator', () => {
    render(
      <ContentSearchResults
        searchQuery="mdts"
        results={[]}
        loading={true}
        error={null}
        onFileSelect={jest.fn()}
      />
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders an error message', () => {
    render(
      <ContentSearchResults
        searchQuery="mdts"
        results={[]}
        loading={false}
        error="failed"
        onFileSelect={jest.fn()}
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Search failed');
  });
});
