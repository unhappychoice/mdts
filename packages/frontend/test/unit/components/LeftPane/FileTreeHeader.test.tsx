import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import FileTreeHeader from '../../../../src/components/LeftPane/FileTreeHeader';

describe('FileTreeHeader', () => {
  test('renders correctly when open', () => {
    const { asFragment } = render(
      <FileTreeHeader
        isOpen={true}
        onToggle={jest.fn()}
        onExpandAllClick={jest.fn()}
        onCollapseAll={jest.fn()}
      />
    );
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText('File Tree')).toBeInTheDocument();
    expect(screen.getByLabelText('expand all')).toBeInTheDocument();
    expect(screen.getByLabelText('collapse all')).toBeInTheDocument();
  });

  test('renders correctly when closed', () => {
    const { asFragment } = render(
      <FileTreeHeader
        isOpen={false}
        onToggle={jest.fn()}
        onExpandAllClick={jest.fn()}
        onCollapseAll={jest.fn()}
      />
    );
    expect(asFragment()).toMatchSnapshot();
    expect(screen.queryByText('File Tree')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('expand all')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('collapse all')).not.toBeInTheDocument();
  });

  test('calls onToggle when toggle button is clicked', () => {
    const onToggleMock = jest.fn();
    render(
      <FileTreeHeader
        isOpen={true}
        onToggle={onToggleMock}
        onExpandAllClick={jest.fn()}
        onCollapseAll={jest.fn()}
      />
    );
    fireEvent.click(screen.getByTestId('ChevronLeftIcon'));
    expect(onToggleMock).toHaveBeenCalled();
  });

  test('calls onExpandAllClick when expand all button is clicked', () => {
    const onExpandAllClickMock = jest.fn();
    render(
      <FileTreeHeader
        isOpen={true}
        onToggle={jest.fn()}
        onExpandAllClick={onExpandAllClickMock}
        onCollapseAll={jest.fn()}
      />
    );
    fireEvent.click(screen.getByLabelText('expand all'));
    expect(onExpandAllClickMock).toHaveBeenCalled();
  });

  test('calls onCollapseAll when collapse all button is clicked', () => {
    const onCollapseAllMock = jest.fn();
    render(
      <FileTreeHeader
        isOpen={true}
        onToggle={jest.fn()}
        onExpandAllClick={jest.fn()}
        onCollapseAll={onCollapseAllMock}
      />
    );
    fireEvent.click(screen.getByLabelText('collapse all'));
    expect(onCollapseAllMock).toHaveBeenCalled();
  });
});
