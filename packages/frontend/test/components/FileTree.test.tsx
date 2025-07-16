import React from 'react';
import { render } from '@testing-library/react';
import FileTree from '../../src/components/FileTree';
import { FileTreeProvider } from '../../src/contexts/FileTreeContext';

jest.mock('../../src/hooks/apis/useFileTree', () => ({
  useFileTree: () => ({
    fileTree: [{ name: 'file1.md', path: '/file1.md', type: 'file' }],
    loading: false,
    error: null,
  }),
}));

describe('FileTree', () => {
  test('renders correctly', () => {
    const { asFragment } = render(
      <FileTreeProvider>
        <FileTree />
      </FileTreeProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
