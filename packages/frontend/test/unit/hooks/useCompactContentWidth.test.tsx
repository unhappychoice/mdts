import { act, render, screen } from '@testing-library/react';
import React from 'react';
import useCompactContentWidth from '../../../src/hooks/useCompactContentWidth';
import { COMPACT_CONTENT_WIDTH, measureCompactContentWidth } from '../../../src/hooks/measureCompactContentWidth';

jest.mock('../../../src/hooks/measureCompactContentWidth', () => {
  const actual = jest.requireActual('../../../src/hooks/measureCompactContentWidth');
  return {
    ...actual,
    measureCompactContentWidth: jest.fn(() => 1200),
  };
});

const mockedMeasure = measureCompactContentWidth as jest.MockedFunction<typeof measureCompactContentWidth>;

const Harness: React.FC<{ enabled: boolean; observeKey?: unknown }> = ({ enabled, observeKey = 'doc' }) => {
  const { ref, width } = useCompactContentWidth(enabled, observeKey);
  return (
    <div data-testid="container" ref={ref} data-width={width}>
      content
    </div>
  );
};

describe('useCompactContentWidth', () => {
  beforeEach(() => {
    mockedMeasure.mockClear();
    mockedMeasure.mockReturnValue(1200);
  });

  test('uses the measured width when compact mode is enabled', () => {
    render(<Harness enabled />);
    expect(screen.getByTestId('container')).toHaveAttribute('data-width', '1200');
    expect(mockedMeasure).toHaveBeenCalled();
  });

  test('resets to compact width when disabled', () => {
    const { rerender } = render(<Harness enabled />);
    expect(screen.getByTestId('container')).toHaveAttribute('data-width', '1200');

    rerender(<Harness enabled={false} />);
    expect(screen.getByTestId('container')).toHaveAttribute('data-width', String(COMPACT_CONTENT_WIDTH));
  });

  test('remeasures when observeKey changes', () => {
    const { rerender } = render(<Harness enabled observeKey="one" />);
    expect(mockedMeasure).toHaveBeenCalledTimes(1);

    rerender(<Harness enabled observeKey="two" />);
    expect(mockedMeasure).toHaveBeenCalledTimes(2);
  });

  test('remeasures when the parent size changes', () => {
    let resizeCallback: ResizeObserverCallback = () => undefined;
    const observe = jest.fn();
    const disconnect = jest.fn();
    window.ResizeObserver = jest.fn((callback) => {
      resizeCallback = callback;
      return { observe, unobserve: jest.fn(), disconnect } as unknown as ResizeObserver;
    });

    render(<Harness enabled />);
    expect(mockedMeasure).toHaveBeenCalledTimes(1);

    mockedMeasure.mockReturnValue(1400);
    act(() => {
      resizeCallback([] as unknown as ResizeObserverEntry[], {} as ResizeObserver);
    });

    expect(screen.getByTestId('container')).toHaveAttribute('data-width', '1400');
  });
});
