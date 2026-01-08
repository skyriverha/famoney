'use client';

import { Box, Button, Container, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import ShieldIcon from '@mui/icons-material/Shield';
import BoltIcon from '@mui/icons-material/Bolt';
import GroupIcon from '@mui/icons-material/Group';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Logo from '@/components/common/Logo';
import FeatureCard from '@/components/landing/FeatureCard';
import UseCaseCard from '@/components/landing/UseCaseCard';

const features = [
  {
    icon: <ShieldIcon sx={{ color: 'white' }} />,
    title: '투명성',
    description: '실시간 지출 내역 공유로 모든 멤버가 투명하게 확인할 수 있습니다',
    bgColor: 'primary.50',
    iconBgColor: 'primary.main',
  },
  {
    icon: <BoltIcon sx={{ color: 'white' }} />,
    title: '편의성',
    description: '간편한 지출 기록으로 언제 어디서나 빠르게 입력할 수 있습니다',
    bgColor: 'success.50',
    iconBgColor: 'success.main',
  },
  {
    icon: <GroupIcon sx={{ color: 'white' }} />,
    title: '협업',
    description: '다중 사용자 공동 관리로 함께 기록하고 관리할 수 있습니다',
    bgColor: 'purple.50',
    iconBgColor: 'purple.main',
  },
];

const useCases = [
  {
    icon: <FavoriteIcon />,
    iconBgColor: 'pink.50',
    iconColor: 'pink.main',
    title: '가족 가계부',
    features: ['가족 생활비 투명하게 관리', '월말 정산 간편하게', '지출 패턴 함께 분석'],
  },
  {
    icon: <GroupIcon />,
    iconBgColor: 'primary.50',
    iconColor: 'primary.main',
    title: '모임 회계',
    features: ['동아리, 스터디 모임 회비 관리', '투명한 회계 처리', '멤버별 정산 자동화'],
  },
  {
    icon: <HomeIcon />,
    iconBgColor: 'success.50',
    iconColor: 'success.main',
    title: '룸메이트 정산',
    features: ['공과금, 생활비 나누기', '실시간 지출 공유', '공평한 비용 분담'],
  },
];

export default function LandingPage() {
  const router = useRouter();

  return (
    <Box sx={{ minHeight: '100vh', overflow: 'auto' }}>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          px: 3,
          py: 6,
          background: (theme) =>
            `linear-gradient(to bottom, ${theme.palette.primary[50]}, ${theme.palette.background.paper})`,
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <Logo size="large" />
            </Box>

            {/* Headline */}
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: '2rem', sm: '2.5rem' },
                lineHeight: 1.2,
              }}
            >
              가족과 함께하는
              <br />
              투명한 가계부
            </Typography>

            {/* Subheading */}
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                mb: 4,
                fontSize: { xs: '1.125rem', sm: '1.25rem' },
              }}
            >
              그룹 지출을 쉽고 투명하게
              <br />
              기록하고 관리하세요
            </Typography>

            {/* CTAs */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => router.push('/signup')}
                sx={{
                  height: 56,
                  fontSize: '1.125rem',
                  fontWeight: 600,
                }}
              >
                무료로 시작하기
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => router.push('/login')}
                sx={{ height: 48 }}
              >
                로그인
              </Button>
            </Box>
          </Box>

          {/* Scroll indicator */}
          <Box
            sx={{
              mt: 6,
              display: 'flex',
              justifyContent: 'center',
              animation: 'bounce 2s infinite',
              '@keyframes bounce': {
                '0%, 100%': {
                  transform: 'translateY(0)',
                },
                '50%': {
                  transform: 'translateY(10px)',
                },
              },
            }}
          >
            <KeyboardArrowDownIcon sx={{ color: 'text.secondary' }} />
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, px: 3, bgcolor: 'background.paper' }}>
        <Container maxWidth="sm">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              textAlign: 'center',
              mb: 6,
            }}
          >
            왜 FaMoney인가요?
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                bgColor={feature.bgColor}
                iconBgColor={feature.iconBgColor}
              />
            ))}
          </Box>
        </Container>
      </Box>

      {/* Use Cases Section */}
      <Box sx={{ py: 8, px: 3, bgcolor: 'grey.50' }}>
        <Container maxWidth="sm">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              textAlign: 'center',
              mb: 6,
            }}
          >
            누가 사용하나요?
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {useCases.map((useCase) => (
              <UseCaseCard
                key={useCase.title}
                icon={useCase.icon}
                iconBgColor={useCase.iconBgColor}
                iconColor={useCase.iconColor}
                title={useCase.title}
                features={useCase.features}
              />
            ))}
          </Box>
        </Container>
      </Box>

      {/* Final CTA Section */}
      <Box
        sx={{
          py: 8,
          px: 3,
          bgcolor: 'primary.main',
          color: 'white',
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              지금 바로 시작하세요
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
              무료로 가입하고 투명한 가계부 관리를 경험해보세요
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/signup')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                height: 56,
                fontSize: '1.125rem',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
            >
              무료로 시작하기
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          py: 4,
          px: 3,
          bgcolor: 'grey.900',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" sx={{ color: 'grey.500' }}>
          © 2025 FaMoney. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
