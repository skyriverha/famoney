'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import TopAppBar from '@/components/layout/TopAppBar';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { useAuthStore } from '@/store/authStore';
import { useLedgerStore } from '@/store/ledgerStore';
import { useExpenseStore } from '@/store/expenseStore';
import { CHART_COLORS, PAGINATION } from '@/lib/constants';
import type { ExpenseResponse, CategoryResponse } from '@/lib/api';

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
  }).format(date);
}

interface CategoryStat {
  name: string;
  value: number;
  color: string;
  percent: number;
}

interface MonthStat {
  month: string;
  amount: number;
}

export default function StatisticsPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { ledgers, fetchLedgers } = useLedgerStore();
  const {
    expenses,
    categories,
    fetchExpenses,
    fetchCategories,
    isLoading: expensesLoading,
    error,
    clearError,
  } = useExpenseStore();

  const [selectedLedgerId, setSelectedLedgerId] = useState<string>('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Load ledgers on mount
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const loadLedgers = async () => {
      try {
        await fetchLedgers();
      } catch {
        // Error handled in store
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadLedgers();
  }, [user, router, fetchLedgers]);

  // Auto-select first ledger
  useEffect(() => {
    if (ledgers.length > 0 && !selectedLedgerId) {
      setSelectedLedgerId(ledgers[0].id);
    }
  }, [ledgers, selectedLedgerId]);

  // Load expenses when ledger is selected
  const loadExpenses = useCallback(async () => {
    if (!selectedLedgerId) return;
    try {
      // Fetch all expenses for statistics (large page size)
      await Promise.all([
        fetchExpenses(selectedLedgerId, { size: PAGINATION.STATISTICS_PAGE_SIZE }),
        fetchCategories(selectedLedgerId),
      ]);
    } catch {
      // Error handled in store
    }
  }, [selectedLedgerId, fetchExpenses, fetchCategories]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (expenses.length === 0) {
      return {
        thisMonth: 0,
        lastMonth: 0,
        thisYear: 0,
        changePercent: 0,
        categoryStats: [] as CategoryStat[],
        monthlyStats: [] as MonthStat[],
        recentExpenses: [] as ExpenseResponse[],
      };
    }

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const thisYearStart = new Date(now.getFullYear(), 0, 1);

    let thisMonth = 0;
    let lastMonth = 0;
    let thisYear = 0;

    const categoryMap = new Map<string, number>();
    const monthlyMap = new Map<string, number>();

    expenses.forEach((expense) => {
      const expenseDate = new Date(expense.expenseDate);

      // This month
      if (expenseDate >= thisMonthStart) {
        thisMonth += expense.amount;
      }

      // Last month
      if (expenseDate >= lastMonthStart && expenseDate <= lastMonthEnd) {
        lastMonth += expense.amount;
      }

      // This year
      if (expenseDate >= thisYearStart) {
        thisYear += expense.amount;
      }

      // Category stats
      const categoryName = expense.category?.name || '미분류';
      categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + expense.amount);

      // Monthly stats (last 6 months)
      const monthKey = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, '0')}`;
      monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + expense.amount);
    });

    // Calculate change percent
    const changePercent = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;

    // Category stats
    const totalAmount = Array.from(categoryMap.values()).reduce((a, b) => a + b, 0);
    const categoryStats: CategoryStat[] = Array.from(categoryMap.entries())
      .map(([name, value], index) => ({
        name,
        value,
        color: categories.find((c) => c.name === name)?.color || CHART_COLORS[index % CHART_COLORS.length],
        percent: totalAmount > 0 ? (value / totalAmount) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value);

    // Monthly stats (last 6 months)
    const monthlyStats: MonthStat[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyStats.push({
        month: `${d.getMonth() + 1}월`,
        amount: monthlyMap.get(key) || 0,
      });
    }

    // Recent expenses (top 5)
    const recentExpenses = [...expenses]
      .sort((a, b) => new Date(b.expenseDate).getTime() - new Date(a.expenseDate).getTime())
      .slice(0, 5);

    return {
      thisMonth,
      lastMonth,
      thisYear,
      changePercent,
      categoryStats,
      monthlyStats,
      recentExpenses,
    };
  }, [expenses, categories]);

  if (!user) return null;

  const selectedLedger = ledgers.find((l) => l.id === selectedLedgerId);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', pb: 10 }}>
      <TopAppBar title="통계" />

      <Container maxWidth="sm" sx={{ py: 3 }}>
        {/* Error Alert */}
        {error && (
          <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {isInitialLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {!isInitialLoading && ledgers.length === 0 && (
          <Card sx={{ borderRadius: 3, textAlign: 'center', py: 6 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              원장이 없습니다
            </Typography>
            <Typography variant="body2" color="text.secondary">
              먼저 원장을 생성해주세요
            </Typography>
          </Card>
        )}

        {!isInitialLoading && ledgers.length > 0 && (
          <>
            {/* Ledger Selector */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="ledger-select-label">원장 선택</InputLabel>
              <Select
                labelId="ledger-select-label"
                value={selectedLedgerId}
                label="원장 선택"
                onChange={(e) => setSelectedLedgerId(e.target.value)}
              >
                {ledgers.map((ledger) => (
                  <MenuItem key={ledger.id} value={ledger.id}>
                    {ledger.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {expensesLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {!expensesLoading && selectedLedger && (
              <>
                {/* Summary Cards */}
                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                  <Card sx={{ flex: 1, borderRadius: 3 }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        이번 달
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {formatCurrency(stats.thisMonth, selectedLedger.currency)}
                      </Typography>
                      {stats.changePercent !== 0 && (
                        <Chip
                          size="small"
                          icon={stats.changePercent > 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                          label={`${stats.changePercent > 0 ? '+' : ''}${stats.changePercent.toFixed(1)}%`}
                          color={stats.changePercent > 0 ? 'error' : 'success'}
                          sx={{ mt: 0.5 }}
                        />
                      )}
                    </CardContent>
                  </Card>
                  <Card sx={{ flex: 1, borderRadius: 3 }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        올해 총
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {formatCurrency(stats.thisYear, selectedLedger.currency)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Stack>

                {/* Category Pie Chart */}
                {stats.categoryStats.length > 0 && (
                  <Card sx={{ mb: 3, borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        카테고리별 지출
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ResponsiveContainer width="50%" height={200}>
                          <PieChart>
                            <Pie
                              data={stats.categoryStats}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={80}
                              dataKey="value"
                            >
                              {stats.categoryStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value: number) =>
                                formatCurrency(value, selectedLedger.currency)
                              }
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <Box sx={{ flex: 1, pl: 2 }}>
                          {stats.categoryStats.slice(0, 5).map((cat, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%',
                                  bgcolor: cat.color,
                                  mr: 1,
                                }}
                              />
                              <Typography variant="body2" sx={{ flex: 1 }}>
                                {cat.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {cat.percent.toFixed(0)}%
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                )}

                {/* Monthly Bar Chart */}
                {stats.monthlyStats.some((m) => m.amount > 0) && (
                  <Card sx={{ mb: 3, borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        월별 지출 추이
                      </Typography>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={stats.monthlyStats}>
                          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 10 }} width={60} />
                          <Tooltip
                            formatter={(value: number) =>
                              formatCurrency(value, selectedLedger.currency)
                            }
                          />
                          <Bar dataKey="amount" fill="#2563eb" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}

                {/* Recent Expenses */}
                {stats.recentExpenses.length > 0 && (
                  <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        최근 지출
                      </Typography>
                      <List disablePadding>
                        {stats.recentExpenses.map((expense, index) => (
                          <Box key={expense.id}>
                            {index > 0 && <Divider />}
                            <ListItem sx={{ px: 0, py: 1 }}>
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  bgcolor: expense.category?.color || '#808080',
                                  mr: 2,
                                  fontSize: 14,
                                }}
                              >
                                {expense.category?.name?.[0] || '💸'}
                              </Avatar>
                              <ListItemText
                                primary={expense.description}
                                secondary={formatDate(expense.expenseDate)}
                              />
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {formatCurrency(expense.amount, selectedLedger.currency)}
                              </Typography>
                            </ListItem>
                          </Box>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                )}

                {/* Empty State */}
                {expenses.length === 0 && (
                  <Card sx={{ borderRadius: 3, textAlign: 'center', py: 6 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      지출 기록이 없습니다
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      지출을 기록하면 통계를 확인할 수 있습니다
                    </Typography>
                  </Card>
                )}
              </>
            )}
          </>
        )}
      </Container>

      <BottomNavigation />
    </Box>
  );
}
