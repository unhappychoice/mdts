import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import FileTree from '../../../../src/components/LeftPane/FileTree';
import { fetchFileTree, setSearchQuery, expandAllNodes, setExpandedNodes } from '../../../../src/store/slices/fileTreeSlice';

const mockStore = configureStore([thunk]);

jest.mock('../../../../src/store/slices/fileTreeSlice', () => ({
  ...jest.requireActual('../../../../src/store/slices/fileTreeSlice'),
  fetchFileTree: Object.assign(jest.fn(() => ({ type: 'fileTree/fetchFileTree/pending' })), {
    fulfilled: jest.fn((payload) => ({ type: 'fileTree/fetchFileTree/fulfilled', payload })),
  }),
  expandAllNodes: jest.fn((payload) => ({ type: 'fileTree/expandAllNodes', payload })),
  setExpandedNodes: jest.fn((payload) => ({ type: 'fileTree/setExpandedNodes', payload })),
  setFilteredFileTree: jest.fn((payload) => ({ type: 'fileTree/setFilteredFileTree', payload }))
}));

describe('FileTree', () => {
  let store;
  const initialState = {
    fileTree: {
      fileTree: [
        { path: 'file3.js', status: ' ' },
        { 'folder1': [{ path: 'folder1/file1.md', status: ' ' }, { path: 'folder1/file2.txt', status: ' ' }] },
      ],
      filteredFileTree: [
        { path: 'file3.js', status: ' ' },
        { 'folder1': [{ path: 'folder1/file1.md', status: ' ' }, { path: 'folder1/file2.txt', status: ' ' }] },
      ],
      loading: false,
      error: null,
      searchQuery: '',
      expandedNodes: [],
      mountedDirectoryPath: '',
    },
  };

  beforeEach(() => {
    store = mockStore(initialState);
    jest.spyOn(store, 'dispatch');
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
        filteredFileTree: [{ path: '/folder1/file1.md', status: ' ' }],
      },
    });
    jest.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <FileTree onFileSelect={jest.fn()} isOpen={true} onToggle={jest.fn()} selectedFilePath={null} />
      </Provider>
    );

    const clearButton = screen.getByLabelText('clear search');
    fireEvent.click(clearButton);

    expect(store.dispatch).toHaveBeenCalledWith(setSearchQuery(''));
  });

  test('dispatches expandAllNodes when expand all button is clicked', () => {
    render(
      <Provider store={store}>
        <FileTree onFileSelect={jest.fn()} isOpen={true} onToggle={jest.fn()} selectedFilePath={null} />
      </Provider>
    );

    const expandAllButton = screen.getByLabelText('expand all');
    fireEvent.click(expandAllButton);

    expect(store.dispatch).toHaveBeenCalledWith(expandAllNodes(initialState.fileTree.fileTree));
  });

  test('dispatches setExpandedNodes with empty array when collapse all button is clicked', () => {
    render(
      <Provider store={store}>
        <FileTree onFileSelect={jest.fn()} isOpen={true} onToggle={jest.fn()} selectedFilePath={null} />
      </Provider>
    );

    const collapseAllButton = screen.getByLabelText('collapse all');
    fireEvent.click(collapseAllButton);

    expect(store.dispatch).toHaveBeenCalledWith(setExpandedNodes([]));
  });

  test('updates expandedNodes when search query changes and filteredFileTree is not empty', async () => {
    const updatedFileTree = [{ 'folder1': [{ path: 'folder1/file1.md', status: ' ' }] }];
    let currentStore = mockStore(initialState);
    const { rerender } = render(
      <Provider store={currentStore}>
        <FileTree onFileSelect={jest.fn()} isOpen={true} onToggle={jest.fn()} selectedFilePath={null} />
      </Provider>
    );

    await act(async () => {
      // Simulate dispatching setSearchQuery and the reducer updating the state
      const newStoreState = {
        fileTree: {
          ...initialState.fileTree,
          searchQuery: 'file1',
          filteredFileTree: updatedFileTree,
        },
      };
      currentStore = mockStore(newStoreState);
      jest.spyOn(currentStore, 'dispatch'); // Re-spy on the new store's dispatch
      rerender(
        <Provider store={currentStore}>
          <FileTree onFileSelect={jest.fn()} isOpen={true} onToggle={jest.fn()} selectedFilePath={null} />
        </Provider>
      );
    });

    await waitFor(() => {
      expect(currentStore.dispatch).toHaveBeenCalledWith({
        type: 'fileTree/setExpandedNodes',
        payload: ['folder1'],
      });
    });
  });

  test('does not update expandedNodes when search query is empty', async () => {
    const updatedState = {
      fileTree: {
        ...initialState.fileTree,
        searchQuery: '',
        filteredFileTree: [{ 'folder1': [{ path: 'file1.md', status: ' ' }] }],
      },
    };
    store = mockStore(updatedState);
    jest.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <FileTree onFileSelect={jest.fn()} isOpen={true} onToggle={jest.fn()} selectedFilePath={null} />
      </Provider>
    );

    // Simulate search query change to empty
    store.dispatch(setSearchQuery(''));

    await waitFor(() => {
      expect(store.dispatch).not.toHaveBeenCalledWith({
        type: 'fileTree/setExpandedNodes',
        payload: [],
      });
    });
  });
});
