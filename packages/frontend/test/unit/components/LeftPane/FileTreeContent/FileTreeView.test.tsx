import { render } from '@testing-library/react';
import React from 'react';
import { FileTreeView } from '../../../../../src/components/LeftPane/FileTreeContent/FileTreeView';

describe('FileTreeView', () => {
  it('should render correctly', () => {
    const filteredFileTree = [
      { path: 'file1.md', status: 'added' },
      { 'dir1': [{ path: 'dir1/file2.md', status: 'modified' }] },
    ];
    const expandedNodes = ['dir1'];
    const onFileSelect = jest.fn();
    const onExpandedItemsChange = jest.fn();
    const getStatusColor = jest.fn((status) => {
      if (status === 'added') return 'green';
      if (status === 'modified') return 'blue';
      return 'black';
    });

    const { asFragment } = render(
      <FileTreeView
        filteredFileTree={filteredFileTree}
        expandedNodes={expandedNodes}
        onFileSelect={onFileSelect}
        onExpandedItemsChange={onExpandedItemsChange}
        getStatusColor={getStatusColor}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
