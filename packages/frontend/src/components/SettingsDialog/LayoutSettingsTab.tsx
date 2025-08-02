import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useCallback } from 'react';

interface LayoutSettingsTabProps {
  contentMode: 'full' | 'compact';
  handleToggleContentMode: (mode: 'full' | 'compact') => void;
}

const LayoutSettingsTab: React.FC<LayoutSettingsTabProps> = ({ contentMode, handleToggleContentMode }) => {
  const theme = useTheme();

  const handleChange = useCallback((_, newMode) => {
    if (newMode)
      handleToggleContentMode(newMode);
  } , [handleToggleContentMode]);

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
        sx={{ mb: 2 }}
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
    </Box>
  );
};

export default LayoutSettingsTab;
