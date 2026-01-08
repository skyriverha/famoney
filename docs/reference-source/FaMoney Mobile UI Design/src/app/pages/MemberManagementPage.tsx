import { useState } from 'react';
import { ArrowLeft, Plus, MoreVertical, Info } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { InviteMemberSheet } from '../components/InviteMemberSheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../components/ui/collapsible';
import { toast } from 'sonner';
import type { Page, Ledger, Member } from '../App';

interface MemberManagementPageProps {
  ledger: Ledger;
  onNavigate: (page: Page, data?: any) => void;
  onUpdateLedger: (ledger: Ledger) => void;
}

export function MemberManagementPage({ ledger, onNavigate, onUpdateLedger }: MemberManagementPageProps) {
  const [showInviteSheet, setShowInviteSheet] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);
  const [infoExpanded, setInfoExpanded] = useState(false);

  const currentUser = ledger.members[0]; // Assuming first member is current user
  const canManageMembers = ['OWNER', 'ADMIN'].includes(currentUser.role);

  const handleInviteMember = (memberData: { email: string; role: Member['role'] }) => {
    const newMember: Member = {
      id: Math.random().toString(36).substr(2, 9),
      name: memberData.email.split('@')[0],
      email: memberData.email,
      role: memberData.role,
      joinedDate: new Date().toISOString(),
      invitedBy: currentUser.name,
    };

    const updatedLedger = {
      ...ledger,
      members: [...ledger.members, newMember],
      memberCount: ledger.memberCount + 1,
    };

    onUpdateLedger(updatedLedger);
    toast.success(`${memberData.email}에게 초대를 보냈습니다`);
    setShowInviteSheet(false);
  };

  const handleRemoveMember = () => {
    if (!memberToRemove) return;

    const updatedLedger = {
      ...ledger,
      members: ledger.members.filter(m => m.id !== memberToRemove.id),
      memberCount: ledger.memberCount - 1,
    };

    onUpdateLedger(updatedLedger);
    toast.success(`${memberToRemove.name}님이 제거되었습니다`);
    setMemberToRemove(null);
  };

  const getRoleBadgeColor = (role: Member['role']) => {
    switch (role) {
      case 'OWNER':
        return 'bg-yellow-100 text-yellow-800';
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800';
      case 'MEMBER':
        return 'bg-green-100 text-green-800';
      case 'VIEWER':
        return 'bg-gray-100 text-gray-800';
    }
  };

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
          <h1 className="font-semibold flex-1 text-center">멤버 관리</h1>
          {canManageMembers && (
            <button
              onClick={() => setShowInviteSheet(true)}
              className="w-10 h-10 flex items-center justify-center"
            >
              <Plus className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Summary */}
        <div className="bg-white rounded-xl p-4 mb-4">
          <p className="text-2xl font-bold text-center">
            총 <span className="text-blue-600">{ledger.memberCount}명</span>의 멤버
          </p>
        </div>

        {/* Role Info */}
        <Collapsible
          open={infoExpanded}
          onOpenChange={setInfoExpanded}
          className="bg-blue-50 rounded-xl mb-6"
        >
          <CollapsibleTrigger className="w-full p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">역할 안내</span>
            </div>
            <span className="text-sm text-blue-600">
              {infoExpanded ? '접기' : '펼치기'}
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Badge className={getRoleBadgeColor('OWNER')}>OWNER</Badge>
                <p className="text-gray-700 flex-1">
                  모든 권한 + 원장 삭제 + 멤버 역할 변경
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Badge className={getRoleBadgeColor('ADMIN')}>ADMIN</Badge>
                <p className="text-gray-700 flex-1">
                  지출 관리 + 멤버 초대 + 멤버 제거
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Badge className={getRoleBadgeColor('MEMBER')}>MEMBER</Badge>
                <p className="text-gray-700 flex-1">
                  지출 기록 + 자신의 지출 수정/삭제
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Badge className={getRoleBadgeColor('VIEWER')}>VIEWER</Badge>
                <p className="text-gray-700 flex-1">
                  조회만 가능 (지출 기록 불가)
                </p>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Member List */}
        <div className="space-y-2">
          {ledger.members.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl p-4 flex items-center gap-3"
            >
              <Avatar className="w-12 h-12">
                <AvatarImage src={member.avatar} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold truncate">{member.name}</h3>
                  <Badge className={getRoleBadgeColor(member.role)}>
                    {member.role}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 truncate">{member.email}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(member.joinedDate).toLocaleDateString('ko-KR')} 가입 • {member.invitedBy}님 초대
                </p>
              </div>

              {canManageMembers && member.role !== 'OWNER' && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-10 h-10 flex items-center justify-center">
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {currentUser.role === 'OWNER' && (
                      <DropdownMenuItem>역할 변경</DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => setMemberToRemove(member)}
                    >
                      제거
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Invite Member Sheet */}
      <InviteMemberSheet
        open={showInviteSheet}
        onClose={() => setShowInviteSheet(false)}
        onInvite={handleInviteMember}
      />

      {/* Remove Confirmation Dialog */}
      <AlertDialog open={!!memberToRemove} onOpenChange={(open) => !open && setMemberToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>멤버 제거</AlertDialogTitle>
            <AlertDialogDescription>
              {memberToRemove?.name}님을 원장에서 제거하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveMember} className="bg-red-600 hover:bg-red-700">
              제거
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
