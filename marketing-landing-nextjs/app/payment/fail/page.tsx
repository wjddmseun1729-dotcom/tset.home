'use client';

import Link from 'next/link';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';

export default function PaymentFailPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      <section className="pt-24 pb-20 min-h-[calc(100vh-200px)] flex items-center">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
            {/* 실패 아이콘 */}
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold mb-2">결제에 실패했습니다</h1>
            <p className="text-muted-foreground mb-6">
              결제 처리 중 문제가 발생했습니다.<br />
              다시 시도하시거나 다른 결제 수단을 이용해 주세요.
            </p>

            {/* 안내 사항 */}
            <div className="bg-secondary/50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-medium mb-3">결제 실패 원인</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• 카드 한도 초과</li>
                <li>• 카드 정보 오류</li>
                <li>• 네트워크 오류</li>
                <li>• 결제 취소</li>
              </ul>
            </div>

            {/* 버튼 */}
            <div className="space-y-3">
              <Link
                href="/products"
                className="block w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-lg font-bold transition-all"
              >
                다시 시도하기
              </Link>
              <Link
                href="/#leadForm"
                className="block w-full py-3 border border-border hover:border-primary text-foreground rounded-lg font-medium transition-all"
              >
                상담 신청하기
              </Link>
            </div>

            {/* 고객센터 */}
            <p className="text-sm text-muted-foreground mt-6">
              문제가 계속되면 고객센터로 문의해 주세요.<br />
              <a href="tel:02-1234-5678" className="text-primary hover:underline">02-1234-5678</a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
