import React from 'react';

type AppSetting = {
  darkMode: 'auto' | 'dark' | 'light';
  contentMode: 'compact' | 'full';
  fileTreeOpen: boolean;
  outlineOpen: boolean;
};

type MockStore = {
  getState: jest.Mock;
  subscribe: jest.Mock;
};

const createStore = (appSetting: AppSetting) => {
  let listener: (() => void) | undefined;
  const store: MockStore = {
    getState: jest.fn(() => ({ appSetting })),
    subscribe: jest.fn((callback: () => void) => {
      listener = callback;
      return jest.fn();
    }),
  };

  return { store, trigger: () => listener?.() };
};

const loadEntryPoint = async (store: MockStore) => {
  const render = jest.fn();
  const createRoot = jest.fn(() => ({ render }));

  jest.resetModules();
  document.body.innerHTML = '<div id="root"></div>';

  jest.doMock('react-dom/client', () => ({
    __esModule: true,
    default: { createRoot },
    createRoot,
  }));
  jest.doMock('react-redux', () => ({
    __esModule: true,
    Provider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }));
  jest.doMock('react-router-dom', () => ({
    __esModule: true,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }));
  jest.doMock('../../src/App', () => ({
    __esModule: true,
    default: () => <div>App</div>,
  }));
  jest.doMock('../../src/store/store', () => ({
    __esModule: true,
    store,
  }));

  await jest.isolateModulesAsync(async () => {
    await import('../../src/index');
  });

  return { createRoot, render };
};

describe('index', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    localStorage.clear();
    document.body.innerHTML = '';
  });

  it('renders the app and persists app settings on store updates', async () => {
    const appSetting = {
      darkMode: 'dark',
      contentMode: 'full',
      fileTreeOpen: false,
      outlineOpen: true,
    } as const;
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    const { store, trigger } = createStore(appSetting);
    const { createRoot, render } = await loadEntryPoint(store);

    expect(createRoot).toHaveBeenCalledWith(document.getElementById('root'));
    expect(render).toHaveBeenCalledTimes(1);
    expect(store.subscribe).toHaveBeenCalledWith(expect.any(Function));

    trigger();

    expect(setItemSpy).toHaveBeenCalledWith('appSetting', JSON.stringify(appSetting));
  });

  it('logs an error when app settings cannot be persisted', async () => {
    const error = new Error('save failed');
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw error;
    });
    const { store, trigger } = createStore({
      darkMode: 'light',
      contentMode: 'compact',
      fileTreeOpen: true,
      outlineOpen: false,
    });

    await loadEntryPoint(store);
    trigger();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Could not save state to localStorage', error);
  });
});
