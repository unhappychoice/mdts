import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from '../../src/App';
import { createMockStore } from '../utils';

jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  CssBaseline: () => null, // Mock CssBaseline to render nothing
  AppBar: ({ children, ...props }: any) => <div {...props}>{children}</div>, // Mock AppBar
}));

jest.mock('@mui/x-tree-view', () => ({
  ...jest.requireActual('@mui/x-tree-view'),
  SimpleTreeView: ({ children, defaultCollapseIcon, defaultExpandIcon, ...props }: any) => (
    <div data-testid="mock-simple-tree-view" {...props}>
      {children}
    </div>
  ),
}));

// Mock the useFileTree hook
jest.mock('../../src/api', () => ({
  fetchData: jest.fn(() => Promise.resolve([])),
}));


describe('App', () => {
  let store;

  beforeEach(() => {
    store = createMockStore();
  });

  test('renders without crashing', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      );
    });
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
