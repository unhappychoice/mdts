import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import BreadCrumb from '../../../../src/components/Content/BreadCrumb';

const mockStore = configureStore([]);

describe('BreadCrumb', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      history: {
        currentPath: '',
      },
    });
  });

  test('renders nothing when currentPath is empty', () => {
    const { asFragment } = render(
      <Provider store={store}>
        <BreadCrumb />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test('renders breadcrumbs for a file path', () => {
    store = mockStore({
      history: {
        currentPath: 'folder1/subfolder/file.md',
      },
    });
    const { asFragment } = render(
      <Provider store={store}>
        <BreadCrumb />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText('folder1')).toBeInTheDocument();
    expect(screen.getByText('subfolder')).toBeInTheDocument();
    expect(screen.getByText('file.md')).toBeInTheDocument();
  });

  test('renders breadcrumbs for a directory path', () => {
    store = mockStore({
      history: {
        currentPath: 'folder1/subfolder',
      },
    });
    const { asFragment } = render(
      <Provider store={store}>
        <BreadCrumb />
      </Provider>
    );
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText('folder1')).toBeInTheDocument();
    expect(screen.getByText('subfolder')).toBeInTheDocument();
  });

  test('calls onDirectorySelect when a directory link is clicked', () => {
    const onDirectorySelectMock = jest.fn();
    store = mockStore({
      history: {
        currentPath: 'folder1/subfolder/file.md',
      },
    });
    render(
      <Provider store={store}>
        <BreadCrumb onDirectorySelect={onDirectorySelectMock} />
      </Provider>
    );

    fireEvent.click(screen.getByText('folder1'));
    expect(onDirectorySelectMock).toHaveBeenCalledWith('folder1');

    fireEvent.click(screen.getByText('subfolder'));
    expect(onDirectorySelectMock).toHaveBeenCalledWith('folder1/subfolder');
  });
});
