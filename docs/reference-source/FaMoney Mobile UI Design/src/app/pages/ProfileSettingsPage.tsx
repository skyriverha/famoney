import { useState } from 'react';
import { ArrowLeft, Camera, Save, Trash2, LogOut } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { toast } from 'sonner';
import type { Page, User } from '../App';

interface ProfileSettingsPageProps {
  user: User;
  onNavigate: (page: Page) => void;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
}

export function ProfileSettingsPage({ user, onNavigate, onUpdateUser, onLogout }: ProfileSettingsPageProps) {
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [notifications, setNotifications] = useState({
    expense: true,
    invite: true,
    update: true,
  });

  const hasChanges = name !== user.name || avatar !== user.avatar;

  const handleSave = () => {
    onUpdateUser({ ...user, name, avatar });
    toast.success('프로필이 저장되었습니다');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    toast.success('로그아웃되었습니다');
    onLogout();
  };

  const handleDeleteAccount = () => {
    toast.success('계정이 삭제되었습니다');
    onLogout();
  };

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
          <h1 className="font-semibold">프로필 설정</h1>
          {hasChanges && (
            <button
              onClick={handleSave}
              className="text-blue-600 font-medium"
            >
              저장
            </button>
          )}
          {!hasChanges && <div className="w-10" />}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Profile Photo Section */}
        <div className="bg-white rounded-xl p-6">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={avatar} />
                <AvatarFallback className="text-2xl">
                  {name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg">
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="w-full space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <div className="relative">
                  <Input
                    id="email"
                    value={user.email}
                    readOnly
                    className="h-12 bg-gray-50"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                      인증됨
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {hasChanges && (
              <Button onClick={handleSave} className="w-full mt-6 h-12">
                <Save className="w-4 h-4 mr-2" />
                저장
              </Button>
            )}
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white rounded-xl p-6">
          <h2 className="font-semibold mb-4">알림 설정</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">지출 알림</p>
                <p className="text-sm text-gray-600">
                  새로운 지출이 기록되면 알림을 받습니다
                </p>
              </div>
              <Switch
                checked={notifications.expense}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, expense: checked })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">멤버 초대 알림</p>
                <p className="text-sm text-gray-600">
                  원장에 초대되면 알림을 받습니다
                </p>
              </div>
              <Switch
                checked={notifications.invite}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, invite: checked })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">원장 업데이트 알림</p>
                <p className="text-sm text-gray-600">
                  원장이 수정되면 알림을 받습니다
                </p>
              </div>
              <Switch
                checked={notifications.update}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, update: checked })
                }
              />
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-xl overflow-hidden">
          <button
            onClick={() => setShowLogoutDialog(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-gray-600" />
              <span className="font-medium">로그아웃</span>
            </div>
          </button>

          <Separator />

          <button
            onClick={() => setShowDeleteDialog(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-red-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-red-600" />
              <span className="font-medium text-red-600">계정 삭제</span>
            </div>
          </button>
        </div>

        {/* App Info */}
        <div className="text-center text-sm text-gray-500 py-4">
          FaMoney v1.0.0
        </div>
      </div>

      {/* Logout Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>로그아웃</AlertDialogTitle>
            <AlertDialogDescription>
              정말 로그아웃 하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              로그아웃
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Account Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>계정 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다. 정말 삭제하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
