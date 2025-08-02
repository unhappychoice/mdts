import { render } from '@testing-library/react';
import React from 'react';
import TabPanel from '../../../../src/components/SettingsDialog/TabPanel';

describe('TabPanel', () => {
  it('should render correctly', () => {
    const { asFragment } = render(<TabPanel value={0} index={0}>Test Content</TabPanel>);
    expect(asFragment()).toMatchSnapshot();
  });
});
