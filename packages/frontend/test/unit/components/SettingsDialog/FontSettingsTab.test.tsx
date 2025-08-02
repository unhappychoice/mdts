import { render } from '@testing-library/react';
import React from 'react';
import FontSettingsTab from '../../../../src/components/SettingsDialog/FontSettingsTab';

describe('FontSettingsTab', () => {
  it('should render correctly', () => {
    const { asFragment } = render(<FontSettingsTab />);
    expect(asFragment()).toMatchSnapshot();
  });
});
