import { useState } from 'react';
import { Menu, Bell, Plus, ChevronRight, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { CreateLedgerModal } from '../components/CreateLedgerModal';
import { SideDrawer } from '../components/SideDrawer';
import type { Page, User, Ledger } from '../App';

interface DashboardPageProps {
  user: User;
  ledgers: Ledger[];
  onNavigate: (page: Page, data?: any) => void;
  onUpdateLedgers: (ledgers: Ledger[]) => void;
}

export function DashboardPage({ user, ledgers, onNavigate, onUpdateLedgers }: DashboardPageProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  const handleCreateLedger = (ledgerData: { name: string; description: string; currency: string }) => {
    const newLedger: Ledger = {
      id: Math.random().toString(36).substr(2, 9),
      name: ledgerData.name,
      description: ledgerData.description,
      currency: ledgerData.currency,
      memberCount: 1,
      monthlyTotal: 0,
      lastUpdated: new Date().toISOString(),
      members: [
        {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: 'OWNER',
          joinedDate: new Date().toISOString(),
          invitedBy: '자신',
        },
      ],
      expenses: [],
    };

    onUpdateLedgers([...ledgers, newLedger]);
    setShowCreateModal(false);
  };

  const handleLedgerClick = (ledger: Ledger) => {
    onNavigate('ledger-detail', { currentLedger: ledger });
  };

  const totalExpenses = ledgers.reduce((sum, ledger) => sum + ledger.monthlyTotal, 0);

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Top App Bar */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between h-14 px-4">
          <button
            onClick={() => setShowDrawer(true)}
            className="w-10 h-10 flex items-center justify-center"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="font-semibold">FaMoney</h1>
          <button className="w-10 h-10 flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Header Section */}
      <div className="bg-white px-4 py-6 border-b border-gray-200">
        <h2 className="text-xl mb-4">안녕하세요, {user.name}님</h2>
        
        {/* Quick Stats */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          <div className="flex-shrink-0 bg-blue-50 rounded-xl p-4 min-w-[140px]">
            <p className="text-sm text-gray-600 mb-1">총 원장 수</p>
            <p className="text-2xl font-bold text-blue-600">{ledgers.length}</p>
          </div>
          <div className="flex-shrink-0 bg-green-50 rounded-xl p-4 min-w-[140px]">
            <p className="text-sm text-gray-600 mb-1">이번 달 지출</p>
            <p className="text-2xl font-bold text-green-600">
              {totalExpenses.toLocaleString()}원
            </p>
          </div>
          <div className="flex-shrink-0 bg-purple-50 rounded-xl p-4 min-w-[140px]">
            <p className="text-sm text-gray-600 mb-1">최근 활동</p>
            <p className="text-2xl font-bold text-purple-600">
              {ledgers.filter(l => l.expenses.length > 0).length}개
            </p>
          </div>
        </div>
      </div>

      {/* Ledger List */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">내 원장</h3>
          <Button
            onClick={() => setShowCreateModal(true)}
            size="sm"
            className="h-9"
          >
            <Plus className="w-4 h-4 mr-1" />
            새 원장
          </Button>
        </div>

        {ledgers.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📊</span>
            </div>
            <h4 className="text-lg font-semibold mb-2">아직 원장이 없습니다</h4>
            <p className="text-gray-600 mb-6">
              첫 원장을 만들어 지출 관리를 시작하세요
            </p>
            <Button onClick={() => setShowCreateModal(true)} className="h-12">
              <Plus className="w-5 h-5 mr-2" />
              원장 만들기
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {ledgers.map((ledger) => (
              <button
                key={ledger.id}
                onClick={() => handleLedgerClick(ledger)}
                className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-1">{ledger.name}</h4>
                    {ledger.description && (
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {ledger.description}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {ledger.members.slice(0, 3).map((member, idx) => (
                        <Avatar key={idx} className="w-8 h-8 border-2 border-white">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="text-xs">
                            {member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {ledger.memberCount}
                    </span>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">
                      {ledger.monthlyTotal.toLocaleString()}원
                    </p>
                    <p className="text-xs text-gray-500">이번 달</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    마지막 업데이트: {new Date(ledger.lastUpdated).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors z-20"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Create Ledger Modal */}
      <CreateLedgerModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateLedger}
      />

      {/* Side Drawer */}
      <SideDrawer
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        user={user}
        onNavigate={onNavigate}
      />
    </div>
  );
}
