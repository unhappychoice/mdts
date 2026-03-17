import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import MarkdownContentView from '../../../../../src/components/Content/MarkdownContent/MarkdownContentView';
import MarkdownRenderer from '../../../../../src/components/Content/MarkdownContent/MarkdownRenderer/MarkdownRenderer';

const mockStore = configureStore([]);

jest.mock('../../../../../src/components/Content/MarkdownContent/MarkdownRenderer/MarkdownRenderer', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="mock-markdown-renderer" />),
}));

describe('MarkdownContentView', () => {
  let store;
  beforeEach(() => {
    store = mockStore({
      history: {
        currentPath: '/test.md',
      },
      config: {
        enableBreaks: false,
      },
      diff: {
        diff: '',
        diffPrev: '',
        diffLoading: false,
        diffPrevLoading: false,
        diffError: null,
        diffPrevError: null,
      },
    });
  });

  test('renders CircularProgress when loading is true', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <MarkdownContentView
          loading={true}
          viewMode="preview"
          content=""
          markdownContent=""
          frontmatter={{}}
        />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders MarkdownRenderer in preview mode', () => {
    render(
      <Provider store={store}>
        <MarkdownContentView
          loading={false}
          viewMode="preview"
          content="# Hello"
          markdownContent="# Hello"
          frontmatter={{}}
        />
      </Provider>
    );

    expect(MarkdownRenderer).toHaveBeenCalledWith(
      expect.objectContaining({
        content: '# Hello',
        selectedFilePath: '/test.md',
      }),
      undefined
    );
    expect(screen.getByTestId('mock-markdown-renderer')).toBeInTheDocument();
  });

  test('renders frontmatter in frontmatter mode', () => {
    const frontmatter = { title: 'Test Title', author: 'Test Author' };
    render(
      <Provider store={store}>
        <MarkdownContentView
          loading={false}
          viewMode="frontmatter"
          content=""
          markdownContent=""
          frontmatter={frontmatter}
        />
      </Provider>
    );
    expect(screen.getByText('title')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('author')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
  });

  test('renders MarkdownRenderer in raw mode', () => {
    render(
      <Provider store={store}>
        <MarkdownContentView
          loading={false}
          viewMode="raw"
          content="# Raw Content"
          markdownContent=""
          frontmatter={{}}
        />
      </Provider>
    );
    expect(MarkdownRenderer).toHaveBeenCalledWith(
      expect.objectContaining({
        content: '`````markdown\n# Raw Content\n``````',
        selectedFilePath: '/test.md',
      }),
      undefined
    );
    expect(screen.getByTestId('mock-markdown-renderer')).toBeInTheDocument();
  });

  test('renders diff content in diff mode', () => {
    store = mockStore({
      history: { currentPath: '/test.md' },
      config: { enableBreaks: false },
      diff: {
        diff: '+added line',
        diffPrev: '',
        diffLoading: false,
        diffPrevLoading: false,
        diffError: null,
        diffPrevError: null,
      },
    });
    render(
      <Provider store={store}>
        <MarkdownContentView
          loading={false}
          viewMode="diff"
          content=""
          markdownContent=""
          frontmatter={{}}
        />
      </Provider>
    );
    expect(MarkdownRenderer).toHaveBeenCalledWith(
      expect.objectContaining({
        content: '`````diff\n+added line\n``````',
      }),
      undefined
    );
  });

  test('renders empty message when diff is empty', () => {
    render(
      <Provider store={store}>
        <MarkdownContentView
          loading={false}
          viewMode="diff"
          content=""
          markdownContent=""
          frontmatter={{}}
        />
      </Provider>
    );
    expect(screen.getByText('No uncommitted changes')).toBeInTheDocument();
  });

  test('renders loading spinner when diff is loading', () => {
    store = mockStore({
      history: { currentPath: '/test.md' },
      config: { enableBreaks: false },
      diff: {
        diff: '',
        diffPrev: '',
        diffLoading: true,
        diffPrevLoading: false,
        diffError: null,
        diffPrevError: null,
      },
    });
    render(
      <Provider store={store}>
        <MarkdownContentView
          loading={false}
          viewMode="diff"
          content=""
          markdownContent=""
          frontmatter={{}}
        />
      </Provider>
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders error alert when diff fetch fails', () => {
    store = mockStore({
      history: { currentPath: '/test.md' },
      config: { enableBreaks: false },
      diff: {
        diff: '',
        diffPrev: '',
        diffLoading: false,
        diffPrevLoading: false,
        diffError: 'Network error',
        diffPrevError: null,
      },
    });
    render(
      <Provider store={store}>
        <MarkdownContentView
          loading={false}
          viewMode="diff"
          content=""
          markdownContent=""
          frontmatter={{}}
        />
      </Provider>
    );
    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  test('renders diff-prev content in diff-prev mode', () => {
    store = mockStore({
      history: { currentPath: '/test.md' },
      config: { enableBreaks: false },
      diff: {
        diff: '',
        diffPrev: '-old\n+new',
        diffLoading: false,
        diffPrevLoading: false,
        diffError: null,
        diffPrevError: null,
      },
    });
    render(
      <Provider store={store}>
        <MarkdownContentView
          loading={false}
          viewMode="diff-prev"
          content=""
          markdownContent=""
          frontmatter={{}}
        />
      </Provider>
    );
    expect(MarkdownRenderer).toHaveBeenCalledWith(
      expect.objectContaining({
        content: '`````diff\n-old\n+new\n``````',
      }),
      undefined
    );
  });

  test('renders empty message when diff-prev is empty', () => {
    render(
      <Provider store={store}>
        <MarkdownContentView
          loading={false}
          viewMode="diff-prev"
          content=""
          markdownContent=""
          frontmatter={{}}
        />
      </Provider>
    );
    expect(screen.getByText('No previous changes found')).toBeInTheDocument();
  });

  test('renders loading spinner when diff-prev is loading', () => {
    store = mockStore({
      history: { currentPath: '/test.md' },
      config: { enableBreaks: false },
      diff: {
        diff: '',
        diffPrev: '',
        diffLoading: false,
        diffPrevLoading: true,
        diffError: null,
        diffPrevError: null,
      },
    });
    render(
      <Provider store={store}>
        <MarkdownContentView
          loading={false}
          viewMode="diff-prev"
          content=""
          markdownContent=""
          frontmatter={{}}
        />
      </Provider>
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders error alert when diff-prev fetch fails', () => {
    store = mockStore({
      history: { currentPath: '/test.md' },
      config: { enableBreaks: false },
      diff: {
        diff: '',
        diffPrev: '',
        diffLoading: false,
        diffPrevLoading: false,
        diffError: null,
        diffPrevError: 'Server error',
      },
    });
    render(
      <Provider store={store}>
        <MarkdownContentView
          loading={false}
          viewMode="diff-prev"
          content=""
          markdownContent=""
          frontmatter={{}}
        />
      </Provider>
    );
    expect(screen.getByText('Server error')).toBeInTheDocument();
  });

  test('renders null for unknown viewMode', () => {
    const { container } = render(
      <Provider store={store}>
        <MarkdownContentView
          loading={false}
          viewMode="unknown" as any
          content=""
          markdownContent=""
          frontmatter={{}}
        />
      </Provider>
    );
    expect(container).toBeEmptyDOMElement();
  });
});
