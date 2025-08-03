import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import AppHeader from '../../../src/components/AppHeader';
import { createMockStore } from '../../utils';

describe('AppHeader', () => {
  let store;

  beforeEach(() => {
    store = createMockStore();
    store.dispatch = jest.fn();
  });

  test('renders correctly', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <AppHeader handleFileSelect={jest.fn()} onSettingsClick={jest.fn()} />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test('calls handleFileSelect when logo is clicked', () => {
    const handleFileSelectMock = jest.fn();
    render(
      <Provider store={store}>
        <AppHeader handleFileSelect={handleFileSelectMock} onSettingsClick={jest.fn()} />
      </Provider>
    );
    fireEvent.click(screen.getByText('mdts'));
    expect(handleFileSelectMock).toHaveBeenCalledWith('');
  });
});
