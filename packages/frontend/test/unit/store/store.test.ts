import { saveAppSetting } from '../../../src/store/slices/appSettingSlice';

type StoreModule = typeof import('../../../src/store/store');
type MatchMediaMock = MediaQueryList & { dispatchChange: (matches: boolean) => void };

const defaultAppSetting = {
  darkMode: 'auto',
  contentMode: 'compact',
  fileTreeOpen: true,
  outlineOpen: true,
} as const;

const importStoreModule = async (): Promise<StoreModule> => {
  jest.resetModules();
  return import('../../../src/store/store');
};

const createMatchMedia = (initialMatches: boolean): MatchMediaMock => {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const mediaQueryList = {
    matches: initialMatches,
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addEventListener: jest.fn((event: string, listener: EventListenerOrEventListenerObject) => {
      if (event === 'change' && typeof listener === 'function') listeners.add(listener);
    }),
    removeEventListener: jest.fn((event: string, listener: EventListenerOrEventListenerObject) => {
      if (event === 'change' && typeof listener === 'function') listeners.delete(listener);
    }),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dispatchEvent: jest.fn(),
    dispatchChange: (matches: boolean) => {
      mediaQueryList.matches = matches;
      [...listeners].map((listener) => listener({ matches } as MediaQueryListEvent));
    },
  };

  return mediaQueryList as MatchMediaMock;
};

describe('store', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    localStorage.clear();
    document.body.removeAttribute('data-theme');
  });

  it('uses the default app setting when localStorage is empty', async () => {
    const { store } = await importStoreModule();

    expect(store.getState().appSetting).toEqual(defaultAppSetting);
  });

  it('loads persisted app settings from localStorage', async () => {
    localStorage.setItem('appSetting', JSON.stringify({
      darkMode: 'light',
      contentMode: 'full',
      fileTreeOpen: false,
      outlineOpen: false,
    }));

    const { store } = await importStoreModule();

    expect(store.getState().appSetting).toEqual({
      darkMode: 'light',
      contentMode: 'full',
      fileTreeOpen: false,
      outlineOpen: false,
    });
  });

  it('falls back to the default app setting when localStorage read fails', async () => {
    const error = new Error('localStorage read failed');
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw error;
    });

    const { store } = await importStoreModule();

    expect(store.getState().appSetting).toEqual(defaultAppSetting);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Could not load state from localStorage', error);
  });

  it('applies explicit and auto themes when app settings change', async () => {
    const matchMedia = createMatchMedia(false);
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockReturnValue(matchMedia),
    });

    const { store } = await importStoreModule();

    store.dispatch(saveAppSetting({ darkMode: 'dark', contentMode: 'compact' }));
    expect(document.body).toHaveAttribute('data-theme', 'dark');

    store.dispatch(saveAppSetting({ darkMode: 'auto', contentMode: 'compact' }));
    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    expect(document.body).toHaveAttribute('data-theme', 'light');

    matchMedia.dispatchChange(true);
    expect(document.body).toHaveAttribute('data-theme', 'dark');
    expect(matchMedia.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });
});
