import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import MarkdownContent from '../../../../../src/components/Content/MarkdownContent/MarkdownContent';

const mockStore = configureStore([thunk]);

jest.mock('../../../../../src/store/slices/contentSlice', () => ({
  ...jest.requireActual('../../../../../src/store/slices/contentSlice'),
  fetchContent: jest.fn((path) => (dispatch) => {
    dispatch({ type: 'content/fetchContent', payload: path });
  }),
}));

describe('MarkdownContent', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
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
  });

  test('renders welcome message when no file is selected', async () => {
    store = mockStore({
      content: {
        content: '',
        loading: false,
        error: null,
      },
      fileTree: {
        loading: false,
      },
      history: {
        currentPath: null,
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

    let fragment;
    await act(async () => {
      const { asFragment } = render(
        <Provider store={store}>
          <BrowserRouter>
            <MarkdownContent scrollToId={null} />
          </BrowserRouter>
        </Provider>
      );
      fragment = asFragment;
    });
    expect(fragment()).toMatchSnapshot();
    expect(screen.getByText('🎉 Welcome to mdts!')).toBeInTheDocument();
    expect(store.getActions()).toEqual([{ type: 'content/fetchContent', payload: null }]);
  });

  test('renders file content when a file is selected', async () => {
    store = mockStore({
      content: {
        content: '# Test Markdown',
        loading: false,
        error: null,
      },
      fileTree: {
        loading: false,
      },
      history: {
        currentPath: '/path/to/test.md',
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

    await act(async () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <MarkdownContent scrollToId={null} />
          </BrowserRouter>
        </Provider>
      );
    });

    fireEvent.click(screen.getByRole('tab', { name: /raw/i }));
    expect(screen.getByTestId('mock-react-markdown')).toBeInTheDocument();
  });

  test('displays loading spinner when content is loading', async () => {
    store = mockStore({
      content: {
        content: '',
        loading: true,
        error: null,
      },
      fileTree: {
        loading: false,
      },
      history: {
        currentPath: '/path/to/test.md',
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

    await act(async () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <MarkdownContent scrollToId={null} />
          </BrowserRouter>
        </Provider>
      );
    });
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('displays error message when there is an error', async () => {
    store = mockStore({
      content: {
        content: '',
        loading: false,
        error: 'Failed to load content',
      },
      fileTree: {
        loading: false,
      },
      history: {
        currentPath: '/path/to/test.md',
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

    await act(async () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <MarkdownContent scrollToId={null} />
          </BrowserRouter>
        </Provider>
      );
    });
    expect(screen.getByText('Error: Failed to load content')).toBeInTheDocument();
  });

  test('calls onDirectorySelect when breadcrumb link is clicked', async () => {
    const handleDirectorySelect = jest.fn();
    store = mockStore({
      content: {
        content: '# Test Markdown',
        loading: false,
        error: null,
      },
      fileTree: {
        loading: false,
      },
      history: {
        currentPath: '/path/to/test.md',
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

    await act(async () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <MarkdownContent scrollToId={null} onDirectorySelect={handleDirectorySelect} />
          </BrowserRouter>
        </Provider>
      );
    });

    const link = screen.getByRole('link', { name: /path/i });
    fireEvent.click(link);
    expect(handleDirectorySelect).toHaveBeenCalledWith('path');
  });

  test('parses and displays frontmatter', async () => {
    const contentWithFrontmatter = '---\ntitle: Test Title\nauthor: Test Author\n---\n# Markdown Content';
    store = mockStore({
      content: {
        content: contentWithFrontmatter,
        loading: false,
        error: null,
      },
      fileTree: {
        loading: false,
      },
      history: {
        currentPath: '/path/to/test.md',
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

    await act(async () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <MarkdownContent scrollToId={null} />
          </BrowserRouter>
        </Provider>
      );
    });

    fireEvent.click(screen.getByText('Frontmatter'));

    expect(screen.getByText('title')).toBeInTheDocument();
    expect(screen.getAllByText('Test Title').length).toBeGreaterThan(0);
    expect(screen.getByText('author')).toBeInTheDocument();
    expect(screen.getAllByText('Test Author').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByText('Preview'));

    expect(screen.getByTestId('mock-react-markdown')).toBeInTheDocument();
  });

  test('scrolls to element when scrollToId is provided', async () => {
    const scrollIntoViewMock = jest.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    const contentWithId = '<a id="test-id">Test Heading</a>';
    store = mockStore({
      content: {
        content: contentWithId,
        loading: false,
        error: null,
      },
      fileTree: {
        loading: false,
      },
      history: {
        currentPath: '/path/to/test.md',
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

    await act(async () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <MarkdownContent scrollToId="test-id" />
          </BrowserRouter>
        </Provider>
      );
    });

    await screen.findByText('Test Heading');
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
  });
});
