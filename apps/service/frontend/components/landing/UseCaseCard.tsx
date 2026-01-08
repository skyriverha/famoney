'use client';

import { Card, CardContent, Box, Typography } from '@mui/material';

interface UseCaseCardProps {
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  title: string;
  features: string[];
}

export default function UseCaseCard({
  icon,
  iconBgColor,
  iconColor,
  title,
  features,
}: UseCaseCardProps) {
  return (
    <Card sx={{ borderRadius: 4 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: iconBgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              '& svg': { color: iconColor },
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        <Box component="ul" sx={{ pl: 2, m: 0 }}>
          {features.map((feature, index) => (
            <Typography
              key={index}
              component="li"
              variant="body2"
              color="text.secondary"
              sx={{ mb: index < features.length - 1 ? 0.5 : 0 }}
            >
              {feature}
            </Typography>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
