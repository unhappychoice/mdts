import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, useSearchParams } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import MarkdownContentTabs from '../../../../../src/components/Content/MarkdownContent/MarkdownContentTabs';
import { ViewMode } from '../../../../../src/hooks/useViewMode';

const mockStore = configureStore([]);

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
    mockSearchParams.delete('tab');
    mockSetSearchParams.mockClear();
  });

  const renderWithStore = (
    viewMode: ViewMode,
    hasFrontmatter: boolean,
    { isGitRepository = true, diff = '' }: { isGitRepository?: boolean; diff?: string } = {},
  ) => {
    const store = mockStore({
      fileTree: { isGitRepository },
      diff: { diff },
    });
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <MarkdownContentTabs viewMode={viewMode} hasFrontmatter={hasFrontmatter} />
        </BrowserRouter>
      </Provider>
    );
  };

  test('renders preview and raw tabs by default', () => {
    const { asFragment } = renderWithStore('preview', false);
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByRole('tab', { name: /preview/i })).toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: /frontmatter/i })).not.toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /raw/i })).toBeInTheDocument();
  });

  test('renders frontmatter tab when hasFrontmatter is true', () => {
    renderWithStore('preview', true);
    expect(screen.getByRole('tab', { name: /preview/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /frontmatter/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /raw/i })).toBeInTheDocument();
  });

  test('renders diff tab when isGitRepository is true and diff exists', () => {
    renderWithStore('preview', false, { isGitRepository: true, diff: '+added line' });
    expect(screen.getByRole('tab', { name: /diff/i })).toBeInTheDocument();
  });

  test('does not render diff tab when diff is empty', () => {
    renderWithStore('preview', false, { isGitRepository: true, diff: '' });
    expect(screen.queryByRole('tab', { name: /^diff$/i })).not.toBeInTheDocument();
  });

  test('renders last commit tab when isGitRepository is true', () => {
    renderWithStore('preview', false, { isGitRepository: true });
    expect(screen.getByRole('tab', { name: /last commit/i })).toBeInTheDocument();
  });

  test('does not render diff tabs when isGitRepository is false', () => {
    renderWithStore('preview', false, { isGitRepository: false });
    expect(screen.queryByRole('tab', { name: /diff/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: /last commit/i })).not.toBeInTheDocument();
  });

  test('sets search param to "frontmatter" when frontmatter tab is clicked', () => {
    renderWithStore('preview', true);
    fireEvent.click(screen.getByRole('tab', { name: /frontmatter/i }));
    expect(mockSetSearchParams).toHaveBeenCalledWith(expect.any(URLSearchParams));
    expect(mockSetSearchParams.mock.calls[0][0].get('tab')).toBe('frontmatter');
  });

  test('sets search param to "raw" when raw tab is clicked', () => {
    renderWithStore('preview', false);
    fireEvent.click(screen.getByRole('tab', { name: /raw/i }));
    expect(mockSetSearchParams).toHaveBeenCalledWith(expect.any(URLSearchParams));
    expect(mockSetSearchParams.mock.calls[0][0].get('tab')).toBe('raw');
  });

  test('sets search param to "preview" when preview tab is clicked', () => {
    renderWithStore('raw', false);
    fireEvent.click(screen.getByRole('tab', { name: /preview/i }));
    expect(mockSetSearchParams).toHaveBeenCalledWith(expect.any(URLSearchParams));
    expect(mockSetSearchParams.mock.calls[0][0].get('tab')).toBe('preview');
  });
});
