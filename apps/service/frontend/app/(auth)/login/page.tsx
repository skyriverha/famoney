'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  FormControlLabel,
  Checkbox,
  IconButton,
  InputAdornment,
  Divider,
  Link as MuiLink,
  Alert,
  CircularProgress,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import TopAppBar from '@/components/layout/TopAppBar';
import Logo from '@/components/common/Logo';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/common/Toast';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  const { showComingSoon } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }

    if (!password) {
      newErrors.password = '비밀번호를 입력해주세요';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        await login(email, password);
        router.push('/ledgers');
      } catch {
        // Error is handled by the store
      }
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      <TopAppBar title="로그인" showBackButton onBackClick={() => router.push('/')} />

      <Container maxWidth="sm" sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 4 }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Logo size="large" />
        </Box>

        <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 4 }}>
          로그인
        </Typography>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          {/* Email */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="이메일"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              autoComplete="email"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              autoComplete="current-password"
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
          </Box>

          {/* Remember Me */}
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
              }
              label="자동 로그인"
            />
          </Box>

          {/* Login Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={isLoading}
            sx={{ mb: 2, height: 56, fontSize: '1.125rem' }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : '로그인'}
          </Button>

          {/* Forgot Password */}
          <Box sx={{ textAlign: 'right', mb: 3 }}>
            <MuiLink
              component="button"
              type="button"
              variant="body2"
              onClick={() => showComingSoon('비밀번호 재설정')}
              sx={{ color: 'text.secondary', textDecoration: 'none' }}
            >
              비밀번호를 잊으셨나요?
            </MuiLink>
          </Box>

          {/* Divider */}
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              또는
            </Typography>
          </Divider>

          {/* Sign Up Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              계정이 없으신가요?{' '}
              <MuiLink
                component="button"
                type="button"
                onClick={() => router.push('/signup')}
                sx={{ fontWeight: 600, textDecoration: 'none' }}
              >
                회원가입
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
