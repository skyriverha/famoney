import { useState } from 'react';
import { Copy, Link as LinkIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { toast } from 'sonner';
import type { Member } from '../App';

interface InviteMemberSheetProps {
  open: boolean;
  onClose: () => void;
  onInvite: (data: { email: string; role: Member['role'] }) => void;
}

export function InviteMemberSheet({ open, onClose, onInvite }: InviteMemberSheetProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Member['role']>('MEMBER');
  const [inviteLink, setInviteLink] = useState('');
  const [linkExpiry, setLinkExpiry] = useState('7');

  const handleEmailInvite = () => {
    if (!email) {
      toast.error('이메일을 입력해주세요');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('올바른 이메일 형식이 아닙니다');
      return;
    }

    onInvite({ email, role });
    setEmail('');
    setRole('MEMBER');
  };

  const handleGenerateLink = () => {
    const link = `https://famoney.app/invite/${Math.random().toString(36).substr(2, 9)}`;
    setInviteLink(link);
    toast.success('초대 링크가 생성되었습니다');
  };

  const handleCopyLink = async () => {
    if (!inviteLink) {
      handleGenerateLink();
      return;
    }

    try {
      await navigator.clipboard.writeText(inviteLink);
      toast.success('링크가 복사되었습니다');
    } catch (err) {
      toast.error('링크 복사에 실패했습니다');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>멤버 초대</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="email" className="pt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">이메일</TabsTrigger>
            <TabsTrigger value="link">링크</TabsTrigger>
          </TabsList>

          {/* Email Invitation */}
          <TabsContent value="email" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일 주소</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">역할</Label>
              <Select value={role} onValueChange={(value) => setRole(value as Member['role'])}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">
                    <div>
                      <div className="font-medium">ADMIN</div>
                      <div className="text-xs text-gray-500">지출 관리 + 멤버 초대</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="MEMBER">
                    <div>
                      <div className="font-medium">MEMBER</div>
                      <div className="text-xs text-gray-500">지출 기록</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="VIEWER">
                    <div>
                      <div className="font-medium">VIEWER</div>
                      <div className="text-xs text-gray-500">조회만 가능</div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleEmailInvite} className="w-full h-12">
              초대 보내기
            </Button>
          </TabsContent>

          {/* Link Invitation */}
          <TabsContent value="link" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>초대 링크</Label>
              {inviteLink ? (
                <div className="flex gap-2">
                  <Input
                    value={inviteLink}
                    readOnly
                    className="h-12 flex-1"
                  />
                  <Button
                    onClick={handleCopyLink}
                    size="icon"
                    variant="outline"
                    className="h-12 w-12 flex-shrink-0"
                  >
                    <Copy className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <LinkIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-4">
                    초대 링크를 생성하세요
                  </p>
                  <Button onClick={handleGenerateLink}>
                    링크 생성
                  </Button>
                </div>
              )}
            </div>

            {inviteLink && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="expiry">유효 기간</Label>
                  <Select value={linkExpiry} onValueChange={setLinkExpiry}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1일</SelectItem>
                      <SelectItem value="7">7일</SelectItem>
                      <SelectItem value="30">30일</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleCopyLink} className="w-full h-12">
                  <Copy className="w-5 h-5 mr-2" />
                  링크 복사
                </Button>
              </>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
