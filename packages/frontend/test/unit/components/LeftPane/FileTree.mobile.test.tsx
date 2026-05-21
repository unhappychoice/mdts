import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import FileTree from '../../../../src/components/LeftPane/FileTree';
import useIsMobile from '../../../../src/hooks/useIsMobile';
import { fetchFileTree, setExpandedNodes } from '../../../../src/store/slices/fileTreeSlice';

const mockStore = configureStore([thunk]);

jest.mock('../../../../src/store/slices/fileTreeSlice', () => ({
  ...jest.requireActual('../../../../src/store/slices/fileTreeSlice'),
  fetchFileTree: Object.assign(jest.fn(() => ({ type: 'fileTree/fetchFileTree/pending' })), {
    fulfilled: jest.fn((payload) => ({ type: 'fileTree/fetchFileTree/fulfilled', payload })),
  }),
  setExpandedNodes: jest.fn((payload) => ({ type: 'fileTree/setExpandedNodes', payload })),
}));

jest.mock('../../../../src/hooks/useIsMobile', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../../../src/components/LeftPane/FileTreeContent/FileTreeContent', () => {
  const React = jest.requireActual('react');

  return {
    __esModule: true,
    default: ({ onExpandedItemsChange, onFileSelect }) => {
      const handleExpandItems = () => onExpandedItemsChange({}, ['folder1']);
      const handleSelectFile = () => onFileSelect('/docs/readme.md');

      return React.createElement(
        'div',
        null,
        React.createElement('button', { onClick: handleExpandItems }, 'expand items'),
        React.createElement('button', { onClick: handleSelectFile }, 'select file')
      );
    },
  };
});

describe('FileTree mobile behavior', () => {
  let store;

  const renderFileTree = (props = {}) => render(
    <Provider store={store}>
      <FileTree
        onFileSelect={jest.fn()}
        isOpen={true}
        onToggle={jest.fn()}
        selectedFilePath={null}
        {...props}
      />
    </Provider>
  );

  beforeEach(() => {
    (useIsMobile as jest.Mock).mockReturnValue(true);
    store = mockStore({
      fileTree: {
        fileTree: [{ 'folder1': [{ path: 'folder1/file1.md', status: ' ' }] }],
        filteredFileTree: [{ 'folder1': [{ path: 'folder1/file1.md', status: ' ' }] }],
        loading: false,
        error: null,
        searchQuery: '',
        searchMode: 'filename',
        expandedNodes: [],
        mountedDirectoryPath: '',
      },
    });
    store.dispatch = jest.fn();
  });

  test('dispatches expanded items updates from the mobile tree content', () => {
    renderFileTree();

    fireEvent.click(screen.getByRole('button', { name: 'expand items' }));

    expect(store.dispatch).toHaveBeenCalledWith(fetchFileTree());
    expect(store.dispatch).toHaveBeenCalledWith(setExpandedNodes(['folder1']));
  });

  test('closes the mobile drawer after selecting a file', () => {
    const onFileSelect = jest.fn();
    const onToggle = jest.fn();

    renderFileTree({ onFileSelect, onToggle });

    fireEvent.click(screen.getByRole('button', { name: 'select file' }));

    expect(onFileSelect).toHaveBeenCalledWith('/docs/readme.md');
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
