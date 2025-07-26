import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import DirectoryContent from '../../../../../src/components/Content/DirectoryContent/DirectoryContent';
import { FileTreeItem } from '../../../../../src/store/slices/fileTreeSlice';

const mockStore = configureStore([]);

describe('DirectoryContent', () => {
  let store;
  const mockFileTree: (FileTreeItem | { [key: string]: (FileTreeItem | object)[] })[] = [
    { 'folder1': [{ path: 'file1.md', status: ' ' }] },
    { path: 'file2.txt', status: ' ' },
  ];

  beforeEach(() => {
    store = mockStore({
      fileTree: {
        fileTree: mockFileTree,
        filteredFileTree: mockFileTree,
        loading: false,
        error: null,
      },
      history: {
        currentPath: '',
        isDirectory: true,
      },
      appSetting: {
        contentMode: 'fixed',
      },
    });
  });

  test('renders correctly with initial state', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <DirectoryContent onFileSelect={jest.fn()} onDirectorySelect={jest.fn()} />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test('calls onFileSelect when a file is clicked', () => {
    const onFileSelectMock = jest.fn();
    const onDirectorySelectMock = jest.fn();

    render(
      <Provider store={store}>
        <DirectoryContent onFileSelect={onFileSelectMock} onDirectorySelect={onDirectorySelectMock} />
      </Provider>
    );

    fireEvent.click(screen.getByText('file2.txt'));
    expect(onFileSelectMock).toHaveBeenCalledWith('file2.txt');
    expect(onDirectorySelectMock).not.toHaveBeenCalled();
  });

  test('calls onDirectorySelect when a folder is clicked', () => {
    const onFileSelectMock = jest.fn();
    const onDirectorySelectMock = jest.fn();

    render(
      <Provider store={store}>
        <DirectoryContent onFileSelect={onFileSelectMock} onDirectorySelect={onDirectorySelectMock} />
      </Provider>
    );

    fireEvent.click(screen.getByText('folder1'));
    expect(onDirectorySelectMock).toHaveBeenCalledWith('folder1');
    expect(onFileSelectMock).not.toHaveBeenCalled();
  });

  test('displays loading spinner when fileTree is loading', () => {
    store = mockStore({
      ...store.getState(),
      fileTree: {
        ...store.getState().fileTree,
        loading: true,
      },
    });

    render(
      <Provider store={store}>
        <DirectoryContent onFileSelect={jest.fn()} onDirectorySelect={jest.fn()} />
      </Provider>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('displays error message when there is an error', () => {
    store = mockStore({
      ...store.getState(),
      fileTree: {
        ...store.getState().fileTree,
        error: 'Failed to load directory',
      },
    });

    render(
      <Provider store={store}>
        <DirectoryContent onFileSelect={jest.fn()} onDirectorySelect={jest.fn()} />
      </Provider>
    );

    expect(screen.getByText('Error: Failed to load directory')).toBeInTheDocument();
  });
});
