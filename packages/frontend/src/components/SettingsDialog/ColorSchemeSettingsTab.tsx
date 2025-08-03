import { Box, MenuItem, Select, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useCallback } from 'react';
import {
  SYNTAX_HIGHLIGHTER_THEMES
} from '../../constants';
import { themes } from '../../styles/themes';

interface ColorSchemeSettingsTabProps {
  darkMode: 'dark' | 'light' | 'auto';
  theme: string;
  syntaxHighlighterTheme: string;
  handleToggleDarkMode: (mode: 'dark' | 'light' | 'auto') => void;
  setSyntaxHighlighterTheme: (theme: string) => void;
  handleToggleTheme: (theme: string) => void;
}

const ColorSchemeSettingsTab: React.FC<ColorSchemeSettingsTabProps> = ({
  darkMode,
  syntaxHighlighterTheme,
  theme,
  handleToggleDarkMode,
  setSyntaxHighlighterTheme,
  handleToggleTheme,
}) => {
  const muiTheme = useTheme();

  const handleDarkModeChange = useCallback((_, newMode) => {
    if (newMode)
      handleToggleDarkMode(newMode);
  }, [handleToggleDarkMode]);

  const handleThemChange = useCallback((e) => {
    setSyntaxHighlighterTheme(e.target.value as string);
  }, [setSyntaxHighlighterTheme]);

  const handleThemeChange = useCallback((e) => {
    handleToggleTheme(e.target.value as string);
  }, [handleToggleTheme]);

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
              backgroundColor: muiTheme.palette.primary.main,
              color: muiTheme.palette.primary.contrastText,
              '&:hover': {
                backgroundColor: muiTheme.palette.primary.dark,
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
              backgroundColor: muiTheme.palette.primary.main,
              color: muiTheme.palette.primary.contrastText,
              '&:hover': {
                backgroundColor: muiTheme.palette.primary.dark,
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
              backgroundColor: muiTheme.palette.primary.main,
              color: muiTheme.palette.primary.contrastText,
              '&:hover': {
                backgroundColor: muiTheme.palette.primary.dark,
              },
            },
          }}
        >
          Auto (System)
        </ToggleButton>
      </ToggleButtonGroup>

      <Typography variant="subtitle2" sx={{ mb: 2 }}>Theme</Typography>
      <Select
        value={theme}
        onChange={handleThemeChange}
        fullWidth
        variant="outlined"
        size="small"
        sx={{ mb: 2 }}
      >
        {themes.map(t => {
          const palette = (darkMode === 'dark' || (darkMode === 'auto' && muiTheme.palette.mode === 'dark')) ? t.dark : t.light;
          const background = `linear-gradient(45deg, ${palette.background} 0%, ${palette.paper} 100%)`;

          return (
            <MenuItem key={t.id} value={t.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 1.5, gap: '4px' }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '4px',
                      background: background,
                      border: `1px solid ${muiTheme.palette.divider}`,
                    }}
                  />
                </Box>
                <Typography variant="body2">{t.name}</Typography>
              </Box>
            </MenuItem>
          );
        })}
      </Select>

      <Typography variant="subtitle2" sx={{ my: 2 }} id="syntax-highlighter-theme-label">Syntax Highlighter Theme</Typography>
      <Select
        labelId="syntax-highlighter-theme-label"
        id="syntaxHighlighterTheme"
        value={syntaxHighlighterTheme || 'auto'}
        onChange={handleThemChange}
        fullWidth
        variant="outlined"
        size="small"
        sx={{ mb: 1 }}
        data-testid="syntax-highlighter-theme-select"
      >
        <MenuItem value="auto">Auto</MenuItem>
        {SYNTAX_HIGHLIGHTER_THEMES.map(theme => {
          const backgroundColor = theme.color || muiTheme.palette.background.default; // Fallback to default background

          return (
            <MenuItem key={theme.value} value={theme.value}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 1.5, gap: '4px' }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '4px',
                      background: backgroundColor,
                      border: `1px solid ${muiTheme.palette.divider}`,
                    }}
                  />
                </Box>
                <Typography variant="body2">{theme.name}</Typography>
              </Box>
            </MenuItem>
          );
        })}
      </Select>
    </Box>
  );
};

export default ColorSchemeSettingsTab;
