'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Fab,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AddIcon from '@mui/icons-material/Add';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PeopleIcon from '@mui/icons-material/People';
import TopAppBar from '@/components/layout/TopAppBar';
import SideDrawer from '@/components/layout/SideDrawer';
import LedgerCreateDialog from '@/components/ledger/LedgerCreateDialog';
import { useAuthStore } from '@/store/authStore';
import { useLedgerStore } from '@/store/ledgerStore';
import type { MemberRole } from '@/lib/api';

const getRoleLabel = (role: MemberRole): string => {
  const labels: Record<MemberRole, string> = {
    OWNER: '소유자',
    ADMIN: '관리자',
    MEMBER: '멤버',
    VIEWER: '뷰어',
  };
  return labels[role];
};

const getRoleColor = (role: MemberRole): 'primary' | 'secondary' | 'default' | 'info' => {
  const colors: Record<MemberRole, 'primary' | 'secondary' | 'default' | 'info'> = {
    OWNER: 'primary',
    ADMIN: 'secondary',
    MEMBER: 'default',
    VIEWER: 'info',
  };
  return colors[role];
};

export default function LedgersPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { ledgers, isLoading, error, fetchLedgers, clearError } = useLedgerStore();
  const [showDrawer, setShowDrawer] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const loadLedgers = useCallback(async () => {
    try {
      await fetchLedgers();
    } catch {
      // Error is handled in store
    }
  }, [fetchLedgers]);

  useEffect(() => {
    // 인증 확인
    if (!user) {
      router.push('/login');
      return;
    }
    // 원장 목록 로드
    loadLedgers();
  }, [user, router, loadLedgers]);

  const handleCreateSuccess = () => {
    setShowCreateDialog(false);
  };

  if (!user) {
    return null;
  }

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

        {/* Error Alert */}
        {error && (
          <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

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
                내 소유
              </Typography>
              <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                {ledgers.filter((l) => l.myRole === 'OWNER').length}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ minWidth: 140, bgcolor: 'secondary.50', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                공유 받음
              </Typography>
              <Typography variant="h4" color="secondary.main" sx={{ fontWeight: 700 }}>
                {ledgers.filter((l) => l.myRole !== 'OWNER').length}
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
            onClick={() => setShowCreateDialog(true)}
          >
            새 원장
          </Button>
        </Box>

        {/* Loading State */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Empty State */}
        {!isLoading && ledgers.length === 0 ? (
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
              onClick={() => setShowCreateDialog(true)}
            >
              원장 만들기
            </Button>
          </Card>
        ) : !isLoading && (
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
                onClick={() => router.push(`/ledgers/${ledger.id}`)}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {ledger.name}
                        </Typography>
                        <Chip
                          label={getRoleLabel(ledger.myRole)}
                          color={getRoleColor(ledger.myRole)}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PeopleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {ledger.memberCount}명
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        · {ledger.currency}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary">
                      생성일: {new Date(ledger.createdAt).toLocaleDateString('ko-KR')}
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
        onClick={() => setShowCreateDialog(true)}
      >
        <AddIcon />
      </Fab>

      {/* Side Drawer */}
      <SideDrawer open={showDrawer} onClose={() => setShowDrawer(false)} />

      {/* Create Ledger Dialog */}
      <LedgerCreateDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={handleCreateSuccess}
      />
    </Box>
  );
}

