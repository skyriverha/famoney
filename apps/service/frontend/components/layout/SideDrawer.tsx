'use client';

import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Box, Typography, Divider } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface SideDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function SideDrawer({ open, onClose }: SideDrawerProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    onClose();
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
        },
      }}
    >
      {/* User Profile Section */}
      <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
        <Avatar
          src={user?.avatar}
          sx={{ width: 64, height: 64, mb: 2 }}
        >
          {user?.name?.charAt(0)}
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {user?.name}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          {user?.email}
        </Typography>
      </Box>

      <List sx={{ pt: 2 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation('/ledgers')}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="내 원장" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation('/profile')}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="프로필 설정" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation('/notifications')}>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText primary="알림 설정" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation('/help')}>
            <ListItemIcon>
              <HelpIcon />
            </ListItemIcon>
            <ListItemText primary="도움말" />
          </ListItemButton>
        </ListItem>

        <Divider sx={{ my: 1 }} />

        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon color="error" />
            </ListItemIcon>
            <ListItemText primary="로그아웃" sx={{ color: 'error.main' }} />
          </ListItemButton>
        </ListItem>
      </List>

      <Box sx={{ p: 2, mt: 'auto', textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          FaMoney v0.0.1
        </Typography>
      </Box>
    </Drawer>
  );
}

