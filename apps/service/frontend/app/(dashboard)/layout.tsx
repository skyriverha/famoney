'use client';

import { Box } from '@mui/material';
import { usePathname } from 'next/navigation';
import BottomNavigation from '@/components/layout/BottomNavigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // 하단 네비게이션을 표시할 경로들
  const showBottomNav = ['/ledgers', '/expenses', '/statistics', '/profile'].some(
    path => pathname.startsWith(path)
  );

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box
        component="main"
        sx={{
          flex: 1,
          pb: showBottomNav ? 7 : 0,
          overflow: 'auto',
        }}
      >
        {children}
      </Box>
      {showBottomNav && <BottomNavigation />}
    </Box>
  );
}

