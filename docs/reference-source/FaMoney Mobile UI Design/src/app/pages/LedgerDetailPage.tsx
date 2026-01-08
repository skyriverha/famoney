import { useState } from 'react';
import { ArrowLeft, MoreVertical, Plus, Users as UsersIcon, Settings, TrendingUp, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ExpenseItem } from '../components/ExpenseItem';
import { AddExpenseSheet } from '../components/AddExpenseSheet';
import { FilterSheet } from '../components/FilterSheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import type { Page, Ledger, Expense, Category } from '../App';

interface LedgerDetailPageProps {
  ledger: Ledger;
  onNavigate: (page: Page, data?: any) => void;
  onUpdateLedger: (ledger: Ledger) => void;
}

export function LedgerDetailPage({ ledger, onNavigate, onUpdateLedger }: LedgerDetailPageProps) {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [filters, setFilters] = useState({
    categories: [] as Category[],
    dateRange: { start: '', end: '' },
    sortBy: 'date' as 'date' | 'amount',
  });

  const handleAddExpense = (expenseData: Omit<Expense, 'id' | 'createdBy' | 'createdByName' | 'createdByAvatar'>) => {
    const currentUser = ledger.members[0]; // Assuming first member is current user
    const newExpense: Expense = {
      ...expenseData,
      id: Math.random().toString(36).substr(2, 9),
      createdBy: currentUser.id,
      createdByName: currentUser.name,
      createdByAvatar: currentUser.avatar,
    };

    const updatedLedger = {
      ...ledger,
      expenses: [...ledger.expenses, newExpense],
      monthlyTotal: ledger.monthlyTotal + expenseData.amount,
      lastUpdated: new Date().toISOString(),
    };

    onUpdateLedger(updatedLedger);
    setShowAddExpense(false);
  };

  const handleUpdateExpense = (expenseData: Omit<Expense, 'id' | 'createdBy' | 'createdByName' | 'createdByAvatar'>) => {
    if (!editingExpense) return;

    const updatedExpenses = ledger.expenses.map(exp =>
      exp.id === editingExpense.id
        ? { ...exp, ...expenseData }
        : exp
    );

    const updatedLedger = {
      ...ledger,
      expenses: updatedExpenses,
      monthlyTotal: updatedExpenses.reduce((sum, exp) => sum + exp.amount, 0),
      lastUpdated: new Date().toISOString(),
    };

    onUpdateLedger(updatedLedger);
    setEditingExpense(null);
    setShowAddExpense(false);
  };

  const handleDeleteExpense = (expenseId: string) => {
    const expense = ledger.expenses.find(e => e.id === expenseId);
    if (!expense) return;

    const updatedLedger = {
      ...ledger,
      expenses: ledger.expenses.filter(e => e.id !== expenseId),
      monthlyTotal: ledger.monthlyTotal - expense.amount,
      lastUpdated: new Date().toISOString(),
    };

    onUpdateLedger(updatedLedger);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setShowAddExpense(true);
  };

  // Group expenses by date
  const groupedExpenses = ledger.expenses.reduce((groups, expense) => {
    const date = new Date(expense.date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateLabel: string;
    if (date.toDateString() === today.toDateString()) {
      dateLabel = '오늘';
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateLabel = '어제';
    } else {
      dateLabel = date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }

    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }
    groups[dateLabel].push(expense);
    return groups;
  }, {} as Record<string, Expense[]>);

  const expenseCount = ledger.expenses.length;
  const averageExpense = expenseCount > 0 ? Math.round(ledger.monthlyTotal / expenseCount) : 0;

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Top App Bar */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between h-14 px-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-10 h-10 flex items-center justify-center -ml-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-semibold flex-1 text-center px-4 truncate">
            {ledger.name}
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-10 h-10 flex items-center justify-center">
                <MoreVertical className="w-6 h-6" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => onNavigate('member-management', { currentLedger: ledger })}
              >
                <UsersIcon className="w-4 h-4 mr-2" />
                멤버 관리
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                원장 설정
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Header Section */}
      <div className="bg-white px-4 py-4 border-b border-gray-200">
        {ledger.description && (
          <p className="text-sm text-gray-600 mb-4">{ledger.description}</p>
        )}

        {/* Summary Cards */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          <div className="flex-shrink-0 bg-blue-50 rounded-xl p-4 min-w-[140px]">
            <p className="text-sm text-gray-600 mb-1">이번 달 지출</p>
            <p className="text-xl font-bold text-blue-600">
              {ledger.monthlyTotal.toLocaleString()}원
            </p>
          </div>
          <div className="flex-shrink-0 bg-green-50 rounded-xl p-4 min-w-[140px]">
            <p className="text-sm text-gray-600 mb-1">지출 건수</p>
            <p className="text-xl font-bold text-green-600">{expenseCount}건</p>
          </div>
          <div className="flex-shrink-0 bg-purple-50 rounded-xl p-4 min-w-[140px]">
            <p className="text-sm text-gray-600 mb-1">평균 지출</p>
            <p className="text-xl font-bold text-purple-600">
              {averageExpense.toLocaleString()}원
            </p>
          </div>
          <div className="flex-shrink-0 bg-orange-50 rounded-xl p-4 min-w-[140px]">
            <p className="text-sm text-gray-600 mb-1">멤버 수</p>
            <p className="text-xl font-bold text-orange-600">{ledger.memberCount}명</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onNavigate('statistics', { currentLedger: ledger })}
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            통계
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilter(true)}
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Expense List */}
      <div className="px-4 py-4">
        {ledger.expenses.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">💸</span>
            </div>
            <h4 className="text-lg font-semibold mb-2">아직 지출 기록이 없습니다</h4>
            <p className="text-gray-600 mb-6">첫 지출을 기록해보세요</p>
            <Button onClick={() => setShowAddExpense(true)} className="h-12">
              <Plus className="w-5 h-5 mr-2" />
              지출 기록하기
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedExpenses).map(([date, expenses]) => (
              <div key={date}>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 sticky top-14 bg-gray-50 py-2">
                  {date}
                </h3>
                <div className="space-y-2">
                  {expenses.map((expense) => (
                    <ExpenseItem
                      key={expense.id}
                      expense={expense}
                      onEdit={handleEditExpense}
                      onDelete={handleDeleteExpense}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => {
          setEditingExpense(null);
          setShowAddExpense(true);
        }}
        className="fixed bottom-20 right-4 w-14 h-14 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors z-20"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Add/Edit Expense Sheet */}
      <AddExpenseSheet
        open={showAddExpense}
        onClose={() => {
          setShowAddExpense(false);
          setEditingExpense(null);
        }}
        onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
        expense={editingExpense}
        currency={ledger.currency}
      />

      {/* Filter Sheet */}
      <FilterSheet
        open={showFilter}
        onClose={() => setShowFilter(false)}
        filters={filters}
        onApply={setFilters}
      />
    </div>
  );
}
