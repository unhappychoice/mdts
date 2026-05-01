import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import React from 'react';
import ColorSchemeSettingsTab from '../../../../src/components/SettingsDialog/ColorSchemeSettingsTab';

const createProps = () => ({
  darkMode: 'dark' as const,
  theme: 'default',
  syntaxHighlighterTheme: 'auto',
  handleToggleDarkMode: jest.fn(),
  setSyntaxHighlighterTheme: jest.fn(),
  handleToggleTheme: jest.fn(),
});

const renderComponent = (props = createProps()) => render(<ColorSchemeSettingsTab {...props} />);

describe('ColorSchemeSettingsTab', () => {
  it('should render correctly', () => {
    const { asFragment } = renderComponent();
    expect(asFragment()).toMatchSnapshot();
  });

  it('calls handleToggleDarkMode only when another mode is selected', () => {
    const props = createProps();

    renderComponent(props);

    fireEvent.click(screen.getByRole('button', { name: 'light' }));
    fireEvent.click(screen.getByRole('button', { name: 'dark' }));

    expect(props.handleToggleDarkMode).toHaveBeenCalledTimes(1);
    expect(props.handleToggleDarkMode).toHaveBeenCalledWith('light');
  });

  it('calls handleToggleTheme when selecting another theme', async () => {
    const props = createProps();

    renderComponent(props);

    fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);
    await waitFor(() => screen.getByRole('option', { name: 'Aurora' }));
    fireEvent.click(screen.getByRole('option', { name: 'Aurora' }));

    expect(props.handleToggleTheme).toHaveBeenCalledWith('aurora');
  });

  it('calls setSyntaxHighlighterTheme when selecting another syntax theme', async () => {
    const props = createProps();

    renderComponent(props);

    const select = screen.getByTestId('syntax-highlighter-theme-select');
    fireEvent.mouseDown(within(select).getByRole('combobox'));
    await waitFor(() => screen.getByRole('option', { name: 'Atom Dark' }));
    fireEvent.click(screen.getByRole('option', { name: 'Atom Dark' }));

    expect(props.setSyntaxHighlighterTheme).toHaveBeenCalledWith('atomDark');
  });
});
