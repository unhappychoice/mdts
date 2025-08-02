import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Tab, Tabs, } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { WEB_SAFE_FONTS, WEB_SAFE_MONOSPACE_FONTS, } from '../../constants';
import { saveAppSetting } from '../../store/slices/appSettingSlice';
import { saveConfigToBackend } from '../../store/slices/configSlice';
import { AppDispatch, RootState } from '../../store/store';
import ColorSchemeSettingsTab from './ColorSchemeSettingsTab';
import FontSettingsTab from './FontSettingsTab';
import LayoutSettingsTab from './LayoutSettingsTab';
import TabPanel from './TabPanel';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onClose }) => {
  const dispatch: AppDispatch = useDispatch();
  const theme = useTheme();
  const {
    darkMode: initialDarkMode,
    contentMode: initialContentMode
  } = useSelector((state: RootState) => state.appSetting);
  const {
    fontFamily: initialFontFamily,
    fontFamilyMonospace: initialFontFamilyMonospace,
    fontSize: initialFontSize,
    syntaxHighlighterTheme: initialSyntaxHighlighterTheme
  } = useSelector((state: RootState) => state.config);

  const [selectedTab, setSelectedTab] = useState(0);
  const [darkMode, setDarkMode] = useState(initialDarkMode);
  const [contentMode, setContentMode] = useState(initialContentMode);
  const [fontFamily, setFontFamily] = useState(initialFontFamily);
  const [fontFamilyMonospace, setFontFamilyMonospace] = useState(initialFontFamilyMonospace);
  const [fontSize, setFontSize] = useState(initialFontSize);
  const [syntaxHighlighterTheme, setSyntaxHighlighterTheme] = useState(initialSyntaxHighlighterTheme);
  const [fontInputMode, setFontInputMode] = useState<'select' | 'text'>(WEB_SAFE_FONTS.includes(initialFontFamily) ? 'select' : 'text');
  const [fontInputModeMonospace, setFontInputModeMonospace] = useState<'select' | 'text'>(WEB_SAFE_MONOSPACE_FONTS.includes(initialFontFamilyMonospace) ? 'select' : 'text');

  useEffect(() => {
    setContentMode(initialContentMode);
    setDarkMode(initialDarkMode);
    setSyntaxHighlighterTheme(initialSyntaxHighlighterTheme);
    setFontFamily(initialFontFamily);
    setFontFamilyMonospace(initialFontFamilyMonospace);
    setFontSize(initialFontSize);
    setFontInputMode(WEB_SAFE_FONTS.includes(initialFontFamily) ? 'select' : 'text');
    setFontInputModeMonospace(WEB_SAFE_MONOSPACE_FONTS.includes(initialFontFamilyMonospace) ? 'select' : 'text');
  }, [
    initialContentMode,
    initialDarkMode,
    initialSyntaxHighlighterTheme,
    initialFontFamily,
    initialFontFamilyMonospace,
    initialFontSize
  ]);

  const handleSave = useCallback(() => {
    dispatch(saveConfigToBackend({ fontFamily, fontFamilyMonospace, fontSize, syntaxHighlighterTheme }));
    dispatch(saveAppSetting({ darkMode, contentMode }));

    onClose();
  }, [contentMode, darkMode, dispatch, fontFamily, fontFamilyMonospace, fontSize, onClose, syntaxHighlighterTheme]);

  const handleCancel = useCallback(() => {
    setDarkMode(initialDarkMode);
    setContentMode(initialContentMode);
    setFontFamily(initialFontFamily);
    setFontFamilyMonospace(initialFontFamilyMonospace);
    setFontSize(initialFontSize);
    setSyntaxHighlighterTheme(initialSyntaxHighlighterTheme);
    setFontInputMode(WEB_SAFE_FONTS.includes(initialFontFamily) ? 'select' : 'text');
    setFontInputModeMonospace(WEB_SAFE_MONOSPACE_FONTS.includes(initialFontFamilyMonospace) ? 'select' : 'text');
    onClose();
  }, [
    initialContentMode,
    initialDarkMode,
    initialFontFamily,
    initialFontFamilyMonospace,
    initialFontSize,
    initialSyntaxHighlighterTheme,
    onClose
  ]);

  const handleSelectTab = useCallback((_, newValue) => {
    setSelectedTab(newValue);
  }, [setSelectedTab]);

  const handleToggleDarkMode = useCallback((mode: 'dark' | 'light' | 'auto') => {
    setDarkMode(mode);
  }, []);

  const handleToggleContentMode = useCallback((mode: 'full' | 'compact') => {
    setContentMode(mode);
  }, []);

  const handleFontInputModeChange = useCallback((_: React.MouseEvent<HTMLElement>, newMode: 'select' | 'text' | null) => {
    if (newMode) {
      setFontInputMode(newMode);
      if (newMode === 'select' && !WEB_SAFE_FONTS.includes(fontFamily)) {
        setFontFamily(WEB_SAFE_FONTS[0]); // Reset to first web-safe font if current is not in list
      }
    }
  }, [fontFamily]);

  const handleFontInputModeMonospaceChange = useCallback((_: React.MouseEvent<HTMLElement>, newMode: 'select' | 'text' | null) => {
    if (newMode) {
      setFontInputModeMonospace(newMode);
      if (newMode === 'select' && !WEB_SAFE_MONOSPACE_FONTS.includes(fontFamilyMonospace)) {
        setFontFamilyMonospace(WEB_SAFE_MONOSPACE_FONTS[0]); // Reset to first web-safe monospace font if current is not in list
      }
    }
  }, [fontFamilyMonospace]);

  const handleReset = useCallback(() => {
    const defaultDarkMode = 'auto';
    const defaultContentMode = 'compact';
    const defaultFontFamily = 'Roboto';
    const defaultFontFamilyMonospace = 'monospace';
    const defaultFontSize = 14;
    const defaultSyntaxHighlighterTheme = 'auto';

    setDarkMode(defaultDarkMode);
    setContentMode(defaultContentMode);
    setFontFamily(defaultFontFamily);
    setFontFamilyMonospace(defaultFontFamilyMonospace);
    setFontSize(defaultFontSize);
    setSyntaxHighlighterTheme(defaultSyntaxHighlighterTheme);
    setFontInputMode(WEB_SAFE_FONTS.includes(defaultFontFamily) ? 'select' : 'text');
    setFontInputModeMonospace(WEB_SAFE_MONOSPACE_FONTS.includes(defaultFontFamilyMonospace) ? 'select' : 'text');

    dispatch(saveConfigToBackend({
      fontFamily: defaultFontFamily,
      fontFamilyMonospace: defaultFontFamilyMonospace,
      fontSize: defaultFontSize,
      syntaxHighlighterTheme: defaultSyntaxHighlighterTheme
    }));
    dispatch(saveAppSetting({ darkMode: defaultDarkMode, contentMode: defaultContentMode }));
  }, [dispatch]);

  return (
    <Dialog maxWidth='lg' open={open} onClose={onClose}>
      <DialogTitle sx={{ pt: 2, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>Appearance Settings</DialogTitle>
      <DialogContent sx={{ width: 800, height: 600, p: 0 }} className="custom-scrollbar">
        <Box sx={{ flexGrow: 1, display: 'flex', height: '100%' }}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={selectedTab}
            onChange={handleSelectTab}
            aria-label="Vertical tabs"
            sx={{
              minWidth: 200,
              py: 4,
              borderRight: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                alignItems: 'flex-end',
                pr: 4,
              },
            }}
          >
            <Tab label="Layout" />
            <Tab label="Color Scheme" />
            <Tab label="Font" />
          </Tabs>
          {selectedTab === 0 && (
            <TabPanel value={selectedTab} index={0}>
              <LayoutSettingsTab
                contentMode={contentMode}
                handleToggleContentMode={handleToggleContentMode}
              />
            </TabPanel>
          )}
          {selectedTab === 1 && (
            <TabPanel value={selectedTab} index={1}>
              <ColorSchemeSettingsTab
                darkMode={darkMode}
                syntaxHighlighterTheme={syntaxHighlighterTheme}
                handleToggleDarkMode={handleToggleDarkMode}
                setSyntaxHighlighterTheme={setSyntaxHighlighterTheme}
                
              />
            </TabPanel>
          )}
          {selectedTab === 2 && (
            <TabPanel value={selectedTab} index={2}>
              <FontSettingsTab
                fontSize={fontSize}
                fontFamily={fontFamily}
                fontFamilyMonospace={fontFamilyMonospace}
                fontInputMode={fontInputMode}
                fontInputModeMonospace={fontInputModeMonospace}
                setFontSize={setFontSize}
                setFontFamily={setFontFamily}
                setFontFamilyMonospace={setFontFamilyMonospace}
                handleFontInputModeChange={handleFontInputModeChange}
                handleFontInputModeMonospaceChange={handleFontInputModeMonospaceChange}
                
              />
            </TabPanel>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button onClick={handleReset} size="small" sx={{ mr: 'auto', color: theme.palette.text.secondary }}>Restore default setting</Button>
        <Button onClick={handleCancel} size="small" sx={{ color: theme.palette.text.secondary }}>Cancel</Button>
        <Button onClick={handleSave} size="small">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;
