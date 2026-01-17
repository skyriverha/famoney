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
import { useLedgerStore } from '@/store/ledgerStore';

interface LedgerCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CURRENCIES = [
  { value: 'KRW', label: '원 (KRW)' },
  { value: 'USD', label: '달러 (USD)' },
  { value: 'EUR', label: '유로 (EUR)' },
  { value: 'JPY', label: '엔 (JPY)' },
];

export default function LedgerCreateDialog({ open, onClose, onSuccess }: LedgerCreateDialogProps) {
  const { createLedger, isLoading } = useLedgerStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState('KRW');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('원장 이름을 입력해주세요.');
      return;
    }

    try {
      await createLedger({
        name: name.trim(),
        description: description.trim() || undefined,
        currency,
      });
      handleClose();
      onSuccess();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('원장 생성에 실패했습니다.');
      }
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setCurrency('KRW');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 600 }}>새 원장 만들기</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <TextField
              label="원장 이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 가족 가계부"
              required
              fullWidth
              autoFocus
              inputProps={{ maxLength: 100 }}
            />

            <TextField
              label="설명 (선택)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="원장에 대한 간단한 설명"
              multiline
              rows={2}
              fullWidth
              inputProps={{ maxLength: 500 }}
            />

            <FormControl fullWidth>
              <InputLabel id="currency-label">통화</InputLabel>
              <Select
                labelId="currency-label"
                value={currency}
                label="통화"
                onChange={(e) => setCurrency(e.target.value)}
              >
                {CURRENCIES.map((curr) => (
                  <MenuItem key={curr.value} value={curr.value}>
                    {curr.label}
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
            disabled={isLoading || !name.trim()}
            startIcon={isLoading ? <CircularProgress size={16} /> : null}
          >
            {isLoading ? '생성 중...' : '만들기'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
