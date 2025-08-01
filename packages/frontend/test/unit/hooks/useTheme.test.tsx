import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useTheme } from '../../../src/hooks/useTheme';
import React from 'react';
import { createMockStore } from '../../utils';

describe('useTheme', () => {
  interface TestComponentProps {
    setResult: (result: any) => void;
  }
  const TestComponent = ({ setResult }: TestComponentProps) => {
    const hookResult = useTheme();
    React.useEffect(() => {
      setResult(hookResult);
    }, [hookResult, setResult]);
    return null;
  };

  test('should return a light theme when darkMode is false', () => {
    const store = createMockStore({ appSetting: { darkMode: 'light' } });

    let hookResult: any;
    render(
      <Provider store={store}>
        <TestComponent setResult={(result: any) => (hookResult = result)} />
      </Provider>
    );
    expect(hookResult.palette.mode).toBe('light');
    expect(hookResult.palette.background.default).toBe('#f4f5f7');
    expect(hookResult.palette.background.paper).toBe('#ffffff');
  });

  test('should return a dark theme when darkMode is true', () => {
    const store = createMockStore({ appSetting: { darkMode: 'dark' } });

    let hookResult: any;
    render(
      <Provider store={store}>
        <TestComponent setResult={(result: any) => (hookResult = result)} />
      </Provider>
    );
    expect(hookResult.palette.mode).toBe('dark');
    expect(hookResult.palette.background.default).toBe('#161819');
    expect(hookResult.palette.background.paper).toBe('#0f1214');
  });

  test('should return consistent primary colors regardless of mode', () => {
    const lightStore = createMockStore({ appSetting: { darkMode: 'light' } });
    let lightThemeResult: any;
    render(
      <Provider store={lightStore}>
        <TestComponent setResult={(result) => (lightThemeResult = result)} />
      </Provider>
    );
    expect(lightThemeResult.palette.primary.main).toBe('#1976d2');

    const darkStore = createMockStore({ appSetting: { darkMode: 'dark' } });
    let darkThemeResult: any;
    render(
      <Provider store={darkStore}>
        <TestComponent setResult={(result) => (darkThemeResult = result)} />
      </Provider>
    );
    expect(darkThemeResult.palette.primary.main).toBe('#1976d2');
  });
});
