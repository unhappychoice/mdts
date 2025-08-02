import { render } from '@testing-library/react';
import React from 'react';
import { FileTreeItemView } from '../../../../../src/components/LeftPane/FileTreeContent/FileTreeItemView';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';

describe('FileTreeItemView', () => {
  it('should render correctly', () => {
    const fileItem = { path: 'test.md', status: 'modified' };
    const onFileSelect = jest.fn();
    const getStatusColor = jest.fn((status) => {
      if (status === 'modified') return 'blue';
      return 'black';
    });

    const { asFragment } = render(
      <SimpleTreeView>
        <FileTreeItemView
          fileItem={fileItem}
          onFileSelect={onFileSelect}
          getStatusColor={getStatusColor}
        />
      </SimpleTreeView>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
