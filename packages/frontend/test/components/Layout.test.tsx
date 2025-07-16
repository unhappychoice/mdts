import React from 'react';
import { render, act } from '@testing-library/react';
import Layout from '../../src/components/Layout';
import { FileTreeProvider } from '../../src/contexts/FileTreeContext';

jest.mock('../../src/hooks/apis/useFileTree', () => ({
  useFileTree: () => ({
    fileTree: [],
    loading: false,
    error: null,
  }),
}));

describe('Layout', () => {
  test('renders correctly', async () => {
    let asFragment;
    await act(async () => {
      const { asFragment: f } = render(
        <FileTreeProvider>
          <Layout>
            <p>Test</p>
          </Layout>
        </FileTreeProvider>
      );
      asFragment = f;
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
