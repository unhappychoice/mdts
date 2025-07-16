import React from 'react';
import { render, act } from '@testing-library/react';
import Content from '../../src/components/Content';
import { FileTreeProvider } from '../../src/contexts/FileTreeContext';

jest.mock('../../src/hooks/apis/useContent', () => ({
  useContent: () => ({
    content: '## Test Content',
    loading: false,
    error: null,
  }),
}));

describe('Content', () => {
  test('renders correctly', async () => {
    let asFragment;
    await act(async () => {
      const { asFragment: f } = render(
        <FileTreeProvider>
          <Content />
        </FileTreeProvider>
      );
      asFragment = f;
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
