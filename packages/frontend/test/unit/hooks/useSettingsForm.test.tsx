import { act, renderHook } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { WEB_SAFE_FONTS, WEB_SAFE_MONOSPACE_FONTS } from '../../../src/constants';
import { useSettingsForm } from '../../../src/hooks/useSettingsForm';
import { createMockStore } from '../../utils';

describe('useSettingsForm', () => {
  const renderUseSettingsForm = () => {
    const store = createMockStore({
      config: {
        theme: 'default',
        fontFamily: 'Custom Sans',
        fontFamilyMonospace: 'Custom Mono',
      },
    });

    return renderHook(() => useSettingsForm(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });
  };

  test('updates the theme and resets custom fonts when select mode is chosen', () => {
    const { result } = renderUseSettingsForm();

    act(() => {
      result.current.handleToggleTheme('aurora');
      result.current.handleFontInputModeChange({} as React.MouseEvent<HTMLElement>, 'select');
      result.current.handleFontInputModeMonospaceChange({} as React.MouseEvent<HTMLElement>, 'select');
    });

    expect(result.current.themeType).toBe('aurora');
    expect(result.current.fontInputMode).toBe('select');
    expect(result.current.fontFamily).toBe(WEB_SAFE_FONTS[0]);
    expect(result.current.fontInputModeMonospace).toBe('select');
    expect(result.current.fontFamilyMonospace).toBe(WEB_SAFE_MONOSPACE_FONTS[0]);
  });
});
