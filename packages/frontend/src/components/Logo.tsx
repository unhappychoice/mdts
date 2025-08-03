import { useTheme } from '@mui/material';
import React from 'react';

const Logo: React.FC = () => {
  const theme = useTheme();
  const color = theme.palette.primary.main;

  return (
    <svg
      viewBox="0 0 180 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: 'auto', height: '100%' }}
    >
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
        <style>
          {`
            .text {
              font-family: 'Segoe UI', 'Arial', sans-serif;
              font-size: 42px;
              font-weight: 700;
              fill: url(#grad);
              letter-spacing: 2px;
            }
            .icon {
              fill: url(#grad);
            }
          `}
        </style>
      </defs>

      <g className="icon" transform="translate(10, 20)">
        <path d="M5 25 L15 45" stroke="url(#grad)" strokeWidth="2" />
        <path d="M25 25 L15 45" stroke="url(#grad)" strokeWidth="2" />
        <rect x="0" y="20" width="10" height="10" rx="2" />
        <rect x="20" y="20" width="10" height="10" rx="2" />
        <rect x="10" y="40" width="10" height="10" rx="2" />
      </g>

      <text x="60" y="70" className="text">
        mdts
      </text>
    </svg>
  );
};

export default Logo;
