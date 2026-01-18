'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  Typography,
} from '@mui/material';
import type { MemberRole, MemberResponse } from '@/lib/api';
import { useLedgerStore } from '@/store/ledgerStore';

interface RoleChangeDialogProps {
  open: boolean;
  onClose: () => void;
  ledgerId: string;
  member: MemberResponse | null;
  onSuccess: () => void;
}

const ROLES: { value: MemberRole; label: string; description: string }[] = [
  { value: 'ADMIN', label: '관리자', description: '멤버 관리 및 지출 기록 가능' },
  { value: 'MEMBER', label: '멤버', description: '지출 기록 및 조회 가능' },
  { value: 'VIEWER', label: '뷰어', description: '지출 조회만 가능' },
];

export default function RoleChangeDialog({
  open,
  onClose,
  ledgerId,
  member,
  onSuccess,
}: RoleChangeDialogProps) {
  const { updateMemberRole, isLoading } = useLedgerStore();
  const [role, setRole] = useState<MemberRole>('MEMBER');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (member && open) {
      setRole(member.role);
      setError(null);
    }
  }, [member, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;
    setError(null);

    if (role === member.role) {
      handleClose();
      return;
    }

    try {
      await updateMemberRole(ledgerId, member.id, { role });
      handleClose();
      onSuccess();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('역할 변경에 실패했습니다.');
      }
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  if (!member) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 600 }}>역할 변경</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <Typography variant="body2" color="text.secondary">
              <strong>{member.user.name}</strong> ({member.user.email})님의 역할을 변경합니다.
            </Typography>

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
            disabled={isLoading || role === member.role}
            startIcon={isLoading ? <CircularProgress size={16} /> : null}
          >
            {isLoading ? '변경 중...' : '변경'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
