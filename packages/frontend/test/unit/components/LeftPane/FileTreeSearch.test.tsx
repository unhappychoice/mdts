import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import FileTreeSearch from '../../../../src/components/LeftPane/FileTreeSearch';

describe('FileTreeSearch', () => {
  test('renders correctly with empty search query', () => {
    const { asFragment } = render(
      <FileTreeSearch searchQuery="" onSearchChange={jest.fn()} onClearSearch={jest.fn()} />
    );
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByPlaceholderText('Search files...')).toBeInTheDocument();
    expect(screen.queryByLabelText('clear search')).not.toBeInTheDocument();
  });

  test('renders correctly with a search query', () => {
    const { asFragment } = render(
      <FileTreeSearch searchQuery="test" onSearchChange={jest.fn()} onClearSearch={jest.fn()} />
    );
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByDisplayValue('test')).toBeInTheDocument();
    expect(screen.getByLabelText('clear search')).toBeInTheDocument();
  });

  test('calls onSearchChange when input value changes', () => {
    const onSearchChangeMock = jest.fn();
    render(
      <FileTreeSearch searchQuery="" onSearchChange={onSearchChangeMock} onClearSearch={jest.fn()} />
    );
    fireEvent.change(screen.getByPlaceholderText('Search files...'), { target: { value: 'new query' } });
    expect(onSearchChangeMock).toHaveBeenCalledWith(expect.any(Object));
  });

  test('calls onClearSearch when clear button is clicked', () => {
    const onClearSearchMock = jest.fn();
    render(
      <FileTreeSearch searchQuery="test" onSearchChange={jest.fn()} onClearSearch={onClearSearchMock} />
    );
    fireEvent.click(screen.getByLabelText('clear search'));
    expect(onClearSearchMock).toHaveBeenCalled();
  });
});
