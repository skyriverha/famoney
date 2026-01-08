'use client';

import { usePathname, useRouter } from 'next/navigation';
import { BottomNavigation as MuiBottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptIcon from '@mui/icons-material/Receipt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonIcon from '@mui/icons-material/Person';

const NAV_ITEMS = [
  { label: '홈', value: '/ledgers', icon: HomeIcon },
  { label: '지출', value: '/expenses', icon: ReceiptIcon },
  { label: '통계', value: '/statistics', icon: TrendingUpIcon },
  { label: '더보기', value: '/profile', icon: PersonIcon },
];

export default function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  // 현재 경로에 맞는 값 찾기
  const currentValue = NAV_ITEMS.find(item => pathname.startsWith(item.value))?.value || '/ledgers';

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    router.push(newValue);
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderTop: 1,
        borderColor: 'divider',
      }}
      elevation={3}
    >
      <MuiBottomNavigation
        value={currentValue}
        onChange={handleChange}
        showLabels
        sx={{
          height: 56,
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '6px 12px 8px',
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.75rem',
            marginTop: '4px',
          },
        }}
      >
        {NAV_ITEMS.map((item) => (
          <BottomNavigationAction
            key={item.value}
            label={item.label}
            value={item.value}
            icon={<item.icon />}
          />
        ))}
      </MuiBottomNavigation>
    </Paper>
  );
}

