import { createTheme } from '@mui/material';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import App from '../../src/App';
import { saveAppSetting } from '../../src/store/slices/appSettingSlice';
import { fetchConfig } from '../../src/store/slices/configSlice';
import { fetchFileTree } from '../../src/store/slices/fileTreeSlice';
import { updateHistoryFromLocation } from '../../src/store/slices/historySlice';
import { useTheme } from '../../src/hooks/useTheme';
import { useWebSocket } from '../../src/hooks/useWebSocket';
import { createMockStore } from '../utils';

const mockUseLocation = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => mockUseLocation(),
}));

jest.mock('../../src/hooks/useTheme', () => ({
  useTheme: jest.fn(),
}));

jest.mock('../../src/hooks/useWebSocket', () => ({
  useWebSocket: jest.fn(),
}));

jest.mock('../../src/Layout', () => ({
  __esModule: true,
  default: ({ onSettingsClick }: { onSettingsClick: () => void }) => (
    <button type="button" onClick={onSettingsClick}>
      open settings
    </button>
  ),
}));

jest.mock('../../src/components/SettingsDialog/SettingsDialog', () => ({
  __esModule: true,
  default: ({ open, onClose }: { open: boolean; onClose: () => void }) => (
    <div>
      <span data-testid="settings-dialog">{open ? 'open' : 'closed'}</span>
      <button type="button" onClick={onClose}>
        close settings
      </button>
    </div>
  ),
}));

jest.mock('../../src/store/slices/configSlice', () => ({
  fetchConfig: jest.fn(() => ({ type: 'config/fetchConfig/mock' })),
}));

jest.mock('../../src/store/slices/fileTreeSlice', () => ({
  fetchFileTree: jest.fn(() => ({ type: 'fileTree/fetchFileTree/mock' })),
}));

jest.mock('../../src/store/slices/historySlice', () => ({
  updateHistoryFromLocation: jest.fn((pathname: string) => ({
    type: 'history/updateHistoryFromLocation/mock',
    payload: pathname,
  })),
}));

describe('App behavior', () => {
  const mockedUseTheme = useTheme as jest.MockedFunction<typeof useTheme>;
  const mockedUseWebSocket = useWebSocket as jest.MockedFunction<typeof useWebSocket>;
  const mockedFetchConfig = fetchConfig as jest.MockedFunction<typeof fetchConfig>;
  const mockedFetchFileTree = fetchFileTree as jest.MockedFunction<typeof fetchFileTree>;
  const mockedUpdateHistoryFromLocation =
    updateHistoryFromLocation as jest.MockedFunction<typeof updateHistoryFromLocation>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocation.mockReturnValue({ pathname: '/docs/readme.md' });
    mockedUseTheme.mockReturnValue(createTheme());
  });

  const renderApp = (initialState = {}) => {
    const store = createMockStore(initialState);

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    return store;
  };

  test('opens and closes the settings dialog from layout actions', () => {
    renderApp();

    expect(screen.getByTestId('settings-dialog')).toHaveTextContent('closed');

    fireEvent.click(screen.getByRole('button', { name: 'open settings' }));
    expect(screen.getByTestId('settings-dialog')).toHaveTextContent('open');

    fireEvent.click(screen.getByRole('button', { name: 'close settings' }));
    expect(screen.getByTestId('settings-dialog')).toHaveTextContent('closed');
  });

  test('dispatches fallback settings when dark mode is invalid', () => {
    const store = renderApp({
      appSetting: {
        darkMode: 'broken',
        contentMode: 'full',
      },
      config: {
        fontSize: 15,
      },
      history: {
        currentPath: '/docs/readme.md',
      },
    });

    expect(mockedUseWebSocket).toHaveBeenCalledWith('/docs/readme.md');
    expect(mockedFetchFileTree).toHaveBeenCalledTimes(1);
    expect(mockedFetchConfig).toHaveBeenCalledTimes(1);
    expect(mockedUpdateHistoryFromLocation).toHaveBeenCalledWith('/docs/readme.md');
    expect(document.documentElement.style.fontSize).toBe('17px');

    expect(store.getActions()).toContainEqual(
      saveAppSetting({ darkMode: 'auto', contentMode: 'compact' })
    );
  });
});
