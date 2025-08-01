import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Slider,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveAppSetting } from '../../store/slices/appSettingSlice';
import { saveConfigToBackend } from '../../store/slices/configSlice';
import { AppDispatch, RootState } from '../../store/store';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

const WEB_SAFE_FONTS = [
  'Roboto',
  'Arial',
  'Courier New',
  'Garamond',
  'Georgia',
  'Helvetica',
  'Tahoma',
  'Times New Roman',
  'Trebuchet MS',
  'Verdana',
];

const WEB_SAFE_MONOSPACE_FONTS = [
  'Consolas',
  'Courier New',
  'Lucida Console',
  'Monaco',
  'monospace',
];

const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onClose }) => {
  const dispatch: AppDispatch = useDispatch();
  const theme = useTheme();
  const { darkMode: initialDarkMode, contentMode: initialContentMode } = useSelector((state: RootState) => state.appSetting);
  const { fontFamily: initialFontFamily, fontFamilyMonospace: initialFontFamilyMonospace, fontSize: initialFontSize } = useSelector((state: RootState) => state.config);

  const [darkMode, setDarkMode] = useState(initialDarkMode);
  const [contentMode, setContentMode] = useState(initialContentMode);
  const [fontFamily, setFontFamily] = useState(initialFontFamily);
  const [fontFamilyMonospace, setFontFamilyMonospace] = useState(initialFontFamilyMonospace);
  const [fontSize, setFontSize] = useState(initialFontSize);
  const [fontInputMode, setFontInputMode] = useState(WEB_SAFE_FONTS.includes(initialFontFamily) ? 'select' : 'text');
  const [fontInputModeMonospace, setFontInputModeMonospace] = useState(WEB_SAFE_MONOSPACE_FONTS.includes(initialFontFamilyMonospace) ? 'select' : 'text');

  useEffect(() => {
    setDarkMode(initialDarkMode);
    setContentMode(initialContentMode);
    setFontFamily(initialFontFamily);
    setFontFamilyMonospace(initialFontFamilyMonospace);
    setFontSize(initialFontSize);
    setFontInputMode(WEB_SAFE_FONTS.includes(initialFontFamily) ? 'select' : 'text');
    setFontInputModeMonospace(WEB_SAFE_MONOSPACE_FONTS.includes(initialFontFamilyMonospace) ? 'select' : 'text');
  }, [initialDarkMode, initialContentMode, initialFontFamily, initialFontFamilyMonospace, initialFontSize]);

  const handleSave = () => {
    dispatch(saveConfigToBackend({ fontFamily, fontFamilyMonospace, fontSize }));
    dispatch(saveAppSetting({ darkMode, contentMode }));

    onClose();
  };

  const handleCancel = () => {
    setDarkMode(initialDarkMode);
    setContentMode(initialContentMode);
    setFontFamily(initialFontFamily);
    setFontFamilyMonospace(initialFontFamilyMonospace);
    setFontSize(initialFontSize);
    setFontInputMode(WEB_SAFE_FONTS.includes(initialFontFamily) ? 'select' : 'text');
    setFontInputModeMonospace(WEB_SAFE_MONOSPACE_FONTS.includes(initialFontFamilyMonospace) ? 'select' : 'text');
    onClose();
  };

  const handleToggleDarkMode = (mode: 'dark' | 'light' | 'auto') => {
    setDarkMode(mode);
  };

  const handleToggleContentMode = (mode: 'full' | 'compact') => {
    setContentMode(mode);
  };

  const handleFontInputModeChange = (_: React.MouseEvent<HTMLElement>, newMode: string | null) => {
    if (newMode) {
      setFontInputMode(newMode);
      if (newMode === 'select' && !WEB_SAFE_FONTS.includes(fontFamily)) {
        setFontFamily(WEB_SAFE_FONTS[0]); // Reset to first web-safe font if current is not in list
      }
    }
  };

  const handleFontInputModeMonospaceChange = (_: React.MouseEvent<HTMLElement>, newMode: string | null) => {
    if (newMode) {
      setFontInputModeMonospace(newMode);
      if (newMode === 'select' && !WEB_SAFE_MONOSPACE_FONTS.includes(fontFamilyMonospace)) {
        setFontFamilyMonospace(WEB_SAFE_MONOSPACE_FONTS[0]); // Reset to first web-safe monospace font if current is not in list
      }
    }
  };

  const handleReset = () => {
    const defaultDarkMode = 'auto';
    const defaultContentMode = 'compact';
    const defaultFontFamily = 'Roboto';
    const defaultFontFamilyMonospace = 'monospace';
    const defaultFontSize = 14;

    setDarkMode(defaultDarkMode);
    setContentMode(defaultContentMode);
    setFontFamily(defaultFontFamily);
    setFontFamilyMonospace(defaultFontFamilyMonospace);
    setFontSize(defaultFontSize);
    setFontInputMode(WEB_SAFE_FONTS.includes(defaultFontFamily) ? 'select' : 'text');
    setFontInputModeMonospace(WEB_SAFE_MONOSPACE_FONTS.includes(defaultFontFamilyMonospace) ? 'select' : 'text');

    dispatch(saveConfigToBackend({ fontFamily: defaultFontFamily, fontFamilyMonospace: defaultFontFamilyMonospace, fontSize: defaultFontSize }));
    dispatch(saveAppSetting({ darkMode: defaultDarkMode, contentMode: defaultContentMode }));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ pt: 2, pb: 2, mb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>Appearance Settings</DialogTitle>
      <DialogContent sx={{ pb: 1, width: 480 }} className="custom-scrollbar">
        <Typography variant="subtitle2" gutterBottom>Dark Mode</Typography>
        <ToggleButtonGroup
          value={darkMode}
          exclusive
          onChange={(_, newMode) => newMode && handleToggleDarkMode(newMode)}
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
              "&.Mui-selected": {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                "&:hover": {
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
              "&.Mui-selected": {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                "&:hover": {
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
              "&.Mui-selected": {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              },
            }}
          >
            Auto (System)
          </ToggleButton>
        </ToggleButtonGroup>

        <Typography variant="subtitle2" gutterBottom>Content Width</Typography>
        <ToggleButtonGroup
          value={contentMode}
          exclusive
          onChange={(_, newMode) => newMode && handleToggleContentMode(newMode)}
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
              "&.Mui-selected": {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                "&:hover": {
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
              "&.Mui-selected": {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              },
            }}
          >
            Compact
          </ToggleButton>
        </ToggleButtonGroup>

        <Typography variant="subtitle2" gutterBottom>Font Size</Typography>
        <Slider
          value={fontSize}
          onChange={(_, newValue) => setFontSize(newValue as number)}
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
        <ToggleButtonGroup
          value={fontInputMode}
          exclusive
          onChange={handleFontInputModeChange}
          aria-label="font input mode"
          fullWidth
          size="small"
          sx={{ mb: 1 }}
        >
          <ToggleButton
            value="select"
            aria-label="select"
            sx={{
              flexGrow: 1,
              "&.Mui-selected": {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              },
            }}
          >
            Select from list
          </ToggleButton>
          <ToggleButton
            value="text"
            aria-label="text"
            sx={{
              flexGrow: 1,
              "&.Mui-selected": {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              },
            }}
          >
            Enter manually
          </ToggleButton>
        </ToggleButtonGroup>

        {fontInputMode === 'select' ? (
          <Select
            labelId="font-family-label"
            id="fontFamily"
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value as string)}
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
            onChange={(e) => setFontFamily(e.target.value)}
            data-testid="font-family-input"
          />
        )}

        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }} id="monospace-font-family-label">Monospace Font Family</Typography>
        <ToggleButtonGroup
          value={fontInputModeMonospace}
          exclusive
          onChange={handleFontInputModeMonospaceChange}
          aria-label="monospace font input mode"
          fullWidth
          size="small"
          sx={{ mb: 1 }}
        >
          <ToggleButton
            value="select"
            aria-label="select"
            sx={{
              flexGrow: 1,
              "&.Mui-selected": {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              },
            }}
          >
            Select from list
          </ToggleButton>
          <ToggleButton
            value="text"
            aria-label="text"
            sx={{
              flexGrow: 1,
              "&.Mui-selected": {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              },
            }}
          >
            Enter manually
          </ToggleButton>
        </ToggleButtonGroup>

        {fontInputModeMonospace === 'select' ? (
          <Select
            labelId="monospace-font-family-label"
            id="fontFamilyMonospace"
            value={fontFamilyMonospace}
            onChange={(e) => setFontFamilyMonospace(e.target.value as string)}
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
            onChange={(e) => setFontFamilyMonospace(e.target.value)}
            data-testid="monospace-font-family-input"
          />
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleReset} size="small" sx={{ mr: "auto", color: theme.palette.text.secondary }}>Reset to Default</Button>
        <Button onClick={handleCancel} size="small" sx={{ color: theme.palette.text.secondary }}>Cancel</Button>
        <Button onClick={handleSave} size="small">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;
