import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import OutlineContent from '../../../../src/components/RightPane/OutlineContent';

describe('OutlineContent', () => {
  const mockOutline = [
    { id: 'heading-1', content: 'Heading 1', level: 1 },
    { id: 'subheading-1', content: 'Subheading 1', level: 2 },
    { id: 'heading-2', content: 'Heading 2', level: 1 },
  ];

  test('renders loading spinner when loading is true', () => {
    render(
      <OutlineContent
        outline={[]}
        loading={true}
        error={null}
        onItemClick={jest.fn()}
      />
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders error message when error is present', () => {
    render(
      <OutlineContent
        outline={[]}
        loading={false}
        error="Failed to load outline"
        onItemClick={jest.fn()}
      />
    );
    expect(screen.getByText('Error: Failed to load outline')).toBeInTheDocument();
  });

  test('renders outline items correctly', () => {
    const { asFragment } = render(
      <OutlineContent
        outline={mockOutline}
        loading={false}
        error={null}
        onItemClick={jest.fn()}
      />
    );
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText('Heading 1')).toBeInTheDocument();
    expect(screen.getByText('Subheading 1')).toBeInTheDocument();
    expect(screen.getByText('Heading 2')).toBeInTheDocument();
  });

  test('calls onItemClick when an outline item is clicked', () => {
    const onItemClickMock = jest.fn();
    render(
      <OutlineContent
        outline={mockOutline}
        loading={false}
        error={null}
        onItemClick={onItemClickMock}
      />
    );
    fireEvent.click(screen.getByText('Heading 1'));
    expect(onItemClickMock).toHaveBeenCalledWith('heading-1');
  });

  test('applies correct padding based on item level', () => {
    render(
      <OutlineContent
        outline={mockOutline}
        loading={false}
        error={null}
        onItemClick={jest.fn()}
      />
    );
    const subheadingItem = screen.getByText('Subheading 1').closest('li');
    expect(subheadingItem).toHaveStyle('padding-left: 32px'); // level 2 * 16px (default ListItem padding) = 32px
  });
});
