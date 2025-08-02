import { Box, MenuItem, Select, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useCallback } from 'react';
import { DARK_SYNTAX_HIGHLIGHTER_THEMES, LIGHT_SYNTAX_HIGHLIGHTER_THEMES, } from '../../constants';

interface ColorSchemeSettingsTabProps {
  darkMode: 'dark' | 'light' | 'auto';
  syntaxHighlighterTheme: string;
  handleToggleDarkMode: (mode: 'dark' | 'light' | 'auto') => void;
  setSyntaxHighlighterTheme: (theme: string) => void;
}

const ColorSchemeSettingsTab: React.FC<ColorSchemeSettingsTabProps> = ({
  darkMode,
  syntaxHighlighterTheme,
  handleToggleDarkMode,
  setSyntaxHighlighterTheme,
}) => {
  const theme = useTheme();
  const selectableThemes = (darkMode === 'dark' || (darkMode === 'auto' && theme.palette.mode === 'dark'))
    ? DARK_SYNTAX_HIGHLIGHTER_THEMES
    : LIGHT_SYNTAX_HIGHLIGHTER_THEMES;

  const handleDarkModeChange = useCallback((_, newMode) => {
    if (newMode)
      handleToggleDarkMode(newMode);
  }, [handleToggleDarkMode]);

  const handleThemChange = useCallback((e) => {
    setSyntaxHighlighterTheme(e.target.value as string);
  }, [setSyntaxHighlighterTheme]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>Dark Mode</Typography>
      <ToggleButtonGroup
        value={darkMode}
        exclusive
        onChange={handleDarkModeChange}
        aria-label="dark mode"
        fullWidth
        size="small"
        sx={{ mb: 2 }}
      >
        <ToggleButton
          value="dark"
          aria-label="dark"
          sx={{
            flexGrow: 1,
            '&.Mui-selected': {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            },
          }}
        >
          Dark
        </ToggleButton>
        <ToggleButton
          value="light"
          aria-label="light"
          sx={{
            flexGrow: 1,
            '&.Mui-selected': {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            },
          }}
        >
          Light
        </ToggleButton>
        <ToggleButton
          value="auto"
          aria-label="auto"
          sx={{
            flexGrow: 1,
            '&.Mui-selected': {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            },
          }}
        >
          Auto (System)
        </ToggleButton>
      </ToggleButtonGroup>

      <Typography variant="subtitle2" sx={{ my: 2 }} id="syntax-highlighter-theme-label">Syntax Highlighter Theme</Typography>
      <Select
        labelId="syntax-highlighter-theme-label"
        id="syntaxHighlighterTheme"
        value={syntaxHighlighterTheme}
        onChange={handleThemChange}
        fullWidth
        variant="outlined"
        size="small"
        sx={{ mb: 1 }}
        data-testid="syntax-highlighter-theme-select"
      >
        <MenuItem value="auto">Auto</MenuItem>
        {selectableThemes.map(theme => (
          <MenuItem key={theme.value} value={theme.value}>
            {theme.name}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default ColorSchemeSettingsTab;
