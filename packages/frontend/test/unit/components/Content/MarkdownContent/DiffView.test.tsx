import { render, screen } from '@testing-library/react';
import React from 'react';
import DiffView from '../../../../../src/components/Content/MarkdownContent/DiffView';

describe('DiffView', () => {
  test('renders empty message when diff is empty', () => {
    render(<DiffView diff="" emptyMessage="No changes" />);
    expect(screen.getByText('No changes')).toBeInTheDocument();
  });

  test('renders diff content with added lines', () => {
    const diff = '+added line';
    render(<DiffView diff={diff} emptyMessage="No changes" />);
    expect(screen.getByText('+added line')).toBeInTheDocument();
  });

  test('renders diff content with removed lines', () => {
    const diff = '-removed line';
    render(<DiffView diff={diff} emptyMessage="No changes" />);
    expect(screen.getByText('-removed line')).toBeInTheDocument();
  });

  test('renders diff content with hunk headers', () => {
    const diff = '@@ -1,3 +1,3 @@';
    render(<DiffView diff={diff} emptyMessage="No changes" />);
    expect(screen.getByText('@@ -1,3 +1,3 @@')).toBeInTheDocument();
  });

  test('renders multi-line diff', () => {
    const diff = '--- a/test.md\n+++ b/test.md\n@@ -1 +1 @@\n-old\n+new';
    render(<DiffView diff={diff} emptyMessage="No changes" />);
    expect(screen.getByText('--- a/test.md')).toBeInTheDocument();
    expect(screen.getByText('+++ b/test.md')).toBeInTheDocument();
    expect(screen.getByText('-old')).toBeInTheDocument();
    expect(screen.getByText('+new')).toBeInTheDocument();
  });

  test('renders snapshot correctly', () => {
    const { asFragment } = render(<DiffView diff="+added" emptyMessage="No changes" />);
    expect(asFragment()).toMatchSnapshot();
  });
});
