import { render } from '@testing-library/react';
import React from 'react';
import { OutlineList } from '../../../../../src/components/RightPane/OutlineContent/OutlineList';

describe('OutlineList', () => {
  it('should render correctly', () => {
    const outline = [
      { id: '1', level: 1, content: 'Heading 1' },
      { id: '2', level: 2, content: 'Heading 2' },
    ];
    const onItemClick = jest.fn();

    const { asFragment } = render(
      <OutlineList outline={outline} onItemClick={onItemClick} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
