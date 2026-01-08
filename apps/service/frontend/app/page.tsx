'use client';

import { Box, Button, Container, Typography, Card, CardContent } from '@mui/material';
import { useRouter } from 'next/navigation';
import ShieldIcon from '@mui/icons-material/Shield';
import BoltIcon from '@mui/icons-material/Bolt';
import GroupIcon from '@mui/icons-material/Group';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import CalculateIcon from '@mui/icons-material/Calculate';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

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
          background: 'linear-gradient(to bottom, #eff6ff, #ffffff)',
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            {/* Logo */}
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 4,
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 4,
                boxShadow: 3,
              }}
            >
              <CalculateIcon sx={{ fontSize: 40, color: 'white' }} />
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
            {/* Feature 1 - 투명성 */}
            <Card
              sx={{
                bgcolor: '#eff6ff',
                borderRadius: 4,
                boxShadow: 'none',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    bgcolor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <ShieldIcon sx={{ color: 'white' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  투명성
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  실시간 지출 내역 공유로 모든 멤버가 투명하게 확인할 수 있습니다
                </Typography>
              </CardContent>
            </Card>

            {/* Feature 2 - 편의성 */}
            <Card
              sx={{
                bgcolor: '#f0fdf4',
                borderRadius: 4,
                boxShadow: 'none',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    bgcolor: 'success.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <BoltIcon sx={{ color: 'white' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  편의성
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  간편한 지출 기록으로 언제 어디서나 빠르게 입력할 수 있습니다
                </Typography>
              </CardContent>
            </Card>

            {/* Feature 3 - 협업 */}
            <Card
              sx={{
                bgcolor: '#faf5ff',
                borderRadius: 4,
                boxShadow: 'none',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    bgcolor: '#9333ea',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <GroupIcon sx={{ color: 'white' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  협업
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  다중 사용자 공동 관리로 함께 기록하고 관리할 수 있습니다
                </Typography>
              </CardContent>
            </Card>
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
            {/* Persona 1 - 가족 가계부 */}
            <Card sx={{ borderRadius: 4 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: '#fce7f3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}
                  >
                    <FavoriteIcon sx={{ color: '#ec4899' }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    가족 가계부
                  </Typography>
                </Box>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    가족 생활비 투명하게 관리
                  </Typography>
                  <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    월말 정산 간편하게
                  </Typography>
                  <Typography component="li" variant="body2" color="text.secondary">
                    지출 패턴 함께 분석
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Persona 2 - 모임 회계 */}
            <Card sx={{ borderRadius: 4 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: '#dbeafe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}
                  >
                    <GroupIcon sx={{ color: 'primary.main' }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    모임 회계
                  </Typography>
                </Box>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    동아리, 스터디 모임 회비 관리
                  </Typography>
                  <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    투명한 회계 처리
                  </Typography>
                  <Typography component="li" variant="body2" color="text.secondary">
                    멤버별 정산 자동화
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Persona 3 - 룸메이트 정산 */}
            <Card sx={{ borderRadius: 4 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: '#dcfce7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}
                  >
                    <HomeIcon sx={{ color: 'success.main' }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    룸메이트 정산
                  </Typography>
                </Box>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    공과금, 생활비 나누기
                  </Typography>
                  <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    실시간 지출 공유
                  </Typography>
                  <Typography component="li" variant="body2" color="text.secondary">
                    공평한 비용 분담
                  </Typography>
                </Box>
              </CardContent>
            </Card>
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
