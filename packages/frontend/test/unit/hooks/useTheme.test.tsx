import { render } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { useTheme } from '../../../src/hooks/useTheme';
import React from 'react';

// Mock useSelector from react-redux
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

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
    (useSelector as jest.Mock).mockReturnValue({
      darkMode: false,
    });

    let hookResult: any;
    render(<TestComponent setResult={(result: any) => (hookResult = result)} />);
    expect(hookResult.palette.mode).toBe('light');
    expect(hookResult.palette.background.default).toBe('#f4f5f7');
    expect(hookResult.palette.background.paper).toBe('#ffffff');
  });

  test('should return a dark theme when darkMode is true', () => {
    (useSelector as jest.Mock).mockReturnValue({
      darkMode: true,
    });

    let hookResult: any;
    render(<TestComponent setResult={(result: any) => (hookResult = result)} />);
    expect(hookResult.palette.mode).toBe('dark');
    expect(hookResult.palette.background.default).toBe('#161819');
    expect(hookResult.palette.background.paper).toBe('#0f1214');
  });

  test('should return consistent primary colors regardless of mode', () => {
    (useSelector as jest.Mock).mockReturnValue({
      darkMode: false,
    });
    let lightThemeResult: any;
    render(<TestComponent setResult={(result) => (lightThemeResult = result)} />);
    expect(lightThemeResult.palette.primary.main).toBe('#1976d2');

    (useSelector as jest.Mock).mockReturnValue({
      darkMode: true,
    });
    let darkThemeResult: any;
    render(<TestComponent setResult={(result) => (darkThemeResult = result)} />);
    expect(darkThemeResult.palette.primary.main).toBe('#1976d2');
  });
});
