import { render } from '@testing-library/react';
import React from 'react';
import ColorSchemeSettingsTab from '../../../../src/components/SettingsDialog/ColorSchemeSettingsTab';

describe('ColorSchemeSettingsTab', () => {
  it('should render correctly', () => {
    const { asFragment } = render(<ColorSchemeSettingsTab />);
    expect(asFragment()).toMatchSnapshot();
  });
});
