'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  IconButton,
  InputAdornment,
  Avatar,
  LinearProgress,
  Link as MuiLink,
  Alert,
  CircularProgress,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import TopAppBar from '@/components/layout/TopAppBar';
import { useAuthStore } from '@/store/authStore';

export default function SignUpPage() {
  const router = useRouter();
  const { signup, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculatePasswordStrength = () => {
    const { password } = formData;
    if (!password) return { strength: 0, label: '', color: 'error' as const };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    const labels = ['매우 약함', '약함', '보통', '강함', '매우 강함'];
    const colors = ['error', 'error', 'warning', 'success', 'success'] as const;

    return {
      strength: (strength / 5) * 100,
      label: labels[strength - 1] || '',
      color: colors[strength - 1] || 'error',
    };
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (validateForm()) {
      try {
        await signup(formData.email, formData.password, formData.name);
        router.push('/ledgers');
      } catch {
        // Error is handled by the store
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const strength = calculatePasswordStrength();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      <TopAppBar title="회원가입" showBackButton onBackClick={() => router.push('/')} />

      <Container maxWidth="sm" sx={{ flex: 1, py: 4, overflow: 'auto' }}>
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          {/* Profile Image */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Box sx={{ position: 'relative' }}>
              {profileImage ? (
                <>
                  <Avatar
                    src={profileImage}
                    sx={{ width: 96, height: 96 }}
                  />
                  <IconButton
                    onClick={() => setProfileImage(null)}
                    disabled={isLoading}
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      bgcolor: 'error.main',
                      color: 'white',
                      width: 32,
                      height: 32,
                      '&:hover': {
                        bgcolor: 'error.dark',
                      },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </>
              ) : (
                <Box
                  component="label"
                  sx={{
                    width: 96,
                    height: 96,
                    borderRadius: '50%',
                    bgcolor: 'grey.100',
                    border: 2,
                    borderStyle: 'dashed',
                    borderColor: 'grey.300',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: isLoading ? 'default' : 'pointer',
                    '&:hover': {
                      borderColor: isLoading ? 'grey.300' : 'primary.main',
                    },
                  }}
                >
                  <CloudUploadIcon sx={{ color: 'grey.400', mb: 0.5 }} />
                  <Typography variant="caption" color="text.secondary">
                    사진 추가
                  </Typography>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isLoading}
                    hidden
                  />
                </Box>
              )}
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              프로필 사진 (선택)
            </Typography>
          </Box>

          {/* Email */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="이메일"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={!!errors.email}
              helperText={errors.email}
              placeholder="example@email.com"
              disabled={isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: 48,
                },
              }}
            />
          </Box>

          {/* Password */}
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="비밀번호"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={!!errors.password}
              helperText={errors.password}
              placeholder="8자 이상 입력"
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: 48,
                },
              }}
            />
            {formData.password && (
              <Box sx={{ mt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={strength.strength}
                  color={strength.color}
                  sx={{ height: 4, borderRadius: 2 }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {strength.label}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Confirm Password */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="비밀번호 확인"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              placeholder="비밀번호를 다시 입력"
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: 48,
                },
              }}
            />
          </Box>

          {/* Name */}
          <Box sx={{ mb: 4 }}>
            <TextField
              fullWidth
              label="이름"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={!!errors.name}
              helperText={errors.name}
              placeholder="홍길동"
              disabled={isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: 48,
                },
              }}
            />
          </Box>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={isLoading}
            sx={{ mb: 3, height: 56, fontSize: '1.125rem' }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : '가입하기'}
          </Button>

          {/* Login Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              이미 계정이 있으신가요?{' '}
              <MuiLink
                component="button"
                type="button"
                onClick={() => router.push('/login')}
                sx={{ fontWeight: 600, textDecoration: 'none' }}
              >
                로그인
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
