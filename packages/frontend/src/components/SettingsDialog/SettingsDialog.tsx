import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Tab, Tabs, } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useCallback, useState } from 'react';
import ColorSchemeSettingsTab from './ColorSchemeSettingsTab';
import FontSettingsTab from './FontSettingsTab';
import LayoutSettingsTab from './LayoutSettingsTab';
import TabPanel from './TabPanel';
import { useSettingsForm } from '../../hooks/useSettingsForm';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState(0);

  const {
    darkMode,
    contentMode,
    themeType,
    fontFamily,
    fontFamilyMonospace,
    fontSize,
    syntaxHighlighterTheme,
    enableBreaks,
    fontInputMode,
    fontInputModeMonospace,
    setFontFamily,
    setFontFamilyMonospace,
    setFontSize,
    setSyntaxHighlighterTheme,
    setEnableBreaks,
    handleSave: handleSaveForm,
    handleCancel: handleCancelForm,
    handleToggleDarkMode,
    handleToggleTheme,
    handleToggleContentMode,
    handleFontInputModeChange,
    handleFontInputModeMonospaceChange,
    handleReset,
  } = useSettingsForm();

  const handleSave = useCallback(() => {
    handleSaveForm();
    onClose();
  }, [handleSaveForm, onClose]);

  const handleCancel = useCallback(() => {
    handleCancelForm();
    onClose();
  }, [handleCancelForm, onClose]);

  const handleSelectTab = useCallback((_, newValue) => {
    setSelectedTab(newValue);
  }, [setSelectedTab]);

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
                enableBreaks={enableBreaks}
                handleToggleContentMode={handleToggleContentMode}
                setEnableBreaks={setEnableBreaks}
              />
            </TabPanel>
          )}
          {selectedTab === 1 && (
            <TabPanel value={selectedTab} index={1}>
              <ColorSchemeSettingsTab
                darkMode={darkMode}
                theme={themeType}
                syntaxHighlighterTheme={syntaxHighlighterTheme}
                handleToggleDarkMode={handleToggleDarkMode}
                handleToggleTheme={handleToggleTheme}
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
