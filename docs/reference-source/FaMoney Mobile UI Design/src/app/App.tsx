import { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { SignUpPage } from './pages/SignUpPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { LedgerDetailPage } from './pages/LedgerDetailPage';
import { MemberManagementPage } from './pages/MemberManagementPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';
import { StatisticsPage } from './pages/StatisticsPage';
import { BottomNavigation } from './components/BottomNavigation';
import { Toaster } from './components/ui/sonner';

export type Page = 
  | 'landing'
  | 'signup'
  | 'login'
  | 'dashboard'
  | 'ledger-detail'
  | 'member-management'
  | 'profile-settings'
  | 'statistics';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Ledger {
  id: string;
  name: string;
  description: string;
  currency: string;
  memberCount: number;
  monthlyTotal: number;
  lastUpdated: string;
  members: Member[];
  expenses: Expense[];
}

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
  joinedDate: string;
  invitedBy: string;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: Category;
  paymentMethod?: string;
  createdBy: string;
  createdByName: string;
  createdByAvatar?: string;
  receipt?: string;
}

export type Category = 
  | '식비'
  | '교통비'
  | '생활용품'
  | '공과금'
  | '의료비'
  | '문화/여가'
  | '기타';

export interface AppState {
  currentPage: Page;
  user: User | null;
  ledgers: Ledger[];
  currentLedger: Ledger | null;
}

function App() {
  const [appState, setAppState] = useState<AppState>({
    currentPage: 'landing',
    user: null,
    ledgers: [],
    currentLedger: null,
  });

  const navigateTo = (page: Page, data?: any) => {
    setAppState(prev => ({ ...prev, currentPage: page, ...data }));
  };

  const login = (user: User) => {
    setAppState(prev => ({ ...prev, user, currentPage: 'dashboard' }));
  };

  const logout = () => {
    setAppState(prev => ({ ...prev, user: null, currentPage: 'landing' }));
  };

  const showBottomNav = appState.user && [
    'dashboard',
    'statistics',
    'profile-settings'
  ].includes(appState.currentPage);

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50">
      <div className={`h-full ${showBottomNav ? 'pb-14' : ''}`}>
        {appState.currentPage === 'landing' && (
          <LandingPage onNavigate={navigateTo} />
        )}
        {appState.currentPage === 'signup' && (
          <SignUpPage onNavigate={navigateTo} onLogin={login} />
        )}
        {appState.currentPage === 'login' && (
          <LoginPage onNavigate={navigateTo} onLogin={login} />
        )}
        {appState.currentPage === 'dashboard' && (
          <DashboardPage
            user={appState.user!}
            ledgers={appState.ledgers}
            onNavigate={navigateTo}
            onUpdateLedgers={(ledgers) => setAppState(prev => ({ ...prev, ledgers }))}
          />
        )}
        {appState.currentPage === 'ledger-detail' && appState.currentLedger && (
          <LedgerDetailPage
            ledger={appState.currentLedger}
            onNavigate={navigateTo}
            onUpdateLedger={(updatedLedger) => {
              setAppState(prev => ({
                ...prev,
                currentLedger: updatedLedger,
                ledgers: prev.ledgers.map(l =>
                  l.id === updatedLedger.id ? updatedLedger : l
                ),
              }));
            }}
          />
        )}
        {appState.currentPage === 'member-management' && appState.currentLedger && (
          <MemberManagementPage
            ledger={appState.currentLedger}
            onNavigate={navigateTo}
            onUpdateLedger={(updatedLedger) => {
              setAppState(prev => ({
                ...prev,
                currentLedger: updatedLedger,
                ledgers: prev.ledgers.map(l =>
                  l.id === updatedLedger.id ? updatedLedger : l
                ),
              }));
            }}
          />
        )}
        {appState.currentPage === 'profile-settings' && (
          <ProfileSettingsPage
            user={appState.user!}
            onNavigate={navigateTo}
            onUpdateUser={(updatedUser) =>
              setAppState(prev => ({ ...prev, user: updatedUser }))
            }
            onLogout={logout}
          />
        )}
        {appState.currentPage === 'statistics' && appState.currentLedger && (
          <StatisticsPage
            ledger={appState.currentLedger}
            onNavigate={navigateTo}
          />
        )}
      </div>

      {showBottomNav && (
        <BottomNavigation
          currentPage={appState.currentPage}
          onNavigate={navigateTo}
        />
      )}

      <Toaster />
    </div>
  );
}

export default App;
