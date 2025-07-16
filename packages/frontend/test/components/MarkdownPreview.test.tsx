import React from 'react';
import { render } from '@testing-library/react';
import MarkdownPreview from '../../src/components/MarkdownPreview';

describe('MarkdownPreview', () => {
  test('renders correctly', () => {
    const { asFragment } = render(<MarkdownPreview content="# Hello" />);
    expect(asFragment()).toMatchSnapshot();
  });
});
