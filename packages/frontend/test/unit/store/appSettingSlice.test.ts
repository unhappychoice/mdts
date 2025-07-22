import appSettingReducer, {
  toggleContentMode,
  toggleDarkMode,
  toggleFileTree,
  toggleOutline,
} from '../../../src/store/slices/appSettingSlice';

describe('appSettingSlice', () => {
  it('should return the initial state', () => {
    expect(appSettingReducer(undefined, { type: '' })).toEqual({
      darkMode: true,
      contentMode: 'fixed',
      fileTreeOpen: true,
      outlineOpen: true,
    });
  });

  it('should handle toggleDarkMode', () => {
    const previousState = {
      darkMode: true,
      contentMode: 'fixed',
      fileTreeOpen: true,
      outlineOpen: true,
    };
    expect(appSettingReducer(previousState, toggleDarkMode())).toEqual({
      darkMode: false,
      contentMode: 'fixed',
      fileTreeOpen: true,
      outlineOpen: true,
    });
  });

  it('should handle toggleContentMode', () => {
    const previousState = {
      darkMode: true,
      contentMode: 'fixed',
      fileTreeOpen: true,
      outlineOpen: true,
    };
    expect(appSettingReducer(previousState, toggleContentMode())).toEqual({
      darkMode: true,
      contentMode: 'full',
      fileTreeOpen: true,
      outlineOpen: true,
    });
  });

  it('should handle toggleFileTree', () => {
    const previousState = {
      darkMode: true,
      contentMode: 'fixed',
      fileTreeOpen: true,
      outlineOpen: true,
    };
    expect(appSettingReducer(previousState, toggleFileTree())).toEqual({
      darkMode: true,
      contentMode: 'fixed',
      fileTreeOpen: false,
      outlineOpen: true,
    });
  });

  it('should handle toggleOutline', () => {
    const previousState = {
      darkMode: true,
      contentMode: 'fixed',
      fileTreeOpen: true,
      outlineOpen: true,
    };
    expect(appSettingReducer(previousState, toggleOutline())).toEqual({
      darkMode: true,
      contentMode: 'fixed',
      fileTreeOpen: true,
      outlineOpen: false,
    });
  });
});
