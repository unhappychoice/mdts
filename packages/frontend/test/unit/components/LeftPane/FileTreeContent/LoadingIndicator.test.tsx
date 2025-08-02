import { render } from '@testing-library/react';
import React from 'react';
import { LoadingIndicator } from '../../../../../src/components/LeftPane/FileTreeContent/LoadingIndicator';

describe('LoadingIndicator', () => {
  it('should render correctly', () => {
    const { asFragment } = render(<LoadingIndicator />);
    expect(asFragment()).toMatchSnapshot();
  });
});
