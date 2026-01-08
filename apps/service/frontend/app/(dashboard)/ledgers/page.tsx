'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Avatar,
  AvatarGroup,
  Fab,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AddIcon from '@mui/icons-material/Add';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PeopleIcon from '@mui/icons-material/People';
import TopAppBar from '@/components/layout/TopAppBar';
import SideDrawer from '@/components/layout/SideDrawer';
import { useAuthStore } from '@/store/authStore';
import type { Ledger } from '@/types';

export default function LedgersPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [showDrawer, setShowDrawer] = useState(false);
  const [ledgers, setLedgers] = useState<Ledger[]>([]);

  useEffect(() => {
    // 인증 확인
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const totalExpenses = ledgers.reduce((sum, ledger) => sum + ledger.monthlyTotal, 0);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <TopAppBar
        title="FaMoney"
        rightAction={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton>
              <NotificationsIcon />
            </IconButton>
            <IconButton onClick={() => setShowDrawer(true)}>
              <MenuIcon />
            </IconButton>
          </Box>
        }
      />

      <Container maxWidth="sm" sx={{ py: 3 }}>
        {/* Greeting */}
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          안녕하세요, {user.name}님
        </Typography>

        {/* Quick Stats */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'auto',
            mb: 4,
            pb: 1,
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          <Card sx={{ minWidth: 140, bgcolor: 'primary.50', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                총 원장 수
              </Typography>
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>
                {ledgers.length}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ minWidth: 140, bgcolor: 'success.50', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                이번 달 지출
              </Typography>
              <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                {totalExpenses.toLocaleString()}원
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ minWidth: 140, bgcolor: 'secondary.50', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                최근 활동
              </Typography>
              <Typography variant="h4" color="secondary.main" sx={{ fontWeight: 700 }}>
                {ledgers.filter((l) => l.expenses.length > 0).length}개
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Ledger List Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            내 원장
          </Typography>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => alert('원장 생성 기능은 준비 중입니다')}
          >
            새 원장
          </Button>
        </Box>

        {/* Empty State */}
        {ledgers.length === 0 ? (
          <Card sx={{ borderRadius: 4, textAlign: 'center', py: 6 }}>
            <Box
              sx={{
                width: 96,
                height: 96,
                borderRadius: '50%',
                bgcolor: 'primary.50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <Typography sx={{ fontSize: 48 }}>📊</Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              아직 원장이 없습니다
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              첫 원장을 만들어 지출 관리를 시작하세요
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => alert('원장 생성 기능은 준비 중입니다')}
            >
              원장 만들기
            </Button>
          </Card>
        ) : (
          /* Ledger List */
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {ledgers.map((ledger) => (
              <Card
                key={ledger.id}
                sx={{
                  borderRadius: 4,
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s',
                  '&:hover': {
                    boxShadow: 4,
                  },
                }}
                onClick={() => alert('원장 상세 페이지는 준비 중입니다')}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {ledger.name}
                      </Typography>
                      {ledger.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {ledger.description}
                        </Typography>
                      )}
                    </Box>
                    <ChevronRightIcon sx={{ color: 'text.secondary', mt: 0.5 }} />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 32, height: 32, fontSize: '0.875rem' } }}>
                        {ledger.members.slice(0, 3).map((member, idx) => (
                          <Avatar key={idx} src={member.avatar}>
                            {member.name.charAt(0)}
                          </Avatar>
                        ))}
                      </AvatarGroup>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PeopleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {ledger.memberCount}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                        {ledger.monthlyTotal.toLocaleString()}원
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        이번 달
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary">
                      마지막 업데이트: {new Date(ledger.lastUpdated).toLocaleDateString('ko-KR')}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>

      {/* FAB */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 16,
        }}
        onClick={() => alert('원장 생성 기능은 준비 중입니다')}
      >
        <AddIcon />
      </Fab>

      {/* Side Drawer */}
      <SideDrawer open={showDrawer} onClose={() => setShowDrawer(false)} />
    </Box>
  );
}

