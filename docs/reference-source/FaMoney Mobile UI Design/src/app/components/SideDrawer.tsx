import { X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import type { Page, User } from '../App';

interface SideDrawerProps {
  open: boolean;
  onClose: () => void;
  user: User;
  onNavigate: (page: Page) => void;
}

export function SideDrawer({ open, onClose, user, onNavigate }: SideDrawerProps) {
  const handleNavigate = (page: Page) => {
    onNavigate(page);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-[280px] bg-white z-50 transform transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-xl">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-lg">{user.name}</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Menu Items */}
          <nav className="flex-1 p-4">
            <button
              onClick={() => handleNavigate('dashboard')}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span className="font-medium">내 원장</span>
            </button>
            <button
              onClick={() => handleNavigate('profile-settings')}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span className="font-medium">프로필 설정</span>
            </button>
            <button
              onClick={onClose}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span className="font-medium">알림 설정</span>
            </button>
            <button
              onClick={onClose}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span className="font-medium">도움말</span>
            </button>
          </nav>

          <Separator />

          {/* Footer */}
          <div className="p-4">
            <p className="text-xs text-gray-500 text-center">FaMoney v1.0.0</p>
          </div>
        </div>
      </div>
    </>
  );
}
