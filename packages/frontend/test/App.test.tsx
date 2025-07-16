import React from 'react';
import { render, screen, act } from '@testing-library/react';
import App from '../src/App';
import { FileTreeProvider } from '../src/contexts/FileTreeContext';

// Mock the useFileTree hook
jest.mock('../src/hooks/apis/useFileTree', () => ({
  useFileTree: () => ({
    fileTree: [],
    loading: false,
    error: null,
  }),
}));

describe('App', () => {
  test('renders without crashing', async () => {
    await act(async () => {
      render(
        <FileTreeProvider>
          <App />
        </FileTreeProvider>
      );
    });
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
