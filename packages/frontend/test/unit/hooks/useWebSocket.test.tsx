import { render } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { useWebSocket } from '../../../src/hooks/useWebSocket';
import { fetchContent } from '../../../src/store/slices/contentSlice';
import { fetchFileTree } from '../../../src/store/slices/fileTreeSlice';
import { fetchOutline } from '../../../src/store/slices/outlineSlice';
import React from 'react';

// Mock useDispatch
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

// Mock WebSocket
const mockWebSocket = {
  send: jest.fn(),
  close: jest.fn(),
  onmessage: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

Object.defineProperty(window, 'WebSocket', {
  writable: true,
  value: jest.fn(() => mockWebSocket),
});

// Mock Redux thunks
jest.mock('../../../src/store/slices/contentSlice', () => ({
  fetchContent: jest.fn(() => ({ type: 'content/fetchContent' })),
}));
jest.mock('../../../src/store/slices/fileTreeSlice', () => ({
  fetchFileTree: jest.fn(() => ({ type: 'fileTree/fetchFileTree' })),
}));
jest.mock('../../../src/store/slices/outlineSlice', () => ({
  fetchOutline: jest.fn(() => ({ type: 'outline/fetchOutline' })),
}));

describe('useWebSocket', () => {
  let dispatchMock: jest.Mock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    (useDispatch as jest.Mock).mockReturnValue(dispatchMock);
    mockWebSocket.send.mockClear();
    mockWebSocket.close.mockClear();
    mockWebSocket.onmessage = jest.fn(); // Reset onmessage for each test
    mockWebSocket.onopen = jest.fn(); // Reset onopen for each test
    mockWebSocket.onerror = jest.fn(); // Reset onerror for each test
  });

  interface TestComponentProps {
    currentPath: string | null;
  }
  const TestComponent = ({ currentPath }: TestComponentProps) => {
    useWebSocket(currentPath);
    return null;
  };

  test('should establish a WebSocket connection on mount', () => {
    render(<TestComponent currentPath="/test.md" />);
    expect(window.WebSocket).toHaveBeenCalledWith(expect.stringContaining('ws://') || expect.stringContaining('wss://'));
  });

  test('should close the WebSocket connection on unmount', () => {
    const { unmount } = render(<TestComponent currentPath="/test.md" />);
    unmount();
    expect(mockWebSocket.close).toHaveBeenCalledTimes(1);
  });

  test('should send watch-file message on WebSocket open if currentPath exists', () => {
    const currentPath = '/test.md';
    render(<TestComponent currentPath={currentPath} />);
    mockWebSocket.onopen();
    expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify({ type: 'watch-file', filePath: currentPath }));
  });

  test('should not send watch-file message on WebSocket open if currentPath is null', () => {
    render(<TestComponent currentPath={null} />);
    mockWebSocket.onopen();
    expect(mockWebSocket.send).not.toHaveBeenCalled();
  });

  test('should dispatch fetchContent and fetchOutline on reload-content message', () => {
    const currentPath = '/test.md';
    render(<TestComponent currentPath={currentPath} />);

    const messageEvent = new MessageEvent('message', {
      data: JSON.stringify({ type: 'reload-content' }),
    });

    mockWebSocket.onmessage(messageEvent);

    expect(dispatchMock).toHaveBeenCalledWith(fetchContent(currentPath));
    expect(dispatchMock).toHaveBeenCalledWith(fetchOutline(currentPath));
  });

  test('should not dispatch fetchContent or fetchOutline if currentPath is null on reload-content message', () => {
    render(<TestComponent currentPath={null} />);

    const messageEvent = new MessageEvent('message', {
      data: JSON.stringify({ type: 'reload-content' }),
    });

    mockWebSocket.onmessage(messageEvent);

    expect(dispatchMock).not.toHaveBeenCalledWith(fetchContent(expect.any(String)));
    expect(dispatchMock).not.toHaveBeenCalledWith(fetchOutline(expect.any(String)));
  });

  test('should dispatch fetchFileTree on reload-tree message', () => {
    render(<TestComponent currentPath="/test.md" />);

    const messageEvent = new MessageEvent('message', {
      data: JSON.stringify({ type: 'reload-tree' }),
    });

    mockWebSocket.onmessage(messageEvent);

    expect(dispatchMock).toHaveBeenCalledWith(fetchFileTree());
  });

  test('should log error on WebSocket error', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<TestComponent currentPath="/test.md" />);
    const errorEvent = new Event('error');
    mockWebSocket.onerror(errorEvent);
    expect(consoleErrorSpy).toHaveBeenCalledWith('WebSocket error:', errorEvent);
    consoleErrorSpy.mockRestore();
  });

  test('should send watch-file message when currentPath changes', () => {
    const { rerender } = render(<TestComponent currentPath="/initial.md" />);
    mockWebSocket.onopen(); // Simulate connection open
    mockWebSocket.send.mockClear(); // Clear initial send

    rerender(<TestComponent currentPath="/new.md" />);
    expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify({ type: 'watch-file', filePath: '/new.md' }));
  });
});
