'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import Link from 'next/link';
import Script from 'next/script';
import { useAuth } from '@/lib/auth-context';

// 상품 데이터
const products: Record<string, Product> = {
  test: {
    id: 'test',
    name: '테스트 상품',
    price: 100,
    originalPrice: 1000,
    period: '1회',
    description: '결제 테스트용 100원 상품입니다. 토스페이먼츠 결제 연동을 확인하기 위한 테스트 상품으로, 실제 결제가 진행됩니다.',
    features: [
      { title: '결제 테스트용', desc: '실제 결제 프로세스를 테스트할 수 있습니다' },
      { title: '토스페이먼츠 연동 확인', desc: '카드, 계좌이체, 토스페이 등 모든 결제수단 테스트' },
      { title: '즉시 환불 가능', desc: '테스트 후 언제든 환불 요청 가능합니다' },
    ],
    images: [
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800&h=600&fit=crop',
    ],
  },
  starter: {
    id: 'starter',
    name: '스타터 플랜',
    price: 990000,
    originalPrice: 1980000,
    period: '월',
    description: '소규모 비즈니스를 위한 기본 마케팅 자동화 솔루션입니다. AI 기반 마케팅 자동화로 시간과 비용을 절약하세요.',
    features: [
      { title: '기본 AI 마케팅 자동화', desc: '자동화된 캠페인 관리로 마케팅 효율성 향상' },
      { title: '월간 성과 리포트', desc: '매월 상세한 성과 분석 보고서 제공' },
      { title: '이메일 마케팅 (월 10,000건)', desc: '자동화된 이메일 캠페인 발송' },
      { title: 'SNS 자동 포스팅 (3개 계정)', desc: '페이스북, 인스타그램, 트위터 자동 포스팅' },
      { title: '기본 고객 분석', desc: '고객 행동 패턴 분석 및 인사이트 제공' },
      { title: '이메일 지원', desc: '영업일 기준 24시간 내 응답' },
    ],
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop',
    ],
  },
  pro: {
    id: 'pro',
    name: '프로 플랜',
    price: 2990000,
    originalPrice: 5980000,
    period: '월',
    description: '성장하는 기업을 위한 고급 마케팅 솔루션입니다. 실시간 데이터 분석과 전담 매니저가 비즈니스 성장을 도와드립니다.',
    features: [
      { title: '고급 AI 마케팅 자동화', desc: '머신러닝 기반 캠페인 최적화' },
      { title: '실시간 대시보드', desc: '모든 마케팅 성과를 한눈에 확인' },
      { title: '이메일 마케팅 (무제한)', desc: '무제한 이메일 발송 및 A/B 테스트' },
      { title: 'SNS 자동 포스팅 (10개 계정)', desc: '모든 주요 SNS 플랫폼 지원' },
      { title: '고급 고객 세그먼트', desc: 'AI 기반 고객 세분화 및 타겟팅' },
      { title: 'A/B 테스트', desc: '무제한 A/B 테스트로 전환율 최적화' },
      { title: '1:1 전담 매니저', desc: '전문 매니저의 맞춤형 컨설팅' },
      { title: '24/7 우선 지원', desc: '언제든지 실시간 지원' },
      { title: 'API 연동', desc: '기존 시스템과 완벽한 통합' },
    ],
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop',
    ],
  },
};

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  period: string;
  description: string;
  features: { title: string; desc: string }[];
  images: string[];
}

// 토스페이먼츠 클라이언트 키
const clientKey = 'test_ck_EP59LybZ8BBwRNmzaPNb86GYo7pR';

