import { useState } from 'react';
import { ArrowLeft, Download, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import type { Page, Ledger, Category } from '../App';

interface StatisticsPageProps {
  ledger: Ledger;
  onNavigate: (page: Page, data?: any) => void;
}

const CATEGORY_COLORS: Record<Category, string> = {
  '식비': '#3b82f6',
  '교통비': '#10b981',
  '생활용품': '#f59e0b',
  '공과금': '#ef4444',
  '의료비': '#8b5cf6',
  '문화/여가': '#ec4899',
  '기타': '#6b7280',
};

export function StatisticsPage({ ledger, onNavigate }: StatisticsPageProps) {
  const [dateRange, setDateRange] = useState<'month' | 'last-month' | '3-months'>('month');

  // Calculate category breakdown
  const categoryData = Object.entries(
    ledger.expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<Category, number>)
  ).map(([name, value]) => ({
    name,
    value,
    color: CATEGORY_COLORS[name as Category],
  }));

  // Calculate daily expenses (last 7 days)
  const dailyExpenses = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    
    const total = ledger.expenses
      .filter(e => e.date.split('T')[0] === dateStr)
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      date: date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
      amount: total,
    };
  });

  // Top 5 expenses
  const topExpenses = [...ledger.expenses]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // Member contributions
  const memberStats = Object.entries(
    ledger.expenses.reduce((acc, expense) => {
      if (!acc[expense.createdByName]) {
        acc[expense.createdByName] = { count: 0, total: 0 };
      }
      acc[expense.createdByName].count++;
      acc[expense.createdByName].total += expense.amount;
      return acc;
    }, {} as Record<string, { count: number; total: number }>)
  ).map(([name, stats]) => ({
    name,
    count: stats.count,
    total: stats.total,
  }));

  const totalExpenses = ledger.monthlyTotal;
  const averageDaily = Math.round(totalExpenses / 30);
  const topCategory = categoryData.length > 0 ? categoryData.sort((a, b) => b.value - a.value)[0].name : '-';
  const topContributor = memberStats.length > 0 ? memberStats.sort((a, b) => b.count - a.count)[0].name : '-';

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Top App Bar */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between h-14 px-4">
          <button
            onClick={() => onNavigate('ledger-detail', { currentLedger: ledger })}
            className="w-10 h-10 flex items-center justify-center -ml-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-semibold">통계</h1>
          <button className="w-10 h-10 flex items-center justify-center">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white px-4 py-4 border-b border-gray-200">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setDateRange('month')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              dateRange === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            이번 달
          </button>
          <button
            onClick={() => setDateRange('last-month')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              dateRange === 'last-month'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            지난 달
          </button>
          <button
            onClick={() => setDateRange('3-months')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              dateRange === '3-months'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            최근 3개월
          </button>
          <button
            className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-gray-100 text-gray-700 flex items-center gap-1"
          >
            <Calendar className="w-4 h-4" />
            커스텀
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="px-4 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <p className="text-sm opacity-90 mb-1">총 지출액</p>
            <p className="text-2xl font-bold">{totalExpenses.toLocaleString()}원</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
            <p className="text-sm opacity-90 mb-1">일평균 지출</p>
            <p className="text-2xl font-bold">{averageDaily.toLocaleString()}원</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
            <p className="text-sm opacity-90 mb-1">가장 많은 카테고리</p>
            <p className="text-xl font-bold">{topCategory}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
            <p className="text-sm opacity-90 mb-1">최다 기록자</p>
            <p className="text-xl font-bold truncate">{topContributor}</p>
          </div>
        </div>

        {/* Category Breakdown */}
        {categoryData.length > 0 && (
          <div className="bg-white rounded-xl p-6">
            <h3 className="font-semibold mb-4">카테고리별 지출</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `${value.toLocaleString()}원`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {item.value.toLocaleString()}원
                    </p>
                    <p className="text-xs text-gray-500">
                      {((item.value / totalExpenses) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Daily Trend */}
        {dailyExpenses.length > 0 && (
          <div className="bg-white rounded-xl p-6">
            <h3 className="font-semibold mb-4">지출 추이 (최근 7일)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyExpenses}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value.toLocaleString()}원`, '지출']}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Top Expenses */}
        {topExpenses.length > 0 && (
          <div className="bg-white rounded-xl p-6">
            <h3 className="font-semibold mb-4">최근 큰 지출 Top 5</h3>
            <div className="space-y-3">
              {topExpenses.map((expense, index) => (
                <div key={expense.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{expense.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(expense.date).toLocaleDateString('ko-KR')} • {expense.category}
                    </p>
                  </div>
                  <p className="font-bold text-blue-600">
                    {expense.amount.toLocaleString()}원
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Member Contributions */}
        {memberStats.length > 0 && (
          <div className="bg-white rounded-xl p-6">
            <h3 className="font-semibold mb-4">멤버별 지출 기록</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={memberStats} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                    width={80}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value.toLocaleString()}원`, '총액']}
                  />
                  <Bar dataKey="total" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {memberStats.map((stat) => (
                <div key={stat.name} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{stat.name}</span>
                  <div className="text-right">
                    <p className="font-semibold">{stat.total.toLocaleString()}원</p>
                    <p className="text-xs text-gray-500">{stat.count}건</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Export Button */}
        <Button variant="outline" className="w-full h-12">
          <Download className="w-5 h-5 mr-2" />
          Excel로 내보내기
        </Button>
      </div>
    </div>
  );
}
