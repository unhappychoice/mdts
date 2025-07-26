import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import App from '../../src/App';

jest.mock('@mui/x-tree-view', () => ({
  ...jest.requireActual('@mui/x-tree-view'),
  SimpleTreeView: ({ children, defaultCollapseIcon, defaultExpandIcon, ...props }: any) => (
    <div data-testid="mock-simple-tree-view" {...props}>
      {children}
    </div>
  ),
}));

const mockStore = configureStore([thunk]);

// Mock the useFileTree hook
jest.mock('../../src/api', () => ({
  fetchData: jest.fn(() => Promise.resolve([])),
}));


describe('App', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      appSetting: {
        darkMode: false,
        contentMode: 'fixed',
        fileTreeOpen: true,
        outlineOpen: true,
      },
      fileTree: {
        fileTree: [
          { path: 'test.md', status: ' ' },
          { 'folder': [{ path: 'folder/subfile.md', status: 'M' }] }
        ],
        filteredFileTree: [
          { path: 'test.md', status: ' ' },
          { 'folder': [{ path: 'folder/subfile.md', status: 'M' }] }
        ],
        loading: false,
        error: null,
        searchQuery: '',
      },
      content: {
        content: '',
        loading: false,
        error: null,
      },
      outline: {
        outline: [],
        loading: false,
        error: null,
      },
      history: {
        currentPath: null,
        isDirectory: false,
      },
    });
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
