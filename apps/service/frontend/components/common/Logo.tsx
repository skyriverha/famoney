'use client';

import { Box } from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

const sizeMap = {
  small: { box: 40, icon: 24 },
  medium: { box: 56, icon: 32 },
  large: { box: 64, icon: 40 },
};

export default function Logo({ size = 'medium' }: LogoProps) {
  const dimensions = sizeMap[size];

  return (
    <Box
      sx={{
        width: dimensions.box,
        height: dimensions.box,
        borderRadius: 4,
        bgcolor: 'primary.main',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 3,
      }}
    >
      <CalculateIcon sx={{ fontSize: dimensions.icon, color: 'white' }} />
    </Box>
  );
}
