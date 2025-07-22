import { act, render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import Outline from '../../../../src/components/RightPane/Outline';
import { fetchOutline } from '../../../../src/store/slices/outlineSlice';

const mockStore = configureStore([thunk]);

jest.mock('../../../../src/store/slices/outlineSlice', () => ({
  ...jest.requireActual('../../../../src/store/slices/outlineSlice'),
  fetchOutline: jest.fn(() => ({ type: 'outline/fetchOutline/pending' })),
}));

describe('Outline', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      outline: {
        outline: [{ id: 'title', content: 'Title', level: 1 }],
        loading: false,
        error: null,
      },
    });
    store.dispatch = jest.fn();
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

  test('dispatches fetchOutline on mount with correct filePath', () => {
    render(
      <Provider store={store}>
        <Outline filePath="/test.md" onItemClick={() => {}} isOpen={true} onToggle={() => {}} />
      </Provider>
    );
    expect(store.dispatch).toHaveBeenCalledWith(fetchOutline('/test.md'));
  });

  test('dispatches fetchOutline with null when filePath is null', () => {
    render(
      <Provider store={store}>
        <Outline filePath={null} onItemClick={() => {}} isOpen={true} onToggle={() => {}} />
      </Provider>
    );
    expect(store.dispatch).toHaveBeenCalledWith(fetchOutline(null));
  });

  test('calls onItemClick when an outline item is clicked', () => {
    const onItemClickMock = jest.fn();
    render(
      <Provider store={store}>
        <Outline filePath="/test.md" onItemClick={onItemClickMock} isOpen={true} onToggle={() => {}} />
      </Provider>
    );

    fireEvent.click(screen.getByText('Title'));
    expect(onItemClickMock).toHaveBeenCalledWith('title');
  });

  test('displays loading spinner when outline is loading', () => {
    store = mockStore({
      outline: {
        outline: [],
        loading: true,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <Outline filePath="/test.md" onItemClick={() => {}} isOpen={true} onToggle={() => {}} />
      </Provider>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('displays error message when there is an error', () => {
    store = mockStore({
      outline: {
        outline: [],
        loading: false,
        error: 'Failed to load outline',
      },
    });

    render(
      <Provider store={store}>
        <Outline filePath="/test.md" onItemClick={() => {}} isOpen={true} onToggle={() => {}} />
      </Provider>
    );

    expect(screen.getByText('Error: Failed to load outline')).toBeInTheDocument();
  });
});
