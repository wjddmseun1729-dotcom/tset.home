'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, userProfile, loading, signOut, isAdmin } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-background/90 backdrop-blur-lg border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <Link href="/" className="text-2xl font-bold text-primary">
            MarketingPro
          </Link>

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/about"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              회사소개
            </Link>
            <Link
              href="/products"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              상품소개
            </Link>
            <Link
              href="/#leadForm"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              상담신청
            </Link>
          </div>

          {/* 로그인/회원가입 또는 사용자 메뉴 */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-8 h-8 animate-pulse bg-secondary rounded-full"></div>
            ) : user ? (
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="px-3 py-1.5 text-sm bg-purple-500/10 text-purple-500 rounded-lg hover:bg-purple-500/20 transition-colors"
                  >
                    관리자
                  </Link>
                )}
                <Link
                  href="/mypage"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">
                      {userProfile?.name?.charAt(0) || user.email?.charAt(0) || '?'}
                    </span>
                  </div>
                  <span className="hidden lg:inline">
                    {userProfile?.name || '사용자'}
                  </span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="px-5 py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-lg font-semibold transition-all hover:-translate-y-0.5"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link
                href="/about"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                회사소개
              </Link>
              <Link
                href="/products"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                상품소개
              </Link>
              <Link
                href="/#leadForm"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                상담신청
              </Link>

              <div className="flex gap-3 pt-4 border-t border-border">
                {loading ? (
                  <div className="w-full h-10 animate-pulse bg-secondary rounded-lg"></div>
                ) : user ? (
                  <div className="flex flex-col gap-3 w-full">
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="py-2 text-center bg-purple-500/10 text-purple-500 rounded-lg font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        관리자 대시보드
                      </Link>
                    )}
                    <Link
                      href="/mypage"
                      className="py-2 text-center text-foreground border border-border rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      마이페이지
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="py-2 text-center text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors"
                    >
                      로그아웃
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex-1 py-2 text-center text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      로그인
                    </Link>
                    <Link
                      href="/signup"
                      className="flex-1 py-2 text-center bg-primary hover:opacity-90 text-primary-foreground rounded-lg font-semibold transition-all"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      회원가입
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
