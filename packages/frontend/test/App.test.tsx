import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';
import App from '../src/App';

const mockStore = configureStore([thunk]);

// Mock the useFileTree hook
jest.mock('../src/api', () => ({
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
        fileTree: [],
        filteredFileTree: [],
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
