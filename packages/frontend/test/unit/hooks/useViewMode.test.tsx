import { render } from '@testing-library/react';
import { useSearchParams } from 'react-router-dom';
import { useViewMode } from '../../../src/hooks/useViewMode';
import React from 'react';

// Mock useSearchParams from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: jest.fn(),
}));

describe('useViewMode', () => {
  const mockSetSearchParams = jest.fn();

  beforeEach(() => {
    mockSetSearchParams.mockClear();
  });

  interface TestComponentProps {
    setResult: (result: any) => void;
  }
  const TestComponent = ({ setResult }: TestComponentProps) => {
    const hookResult = useViewMode();
    React.useEffect(() => {
      setResult(hookResult);
    }, [hookResult, setResult]);
    return null;
  };

  test('should return "preview" by default when no tab param is present', () => {
    (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams(), mockSetSearchParams]);
    let hookResult: any;
    render(<TestComponent setResult={(result: any) => (hookResult = result)} />);
    expect(hookResult).toBe('preview');
  });

  test('should return "frontmatter" when tab param is "frontmatter"', () => {
    const params = new URLSearchParams();
    params.set('tab', 'frontmatter');
    (useSearchParams as jest.Mock).mockReturnValue([params, mockSetSearchParams]);
    let hookResult: any;
    render(<TestComponent setResult={(result: any) => (hookResult = result)} />);
    expect(hookResult).toBe('frontmatter');
  });

  test('should return "raw" when tab param is "raw"', () => {
    const params = new URLSearchParams();
    params.set('tab', 'raw');
    (useSearchParams as jest.Mock).mockReturnValue([params, mockSetSearchParams]);
    let hookResult: any;
    render(<TestComponent setResult={(result: any) => (hookResult = result)} />);
    expect(hookResult).toBe('raw');
  });

  test('should return "invalid" when tab param is "invalid"', () => {
    const params = new URLSearchParams();
    params.set('tab', 'invalid');
    (useSearchParams as jest.Mock).mockReturnValue([params, mockSetSearchParams]);
    let hookResult: any;
    render(<TestComponent setResult={(result: any) => (hookResult = result)} />);
    expect(hookResult).toBe('invalid');
  });
});
