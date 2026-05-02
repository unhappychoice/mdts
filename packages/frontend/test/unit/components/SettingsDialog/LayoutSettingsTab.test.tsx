import { fireEvent, render, screen } from '@testing-library/react';
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

  it('calls handleToggleContentMode when selecting another mode', () => {
    const handleToggleContentMode = jest.fn();

    render(
      <LayoutSettingsTab
        contentMode="compact"
        enableBreaks={false}
        handleToggleContentMode={handleToggleContentMode}
        setEnableBreaks={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'full' }));

    expect(handleToggleContentMode).toHaveBeenCalledWith('full');
  });

  it('does not call handleToggleContentMode when the selected mode is clicked again', () => {
    const handleToggleContentMode = jest.fn();

    render(
      <LayoutSettingsTab
        contentMode="compact"
        enableBreaks={false}
        handleToggleContentMode={handleToggleContentMode}
        setEnableBreaks={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'compact' }));

    expect(handleToggleContentMode).not.toHaveBeenCalled();
  });

  it('calls setEnableBreaks with the next checked state', () => {
    const setEnableBreaks = jest.fn();

    render(
      <LayoutSettingsTab
        contentMode="compact"
        enableBreaks={false}
        handleToggleContentMode={jest.fn()}
        setEnableBreaks={setEnableBreaks}
      />
    );

    fireEvent.click(screen.getByRole('switch', { name: 'Enable soft line breaks' }));

    expect(setEnableBreaks).toHaveBeenCalledWith(true);
  });
});