// TossPayments 타입 선언
declare global {
  interface Window {
    TossPayments?: (clientKey: string) => {
      requestPayment: (method: string, options: {
        amount: number;
        orderId: string;
        orderName: string;
        customerName?: string;
        customerEmail?: string;
        successUrl: string;
        failUrl: string;
      }) => Promise<void>;
    };
  }
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  useEffect(() => {
    const productId = params.id as string;
    if (products[productId]) {
      setProduct(products[productId]);
    } else {
      router.push('/products');
    }
  }, [params.id, router]);

  // 결제 요청 (구 SDK 방식)
  const handlePayment = async () => {
    if (!product || !sdkLoaded) {
      alert('결제 모듈을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    setIsPaymentLoading(true);

    try {
      const tossPayments = window.TossPayments?.(clientKey);

      if (!tossPayments) {
        throw new Error('결제 모듈을 불러올 수 없습니다.');
      }

      // 주문 ID 생성
      const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

      // 결제 요청
      await tossPayments.requestPayment('카드', {
        amount: product.price,
        orderId,
        orderName: product.name,
        customerName: userProfile?.name || '고객',
        customerEmail: user?.email || undefined,
        successUrl: `${window.location.origin}/payment/success?orderId=${orderId}&amount=${product.price}&productId=${product.id}`,
        failUrl: `${window.location.origin}/payment/fail?orderId=${orderId}`,
      });
    } catch (error: unknown) {
      console.error('결제 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '결제 중 오류가 발생했습니다.';
      // 사용자 취소는 알림 표시하지 않음
      if (!errorMessage.includes('사용자가 결제를 취소') &&
          !errorMessage.includes('USER_CANCEL') &&
          !errorMessage.includes('PAY_PROCESS_CANCELED')) {
        alert(errorMessage);
      }
    } finally {
      setIsPaymentLoading(false);
    }
  };

  if (!product) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* 토스페이먼츠 SDK 스크립트 */}
      <Script
        src="https://js.tosspayments.com/v1/payment"
        onLoad={() => setSdkLoaded(true)}
        strategy="afterInteractive"
      />

      <Header />

      <section className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm">
            <ol className="flex items-center gap-2 text-muted-foreground">
              <li><Link href="/" className="hover:text-primary">홈</Link></li>
              <li>/</li>
              <li><Link href="/products" className="hover:text-primary">상품</Link></li>
              <li>/</li>
              <li className="text-foreground">{product.name}</li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* 이미지 갤러리 */}
            <div>
              <div className="bg-card border border-border rounded-2xl overflow-hidden mb-4">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-[400px] object-cover"
                />
              </div>
              <div className="flex gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-primary' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* 상품 정보 */}
            <div>
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-3">
                  50% 할인
                </span>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              {/* 가격 */}
              <div className="bg-card border border-border rounded-xl p-6 mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold">
                    {product.price.toLocaleString()}원
                  </span>
                  <span className="text-muted-foreground">/{product.period}</span>
                </div>
                <p className="text-muted-foreground line-through">
                  정가 {product.originalPrice.toLocaleString()}원
                </p>
                <p className="text-green-500 text-sm mt-2">
                  {(product.originalPrice - product.price).toLocaleString()}원 절약
                </p>
              </div>

              {/* 결제 버튼 */}
              <div className="space-y-3 mb-8">
                <button
                  onClick={handlePayment}
                  disabled={isPaymentLoading || !sdkLoaded}
                  className="w-full py-4 bg-primary hover:opacity-90 disabled:opacity-50 text-primary-foreground rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
                >
                  {isPaymentLoading ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      결제 진행 중...
                    </>
                  ) : !sdkLoaded ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      결제 모듈 로딩 중...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                        <line x1="1" y1="10" x2="23" y2="10"></line>
                      </svg>
                      {product.price.toLocaleString()}원 결제하기
                    </>
                  )}
                </button>
                <Link
                  href="/#leadForm"
                  className="block w-full py-4 border border-border hover:border-primary text-foreground rounded-xl font-bold text-lg text-center transition-all"
                >
                  상담 먼저 받기
                </Link>
              </div>

              {/* 혜택 */}
              <div className="bg-secondary/50 rounded-xl p-4 mb-8">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    30일 환불 보장
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    즉시 이용 가능
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    무료 설치 지원
                  </div>
                </div>
              </div>

              {/* 결제 수단 안내 */}
              <div className="text-center text-sm text-muted-foreground">
                <p className="mb-2">안전한 결제</p>
                <div className="flex items-center justify-center gap-4">
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded font-medium">토스페이</span>
                  <span className="px-3 py-1 bg-secondary rounded">신용카드</span>
                  <span className="px-3 py-1 bg-secondary rounded">계좌이체</span>
                </div>
              </div>
            </div>
          </div>

          {/* 상세 기능 */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">포함된 기능</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.features.map((feature, idx) => (
                <div key={idx} className="bg-card border border-border rounded-xl p-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
