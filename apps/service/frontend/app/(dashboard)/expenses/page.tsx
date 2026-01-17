'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Chip,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TopAppBar from '@/components/layout/TopAppBar';
import { useAuthStore } from '@/store/authStore';
import { useLedgerStore } from '@/store/ledgerStore';

export default function ExpensesPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { ledgers, isLoading, fetchLedgers } = useLedgerStore();

  const loadLedgers = useCallback(async () => {
    try {
      await fetchLedgers();
    } catch {
      // Error handled in store
    }
  }, [fetchLedgers]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadLedgers();
  }, [user, router, loadLedgers]);

  // If only one ledger, redirect directly
  useEffect(() => {
    if (!isLoading && ledgers.length === 1) {
      router.push(`/ledgers/${ledgers[0].id}`);
    }
  }, [isLoading, ledgers, router]);

  if (!user) return null;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <TopAppBar title="지출 기록" />

      <Container maxWidth="sm" sx={{ py: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          원장 선택
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          지출을 기록할 원장을 선택해주세요
        </Typography>

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {!isLoading && ledgers.length === 0 && (
          <Card sx={{ borderRadius: 4, textAlign: 'center', py: 6 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              원장이 없습니다
            </Typography>
            <Typography variant="body2" color="text.secondary">
              먼저 원장을 생성해주세요
            </Typography>
          </Card>
        )}

        {!isLoading && ledgers.length > 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {ledgers.map((ledger) => (
              <Card
                key={ledger.id}
                sx={{
                  borderRadius: 3,
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s',
                  '&:hover': {
                    boxShadow: 4,
                  },
                }}
                onClick={() => router.push(`/ledgers/${ledger.id}`)}
              >
                <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {ledger.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                      <Chip
                        label={`${ledger.memberCount}명`}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={ledger.currency}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  <ChevronRightIcon sx={{ color: 'text.secondary' }} />
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
