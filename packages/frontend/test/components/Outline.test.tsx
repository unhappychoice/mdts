import React from 'react';
import { render, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Outline from '../../src/components/Outline';
import { fetchOutline } from '../../src/store/slices/outlineSlice';

import { thunk } from 'redux-thunk';
const mockStore = configureStore([thunk]);

jest.mock('../../src/store/slices/outlineSlice', () => ({
  ...jest.requireActual('../../src/store/slices/outlineSlice'),
  fetchOutline: jest.fn(() => ({ type: 'outline/fetchOutline/pending' })), // Mock the thunk action
}));

describe('Outline', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      outline: {
        outline: [{ depth: 1, value: 'Title' }],
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
          <Outline filePath="/test.md" onItemClick={() => {}} isOpen={true} onToggle={() => {}} />
        </Provider>
      );
      asFragment = f;
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
