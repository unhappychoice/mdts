import { render } from '@testing-library/react';
import React from 'react';
import { OutlineListItem } from '../../../../../src/components/RightPane/OutlineContent/OutlineListItem';

describe('OutlineListItem', () => {
  it('should render correctly', () => {
    const item = { id: '1', level: 1, content: 'Heading 1' };
    const onItemClick = jest.fn();

    const { asFragment } = render(
      <OutlineListItem item={item} onItemClick={onItemClick} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
