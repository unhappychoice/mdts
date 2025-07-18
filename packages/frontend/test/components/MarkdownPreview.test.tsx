import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MarkdownPreview from '../../src/components/MarkdownPreview';

describe('MarkdownPreview', () => {
  test('renders correctly', () => {
    const { asFragment } = render(
      <BrowserRouter>
        <MarkdownPreview content="# Hello" selectedFilePath={null} />
      </BrowserRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
