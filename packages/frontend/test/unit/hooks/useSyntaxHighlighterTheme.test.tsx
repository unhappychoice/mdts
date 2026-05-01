import { createTheme, ThemeProvider } from '@mui/material/styles';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { atomDark, coy, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useSyntaxHighlighterTheme } from '../../../src/hooks/useSyntaxHighlighterTheme';

const createWrapper = (mode: 'light' | 'dark') => {
  const theme = createTheme({ palette: { mode } });

  function ThemeWrapper({ children }: { children: React.ReactNode }) {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
  }

  return ThemeWrapper;
};

describe('useSyntaxHighlighterTheme', () => {
  test('returns atomDark when auto mode uses a dark palette', () => {
    const { result } = renderHook(() => useSyntaxHighlighterTheme('auto'), {
      wrapper: createWrapper('dark'),
    });

    expect(result.current).toBe(atomDark);
  });

  test('returns vs when auto mode uses a light palette', () => {
    const { result } = renderHook(() => useSyntaxHighlighterTheme('auto'), {
      wrapper: createWrapper('light'),
    });

    expect(result.current).toBe(vs);
  });

  test('returns the selected theme when the name is known', () => {
    const { result } = renderHook(() => useSyntaxHighlighterTheme('coy'), {
      wrapper: createWrapper('light'),
    });

    expect(result.current).toBe(coy);
  });

  test('falls back to atomDark when the theme name is unknown', () => {
    const { result } = renderHook(() => useSyntaxHighlighterTheme('unknown-theme'), {
      wrapper: createWrapper('light'),
    });

    expect(result.current).toBe(atomDark);
  });
});
