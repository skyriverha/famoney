'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Fab,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
  Button,
  Stack,
  Avatar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import TopAppBar from '@/components/layout/TopAppBar';
import ExpenseCreateDialog from '@/components/expense/ExpenseCreateDialog';
import ExpenseEditDialog from '@/components/expense/ExpenseEditDialog';
import ExpenseFilterDialog from '@/components/expense/ExpenseFilterDialog';
import { useAuthStore } from '@/store/authStore';
import { useLedgerStore } from '@/store/ledgerStore';
import { useExpenseStore } from '@/store/expenseStore';
import type { ExpenseResponse, MemberRole } from '@/lib/api';

function formatCurrency(amount: number, currency: string = 'KRW'): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  }).format(date);
}

function groupExpensesByDate(expenses: ExpenseResponse[]): Map<string, ExpenseResponse[]> {
  const groups = new Map<string, ExpenseResponse[]>();
  expenses.forEach((expense) => {
    const date = expense.expenseDate;
    if (!groups.has(date)) {
      groups.set(date, []);
    }
    groups.get(date)!.push(expense);
  });
  return groups;
}

function canWriteExpenses(role: MemberRole): boolean {
  return role !== 'VIEWER';
}

export default function LedgerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const ledgerId = params.ledgerId as string;

  const user = useAuthStore((state) => state.user);
  const { currentLedger, fetchLedger, isLoading: ledgerLoading, error: ledgerError } = useLedgerStore();
  const {
    expenses,
    categories,
    pagination,
    filters,
    isLoading: expensesLoading,
    error: expensesError,
    fetchExpenses,
    fetchCategories,
    deleteExpense,
    clearError,
  } = useExpenseStore();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseResponse | null>(null);

  const loadData = useCallback(async () => {
    if (!ledgerId) return;
    try {
      await Promise.all([
        fetchLedger(ledgerId),
        fetchExpenses(ledgerId),
        fetchCategories(ledgerId),
      ]);
    } catch {
      // Errors handled in store
    }
  }, [ledgerId, fetchLedger, fetchExpenses, fetchCategories]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadData();
  }, [user, router, loadData]);

  const handleExpenseClick = (event: React.MouseEvent<HTMLElement>, expense: ExpenseResponse) => {
    setSelectedExpense(expense);
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleEditExpense = () => {
    setMenuAnchor(null);
    setShowEditDialog(true);
  };

  const handleDeleteExpense = async () => {
    if (!selectedExpense) return;
    try {
      await deleteExpense(ledgerId, selectedExpense.id);
      handleMenuClose();
    } catch {
      // Error handled in store
    }
  };

  const handleApplyFilters = async (newFilters: { startDate?: string; endDate?: string; categoryId?: string }) => {
    await fetchExpenses(ledgerId, { ...newFilters, page: 0 });
    setShowFilterDialog(false);
  };

  const handleLoadMore = async () => {
    if (pagination.page < pagination.totalPages - 1) {
      await fetchExpenses(ledgerId, { ...filters, page: pagination.page + 1 });
    }
  };

  if (!user) return null;

  const isLoading = ledgerLoading || expensesLoading;
  const error = ledgerError || expensesError;
  const groupedExpenses = groupExpensesByDate(expenses);
  const canWrite = currentLedger ? canWriteExpenses(currentLedger.myRole) : false;

  // Calculate total for current view
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <TopAppBar
        title={currentLedger?.name || '로딩 중...'}
        showBackButton
        onBackClick={() => router.push('/ledgers')}
        rightAction={
          <IconButton onClick={() => setShowFilterDialog(true)}>
            <FilterListIcon />
          </IconButton>
        }
      />

      <Container maxWidth="sm" sx={{ py: 3 }}>
        {/* Error Alert */}
        {error && (
          <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Summary Card */}
        {currentLedger && (
          <Card sx={{ mb: 3, borderRadius: 4 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {filters.startDate || filters.endDate
                  ? `${filters.startDate || '시작'} ~ ${filters.endDate || '종료'}`
                  : '전체 기간'}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {formatCurrency(totalAmount, currentLedger.currency)}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Chip
                  label={`${pagination.totalElements}건`}
                  size="small"
                  variant="outlined"
                />
                {filters.categoryId && (
                  <Chip
                    label={categories.find(c => c.id === filters.categoryId)?.name || '카테고리'}
                    size="small"
                    color="primary"
                    onDelete={() => handleApplyFilters({ ...filters, categoryId: undefined })}
                  />
                )}
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && expenses.length === 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Empty State */}
        {!isLoading && expenses.length === 0 && (
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
              <Typography sx={{ fontSize: 48 }}>💰</Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              아직 지출 기록이 없습니다
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              첫 지출을 기록해보세요
            </Typography>
            {canWrite && (
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => setShowCreateDialog(true)}
              >
                지출 기록하기
              </Button>
            )}
          </Card>
        )}

        {/* Expense List */}
        {expenses.length > 0 && (
          <Box>
            {Array.from(groupedExpenses.entries()).map(([date, dayExpenses]) => (
              <Box key={date} sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: 'text.secondary',
                    mb: 1,
                    fontWeight: 600,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{formatDate(date)}</span>
                  <span>
                    {formatCurrency(
                      dayExpenses.reduce((sum, e) => sum + e.amount, 0),
                      currentLedger?.currency
                    )}
                  </span>
                </Typography>
                <Card sx={{ borderRadius: 3 }}>
                  <List disablePadding>
                    {dayExpenses.map((expense, index) => (
                      <Box key={expense.id}>
                        {index > 0 && <Divider />}
                        <ListItem
                          sx={{
                            py: 1.5,
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'action.hover' },
                          }}
                          onClick={(e) => handleExpenseClick(e, expense)}
                        >
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 2,
                              bgcolor: expense.category?.color || '#808080',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 2,
                              fontSize: 20,
                            }}
                          >
                            {expense.category?.icon ? (
                              <span className="material-icons" style={{ fontSize: 20, color: 'white' }}>
                                {expense.category.icon}
                              </span>
                            ) : (
                              '💸'
                            )}
                          </Box>
                          <ListItemText
                            primary={expense.description}
                            secondary={
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Avatar
                                  src={expense.createdByUser.profileImage || undefined}
                                  sx={{ width: 16, height: 16 }}
                                >
                                  {expense.createdByUser.displayName[0]}
                                </Avatar>
                                <Typography variant="caption" color="text.secondary">
                                  {expense.createdByUser.displayName}
                                </Typography>
                                {expense.paymentMethod && (
                                  <Chip
                                    label={expense.paymentMethod}
                                    size="small"
                                    sx={{ height: 18, fontSize: '0.7rem' }}
                                  />
                                )}
                              </Stack>
                            }
                          />
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {formatCurrency(expense.amount, currentLedger?.currency)}
                          </Typography>
                        </ListItem>
                      </Box>
                    ))}
                  </List>
                </Card>
              </Box>
            ))}

            {/* Load More Button */}
            {!pagination.last && (
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleLoadMore}
                  disabled={expensesLoading}
                >
                  {expensesLoading ? <CircularProgress size={20} /> : '더 보기'}
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Container>

      {/* FAB for adding expense */}
      {canWrite && (
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
      )}

      {/* Expense Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditExpense}>수정</MenuItem>
        <MenuItem onClick={handleDeleteExpense} sx={{ color: 'error.main' }}>
          삭제
        </MenuItem>
      </Menu>

      {/* Create Expense Dialog */}
      <ExpenseCreateDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        ledgerId={ledgerId}
        categories={categories}
        onSuccess={() => {
          setShowCreateDialog(false);
          fetchExpenses(ledgerId, { page: 0 });
        }}
      />

      {/* Edit Expense Dialog */}
      <ExpenseEditDialog
        open={showEditDialog}
        onClose={() => {
          setShowEditDialog(false);
          setSelectedExpense(null);
        }}
        ledgerId={ledgerId}
        expense={selectedExpense}
        categories={categories}
        onSuccess={() => {
          setShowEditDialog(false);
          setSelectedExpense(null);
          fetchExpenses(ledgerId, { page: 0 });
        }}
      />

      {/* Filter Dialog */}
      <ExpenseFilterDialog
        open={showFilterDialog}
        onClose={() => setShowFilterDialog(false)}
        categories={categories}
        currentFilters={filters}
        onApply={handleApplyFilters}
      />
    </Box>
  );
}
