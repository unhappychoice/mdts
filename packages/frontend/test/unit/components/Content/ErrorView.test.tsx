import { render, screen } from '@testing-library/react';
import React from 'react';
import ErrorView from '../../../../src/components/ErrorView';

describe('ErrorView', () => {
  test('renders nothing when error is null', () => {
    const { container } = render(<ErrorView error={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  test('renders nothing when error is an empty string', () => {
    const { container } = render(<ErrorView error="" />);
    expect(container).toBeEmptyDOMElement();
  });

  test('renders error message correctly', () => {
    render(<ErrorView error="Something went wrong" />);
    expect(screen.getByText('Error: Something went wrong')).toBeInTheDocument();
  });

  test('renders "Not Found" for 404 errors', () => {
    render(<ErrorView error="HTTP error! status: 404" />);
    expect(screen.getByText('Not Found')).toBeInTheDocument();
  });

  test('renders snapshot correctly with an error', () => {
    const { asFragment } = render(<ErrorView error="Test error message" />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('renders snapshot correctly with 404 error', () => {
    const { asFragment } = render(<ErrorView error="HTTP error! status: 404" />);
    expect(asFragment()).toMatchSnapshot();
  });
});
