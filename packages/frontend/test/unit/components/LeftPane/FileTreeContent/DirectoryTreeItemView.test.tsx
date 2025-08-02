import { render } from '@testing-library/react';
import React from 'react';
import { DirectoryTreeItemView } from '../../../../../src/components/LeftPane/FileTreeContent/DirectoryTreeItemView';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';

describe('DirectoryTreeItemView', () => {
  it('should render correctly', () => {
    const { asFragment } = render(
      <SimpleTreeView>
        <DirectoryTreeItemView directoryName="test-dir" currentPath="/test-path">
          <div>Child Content</div>
        </DirectoryTreeItemView>
      </SimpleTreeView>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
