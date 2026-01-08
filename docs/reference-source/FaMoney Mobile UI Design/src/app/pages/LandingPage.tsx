import { ChevronRight, Shield, Zap, Users, Heart, Calculator, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import type { Page } from '../App';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="h-full overflow-y-auto">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 py-12 bg-gradient-to-b from-blue-50 to-white">
        <div className="w-full max-w-md space-y-6 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Calculator className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            가족과 함께하는
            <br />
            투명한 가계부
          </h1>

          {/* Subheading */}
          <p className="text-lg text-gray-600">
            그룹 지출을 쉽고 투명하게
            <br />
            기록하고 관리하세요
          </p>

          {/* CTAs */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={() => onNavigate('signup')}
              className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700"
            >
              무료로 시작하기
            </Button>
            <Button
              onClick={() => onNavigate('login')}
              variant="outline"
              className="w-full h-12"
            >
              로그인
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-12 animate-bounce">
          <ChevronRight className="w-6 h-6 text-gray-400 rotate-90" />
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12 text-gray-900">
            왜 FaMoney인가요?
          </h2>

          <div className="space-y-6">
            {/* Feature 1 */}
            <div className="bg-blue-50 rounded-2xl p-6">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">투명성</h3>
              <p className="text-gray-600">
                실시간 지출 내역 공유로 모든 멤버가 투명하게 확인할 수 있습니다
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-green-50 rounded-2xl p-6">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">편의성</h3>
              <p className="text-gray-600">
                간편한 지출 기록으로 언제 어디서나 빠르게 입력할 수 있습니다
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-purple-50 rounded-2xl p-6">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">협업</h3>
              <p className="text-gray-600">
                다중 사용자 공동 관리로 함께 기록하고 관리할 수 있습니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12 text-gray-900">
            누가 사용하나요?
          </h2>

          <div className="space-y-4">
            {/* Persona 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="text-lg font-semibold ml-3 text-gray-900">가족 가계부</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 가족 생활비 투명하게 관리</li>
                <li>• 월말 정산 간편하게</li>
                <li>• 지출 패턴 함께 분석</li>
              </ul>
            </div>

            {/* Persona 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold ml-3 text-gray-900">모임 회계</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 동아리, 스터디 모임 회비 관리</li>
                <li>• 투명한 회계 처리</li>
                <li>• 멤버별 정산 자동화</li>
              </ul>
            </div>

            {/* Persona 3 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Home className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold ml-3 text-gray-900">룸메이트 정산</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 공과금, 생활비 나누기</li>
                <li>• 실시간 지출 공유</li>
                <li>• 공평한 비용 분담</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-6 py-16 bg-blue-600">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-blue-100 mb-8">
            무료로 가입하고 투명한 가계부 관리를 경험해보세요
          </p>
          <Button
            onClick={() => onNavigate('signup')}
            className="w-full h-14 text-lg bg-white text-blue-600 hover:bg-gray-100"
          >
            무료로 시작하기
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-gray-900 text-center">
        <p className="text-gray-400 text-sm">
          © 2025 FaMoney. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
