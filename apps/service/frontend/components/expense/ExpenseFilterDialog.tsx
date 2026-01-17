'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Chip,
  Stack,
  InputLabel,
  Typography,
} from '@mui/material';
import type { CategoryResponse, ExpenseFilters } from '@/lib/api';

interface ExpenseFilterDialogProps {
  open: boolean;
  onClose: () => void;
  categories: CategoryResponse[];
  currentFilters: ExpenseFilters;
  onApply: (filters: { startDate?: string; endDate?: string; categoryId?: string }) => void;
}

export default function ExpenseFilterDialog({
  open,
  onClose,
  categories,
  currentFilters,
  onApply,
}: ExpenseFilterDialogProps) {
  const [startDate, setStartDate] = useState(currentFilters.startDate || '');
  const [endDate, setEndDate] = useState(currentFilters.endDate || '');
  const [categoryId, setCategoryId] = useState(currentFilters.categoryId || '');

  const handleApply = () => {
    onApply({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      categoryId: categoryId || undefined,
    });
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    setCategoryId('');
    onApply({});
  };

  // Quick date presets
  const setThisMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  const setLastMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  const setThisYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear(), 11, 31);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  const defaultCategories = categories.filter((c) => c.isDefault);
  const customCategories = categories.filter((c) => !c.isDefault);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>필터</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          {/* Date Range */}
          <Box>
            <InputLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>기간</InputLabel>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip
                label="이번 달"
                onClick={setThisMonth}
                variant="outlined"
                size="small"
              />
              <Chip
                label="지난 달"
                onClick={setLastMonth}
                variant="outlined"
                size="small"
              />
              <Chip
                label="올해"
                onClick={setThisYear}
                variant="outlined"
                size="small"
              />
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField
                label="시작일"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
              />
              <Typography sx={{ alignSelf: 'center' }}>~</Typography>
              <TextField
                label="종료일"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
          </Box>

          {/* Category Filter */}
          <Box>
            <InputLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>카테고리</InputLabel>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              <Chip
                label="전체"
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
                    ...(categoryId === cat.id && { bgcolor: cat.color, color: 'white' }),
                  }}
                />
              ))}
              {customCategories.length > 0 && (
                <>
                  {customCategories.map((cat) => (
                    <Chip
                      key={cat.id}
                      label={cat.name}
                      onClick={() => setCategoryId(cat.id)}
                      color={categoryId === cat.id ? 'primary' : 'default'}
                      variant={categoryId === cat.id ? 'filled' : 'outlined'}
                      sx={{
                        borderColor: cat.color,
                        ...(categoryId === cat.id && { bgcolor: cat.color, color: 'white' }),
                      }}
                    />
                  ))}
                </>
              )}
            </Stack>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
        <Button onClick={handleClear} color="inherit">
          초기화
        </Button>
        <Box>
          <Button onClick={onClose} sx={{ mr: 1 }}>
            취소
          </Button>
          <Button onClick={handleApply} variant="contained">
            적용
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
