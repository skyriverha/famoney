import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { toast } from 'sonner';
import type { Page, User } from '../App';

interface LoginPageProps {
  onNavigate: (page: Page) => void;
  onLogin: (user: User) => void;
}

export function LoginPage({ onNavigate, onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
      // Mock login - in real app, this would call an API
      const mockUser: User = {
        id: '1',
        name: email.split('@')[0],
        email: email,
        avatar: undefined,
      };
      
      toast.success('로그인 성공!');
      onLogin(mockUser);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-white">
      {/* Top Bar */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={() => onNavigate('landing')}
            className="w-12 h-12 flex items-center justify-center -ml-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="flex-1 text-center font-semibold pr-12">로그인</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8 flex flex-col min-h-[calc(100vh-56px)]">
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl">💰</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-8">로그인</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
                placeholder="example@email.com"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pr-12"
                  placeholder="비밀번호를 입력하세요"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <label
                htmlFor="remember"
                className="text-sm text-gray-700 cursor-pointer select-none"
              >
                자동 로그인
              </label>
            </div>

            {/* Login Button */}
            <Button type="submit" className="w-full h-14 text-lg">
              로그인
            </Button>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => toast.info('비밀번호 재설정 기능은 준비 중입니다')}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                비밀번호를 잊으셨나요?
              </button>
            </div>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 text-sm text-gray-500 bg-white">또는</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => onNavigate('signup')}
                className="text-sm text-blue-600"
              >
                계정이 없으신가요? <span className="font-semibold">회원가입</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
