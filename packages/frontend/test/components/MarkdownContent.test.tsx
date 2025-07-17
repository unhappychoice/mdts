import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import MarkdownContent from '../../src/components/MarkdownContent';
import { fetchContent } from '../../src/store/slices/contentSlice';

const mockStore = configureStore([thunk]);

jest.mock('../../src/store/slices/contentSlice', () => ({
  ...jest.requireActual('../../src/store/slices/contentSlice'),
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
    });
  });

  test('renders welcome message when no file is selected', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <MarkdownContent selectedFilePath={null} scrollToId={null} />
        </Provider>
      );
    });
    expect(screen.getByText('🎉 Welcome to mdts!')).toBeInTheDocument();
    expect(store.getActions()).toEqual([{ type: 'content/fetchContent', payload: null }]);
  });

  test('renders file content when a file is selected', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <MarkdownContent selectedFilePath="/path/to/test.md" scrollToId={null} />
        </Provider>
      );
    });
    expect(screen.getByRole('heading', { name: /test.md/i })).toBeInTheDocument();
    expect(screen.getByText('# Test Markdown')).toBeInTheDocument();
    expect(store.getActions()).toEqual([{ type: 'content/fetchContent', payload: "/path/to/test.md" }]);
  });

  test('switches to raw view when raw tab is clicked', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <MarkdownContent selectedFilePath="/path/to/test.md" scrollToId={null} />
        </Provider>
      );
    });

    fireEvent.click(screen.getByRole('tab', { name: /raw/i }));
    expect(screen.getByText('# Test Markdown')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-react-markdown')).not.toBeInTheDocument();
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
    });

    await act(async () => {
      render(
        <Provider store={store}>
          <MarkdownContent selectedFilePath="/path/to/test.md" scrollToId={null} />
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
    });

    await act(async () => {
      render(
        <Provider store={store}>
          <MarkdownContent selectedFilePath="/path/to/test.md" scrollToId={null} />
        </Provider>
      );
    });
    expect(screen.getByText('Error: Failed to load content')).toBeInTheDocument();
  });

  test('calls onDirectorySelect when breadcrumb link is clicked', async () => {
    const handleDirectorySelect = jest.fn();
    await act(async () => {
      render(
        <Provider store={store}>
          <MarkdownContent
            selectedFilePath="/path/to/test.md"
            scrollToId={null}
            onDirectorySelect={handleDirectorySelect}
          />
        </Provider>
      );
    });

    const link = screen.getByRole('link', { name: /path/i });
    fireEvent.click(link);
    expect(handleDirectorySelect).toHaveBeenCalledWith("path");
  });
});
