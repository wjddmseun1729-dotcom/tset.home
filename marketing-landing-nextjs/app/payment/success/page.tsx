'use client';

import { useEffect, useState, Suspense, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';

// 상품명 매핑
const productNames: Record<string, string> = {
  test: '테스트 상품',
  starter: '스타터 플랜',
  pro: '프로 플랜',
};

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const { user, userProfile, loading } = useAuth();
  const [orderInfo, setOrderInfo] = useState({
    orderId: '',
    amount: 0,
    productId: '',
    paymentKey: '',
  });
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const saveAttempted = useRef(false);

  // URL에서 주문 정보 파싱
  useEffect(() => {
    const orderId = searchParams.get('orderId') || '';
    const amount = parseInt(searchParams.get('amount') || '0');
    const productId = searchParams.get('productId') || '';
    const paymentKey = searchParams.get('paymentKey') || '';

    console.log('결제 성공 페이지 - 주문 정보:', { orderId, amount, productId, paymentKey });

    setOrderInfo({ orderId, amount, productId, paymentKey });
  }, [searchParams]);

  // Firebase에 주문 저장
  const saveOrder = useCallback(async () => {
    if (saveAttempted.current || !orderInfo.orderId || isSaved) {
      return;
    }

    // 인증 로딩 중이면 대기
    if (loading) {
      console.log('인증 로딩 중... 대기');
      return;
    }

    saveAttempted.current = true;
    console.log('Firebase에 주문 저장 시도...', orderInfo);

    try {
      // 이미 저장된 주문인지 확인
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('orderId', '==', orderInfo.orderId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // 새 주문 저장
        const orderData = {
          orderId: orderInfo.orderId,
          amount: orderInfo.amount,
          productId: orderInfo.productId,
          productName: productNames[orderInfo.productId] || orderInfo.productId,
          paymentKey: orderInfo.paymentKey,
          userId: user?.uid || 'guest',
          userEmail: user?.email || 'guest@guest.com',
          userName: userProfile?.name || '비회원',
          status: 'completed',
          paymentMethod: 'toss',
          createdAt: serverTimestamp(),
        };

        console.log('저장할 주문 데이터:', orderData);

        await addDoc(ordersRef, orderData);
        console.log('주문이 Firebase에 저장되었습니다!');
        setIsSaved(true);
      } else {
        console.log('이미 저장된 주문입니다.');
        setIsSaved(true);
      }
    } catch (error) {
      console.error('주문 저장 오류:', error);
      setSaveError('주문 저장 중 오류가 발생했습니다.');
      // 에러가 나도 재시도할 수 있도록
      saveAttempted.current = false;
    }
  }, [orderInfo, user, userProfile, loading, isSaved]);

  // 주문 정보가 있고 인증 로딩이 완료되면 저장
  useEffect(() => {
    if (orderInfo.orderId && !loading) {
      saveOrder();
    }
  }, [orderInfo.orderId, loading, saveOrder]);

  return (
    <section className="pt-24 pb-20 min-h-[calc(100vh-200px)] flex items-center">
      <div className="max-w-lg mx-auto px-4 text-center">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          {/* 성공 아이콘 */}
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold mb-2">결제가 완료되었습니다!</h1>
          <p className="text-muted-foreground mb-6">
            MarketingPro를 선택해 주셔서 감사합니다.<br />
            서비스 이용 안내 이메일을 곧 발송해 드립니다.
          </p>

          {/* 저장 상태 표시 */}
          {!isSaved && !saveError && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
              <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
              주문 정보 저장 중...
            </div>
          )}
          {saveError && (
            <div className="text-red-500 text-sm mb-4">{saveError}</div>
          )}

          {/* 주문 정보 */}
          <div className="bg-secondary/50 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-medium mb-3">주문 정보</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">주문번호</dt>
                <dd className="font-mono">{orderInfo.orderId ? `${orderInfo.orderId.slice(0, 20)}...` : '-'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">상품명</dt>
                <dd className="font-medium">{productNames[orderInfo.productId] || orderInfo.productId || '-'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">결제금액</dt>
                <dd className="font-bold">{orderInfo.amount.toLocaleString()}원</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">결제상태</dt>
                <dd className="text-green-500 font-medium">결제완료</dd>
              </div>
            </dl>
          </div>

          {/* 안내 사항 */}
          <div className="text-left text-sm text-muted-foreground mb-6">
            <p className="mb-2">• 서비스 이용 안내가 이메일로 발송됩니다.</p>
            <p className="mb-2">• 전담 매니저가 24시간 내 연락드립니다.</p>
            <p>• 문의사항은 고객센터로 연락해 주세요.</p>
          </div>

          {/* 버튼 */}
          <div className="space-y-3">
            {user ? (
              <Link
                href="/mypage"
                className="block w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-lg font-bold transition-all"
              >
                마이페이지에서 확인하기
              </Link>
            ) : (
              <Link
                href="/"
                className="block w-full py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-lg font-bold transition-all"
              >
                홈으로 돌아가기
              </Link>
            )}
            <Link
              href="/products"
              className="block w-full py-3 border border-border hover:border-primary text-foreground rounded-lg font-medium transition-all"
            >
              다른 상품 보기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <Suspense fallback={
        <section className="pt-24 pb-20 min-h-[calc(100vh-200px)] flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </section>
      }>
        <PaymentSuccessContent />
      </Suspense>
      <Footer />
    </main>
  );
}
