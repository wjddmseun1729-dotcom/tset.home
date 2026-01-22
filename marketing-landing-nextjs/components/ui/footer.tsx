'use client';

import Link from 'next/link';
import { useState } from 'react';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError('');

    try {
      // 이미 구독한 이메일인지 확인
      const subscribersRef = collection(db, 'newsletter');
      const q = query(subscribersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError('이미 구독 중인 이메일입니다.');
        setIsLoading(false);
        return;
      }

      // 새 구독자 저장
      await addDoc(subscribersRef, {
        email,
        status: 'active',
        createdAt: serverTimestamp(),
      });

      setIsSubscribed(true);
      setEmail('');
      console.log('뉴스레터 구독이 Firebase에 저장되었습니다.');

      // 3초 후 메시지 숨기기
      setTimeout(() => setIsSubscribed(false), 3000);
    } catch (err) {
      console.error('뉴스레터 구독 오류:', err);
      setError('구독 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-secondary border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">MarketingPro</h3>
            <p className="text-muted-foreground mb-4">
              데이터 기반 마케팅 자동화로
              <br />
              비즈니스 성장을 가속화합니다.
            </p>

            {/* 뉴스레터 구독 폼 */}
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">뉴스레터 구독</p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일 입력"
                  className="flex-1 px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
                >
                  {isLoading ? '...' : '구독'}
                </button>
              </form>
              {isSubscribed && (
                <p className="text-green-500 text-xs mt-2">구독 완료!</p>
              )}
              {error && (
                <p className="text-red-500 text-xs mt-2">{error}</p>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-4">서비스</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/products" className="hover:text-primary transition-colors">마케팅 자동화</Link></li>
              <li><Link href="/products" className="hover:text-primary transition-colors">데이터 분석</Link></li>
              <li><Link href="/products" className="hover:text-primary transition-colors">SEO 최적화</Link></li>
              <li><Link href="/products" className="hover:text-primary transition-colors">SNS 마케팅</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">회사</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">회사 소개</Link></li>
              <li><Link href="/about#cases" className="hover:text-primary transition-colors">고객 사례</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">블로그</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">채용</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">문의</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="mailto:contact@marketingpro.com" className="hover:text-primary transition-colors">contact@marketingpro.com</a></li>
              <li><a href="tel:02-1234-5678" className="hover:text-primary transition-colors">02-1234-5678</a></li>
              <li className="mt-2">평일 09:00 - 18:00</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-muted-foreground border-t border-border pt-8">
          <p>&copy; 2024 MarketingPro. All rights reserved. | <Link href="#" className="hover:text-primary">개인정보처리방침</Link> | <Link href="#" className="hover:text-primary">이용약관</Link></p>
        </div>
      </div>
    </footer>
  );
}
