import { render } from '@testing-library/react';
import React from 'react';
import { RecursiveTreeItems } from '../../../../../src/components/LeftPane/FileTreeContent/RecursiveTreeItems';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';

describe('RecursiveTreeItems', () => {
  it('should render correctly with files and directories', () => {
    const tree = [
      { path: 'file1.md', status: 'added' },
      { 'dir1': [{ path: 'dir1/file2.md', status: 'modified' }] },
    ];
    const onFileSelect = jest.fn();
    const getStatusColor = jest.fn((status) => {
      if (status === 'added') return 'green';
      if (status === 'modified') return 'blue';
      return 'black';
    });

    const { asFragment } = render(
      <SimpleTreeView>
        <RecursiveTreeItems
          tree={tree}
          onFileSelect={onFileSelect}
          getStatusColor={getStatusColor}
        />
      </SimpleTreeView>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render correctly with empty tree', () => {
    const tree = null;
    const onFileSelect = jest.fn();
    const getStatusColor = jest.fn();

    const { asFragment } = render(
      <SimpleTreeView>
        <RecursiveTreeItems
          tree={tree}
          onFileSelect={onFileSelect}
          getStatusColor={getStatusColor}
        />
      </SimpleTreeView>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
