import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import FileTreeContent from '../../../../src/components/LeftPane/FileTreeContent';

jest.mock('@mui/x-tree-view', () => ({
  ...jest.requireActual('@mui/x-tree-view'),
  SimpleTreeView: ({ children, defaultCollapseIcon, defaultExpandIcon, ...props }: any) => (
    <div data-testid="mock-simple-tree-view" {...props}>
      {children}
    </div>
  ),
}));

describe('FileTreeContent', () => {
  const mockFileTree = [
    { 'folder1': [{ path: 'file1.md', status: ' ' }, { 'subfolder': [{ path: 'folder1/subfolder/file2.txt', status: ' ' }] }] },
    { path: 'file3.js', status: ' ' },
  ];

  test('renders loading spinner when loading is true', () => {
    render(
      <FileTreeContent
        filteredFileTree={[]} // Can be empty when loading
        loading={true}
        error={null}
        expandedNodes={[]}
        onFileSelect={jest.fn()}
        onExpandedItemsChange={jest.fn()}
      />
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders error message when error is present', () => {
    render(
      <FileTreeContent
        filteredFileTree={[]} // Can be empty when error
        loading={false}
        error="Failed to load tree"
        expandedNodes={[]}
        onFileSelect={jest.fn()}
        onExpandedItemsChange={jest.fn()}
      />
    );
    expect(screen.getByText('Error: Failed to load tree')).toBeInTheDocument();
  });

  test('renders file tree correctly', () => {
    const { asFragment } = render(
      <FileTreeContent
        filteredFileTree={mockFileTree}
        loading={false}
        error={null}
        expandedNodes={['folder1']}
        onFileSelect={jest.fn()}
        onExpandedItemsChange={jest.fn()}
      />
    );
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText('folder1')).toBeInTheDocument();
    expect(screen.getByText('file3.js')).toBeInTheDocument();
  });

  test('calls onFileSelect when a file is clicked', () => {
    const onFileSelectMock = jest.fn();
    render(
      <FileTreeContent
        filteredFileTree={mockFileTree}
        loading={false}
        error={null}
        expandedNodes={[]}
        onFileSelect={onFileSelectMock}
        onExpandedItemsChange={jest.fn()}
      />
    );
    fireEvent.click(screen.getByText('file3.js'));
    expect(onFileSelectMock).toHaveBeenCalledWith('file3.js');
  });

  test('calls onExpandedItemsChange when a folder is expanded/collapsed', () => {
    const onExpandedItemsChangeMock = jest.fn();
    render(
      <FileTreeContent
        filteredFileTree={mockFileTree}
        loading={false}
        error={null}
        expandedNodes={[]}
        onFileSelect={jest.fn()}
        onExpandedItemsChange={onExpandedItemsChangeMock}
      />
    );
    // Simulate expanding 'folder1'
    fireEvent.click(screen.getByText('folder1'));
    expect(onExpandedItemsChangeMock).toHaveBeenCalledWith(expect.any(Object), ['folder1']);
  });
});
