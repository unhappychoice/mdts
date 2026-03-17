import { Box, Typography } from '@mui/material';
import React from 'react';

interface DiffViewProps {
  diff: string;
  emptyMessage: string;
}

const lineStyle = (line: string): React.CSSProperties => {
  if (line.startsWith('+') && !line.startsWith('+++')) {
    return { backgroundColor: 'rgba(46, 160, 67, 0.15)', color: 'inherit' };
  }
  if (line.startsWith('-') && !line.startsWith('---')) {
    return { backgroundColor: 'rgba(248, 81, 73, 0.15)', color: 'inherit' };
  }
  if (line.startsWith('@@')) {
    return { backgroundColor: 'rgba(56, 139, 253, 0.15)', color: 'inherit' };
  }
  return {};
};

const DiffView: React.FC<DiffViewProps> = ({ diff, emptyMessage }) => {
  if (!diff) {
    return (
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  const lines = diff.split('\n');

  return (
    <Box
      sx={{
        my: 2,
        fontFamily: 'monospace',
        fontSize: '13px',
        lineHeight: 1.6,
        overflow: 'auto',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
      }}
    >
      {lines.map((line, index) => (
        <Box
          key={index}
          sx={{
            px: 2,
            whiteSpace: 'pre',
            ...lineStyle(line),
          }}
        >
          {line}
        </Box>
      ))}
    </Box>
  );
};

export default DiffView;
