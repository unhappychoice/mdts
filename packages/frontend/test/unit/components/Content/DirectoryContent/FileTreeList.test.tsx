import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { FileTreeList } from '../../../../../src/components/Content/DirectoryContent/FileTreeList';
import { FileTreeItem } from '../../../../../src/store/slices/fileTreeSlice';

const mockStore = configureStore([]);

describe('FileTreeList', () => {
  let store;
  const mockFileTree: (FileTreeItem | { [key: string]: (FileTreeItem | object)[] })[] = [
    { 'folder1': [] },
    { path: 'file2.txt', status: ' ' },
  ];

  beforeEach(() => {
    store = mockStore({
      history: {
        currentPath: '',
      },
    });
  });

  test('renders correctly with files and folders', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <FileTreeList fileTree={mockFileTree} handleItemClick={jest.fn()} />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText('folder1')).toBeInTheDocument();
    expect(screen.getByText('file2.txt')).toBeInTheDocument();
  });

  test('calls handleItemClick with correct arguments for a file', () => {
    const handleItemClickMock = jest.fn();
    render(
      <Provider store={store}>
        <FileTreeList fileTree={mockFileTree} handleItemClick={handleItemClickMock} />
      </Provider>
    );
    fireEvent.click(screen.getByText('file2.txt'));
    expect(handleItemClickMock).toHaveBeenCalledWith('file2.txt', false);
  });

  test('calls handleItemClick with correct arguments for a folder', () => {
    const handleItemClickMock = jest.fn();
    render(
      <Provider store={store}>
        <FileTreeList fileTree={mockFileTree} handleItemClick={handleItemClickMock} />
      </Provider>
    );
    fireEvent.click(screen.getByText('folder1'));
    expect(handleItemClickMock).toHaveBeenCalledWith('folder1', true);
  });

  test('handles currentPath correctly for item paths', () => {
    store = mockStore({
      history: {
        currentPath: 'parent_folder',
      },
    });
    const handleItemClickMock = jest.fn();
    render(
      <Provider store={store}>
        <FileTreeList fileTree={mockFileTree} handleItemClick={handleItemClickMock} />
      </Provider>
    );
    fireEvent.click(screen.getByText('file2.txt'));
    expect(handleItemClickMock).toHaveBeenCalledWith('parent_folder/file2.txt', false);
  });
});
