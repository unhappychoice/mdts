import {
  Box,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Slider,
  TextField,
  Typography
} from '@mui/material';
import React, { useCallback } from 'react';
import { WEB_SAFE_FONTS, WEB_SAFE_MONOSPACE_FONTS, } from '../../constants';

interface FontSettingsTabProps {
  fontSize: number;
  fontFamily: string;
  fontFamilyMonospace: string;
  fontInputMode: 'select' | 'text';
  fontInputModeMonospace: 'select' | 'text';
  setFontSize: (size: number) => void;
  setFontFamily: (font: string) => void;
  setFontFamilyMonospace: (font: string) => void;
  handleFontInputModeChange: (_: React.MouseEvent<HTMLElement>, newMode: 'select' | 'text' | null) => void;
  handleFontInputModeMonospaceChange: (_: React.MouseEvent<HTMLElement>, newMode: 'select' | 'text' | null) => void;
}

const FontSettingsTab: React.FC<FontSettingsTabProps> = ({
  fontSize,
  fontFamily,
  fontFamilyMonospace,
  fontInputMode,
  fontInputModeMonospace,
  setFontSize,
  setFontFamily,
  setFontFamilyMonospace,
  handleFontInputModeChange,
  handleFontInputModeMonospaceChange,
}) => {

  const handleFontSelect = useCallback((e) => {
    setFontFamily(e.target.value as string);
  }, [setFontFamily]);

  const handleFontChange = useCallback((e) => {
    setFontFamily(e.target.value);
  }, [setFontFamily]);

  const handleMonospaceFontSelect = useCallback((e) => {
    setFontFamilyMonospace(e.target.value as string);
  }, [setFontFamilyMonospace]);

  const handleMonospaceFontChange = useCallback((e) => {
    setFontFamilyMonospace(e.target.value);
  }, [setFontFamilyMonospace]);

  const handleChangeFontSize = useCallback((_, newValue) => {
    setFontSize(newValue as number);
  }, [setFontSize]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle2" gutterBottom>Font Size</Typography>
      <Slider
        value={fontSize}
        onChange={handleChangeFontSize}
        aria-label="Font Size"
        aria-labelledby="font-size-slider"
        valueLabelDisplay="auto"
        step={1}
        marks
        min={10}
        max={24}
        size="small"
        sx={{ mb: 1 }}
      />

      <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }} id="font-family-label">Font Family</Typography>
      <RadioGroup
        row
        aria-labelledby="font-family-label"
        name="font-input-mode-group"
        value={fontInputMode}
        onChange={handleFontInputModeChange}
        sx={{ mb: 1 }}
      >
        <FormControlLabel value="select" control={<Radio size="small" />} label="Select from list" />
        <FormControlLabel value="text" control={<Radio size="small" />} label="Enter manually" />
      </RadioGroup>

      {fontInputMode === 'select' ? (
        <Select
          labelId="font-family-label"
          id="fontFamily"
          value={fontFamily}
          onChange={handleFontSelect}
          fullWidth
          variant="outlined"
          size="small"
          sx={{ mb: 1 }}
          data-testid="font-family-select"
        >
          {WEB_SAFE_FONTS.map((font) => (
            <MenuItem key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <TextField
          autoFocus
          margin="dense"
          id="fontFamily"
          aria-labelledby="font-family-label"
          type="text"
          fullWidth
          variant="outlined"
          size="small"
          value={fontFamily}
          sx={{ mt: 0, mb: 1 }}
          onChange={handleFontChange}
          data-testid="font-family-input"
        />
      )}

      <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }} id="monospace-font-family-label">Monospace Font Family</Typography>
      <RadioGroup
        row
        aria-labelledby="monospace-font-family-label"
        name="monospace-font-input-mode-group"
        value={fontInputModeMonospace}
        onChange={handleFontInputModeMonospaceChange}
        sx={{ mb: 1 }}
      >
        <FormControlLabel value="select" control={<Radio size="small" />} label="Select from list" />
        <FormControlLabel value="text" control={<Radio size="small" />} label="Enter manually" />
      </RadioGroup>

      {fontInputModeMonospace === 'select' ? (
        <Select
          labelId="monospace-font-family-label"
          id="fontFamilyMonospace"
          value={fontFamilyMonospace}
          onChange={handleMonospaceFontSelect}
          fullWidth
          variant="outlined"
          size="small"
          sx={{ mb: 1 }}
          data-testid="monospace-font-family-select"
        >
          {WEB_SAFE_MONOSPACE_FONTS.map((font) => (
            <MenuItem key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <TextField
          margin="dense"
          id="fontFamilyMonospace"
          aria-labelledby="monospace-font-family-label"
          type="text"
          fullWidth
          variant="outlined"
          size="small"
          value={fontFamilyMonospace}
          sx={{ mt: 0, mb: 1 }}
          onChange={handleMonospaceFontChange}
          data-testid="monospace-font-family-input"
        />
      )}
    </Box>
  );
};

export default FontSettingsTab;
