'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = '이메일을 입력해주세요.';
    if (!formData.password) newErrors.password = '비밀번호를 입력해주세요.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      await signIn(formData.email, formData.password);
      router.push('/mypage');
    } catch (error: unknown) {
      console.error('로그인 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '';

      if (errorMessage.includes('user-not-found')) {
        setErrors({ email: '등록되지 않은 이메일입니다.' });
      } else if (errorMessage.includes('wrong-password')) {
        setErrors({ password: '비밀번호가 올바르지 않습니다.' });
      } else if (errorMessage.includes('invalid-email')) {
        setErrors({ email: '유효하지 않은 이메일 형식입니다.' });
      } else if (errorMessage.includes('invalid-credential')) {
        setErrors({ password: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      } else {
        setErrors({ password: '로그인 중 오류가 발생했습니다.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      router.push('/mypage');
    } catch (error) {
      console.error('Google 로그인 오류:', error);
      setErrors({ password: 'Google 로그인 중 오류가 발생했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      <section className="pt-24 pb-20 px-4 min-h-[calc(100vh-200px)] flex items-center">
        <div className="max-w-md mx-auto w-full">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">로그인</h1>
              <p className="text-muted-foreground">계정에 로그인하세요</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 이메일 */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  이메일
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@company.com"
                  className={`w-full px-4 py-3 bg-secondary border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.email ? 'border-red-500' : 'border-input'}`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* 비밀번호 */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  비밀번호
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="비밀번호 입력"
                  className={`w-full px-4 py-3 bg-secondary border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.password ? 'border-red-500' : 'border-input'}`}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* 로그인 유지 & 비밀번호 찾기 */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-input"
                  />
                  <span className="text-sm text-muted-foreground">로그인 유지</span>
                </label>
                <Link href="#" className="text-sm text-primary hover:underline">
                  비밀번호 찾기
                </Link>
              </div>

              {/* 로그인 버튼 */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-primary hover:opacity-90 disabled:opacity-50 text-primary-foreground rounded-lg font-bold text-lg transition-all hover:-translate-y-0.5"
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </button>
            </form>

            {/* 소셜 로그인 */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-card text-muted-foreground">또는</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 px-4 py-3 border border-border rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-sm font-medium">Google</span>
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 border border-border rounded-lg hover:bg-secondary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#FEE500">
                    <path d="M12 3c-5.52 0-10 3.59-10 8.03 0 2.83 1.88 5.32 4.71 6.72-.16.57-.59 2.07-.68 2.39-.1.4.15.39.31.29.13-.08 2.04-1.38 2.87-1.94.91.13 1.85.2 2.79.2 5.52 0 10-3.59 10-8.03S17.52 3 12 3z"/>
                  </svg>
                  <span className="text-sm font-medium">카카오</span>
                </button>
              </div>
            </div>

            {/* 회원가입 링크 */}
            <p className="text-center text-muted-foreground mt-6">
              계정이 없으신가요?{' '}
              <Link href="/signup" className="text-primary hover:underline font-medium">
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
