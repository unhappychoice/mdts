import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import OutlineHeader from '../../../../src/components/RightPane/OutlineHeader';

describe('OutlineHeader', () => {
  test('renders correctly when open', () => {
    const { asFragment } = render(
      <OutlineHeader isOpen={true} onToggle={jest.fn()} />
    );
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText('Outline')).toBeInTheDocument();
  });

  test('renders correctly when closed', () => {
    const { asFragment } = render(
      <OutlineHeader isOpen={false} onToggle={jest.fn()} />
    );
    expect(asFragment()).toMatchSnapshot();
    expect(screen.queryByText('Outline')).not.toBeInTheDocument();
  });

  test('calls onToggle when toggle button is clicked', () => {
    const onToggleMock = jest.fn();
    render(
      <OutlineHeader isOpen={true} onToggle={onToggleMock} />
    );
    fireEvent.click(screen.getByTestId('ChevronRightIcon'));
    expect(onToggleMock).toHaveBeenCalled();
  });
});
