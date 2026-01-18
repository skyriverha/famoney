'use client';

import { useState, useEffect } from 'react';
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
  InputAdornment,
  Chip,
  Stack,
} from '@mui/material';
import { useExpenseStore } from '@/store/expenseStore';
import { PAYMENT_METHODS } from '@/lib/constants';
import type { CategoryResponse, ExpenseResponse } from '@/lib/api';

interface ExpenseEditDialogProps {
  open: boolean;
  onClose: () => void;
  ledgerId: string;
  expense: ExpenseResponse | null;
  categories: CategoryResponse[];
  onSuccess: () => void;
}

export default function ExpenseEditDialog({
  open,
  onClose,
  ledgerId,
  expense,
  categories,
  onSuccess,
}: ExpenseEditDialogProps) {
  const { updateExpense, isLoading } = useExpenseStore();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [error, setError] = useState<string | null>(null);

  // Initialize form with expense data when dialog opens
  useEffect(() => {
    if (expense && open) {
      setAmount(expense.amount.toLocaleString());
      setDescription(expense.description);
      setExpenseDate(expense.expenseDate);
      setCategoryId(expense.category?.id || '');
      setPaymentMethod(expense.paymentMethod || 'card');
      setError(null);
    }
  }, [expense, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expense) return;
    setError(null);

    const parsedAmount = parseFloat(amount.replace(/,/g, ''));
    if (!parsedAmount || parsedAmount <= 0) {
      setError('올바른 금액을 입력해주세요.');
      return;
    }

    if (!description.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }

    if (!expenseDate) {
      setError('날짜를 선택해주세요.');
      return;
    }

    try {
      await updateExpense(ledgerId, expense.id, {
        amount: parsedAmount,
        description: description.trim(),
        expenseDate,
        categoryId: categoryId || undefined,
        paymentMethod: paymentMethod || undefined,
      });
      handleClose();
      onSuccess();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('지출 수정에 실패했습니다.');
      }
    }
  };

  const handleClose = () => {
    setAmount('');
    setDescription('');
    setExpenseDate('');
    setCategoryId('');
    setPaymentMethod('card');
    setError(null);
    onClose();
  };

  const handleAmountChange = (value: string) => {
    // Allow only numbers and commas
    const cleaned = value.replace(/[^\d]/g, '');
    if (cleaned) {
      // Format with comma separators
      setAmount(Number(cleaned).toLocaleString());
    } else {
      setAmount('');
    }
  };

  const defaultCategories = categories.filter((c) => c.isDefault);
  const customCategories = categories.filter((c) => !c.isDefault);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 600 }}>지출 수정하기</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {/* Amount Input */}
            <TextField
              label="금액"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0"
              required
              fullWidth
              autoFocus
              InputProps={{
                endAdornment: <InputAdornment position="end">원</InputAdornment>,
                inputProps: { inputMode: 'numeric', style: { fontSize: '1.5rem', fontWeight: 600 } },
              }}
            />

            {/* Description */}
            <TextField
              label="내용"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="예: 점심 식사"
              required
              fullWidth
              inputProps={{ maxLength: 255 }}
            />

            {/* Date */}
            <TextField
              label="날짜"
              type="date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            {/* Category Selection */}
            <Box>
              <InputLabel sx={{ mb: 1, fontSize: '0.875rem' }}>카테고리</InputLabel>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                <Chip
                  label="없음"
                  onClick={() => setCategoryId('')}
                  color={!categoryId ? 'primary' : 'default'}
                  variant={!categoryId ? 'filled' : 'outlined'}
                />
                {defaultCategories.map((cat) => (
                  <Chip
                    key={cat.id}
                    label={cat.name}
                    onClick={() => setCategoryId(cat.id)}
                    color={categoryId === cat.id ? 'primary' : 'default'}
                    variant={categoryId === cat.id ? 'filled' : 'outlined'}
                    sx={{
                      borderColor: cat.color,
                      ...(categoryId === cat.id && { bgcolor: cat.color }),
                    }}
                  />
                ))}
                {customCategories.map((cat) => (
                  <Chip
                    key={cat.id}
                    label={cat.name}
                    onClick={() => setCategoryId(cat.id)}
                    color={categoryId === cat.id ? 'primary' : 'default'}
                    variant={categoryId === cat.id ? 'filled' : 'outlined'}
                    sx={{
                      borderColor: cat.color,
                      ...(categoryId === cat.id && { bgcolor: cat.color }),
                    }}
                  />
                ))}
              </Stack>
            </Box>

            {/* Payment Method */}
            <FormControl fullWidth>
              <InputLabel id="payment-method-label">결제 수단</InputLabel>
              <Select
                labelId="payment-method-label"
                value={paymentMethod}
                label="결제 수단"
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                {PAYMENT_METHODS.map((method) => (
                  <MenuItem key={method.value} value={method.value}>
                    {method.label}
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
            disabled={isLoading || !amount || !description.trim()}
            startIcon={isLoading ? <CircularProgress size={16} /> : null}
          >
            {isLoading ? '수정 중...' : '수정'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
