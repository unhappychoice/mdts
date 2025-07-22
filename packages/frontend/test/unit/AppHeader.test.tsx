import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import AppHeader from '../../src/components/AppHeader';
import { toggleContentMode, toggleDarkMode } from '../../src/store/slices/appSettingSlice';

const mockStore = configureStore([]);

jest.mock('../../src/store/slices/appSettingSlice', () => ({
  ...jest.requireActual('../../src/store/slices/appSettingSlice'),
  toggleContentMode: jest.fn(() => ({ type: 'appSetting/toggleContentMode' })),
  toggleDarkMode: jest.fn(() => ({ type: 'appSetting/toggleDarkMode' })),
}));

describe('AppHeader', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      appSetting: {
        darkMode: false,
        contentMode: 'fixed',
      },
    });
    store.dispatch = jest.fn();
  });

  test('renders correctly', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <AppHeader darkMode={false} contentMode="fixed" handleFileSelect={jest.fn()} />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test('calls handleFileSelect when logo is clicked', () => {
    const handleFileSelectMock = jest.fn();
    render(
      <Provider store={store}>
        <AppHeader darkMode={false} contentMode="fixed" handleFileSelect={handleFileSelectMock} />
      </Provider>
    );
    fireEvent.click(screen.getByAltText('mdts logo'));
    expect(handleFileSelectMock).toHaveBeenCalledWith('');
  });

  test('dispatches toggleContentMode when content mode button is clicked', () => {
    render(
      <Provider store={store}>
        <AppHeader darkMode={false} contentMode="fixed" handleFileSelect={jest.fn()} />
      </Provider>
    );
    fireEvent.click(screen.getByTestId('CropFreeIcon'));
    expect(store.dispatch).toHaveBeenCalledWith(toggleContentMode());
  });

  test('dispatches toggleDarkMode when dark mode button is clicked', () => {
    render(
      <Provider store={store}>
        <AppHeader darkMode={false} contentMode="fixed" handleFileSelect={jest.fn()} />
      </Provider>
    );
    fireEvent.click(screen.getByTestId('Brightness4Icon'));
    expect(store.dispatch).toHaveBeenCalledWith(toggleDarkMode());
  });
});
