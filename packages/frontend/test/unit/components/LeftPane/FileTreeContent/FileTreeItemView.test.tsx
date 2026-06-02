import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { FileTreeItemView } from '../../../../../src/components/LeftPane/FileTreeContent/FileTreeItemView';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';

describe('FileTreeItemView', () => {
  const renderFileTreeItem = ({
    fileItem = { path: 'test.md', status: 'modified' },
    onFileSelect = jest.fn(),
  } = {}) => {
    const getStatusColor = jest.fn((status) => {
      if (status === 'modified') return 'blue';
      return 'black';
    });

    const result = render(
      <SimpleTreeView>
        <FileTreeItemView
          fileItem={fileItem}
          onFileSelect={onFileSelect}
          getStatusColor={getStatusColor}
        />
      </SimpleTreeView>
    );

    return { ...result, getStatusColor, onFileSelect };
  };

  it('should render correctly', () => {
    renderFileTreeItem();

    expect(screen.getByText('test.md')).toBeInTheDocument();
    expect(screen.getByText('modified')).toBeInTheDocument();
  });

  it('should render the file tree item as a link', () => {
    renderFileTreeItem({
      fileItem: { path: 'docs/getting started.md', status: ' ' },
    });

    expect(screen.getByRole('link', { name: 'getting started.md' })).toHaveAttribute(
      'href',
      '/docs/getting%20started.md',
    );
  });

  it('should use client-side selection for regular clicks', () => {
    const onFileSelect = jest.fn();
    renderFileTreeItem({ onFileSelect });

    fireEvent.click(screen.getByRole('link', { name: /test\.md/ }));

    expect(onFileSelect).toHaveBeenCalledWith('test.md');
  });

  it('should preserve native browser behavior for modified clicks', () => {
    const onFileSelect = jest.fn();
    renderFileTreeItem({ onFileSelect });

    fireEvent.click(screen.getByRole('link', { name: /test\.md/ }), { ctrlKey: true });

    expect(onFileSelect).not.toHaveBeenCalled();
  });
});
