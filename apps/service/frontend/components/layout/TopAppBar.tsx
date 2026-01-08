'use client';

import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';

interface TopAppBarProps {
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  rightAction?: React.ReactNode;
}

export default function TopAppBar({
  title,
  showBackButton = false,
  onBackClick,
  rightAction,
}: TopAppBarProps) {
  const router = useRouter();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
      <Toolbar
        sx={{
          minHeight: 56,
          height: 56,
          px: 1,
        }}
      >
        {showBackButton && (
          <IconButton
            edge="start"
            onClick={handleBackClick}
            sx={{ mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}
        
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            textAlign: showBackButton ? 'center' : 'left',
            fontWeight: 600,
            fontSize: '1rem',
            pr: showBackButton ? 6 : 0,
          }}
        >
          {title}
        </Typography>

        {rightAction && (
          <Box sx={{ ml: 'auto' }}>
            {rightAction}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

