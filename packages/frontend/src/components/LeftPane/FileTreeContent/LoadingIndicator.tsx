import { Box, CircularProgress } from '@mui/material';
import React from 'react';

export const LoadingIndicator: React.FC = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 180px)' }}>
    <CircularProgress />
  </Box>
);
