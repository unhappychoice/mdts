import { renderHook } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { useTheme } from '../../../src/hooks/useTheme';
import { createMockStore } from '../../utils';

describe('useTheme', () => {
  test('should return a light theme when darkMode is false', () => {
    const store = createMockStore({ appSetting: { darkMode: 'light' } });
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });
    expect(result.current.palette.mode).toBe('light');
    expect(result.current.palette.background.default).toBe('#f4f5f7');
    expect(result.current.palette.background.paper).toBe('#ffffff');
  });

  test('should return a dark theme when darkMode is true', () => {
    const store = createMockStore({ appSetting: { darkMode: 'dark' } });
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });
    expect(result.current.palette.mode).toBe('dark');
    expect(result.current.palette.background.default).toBe('#161819');
    expect(result.current.palette.background.paper).toBe('#0f1214');
  });

  test('should return consistent primary colors regardless of mode', () => {
    const lightStore = createMockStore({ appSetting: { darkMode: 'light' } });
    const { result: lightThemeResult } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <Provider store={lightStore}>{children}</Provider>,
    });
    expect(lightThemeResult.current.palette.primary.main).toBe('#1976d2');

    const darkStore = createMockStore({ appSetting: { darkMode: 'dark' } });
    const { result: darkThemeResult } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <Provider store={darkStore}>{children}</Provider>,
    });
    expect(darkThemeResult.current.palette.primary.main).toBe('#1976d2');
  });
});
