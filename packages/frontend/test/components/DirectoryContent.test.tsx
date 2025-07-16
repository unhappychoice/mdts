import React from 'react';
import { render } from '@testing-library/react';
import DirectoryContent from '../../src/components/DirectoryContent';
import { FileTreeProvider } from '../../src/contexts/FileTreeContext';

jest.mock('../../src/hooks/apis/useFileTree', () => ({
  useFileTree: () => ({
    fileTree: [{ name: 'file1.md', path: '/file1.md', type: 'file' }],
    loading: false,
    error: null,
  }),
}));

describe('DirectoryContent', () => {
  test('renders correctly', () => {
    const { asFragment } = render(
      <FileTreeProvider>
        <DirectoryContent selectedDirectoryPath="" onFileSelect={() => {}} onDirectorySelect={() => {}} />
      </FileTreeProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
