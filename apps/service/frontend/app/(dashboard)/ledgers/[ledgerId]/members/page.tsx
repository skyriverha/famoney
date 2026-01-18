'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Card,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Fab,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TopAppBar from '@/components/layout/TopAppBar';
import InviteMemberDialog from '@/components/member/InviteMemberDialog';
import RoleChangeDialog from '@/components/member/RoleChangeDialog';
import { useAuthStore } from '@/store/authStore';
import { useLedgerStore } from '@/store/ledgerStore';
import type { MemberResponse, MemberRole } from '@/lib/api';

const ROLE_ORDER: MemberRole[] = ['OWNER', 'ADMIN', 'MEMBER', 'VIEWER'];
const ROLE_LABELS: Record<MemberRole, string> = {
  OWNER: '소유자',
  ADMIN: '관리자',
  MEMBER: '멤버',
  VIEWER: '뷰어',
};
const ROLE_COLORS: Record<MemberRole, 'error' | 'warning' | 'primary' | 'default'> = {
  OWNER: 'error',
  ADMIN: 'warning',
  MEMBER: 'primary',
  VIEWER: 'default',
};

function sortMembers(members: MemberResponse[]): MemberResponse[] {
  return [...members].sort((a, b) => {
    const aIndex = ROLE_ORDER.indexOf(a.role);
    const bIndex = ROLE_ORDER.indexOf(b.role);
    if (aIndex !== bIndex) return aIndex - bIndex;
    return a.user.name.localeCompare(b.user.name);
  });
}

export default function MembersPage() {
  const router = useRouter();
  const params = useParams();
  const ledgerId = params.ledgerId as string;

  const user = useAuthStore((state) => state.user);
  const {
    currentLedger,
    members,
    fetchLedger,
    fetchMembers,
    removeMember,
    isLoading,
    error,
    clearError,
  } = useLedgerStore();

  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedMember, setSelectedMember] = useState<MemberResponse | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!ledgerId) return;
    try {
      await Promise.all([fetchLedger(ledgerId), fetchMembers(ledgerId)]);
    } catch {
      // Errors handled in store
    }
  }, [ledgerId, fetchLedger, fetchMembers]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadData();
  }, [user, router, loadData]);

  const handleMemberClick = (event: React.MouseEvent<HTMLElement>, member: MemberResponse) => {
    // Don't show menu for OWNER or if current user is not OWNER/ADMIN
    if (member.role === 'OWNER') return;
    if (currentLedger?.myRole !== 'OWNER' && currentLedger?.myRole !== 'ADMIN') return;
    // ADMIN can only remove MEMBER/VIEWER, not change roles
    if (currentLedger?.myRole === 'ADMIN' && member.role === 'ADMIN') return;

    setSelectedMember(member);
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleChangeRole = () => {
    handleMenuClose();
    setShowRoleDialog(true);
  };

  const handleRemoveMember = () => {
    handleMenuClose();
    setShowRemoveDialog(true);
  };

  const confirmRemoveMember = async () => {
    if (!selectedMember) return;
    try {
      await removeMember(ledgerId, selectedMember.id);
      setShowRemoveDialog(false);
      setSelectedMember(null);
      setSuccessMessage('멤버가 제거되었습니다.');
    } catch {
      // Error handled in store
    }
  };

  if (!user) return null;

  const sortedMembers = sortMembers(members);
  const isOwner = currentLedger?.myRole === 'OWNER';
  const isAdmin = currentLedger?.myRole === 'ADMIN';
  const canInvite = isOwner || isAdmin;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', pb: 10 }}>
      <TopAppBar
        title="멤버 관리"
        showBackButton
        onBackClick={() => router.push(`/ledgers/${ledgerId}`)}
      />

      <Container maxWidth="sm" sx={{ py: 3 }}>
        {/* Error Alert */}
        {error && (
          <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && members.length === 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Members List */}
        {members.length > 0 && (
          <Card sx={{ borderRadius: 3 }}>
            <List disablePadding>
              {sortedMembers.map((member, index) => (
                <ListItem
                  key={member.id}
                  divider={index < members.length - 1}
                  secondaryAction={
                    member.role !== 'OWNER' &&
                    (isOwner || (isAdmin && member.role !== 'ADMIN')) && (
                      <IconButton
                        edge="end"
                        onClick={(e) => handleMemberClick(e, member)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    )
                  }
                  sx={{
                    py: 2,
                    bgcolor: member.user.id === user.id ? 'action.selected' : 'inherit',
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={member.user.profileImage || undefined}>
                      {member.user.name[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontWeight: 500 }}>
                          {member.user.name}
                        </Typography>
                        {member.user.id === user.id && (
                          <Typography variant="caption" color="text.secondary">
                            (나)
                          </Typography>
                        )}
                      </Box>
                    }
                    secondary={member.user.email}
                  />
                  <Chip
                    label={ROLE_LABELS[member.role]}
                    size="small"
                    color={ROLE_COLORS[member.role]}
                    sx={{ mr: 4 }}
                  />
                </ListItem>
              ))}
            </List>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && members.length === 0 && (
          <Card sx={{ borderRadius: 3, textAlign: 'center', py: 6 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              멤버가 없습니다
            </Typography>
            <Typography variant="body2" color="text.secondary">
              멤버를 초대해보세요
            </Typography>
          </Card>
        )}
      </Container>

      {/* FAB for inviting member */}
      {canInvite && (
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 16,
          }}
          onClick={() => setShowInviteDialog(true)}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        {isOwner && (
          <MenuItem onClick={handleChangeRole}>역할 변경</MenuItem>
        )}
        <MenuItem onClick={handleRemoveMember} sx={{ color: 'error.main' }}>
          멤버 제거
        </MenuItem>
      </Menu>

      {/* Invite Member Dialog */}
      <InviteMemberDialog
        open={showInviteDialog}
        onClose={() => setShowInviteDialog(false)}
        ledgerId={ledgerId}
        onSuccess={() => {
          setSuccessMessage('멤버가 초대되었습니다.');
          loadData();
        }}
      />

      {/* Role Change Dialog */}
      <RoleChangeDialog
        open={showRoleDialog}
        onClose={() => {
          setShowRoleDialog(false);
          setSelectedMember(null);
        }}
        ledgerId={ledgerId}
        member={selectedMember}
        onSuccess={() => {
          setSuccessMessage('역할이 변경되었습니다.');
          loadData();
        }}
      />

      {/* Remove Member Confirmation Dialog */}
      <Dialog
        open={showRemoveDialog}
        onClose={() => setShowRemoveDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>멤버 제거</DialogTitle>
        <DialogContent>
          <Typography>
            정말 <strong>{selectedMember?.user.name}</strong>님을 이 원장에서 제거하시겠습니까?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setShowRemoveDialog(false)} disabled={isLoading}>
            취소
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmRemoveMember}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={16} /> : null}
          >
            {isLoading ? '제거 중...' : '제거'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(null)}
        message={successMessage}
      />
    </Box>
  );
}
