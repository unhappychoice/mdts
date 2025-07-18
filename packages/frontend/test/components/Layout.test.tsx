import React from 'react';
import { render, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';
import Layout from '../../src/components/Layout';



import { thunk } from 'redux-thunk';
const mockStore = configureStore([thunk]);

describe('Layout', () => {
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

  test('renders correctly', async () => {
    let asFragment;
    await act(async () => {
      const { asFragment: f } = render(
        <Provider store={store}>
          <BrowserRouter>
            <Layout
              currentPath={null}
              isCurrentPathDirectory={false}
            />
          </BrowserRouter>
        </Provider>
      );
      asFragment = f;
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
