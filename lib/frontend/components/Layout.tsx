import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  // Dark mode state and toggle function can be managed here or via a context API
  const darkMode = false; // Placeholder for dark mode state
  const toggleDarkMode = () => {}; // Placeholder for dark mode toggle

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            mdts
          </Typography>
          <IconButton sx={{ ml: 1 }} onClick={toggleDarkMode} color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, display: 'flex' }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;