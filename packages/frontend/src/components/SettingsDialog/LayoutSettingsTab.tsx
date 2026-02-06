import {
  Box,
  FormControlLabel,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useCallback } from 'react';

interface LayoutSettingsTabProps {
  contentMode: 'full' | 'compact';
  enableBreaks: boolean;
  handleToggleContentMode: (mode: 'full' | 'compact') => void;
  setEnableBreaks: (enable: boolean) => void;
}

const LayoutSettingsTab: React.FC<LayoutSettingsTabProps> = ({
  contentMode,
  enableBreaks,
  handleToggleContentMode,
  setEnableBreaks,
}) => {
  const theme = useTheme();

  const handleChange = useCallback((_, newMode) => {
    if (newMode)
      handleToggleContentMode(newMode);
  } , [handleToggleContentMode]);

  const handleEnableBreaksChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setEnableBreaks(event.target.checked);
  }, [setEnableBreaks]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>Content Width</Typography>
      <ToggleButtonGroup
        value={contentMode}
        exclusive
        onChange={handleChange}
        aria-label="content width"
        fullWidth
        size="small"
        sx={{ mb: 3 }}
      >
        <ToggleButton
          value="full"
          aria-label="full"
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
          Full
        </ToggleButton>
        <ToggleButton
          value="compact"
          aria-label="compact"
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
          Compact
        </ToggleButton>
      </ToggleButtonGroup>

      <Typography variant="subtitle2" sx={{ mb: 1 }}>Markdown</Typography>
      <FormControlLabel
        control={
          <Switch
            checked={enableBreaks}
            onChange={handleEnableBreaksChange}
            size="small"
          />
        }
        label="Enable soft line breaks"
      />
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
        Convert single line breaks to {'<br>'} elements
      </Typography>
    </Box>
  );
};

export default LayoutSettingsTab;
