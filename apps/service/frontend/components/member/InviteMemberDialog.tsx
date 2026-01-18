'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import type { MemberRole } from '@/lib/api';
import { useLedgerStore } from '@/store/ledgerStore';

interface InviteMemberDialogProps {
  open: boolean;
  onClose: () => void;
  ledgerId: string;
  onSuccess: () => void;
}

const ROLES: { value: MemberRole; label: string; description: string }[] = [
  { value: 'ADMIN', label: '관리자', description: '멤버 관리 및 지출 기록 가능' },
  { value: 'MEMBER', label: '멤버', description: '지출 기록 및 조회 가능' },
  { value: 'VIEWER', label: '뷰어', description: '지출 조회만 가능' },
];

export default function InviteMemberDialog({
  open,
  onClose,
  ledgerId,
  onSuccess,
}: InviteMemberDialogProps) {
  const { inviteMember, isLoading } = useLedgerStore();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<MemberRole>('MEMBER');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('이메일을 입력해주세요.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    try {
      await inviteMember(ledgerId, { email: email.trim(), role });
      handleClose();
      onSuccess();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('멤버 초대에 실패했습니다.');
      }
    }
  };

  const handleClose = () => {
    setEmail('');
    setRole('MEMBER');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 600 }}>멤버 초대</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {/* Email Input */}
            <TextField
              label="이메일"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
              fullWidth
              autoFocus
              helperText="초대할 사용자의 이메일을 입력하세요"
            />

            {/* Role Selection */}
            <FormControl fullWidth>
              <InputLabel id="role-label">역할</InputLabel>
              <Select
                labelId="role-label"
                value={role}
                label="역할"
                onChange={(e) => setRole(e.target.value as MemberRole)}
              >
                {ROLES.map((r) => (
                  <MenuItem key={r.value} value={r.value}>
                    <Box>
                      <Box sx={{ fontWeight: 500 }}>{r.label}</Box>
                      <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                        {r.description}
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={isLoading}>
            취소
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || !email.trim()}
            startIcon={isLoading ? <CircularProgress size={16} /> : null}
          >
            {isLoading ? '초대 중...' : '초대'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
