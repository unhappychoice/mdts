import React from 'react';
import { render, act } from '@testing-library/react';
import Outline from '../../src/components/Outline';

jest.mock('../../src/hooks/apis/useOutline', () => ({
  useOutline: () => ({
    outline: [{ depth: 1, value: 'Title' }],
    loading: false,
    error: null,
  }),
}));

describe('Outline', () => {
  test('renders correctly', async () => {
    let asFragment;
    await act(async () => {
      const { asFragment: f } = render(<Outline />);
      asFragment = f;
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
