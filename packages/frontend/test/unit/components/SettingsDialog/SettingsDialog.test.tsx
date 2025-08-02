import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { within } from '@testing-library/dom';
import React from 'react';
import { Provider } from 'react-redux';
import SettingsDialog from '../../../../src/components/SettingsDialog/SettingsDialog';
import { saveAppSetting } from '../../../../src/store/slices/appSettingSlice';
import { saveConfigToBackend } from '../../../../src/store/slices/configSlice';
import { createMockStore } from '../../../utils';

jest.mock('../../../../src/store/slices/appSettingSlice', () => ({
  ...jest.requireActual('../../../../src/store/slices/appSettingSlice'),
  saveAppSetting: jest.fn(() => ({ type: 'appSetting/saveAppSetting' })),
}));

jest.mock('../../../../src/store/slices/configSlice', () => ({
  ...jest.requireActual('../../../../src/store/slices/configSlice'),
  saveConfigToBackend: jest.fn(() => ({ type: 'config/saveConfigToBackend' })),
}));

describe('SettingsDialog', () => {
  let store;

  beforeEach(() => {
    store = createMockStore();
    store.dispatch = jest.fn();
  });

  const renderComponent = (open: boolean, onClose: () => void) => {
    return render(
      <Provider store={store}>
        <SettingsDialog open={open} onClose={onClose} />
      </Provider>,
    );
  };

  test('renders correctly when open', () => {
    const onClose = jest.fn();
    const { asFragment } = renderComponent(true, onClose);
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText('Appearance Settings')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    const onClose = jest.fn();
    const { queryByText } = renderComponent(false, onClose);
    expect(queryByText('Appearance Settings')).not.toBeInTheDocument();
  });

  test('dispatches saveAppSetting and saveConfigToBackend on Save button click', async () => {
    const onClose = jest.fn();
    renderComponent(true, onClose);

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(saveAppSetting).toHaveBeenCalledWith({ darkMode: 'dark', contentMode: 'compact' });
      expect(saveConfigToBackend).toHaveBeenCalledWith({ fontFamily: 'Roboto', fontFamilyMonospace: 'monospace', fontSize: 14, syntaxHighlighterTheme: 'atom-dark' });
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  test('resets state and closes on Cancel button click', async () => {
    const onClose = jest.fn();
    renderComponent(true, onClose);

    // Change some settings
    fireEvent.click(screen.getByLabelText('full')); // Change content mode
    fireEvent.click(screen.getByRole('tab', { name: 'Color Scheme' }));
    await waitFor(() => {
      fireEvent.click(screen.getByLabelText('dark')); // Change dark mode
    });
    fireEvent.click(screen.getByRole('tab', { name: 'Font' })); // Select Font tab
    fireEvent.change(screen.getByRole('slider', { name: 'Font Size' }), { target: { value: 18 } }); // Change font size

    fireEvent.click(screen.getByText('Cancel'));

    expect(onClose).toHaveBeenCalledTimes(1);
    // Verify state is reset by checking if save was not called with changed values
    fireEvent.click(screen.getByText('Save')); // Try to save after cancel
    expect(saveAppSetting).toHaveBeenCalledWith({ darkMode: 'dark', contentMode: 'compact' });
    expect(saveConfigToBackend).toHaveBeenCalledWith({ fontFamily: 'Roboto', fontFamilyMonospace: 'monospace', fontSize: 14, syntaxHighlighterTheme: 'atom-dark' });
  });

  test('resets to default settings on Reset to Default button click', async () => {
    const onClose = jest.fn();
    renderComponent(true, onClose);

    // Change some settings
    fireEvent.click(screen.getByLabelText('full')); // Change content mode
    fireEvent.click(screen.getByRole('tab', { name: 'Color Scheme' }));
    await waitFor(() => {
      fireEvent.click(screen.getByLabelText('dark')); // Change dark mode
    });
    fireEvent.click(screen.getByRole('tab', { name: 'Font' })); // Select Font tab
    fireEvent.change(screen.getByRole('slider', { name: 'Font Size' }), { target: { value: 18 } }); // Change font size

    fireEvent.click(screen.getByText('Restore default setting'));

    await waitFor(() => {
      expect(saveAppSetting).toHaveBeenCalledWith({ darkMode: 'auto', contentMode: 'compact' });
      expect(saveConfigToBackend).toHaveBeenCalledWith({ fontFamily: 'Roboto', fontFamilyMonospace: 'monospace', fontSize: 14, syntaxHighlighterTheme: 'auto' });
    });
  });

  test('toggles dark mode', async () => {
    const onClose = jest.fn();
    renderComponent(true, onClose);

    fireEvent.click(screen.getByRole('tab', { name: 'Color Scheme' }));

    await waitFor(() => {
      fireEvent.click(screen.getByLabelText('dark'));
    });
    fireEvent.click(screen.getByText('Save'));
    expect(saveAppSetting).toHaveBeenCalledWith(expect.objectContaining({ darkMode: 'dark' }));

    fireEvent.click(screen.getByRole('tab', { name: 'Color Scheme' }));
    await waitFor(() => {
      fireEvent.click(screen.getByLabelText('light'));
    });
    fireEvent.click(screen.getByText('Save'));
    expect(saveAppSetting).toHaveBeenCalledWith(expect.objectContaining({ darkMode: 'light' }));

    fireEvent.click(screen.getByRole('tab', { name: 'Color Scheme' }));
    await waitFor(() => {
      fireEvent.click(screen.getByLabelText('auto'));
    });
    fireEvent.click(screen.getByText('Save'));
    expect(saveAppSetting).toHaveBeenCalledWith(expect.objectContaining({ darkMode: 'auto' }));
  });

  test('toggles content mode', () => {
    const onClose = jest.fn();
    renderComponent(true, onClose);

    fireEvent.click(screen.getByLabelText('full'));
    fireEvent.click(screen.getByText('Save'));
    expect(saveAppSetting).toHaveBeenCalledWith(expect.objectContaining({ contentMode: 'full' }));

    fireEvent.click(screen.getByLabelText('compact'));
    fireEvent.click(screen.getByText('Save'));
    expect(saveAppSetting).toHaveBeenCalledWith(expect.objectContaining({ contentMode: 'compact' }));
  });

  test('changes font size', async () => {
    const onClose = jest.fn();
    renderComponent(true, onClose);

    fireEvent.click(screen.getByRole('tab', { name: 'Font' }));

    await waitFor(() => {
      fireEvent.change(screen.getByRole('slider', { name: 'Font Size' }), { target: { value: 20 } });
    });
    fireEvent.click(screen.getByText('Save'));
    expect(saveConfigToBackend).toHaveBeenCalledWith(expect.objectContaining({ fontSize: 20 }));
  });

  test('changes font family via select', async () => {
    const onClose = jest.fn();
    renderComponent(true, onClose);

    fireEvent.click(screen.getByRole('tab', { name: 'Font' }));

    await waitFor(() => {
      fireEvent.click(within(screen.getByRole('radiogroup', { name: 'Font Family' })).getByText('Select from list'));
    });

    const select = screen.getByTestId('font-family-select');
    const button = within(select).getByRole('combobox');
    fireEvent.mouseDown(button);
    await waitFor(() => screen.getByRole('option', { name: 'Arial' }));
    fireEvent.click(screen.getByRole('option', { name: 'Arial' }));

    fireEvent.click(screen.getByText('Save'));
    expect(saveConfigToBackend).toHaveBeenCalledWith(expect.objectContaining({ fontFamily: 'Arial' }));
  });

  test('changes font family via text input', async () => {
    const onClose = jest.fn();
    renderComponent(true, onClose);

    fireEvent.click(screen.getByRole('tab', { name: 'Font' }));

    await waitFor(() => {
      fireEvent.click(within(screen.getByRole('radiogroup', { name: 'Font Family' })).getByText('Enter manually'));
    });
    const input = screen.getByTestId('font-family-input').querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Custom Font' } });
    fireEvent.click(screen.getByText('Save'));
    expect(saveConfigToBackend).toHaveBeenCalledWith(expect.objectContaining({ fontFamily: 'Custom Font' }));
  });

  test('changes monospace font family via select', async () => {
    const onClose = jest.fn();
    renderComponent(true, onClose);

    fireEvent.click(screen.getByRole('tab', { name: 'Font' }));

    await waitFor(() => {
      fireEvent.click(within(screen.getByRole('radiogroup', { name: 'Monospace Font Family' })).getByText('Select from list'));
    });

    const select = screen.getByTestId('monospace-font-family-select');
    const button = within(select).getByRole('combobox');
    fireEvent.mouseDown(button);
    await waitFor(() => screen.getByRole('option', { name: 'Consolas' }));
    fireEvent.click(screen.getByRole('option', { name: 'Consolas' }));

    fireEvent.click(screen.getByText('Save'));
    expect(saveConfigToBackend).toHaveBeenCalledWith(expect.objectContaining({ fontFamilyMonospace: 'Consolas' }));
  });

  test('changes monospace font family via text input', async () => {
    const onClose = jest.fn();
    renderComponent(true, onClose);

    fireEvent.click(screen.getByRole('tab', { name: 'Font' }));

    await waitFor(() => {
      fireEvent.click(within(screen.getByRole('radiogroup', { name: 'Monospace Font Family' })).getByText('Enter manually'));
    });
    const input = screen.getByTestId('monospace-font-family-input').querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Custom Monospace' } });
    fireEvent.click(screen.getByText('Save'));
    expect(saveConfigToBackend).toHaveBeenCalledWith(expect.objectContaining({ fontFamilyMonospace: 'Custom Monospace' }));
  });
});
