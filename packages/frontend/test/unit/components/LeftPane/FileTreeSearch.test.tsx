import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import FileTreeSearch from '../../../../src/components/LeftPane/FileTreeSearch';

const mockStore = configureStore([thunk]);

const renderWithProvider = (searchQuery: string, searchMode: 'filename' | 'content' = 'filename') => {
  const store = mockStore({
    fileTree: {
      searchMode,
    },
  });
  const onSearchChange = jest.fn();
  const onClearSearch = jest.fn();

  return {
    ...render(
      <Provider store={store}>
        <FileTreeSearch 
          searchQuery={searchQuery} 
          onSearchChange={onSearchChange} 
          onClearSearch={onClearSearch} 
        />
      </Provider>
    ),
    store,
    onSearchChange,
    onClearSearch,
  };
};

describe('FileTreeSearch', () => {
  test('renders correctly with empty search query', () => {
    const { asFragment } = renderWithProvider('');
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByPlaceholderText('Search files...')).toBeInTheDocument();
    expect(screen.queryByLabelText('clear search')).not.toBeInTheDocument();
  });

  test('renders correctly with a search query', () => {
    const { asFragment } = renderWithProvider('test');
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByDisplayValue('test')).toBeInTheDocument();
    expect(screen.getByLabelText('clear search')).toBeInTheDocument();
  });

  test('calls onSearchChange when input value changes', () => {
    const { onSearchChange } = renderWithProvider('');
    fireEvent.change(screen.getByPlaceholderText('Search files...'), { target: { value: 'new query' } });
    expect(onSearchChange).toHaveBeenCalled();
  });

  test('calls onClearSearch when clear button is clicked', () => {
    const { onClearSearch } = renderWithProvider('test');
    fireEvent.click(screen.getByLabelText('clear search'));
    expect(onClearSearch).toHaveBeenCalled();
  });

  test('displays correct placeholder and aria-label for filename mode', () => {
    renderWithProvider('', 'filename');
    expect(screen.getByPlaceholderText('Search files...')).toBeInTheDocument();
    expect(screen.getByLabelText('search files')).toBeInTheDocument();
  });

  test('displays correct placeholder and aria-label for content mode', () => {
    renderWithProvider('', 'content');
    expect(screen.getByPlaceholderText('Search content...')).toBeInTheDocument();
    expect(screen.getByLabelText('search content')).toBeInTheDocument();
  });

  test('displays correct aria-label for toggle search mode button', () => {
    const { rerender } = renderWithProvider('', 'filename');
    expect(screen.getByLabelText('switch to content search')).toBeInTheDocument();

    const store = mockStore({
      fileTree: {
        searchMode: 'content',
      },
    });
    rerender(
      <Provider store={store}>
        <FileTreeSearch searchQuery="" onSearchChange={jest.fn()} onClearSearch={jest.fn()} />
      </Provider>
    );
    expect(screen.getByLabelText('switch to filename search')).toBeInTheDocument();
  });
});
