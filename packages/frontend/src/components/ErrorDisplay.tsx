import React from 'react';
import { Box, Typography } from '@mui/material';
import { ReportProblemOutlined } from '@mui/icons-material';

interface ErrorDisplayProps {
  error: string | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) {
    return null;
  }

  const message = error.includes('404') ? 'Not Found' : `Error: ${error}`;

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        p: 4,
      }}
    >
      <ReportProblemOutlined sx={{ fontSize: 60, mb: 2 }} color="action" />
      <Typography variant="h5" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

export default ErrorDisplay;
