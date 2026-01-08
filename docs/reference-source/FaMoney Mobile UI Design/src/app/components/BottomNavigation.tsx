import { Home, Receipt, TrendingUp, User } from 'lucide-react';
import type { Page } from '../App';

interface BottomNavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function BottomNavigation({ currentPage, onNavigate }: BottomNavigationProps) {
  const tabs = [
    { id: 'dashboard' as Page, label: '홈', icon: Home },
    { id: 'ledger-detail' as Page, label: '지출', icon: Receipt },
    { id: 'statistics' as Page, label: '통계', icon: TrendingUp },
    { id: 'profile-settings' as Page, label: '더보기', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50">
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentPage === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className="flex flex-col items-center justify-center flex-1 h-full"
            >
              <Icon
                className={`w-6 h-6 ${
                  isActive ? 'text-blue-600' : 'text-gray-400'
                }`}
                fill={isActive ? 'currentColor' : 'none'}
              />
              <span
                className={`text-xs mt-1 ${
                  isActive ? 'text-blue-600 font-medium' : 'text-gray-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
