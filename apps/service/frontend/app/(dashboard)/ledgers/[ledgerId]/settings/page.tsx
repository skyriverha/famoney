'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Chip,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupIcon from '@mui/icons-material/Group';
import TopAppBar from '@/components/layout/TopAppBar';
import { useAuthStore } from '@/store/authStore';
import { useLedgerStore } from '@/store/ledgerStore';

export default function LedgerSettingsPage() {
  const router = useRouter();
  const params = useParams();
  const ledgerId = params.ledgerId as string;

  const user = useAuthStore((state) => state.user);
  const {
    currentLedger,
    fetchLedger,
    updateLedger,
    deleteLedger,
    isLoading,
    error,
    clearError,
  } = useLedgerStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchLedger(ledgerId);
  }, [user, router, ledgerId, fetchLedger]);

  useEffect(() => {
    if (currentLedger) {
      setName(currentLedger.name);
      setDescription(currentLedger.description || '');
    }
  }, [currentLedger]);

  const handleSave = async () => {
    setLocalError(null);
    try {
      await updateLedger(ledgerId, {
        name: name.trim(),
        description: description.trim() || undefined,
      });
      setIsEditing(false);
      setSuccessMessage('원장 정보가 저장되었습니다.');
    } catch (err) {
      if (err instanceof Error) {
        setLocalError(err.message);
      }
    }
  };

  const handleCancelEdit = () => {
    if (currentLedger) {
      setName(currentLedger.name);
      setDescription(currentLedger.description || '');
    }
    setIsEditing(false);
    setLocalError(null);
  };

  const handleDelete = async () => {
    if (deleteConfirmName !== currentLedger?.name) {
      setLocalError('원장 이름이 일치하지 않습니다.');
      return;
    }

    try {
      await deleteLedger(ledgerId);
      router.push('/ledgers');
    } catch (err) {
      if (err instanceof Error) {
        setLocalError(err.message);
      }
    }
  };

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
    setDeleteConfirmName('');
    setLocalError(null);
  };

  if (!user) return null;

  const isOwner = currentLedger?.myRole === 'OWNER';
  const isAdmin = currentLedger?.myRole === 'ADMIN';
  const canEdit = isOwner || isAdmin;

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateStr));
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <TopAppBar
        title="원장 설정"
        showBackButton
        onBackClick={() => router.push(`/ledgers/${ledgerId}`)}
      />

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

        {/* Loading State */}
        {isLoading && !currentLedger && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {currentLedger && (
          <>
            {/* Ledger Info Card */}
            <Card sx={{ mb: 3, borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  원장 정보
                </Typography>

                {!isEditing ? (
                  <>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        이름
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {currentLedger.name}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        설명
                      </Typography>
                      <Typography variant="body1">
                        {currentLedger.description || '설명 없음'}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          생성일
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(currentLedger.createdAt)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          멤버 수
                        </Typography>
                        <Chip
                          icon={<GroupIcon />}
                          label={`${currentLedger.memberCount}명`}
                          size="small"
                        />
                      </Box>
                    </Stack>

                    {canEdit && (
                      <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => setIsEditing(true)}
                      >
                        정보 수정
                      </Button>
                    )}
                  </>
                ) : (
                  <Box>
                    <TextField
                      label="이름"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      fullWidth
                      sx={{ mb: 2 }}
                      inputProps={{ maxLength: 100 }}
                    />
                    <TextField
                      label="설명"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      fullWidth
                      multiline
                      rows={3}
                      sx={{ mb: 2 }}
                      inputProps={{ maxLength: 500 }}
                      placeholder="원장에 대한 설명을 입력하세요 (선택사항)"
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button onClick={handleCancelEdit} disabled={isLoading}>
                        취소
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleSave}
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

            {/* Quick Actions Card */}
            <Card sx={{ mb: 3, borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  바로가기
                </Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<GroupIcon />}
                  onClick={() => router.push(`/ledgers/${ledgerId}/members`)}
                  sx={{ justifyContent: 'flex-start', py: 1.5 }}
                >
                  멤버 관리
                </Button>
              </CardContent>
            </Card>

            {/* Danger Zone - Only for OWNER */}
            {isOwner && (
              <Card
                sx={{
                  borderRadius: 3,
                  borderColor: 'error.main',
                  borderWidth: 1,
                  borderStyle: 'solid',
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'error.main' }}>
                    위험 구역
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    원장을 삭제하면 모든 지출 기록과 멤버 정보가 영구적으로 삭제됩니다.
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    startIcon={<DeleteIcon />}
                    onClick={() => setShowDeleteDialog(true)}
                    sx={{ justifyContent: 'flex-start', py: 1.5 }}
                  >
                    원장 삭제
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onClose={handleCloseDeleteDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: 'error.main', fontWeight: 600 }}>
          정말 원장을 삭제하시겠습니까?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 3 }}>
            이 작업은 되돌릴 수 없습니다. 모든 지출 기록, 카테고리, 멤버 정보가 영구적으로
            삭제됩니다.
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            계속하려면 원장 이름 <strong>{currentLedger?.name}</strong>을 입력하세요.
          </Typography>
          <TextField
            label="원장 이름 확인"
            value={deleteConfirmName}
            onChange={(e) => setDeleteConfirmName(e.target.value)}
            fullWidth
            placeholder={currentLedger?.name}
            error={deleteConfirmName.length > 0 && deleteConfirmName !== currentLedger?.name}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDeleteDialog} disabled={isLoading}>
            취소
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={isLoading || deleteConfirmName !== currentLedger?.name}
            startIcon={isLoading ? <CircularProgress size={16} /> : <DeleteIcon />}
          >
            {isLoading ? '삭제 중...' : '원장 삭제'}
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
