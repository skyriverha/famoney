'use client';

import { Card, CardContent, Box, Typography } from '@mui/material';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  iconBgColor: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  bgColor,
  iconBgColor,
}: FeatureCardProps) {
  return (
    <Card
      sx={{
        bgcolor: bgColor,
        borderRadius: 4,
        boxShadow: 'none',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 3,
            bgcolor: iconBgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}
