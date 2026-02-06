import { render } from '@testing-library/react';
import React from 'react';
import LayoutSettingsTab from '../../../../src/components/SettingsDialog/LayoutSettingsTab';

describe('LayoutSettingsTab', () => {
  it('should render correctly', () => {
    const { asFragment } = render(
      <LayoutSettingsTab
        contentMode="compact"
        enableBreaks={false}
        handleToggleContentMode={jest.fn()}
        setEnableBreaks={jest.fn()}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
