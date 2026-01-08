'use client';

import { Box, Container, Typography } from '@mui/material';
import TopAppBar from '@/components/layout/TopAppBar';

export default function ProfilePage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <TopAppBar title="프로필 설정" />
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h6" align="center" color="text.secondary">
          프로필 설정 페이지는 준비 중입니다
        </Typography>
      </Container>
    </Box>
  );
}

