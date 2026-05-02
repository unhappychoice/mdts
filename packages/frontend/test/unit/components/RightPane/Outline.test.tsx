import { act, render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import useIsMobile from '../../../../src/hooks/useIsMobile';
import Outline from '../../../../src/components/RightPane/Outline';
import { fetchOutline } from '../../../../src/store/slices/outlineSlice';

const mockStore = configureStore([thunk]);

jest.mock('../../../../src/store/slices/outlineSlice', () => ({
  ...jest.requireActual('../../../../src/store/slices/outlineSlice'),
  fetchOutline: jest.fn(() => ({ type: 'outline/fetchOutline/pending' })),
}));

jest.mock('../../../../src/hooks/useIsMobile', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('Outline', () => {
  let store;

  const renderOutline = (props = {}) => render(
    <Provider store={store}>
      <Outline filePath="/test.md" onItemClick={jest.fn()} isOpen={true} onToggle={jest.fn()} {...props} />
    </Provider>
  );

  beforeEach(() => {
    (useIsMobile as jest.Mock).mockReturnValue(false);
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
          <Outline filePath="/test.md" onItemClick={jest.fn()} isOpen={true} onToggle={jest.fn()} />
        </Provider>
      );
      asFragment = f;
    });
    expect(asFragment()).toMatchSnapshot();
  });

  test('dispatches fetchOutline on mount with correct filePath', () => {
    renderOutline();
    expect(store.dispatch).toHaveBeenCalledWith(fetchOutline('/test.md'));
  });

  test('dispatches fetchOutline with null when filePath is null', () => {
    renderOutline({ filePath: null });
    expect(store.dispatch).toHaveBeenCalledWith(fetchOutline(null));
  });

  test('calls onItemClick when an outline item is clicked', () => {
    const onItemClickMock = jest.fn();
    renderOutline({ onItemClick: onItemClickMock });

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

    renderOutline();

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

    renderOutline();

    expect(screen.getByText('Error: Failed to load outline')).toBeInTheDocument();
  });

  test('closes the mobile outline after selecting an item', () => {
    const onItemClickMock = jest.fn();
    const onToggleMock = jest.fn();
    (useIsMobile as jest.Mock).mockReturnValue(true);

    renderOutline({ onItemClick: onItemClickMock, onToggle: onToggleMock });

    fireEvent.click(screen.getByText('Title'));

    expect(onItemClickMock).toHaveBeenCalledWith('title');
    expect(onToggleMock).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Outline')).toBeInTheDocument();
  });

  test('hides outline content when collapsed on desktop', () => {
    renderOutline({ isOpen: false });

    expect(screen.queryByText('Title')).not.toBeInTheDocument();
    expect(screen.queryByText('Outline')).not.toBeInTheDocument();
    expect(screen.getByLabelText('toggle outline')).toBeInTheDocument();
  });
});
