'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { useAuth } from '@/lib/auth-context';

export default function SignupPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    company: '',
    phone: '',
    agreeTerms: false,
    agreeMarketing: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    // 에러 초기화
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    }

    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    }

    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = '필수 약관에 동의해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      await signUp(
        formData.email,
        formData.password,
        formData.name,
        formData.company,
        formData.phone
      );

      alert('회원가입이 완료되었습니다!');
      router.push('/mypage');
    } catch (error: unknown) {
      console.error('회원가입 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '';

      if (errorMessage.includes('email-already-in-use')) {
        setErrors({ email: '이미 가입된 이메일입니다.' });
      } else if (errorMessage.includes('weak-password')) {
        setErrors({ password: '비밀번호가 너무 약합니다. 6자 이상 입력해주세요.' });
      } else if (errorMessage.includes('invalid-email')) {
        setErrors({ email: '유효하지 않은 이메일 형식입니다.' });
      } else {
        setErrors({ email: '회원가입 중 오류가 발생했습니다.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      router.push('/mypage');
    } catch (error) {
      console.error('Google 회원가입 오류:', error);
      setErrors({ email: 'Google 회원가입 중 오류가 발생했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      <section className="pt-24 pb-20 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">회원가입</h1>
              <p className="text-muted-foreground">MarketingPro와 함께 성장하세요</p>
            </div>

            {/* 소셜 회원가입 */}
            <div className="mb-6">
              <button
                onClick={handleGoogleSignup}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-border rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-medium">Google로 시작하기</span>
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground">또는 이메일로 가입</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 이메일 */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  이메일 *
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
                  비밀번호 *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="8자 이상 입력"
                  className={`w-full px-4 py-3 bg-secondary border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.password ? 'border-red-500' : 'border-input'}`}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* 비밀번호 확인 */}
              <div>
                <label htmlFor="passwordConfirm" className="block text-sm font-medium mb-1">
                  비밀번호 확인 *
                </label>
                <input
                  type="password"
                  id="passwordConfirm"
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  placeholder="비밀번호 재입력"
                  className={`w-full px-4 py-3 bg-secondary border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.passwordConfirm ? 'border-red-500' : 'border-input'}`}
                />
                {errors.passwordConfirm && <p className="text-red-500 text-sm mt-1">{errors.passwordConfirm}</p>}
              </div>

              {/* 이름 */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  이름 *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="홍길동"
                  className={`w-full px-4 py-3 bg-secondary border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.name ? 'border-red-500' : 'border-input'}`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* 회사명 (선택) */}
              <div>
                <label htmlFor="company" className="block text-sm font-medium mb-1">
                  회사명
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="ABC마케팅"
                  className="w-full px-4 py-3 bg-secondary border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* 연락처 (선택) */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                  연락처
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="010-1234-5678"
                  className="w-full px-4 py-3 bg-secondary border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* 약관 동의 */}
              <div className="space-y-3 pt-4 border-t border-border">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 rounded border-input"
                  />
                  <span className="text-sm">
                    <span className="text-red-500">[필수]</span> 이용약관 및 개인정보처리방침에 동의합니다.
                  </span>
                </label>
                {errors.agreeTerms && <p className="text-red-500 text-sm">{errors.agreeTerms}</p>}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeMarketing"
                    checked={formData.agreeMarketing}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 rounded border-input"
                  />
                  <span className="text-sm text-muted-foreground">
                    [선택] 마케팅 정보 수신에 동의합니다.
                  </span>
                </label>
              </div>

              {/* 가입 버튼 */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-primary hover:opacity-90 disabled:opacity-50 text-primary-foreground rounded-lg font-bold text-lg transition-all hover:-translate-y-0.5"
              >
                {isLoading ? '가입 중...' : '회원가입'}
              </button>
            </form>

            {/* 로그인 링크 */}
            <p className="text-center text-muted-foreground mt-6">
              이미 계정이 있으신가요?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
