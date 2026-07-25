import { render, screen, fireEvent } from '@testing-library/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import FileTreeContent from '../../../../../src/components/LeftPane/FileTreeContent/FileTreeContent';

jest.mock('@mui/x-tree-view', () => ({
  ...jest.requireActual('@mui/x-tree-view'),
  SimpleTreeView: ({ children, ...props }: { children: React.ReactNode }) => (
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
  const statusFileTree = [
    { path: 'modified.md', status: 'M' },
    { path: 'untracked.md', status: '?' },
    { path: 'added.md', status: 'A' },
    { path: 'deleted.md', status: 'D' },
    { path: 'renamed.md', status: 'R' },
    { path: 'copied.md', status: 'C' },
    { path: 'unknown.md', status: 'X' },
  ];
  const theme = createTheme({
    palette: {
      info: { main: 'rgb(1, 2, 3)' },
      success: { main: 'rgb(4, 5, 6)' },
      error: { main: 'rgb(7, 8, 9)' },
      warning: { main: 'rgb(10, 11, 12)' },
      secondary: { main: 'rgb(13, 14, 15)' },
      text: { primary: 'rgb(16, 17, 18)' },
    },
  });

  test('renders loading spinner when loading is true', () => {
    render(
      <FileTreeContent
        filteredFileTree={[]} // Can be empty when loading
        loading={true}
        error={null}
        expandedNodes={[]}
        selectedFilePath={null}
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
        selectedFilePath={null}
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
        selectedFilePath={null}
        onFileSelect={jest.fn()}
        onExpandedItemsChange={jest.fn()}
      />
    );
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText('folder1')).toBeInTheDocument();
    expect(screen.getByText('file3.js')).toBeInTheDocument();
  });

  test('renders existing tree while loading when filtered tree already has content', () => {
    render(
      <FileTreeContent
        filteredFileTree={mockFileTree}
        loading={true}
        error={null}
        expandedNodes={['folder1']}
        selectedFilePath={null}
        onFileSelect={jest.fn()}
        onExpandedItemsChange={jest.fn()}
      />
    );
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.getByText('folder1')).toBeInTheDocument();
  });

  test('applies theme colors for each git status', () => {
    render(
      <ThemeProvider theme={theme}>
        <FileTreeContent
          filteredFileTree={statusFileTree}
          loading={false}
          error={null}
          expandedNodes={[]}
          selectedFilePath={null}
          onFileSelect={jest.fn()}
          onExpandedItemsChange={jest.fn()}
        />
      </ThemeProvider>
    );

    [
      ['modified.md', 'rgb(1, 2, 3)'],
      ['untracked.md', 'rgb(4, 5, 6)'],
      ['added.md', 'rgb(4, 5, 6)'],
      ['deleted.md', 'rgb(7, 8, 9)'],
      ['renamed.md', 'rgb(10, 11, 12)'],
      ['copied.md', 'rgb(13, 14, 15)'],
      ['unknown.md', 'rgb(16, 17, 18)'],
    ].forEach(([fileName, color]) => {
      expect(screen.getByText(fileName)).toHaveStyle({ color });
    });
  });

  test('calls onFileSelect when a file is clicked', () => {
    const onFileSelectMock = jest.fn();
    render(
      <FileTreeContent
        filteredFileTree={mockFileTree}
        loading={false}
        error={null}
        expandedNodes={[]}
        selectedFilePath={null}
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
        selectedFilePath={null}
        onFileSelect={jest.fn()}
        onExpandedItemsChange={onExpandedItemsChangeMock}
      />
    );
    // Simulate expanding 'folder1'
    fireEvent.click(screen.getByText('folder1'));
    expect(onExpandedItemsChangeMock).toHaveBeenCalledWith(expect.any(Object), ['folder1']);
  });
});
