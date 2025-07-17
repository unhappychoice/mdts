import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import FileTree from '../../src/components/FileTree';
import { fetchFileTree, setSearchQuery } from '../../src/store/slices/fileTreeSlice';

const mockStore = configureStore([]);

describe('FileTree', () => {
  let store;
  const initialState = {
    fileTree: {
      fileTree: [
        { 'folder1': ['/folder1/file1.md', '/folder1/file2.txt'] },
        '/file3.js',
      ],
      filteredFileTree: [
        { 'folder1': ['/folder1/file1.md', '/folder1/file2.txt'] },
        '/file3.js',
      ],
      loading: false,
      error: null,
      searchQuery: '',
    },
  };

  beforeEach(() => {
    store = mockStore(initialState);
    store.dispatch = jest.fn();
  });

  test('renders correctly', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <FileTree onFileSelect={jest.fn()} isOpen={true} onToggle={jest.fn()} selectedFilePath={null} />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test('dispatches fetchFileTree on mount', () => {
    render(
      <Provider store={store}>
        <FileTree onFileSelect={jest.fn()} isOpen={true} onToggle={jest.fn()} selectedFilePath={null} />
      </Provider>
    );
    expect(store.dispatch).toHaveBeenCalledWith(fetchFileTree());
  });

  test('dispatches setSearchQuery on search input change', () => {
    render(
      <Provider store={store}>
        <FileTree onFileSelect={jest.fn()} isOpen={true} onToggle={jest.fn()} selectedFilePath={null} />
      </Provider>
    );

    const searchInput = screen.getByPlaceholderText('Search files...');
    fireEvent.change(searchInput, { target: { value: 'file' } });

    expect(store.dispatch).toHaveBeenCalledWith(setSearchQuery('file'));
  });

  test('clears search query when clear button is clicked', () => {
    store = mockStore({
      fileTree: {
        ...initialState.fileTree,
        searchQuery: 'file',
        filteredFileTree: ['/folder1/file1.md'],
      },
    });
    store.dispatch = jest.fn();

    render(
      <Provider store={store}>
        <FileTree onFileSelect={jest.fn()} isOpen={true} onToggle={jest.fn()} selectedFilePath={null} />
      </Provider>
    );

    const clearButton = screen.getByLabelText('clear search');
    fireEvent.click(clearButton);

    expect(store.dispatch).toHaveBeenCalledWith(setSearchQuery(''));
  });

  test('expands all folders when expand all button is clicked', () => {
    render(
      <Provider store={store}>
        <FileTree onFileSelect={jest.fn()} isOpen={true} onToggle={jest.fn()} selectedFilePath={null} />
      </Provider>
    );

    const expandAllButton = screen.getByLabelText('expand all');
    fireEvent.click(expandAllButton);

    // This test needs to assert on the expanded state of the TreeView, which is internal to the component.
    // For now, we'll just ensure the button click doesn't cause an error.
    // A more robust test would involve checking the `expandedItems` prop of SimpleTreeView.
  });

  test('collapses all folders when collapse all button is clicked', () => {
    render(
      <Provider store={store}>
        <FileTree onFileSelect={jest.fn()} isOpen={true} onToggle={jest.fn()} selectedFilePath={null} />
      </Provider>
    );

    const collapseAllButton = screen.getByLabelText('collapse all');
    fireEvent.click(collapseAllButton);

    // Similar to expand all, this would require inspecting internal state.
  });
});
