import appSettingReducer, {
  saveAppSetting,
  toggleFileTree,
  toggleOutline,
} from '../../../src/store/slices/appSettingSlice';

describe('appSettingSlice', () => {
  it('should return the initial state', () => {
    expect(appSettingReducer(undefined, { type: '' })).toEqual({
      darkMode: 'auto',
      contentMode: 'compact',
      fileTreeOpen: true,
      outlineOpen: true,
    });
  });

  it('should handle saveAppSetting', () => {
    const previousState = {
      darkMode: 'auto',
      contentMode: 'compact',
      fileTreeOpen: true,
      outlineOpen: true,
    };
    expect(
      appSettingReducer(
        previousState,
        saveAppSetting({ darkMode: 'dark', contentMode: 'full' }),
      ),
    ).toEqual({
      darkMode: 'dark',
      contentMode: 'full',
      fileTreeOpen: true,
      outlineOpen: true,
    });
  });

  it('should handle toggleFileTree', () => {
    const previousState = {
      darkMode: 'auto',
      contentMode: 'compact',
      fileTreeOpen: true,
      outlineOpen: true,
    };
    expect(appSettingReducer(previousState, toggleFileTree())).toEqual({
      darkMode: 'auto',
      contentMode: 'compact',
      fileTreeOpen: false,
      outlineOpen: true,
    });
  });

  it('should handle toggleOutline', () => {
    const previousState = {
      darkMode: 'auto',
      contentMode: 'compact',
      fileTreeOpen: true,
      outlineOpen: true,
    };
    expect(appSettingReducer(previousState, toggleOutline())).toEqual({
      darkMode: 'auto',
      contentMode: 'compact',
      fileTreeOpen: true,
      outlineOpen: false,
    });
  });
});
