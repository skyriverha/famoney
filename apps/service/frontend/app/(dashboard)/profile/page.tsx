'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Alert,
  CircularProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import DeleteIcon from '@mui/icons-material/Delete';
import TopAppBar from '@/components/layout/TopAppBar';
import PasswordChangeDialog from '@/components/profile/PasswordChangeDialog';
import { useAuthStore } from '@/store/authStore';

export default function ProfilePage() {
  const router = useRouter();
  const {
    user,
    isLoading,
    error,
    updateProfile,
    deleteAccount,
    clearError,
  } = useAuthStore();

  const [name, setName] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    setName(user.name);
    setProfileImage(user.profileImage || '');
  }, [user, router]);

  const handleSaveProfile = async () => {
    setLocalError(null);
    try {
      await updateProfile({
        name: name.trim(),
        profileImage: profileImage.trim() || null,
      });
      setIsEditing(false);
      setSuccessMessage('프로필이 저장되었습니다.');
    } catch (err) {
      if (err instanceof Error) {
        setLocalError(err.message);
      }
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setName(user.name);
      setProfileImage(user.profileImage || '');
    }
    setIsEditing(false);
    setLocalError(null);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmEmail !== user?.email) {
      setLocalError('이메일이 일치하지 않습니다.');
      return;
    }

    try {
      await deleteAccount();
      router.push('/login');
    } catch (err) {
      if (err instanceof Error) {
        setLocalError(err.message);
      }
    }
  };

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
    setDeleteConfirmEmail('');
    setLocalError(null);
  };

  if (!user) return null;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <TopAppBar title="프로필 설정" showBackButton onBackClick={() => router.back()} />

      <Container maxWidth="sm" sx={{ py: 3 }}>
        {/* Error Alert */}
        {(error || localError) && (
          <Alert
            severity="error"
            onClose={() => {
              clearError();
              setLocalError(null);
            }}
            sx={{ mb: 2 }}
          >
            {error || localError}
          </Alert>
        )}

        {/* Profile Card */}
        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Avatar
              src={profileImage || undefined}
              sx={{
                width: 100,
                height: 100,
                mx: 'auto',
                mb: 2,
                bgcolor: 'primary.main',
                fontSize: '2.5rem',
              }}
            >
              {user.name[0]}
            </Avatar>

            {!isEditing ? (
              <>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {user.email}
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<PersonIcon />}
                  onClick={() => setIsEditing(true)}
                >
                  프로필 수정
                </Button>
              </>
            ) : (
              <Box sx={{ mt: 2 }}>
                <TextField
                  label="이름"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                  inputProps={{ maxLength: 50 }}
                />
                <TextField
                  label="프로필 이미지 URL"
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                  placeholder="https://example.com/image.jpg"
                  helperText="이미지 URL을 입력하세요 (선택사항)"
                />
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                  <Button onClick={handleCancelEdit} disabled={isLoading}>
                    취소
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSaveProfile}
                    disabled={isLoading || !name.trim()}
                    startIcon={isLoading ? <CircularProgress size={16} /> : null}
                  >
                    {isLoading ? '저장 중...' : '저장'}
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              보안
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<LockIcon />}
              onClick={() => setShowPasswordDialog(true)}
              sx={{ justifyContent: 'flex-start', py: 1.5 }}
            >
              비밀번호 변경
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card sx={{ borderRadius: 3, borderColor: 'error.main', borderWidth: 1, borderStyle: 'solid' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'error.main' }}>
              위험 구역
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.
            </Typography>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              startIcon={<DeleteIcon />}
              onClick={() => setShowDeleteDialog(true)}
              sx={{ justifyContent: 'flex-start', py: 1.5 }}
            >
              계정 삭제
            </Button>
          </CardContent>
        </Card>
      </Container>

      {/* Password Change Dialog */}
      <PasswordChangeDialog
        open={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
        onSuccess={() => setSuccessMessage('비밀번호가 변경되었습니다.')}
      />

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onClose={handleCloseDeleteDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: 'error.main', fontWeight: 600 }}>
          정말 계정을 삭제하시겠습니까?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 3 }}>
            이 작업은 되돌릴 수 없습니다. 모든 원장, 지출 기록, 멤버십 정보가 영구적으로 삭제됩니다.
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            계속하려면 이메일 <strong>{user.email}</strong>을 입력하세요.
          </Typography>
          <TextField
            label="이메일 확인"
            value={deleteConfirmEmail}
            onChange={(e) => setDeleteConfirmEmail(e.target.value)}
            fullWidth
            placeholder={user.email}
            error={deleteConfirmEmail.length > 0 && deleteConfirmEmail !== user.email}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDeleteDialog} disabled={isLoading}>
            취소
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteAccount}
            disabled={isLoading || deleteConfirmEmail !== user.email}
            startIcon={isLoading ? <CircularProgress size={16} /> : <DeleteIcon />}
          >
            {isLoading ? '삭제 중...' : '계정 삭제'}
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
