'use client';

import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import Link from 'next/link';

// 상품 데이터
export const products = [
  {
    id: 'test',
    name: '테스트 상품',
    price: 100,
    originalPrice: 1000,
    period: '1회',
    badge: '테스트',
    description: '결제 테스트용 100원 상품입니다',
    features: [
      '결제 테스트용',
      '토스페이먼츠 연동 확인',
      '즉시 환불 가능',
    ],
    notIncluded: [],
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
  },
  {
    id: 'starter',
    name: '스타터 플랜',
    price: 990000,
    originalPrice: 1980000,
    period: '월',
    badge: '',
    description: '소규모 비즈니스를 위한 기본 마케팅 자동화',
    features: [
      '기본 AI 마케팅 자동화',
      '월간 성과 리포트',
      '이메일 마케팅 (월 10,000건)',
      'SNS 자동 포스팅 (3개 계정)',
      '기본 고객 분석',
      '이메일 지원',
    ],
    notIncluded: [
      '실시간 대시보드',
      '1:1 전담 매니저',
      'A/B 테스트',
    ],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
  },
  {
    id: 'pro',
    name: '프로 플랜',
    price: 2990000,
    originalPrice: 5980000,
    period: '월',
    badge: '인기',
    description: '성장하는 기업을 위한 고급 마케팅 솔루션',
    features: [
      '고급 AI 마케팅 자동화',
      '실시간 대시보드',
      '이메일 마케팅 (무제한)',
      'SNS 자동 포스팅 (10개 계정)',
      '고급 고객 세그먼트',
      'A/B 테스트',
      '1:1 전담 매니저',
      '24/7 우선 지원',
      'API 연동',
    ],
    notIncluded: [
      '맞춤형 개발',
    ],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
  },
  {
    id: 'enterprise',
    name: '엔터프라이즈',
    price: 0, // 맞춤 견적
    originalPrice: 0,
    period: '',
    badge: '맞춤',
    description: '대기업을 위한 완전 맞춤형 솔루션',
    features: [
      '프로 플랜의 모든 기능',
      '맞춤형 AI 모델 개발',
      '전용 서버 구축',
      '무제한 API 호출',
      '전담 개발팀 배정',
      'SLA 99.9% 보장',
      '온사이트 교육',
      '우선 기능 개발',
    ],
    notIncluded: [],
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop',
  },
];

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
            Products
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            비즈니스에 맞는<br />플랜을 선택하세요
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            지금 시작하면 첫 달 50% 할인! 30일 100% 환불 보장
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className={`relative bg-card border rounded-2xl overflow-hidden transition-all hover:-translate-y-2 hover:shadow-xl ${
                  product.badge === '인기' ? 'border-primary shadow-lg shadow-primary/20' : 'border-border'
                }`}
              >
                {/* Badge */}
                {product.badge && (
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${
                    product.badge === '인기' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'
                  }`}>
                    {product.badge}
                  </div>
                )}

                {/* Image */}
                <div className="h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                  <p className="text-muted-foreground mb-4">{product.description}</p>

                  {/* Price */}
                  <div className="mb-6">
                    {product.price > 0 ? (
                      <>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold">
                            {product.price.toLocaleString()}원
                          </span>
                          <span className="text-muted-foreground">/{product.period}</span>
                        </div>
                        {product.originalPrice > product.price && (
                          <p className="text-sm text-muted-foreground line-through">
                            정가 {product.originalPrice.toLocaleString()}원
                          </p>
                        )}
                      </>
                    ) : (
                      <div className="text-3xl font-bold">맞춤 견적</div>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                    {product.notIncluded.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <svg className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href={product.price > 0 ? `/products/${product.id}` : '/#leadForm'}
                    className={`block w-full py-3 rounded-lg font-bold text-center transition-all ${
                      product.badge === '인기'
                        ? 'bg-primary hover:opacity-90 text-primary-foreground'
                        : 'bg-secondary hover:bg-secondary/80 text-foreground border border-border'
                    }`}
                  >
                    {product.price > 0 ? '자세히 보기' : '문의하기'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">플랜 비교</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-card border border-border rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-secondary">
                  <th className="p-4 text-left">기능</th>
                  <th className="p-4 text-center">스타터</th>
                  <th className="p-4 text-center bg-primary/10">프로</th>
                  <th className="p-4 text-center">엔터프라이즈</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'AI 마케팅 자동화', starter: '기본', pro: '고급', enterprise: '맞춤형' },
                  { feature: '이메일 마케팅', starter: '월 10,000건', pro: '무제한', enterprise: '무제한' },
                  { feature: 'SNS 자동 포스팅', starter: '3개 계정', pro: '10개 계정', enterprise: '무제한' },
                  { feature: '실시간 대시보드', starter: false, pro: true, enterprise: true },
                  { feature: 'A/B 테스트', starter: false, pro: true, enterprise: true },
                  { feature: '1:1 전담 매니저', starter: false, pro: true, enterprise: true },
                  { feature: 'API 연동', starter: false, pro: true, enterprise: true },
                  { feature: '맞춤형 개발', starter: false, pro: false, enterprise: true },
                  { feature: 'SLA 보장', starter: '99%', pro: '99.5%', enterprise: '99.9%' },
                ].map((row, idx) => (
                  <tr key={idx} className="border-t border-border">
                    <td className="p-4 font-medium">{row.feature}</td>
                    <td className="p-4 text-center">
                      {typeof row.starter === 'boolean' ? (
                        row.starter ? '✓' : '—'
                      ) : row.starter}
                    </td>
                    <td className="p-4 text-center bg-primary/5">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <span className="text-primary font-bold">✓</span> : '—'
                      ) : <span className="text-primary font-bold">{row.pro}</span>}
                    </td>
                    <td className="p-4 text-center">
                      {typeof row.enterprise === 'boolean' ? (
                        row.enterprise ? '✓' : '—'
                      ) : row.enterprise}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">자주 묻는 질문</h2>
          <div className="space-y-4">
            {[
              { q: '언제든지 플랜을 변경할 수 있나요?', a: '네, 언제든지 업그레이드하거나 다운그레이드할 수 있습니다. 변경 사항은 다음 결제일부터 적용됩니다.' },
              { q: '환불 정책은 어떻게 되나요?', a: '첫 30일 이내에는 100% 환불이 가능합니다. 그 이후에는 남은 기간에 대해 비례 환불해 드립니다.' },
              { q: '무료 체험이 가능한가요?', a: '14일 무료 체험을 제공합니다. 신용카드 없이 바로 시작할 수 있습니다.' },
              { q: '결제 방법은 무엇이 있나요?', a: '신용카드, 체크카드, 계좌이체, 토스페이 등 다양한 결제 수단을 지원합니다.' },
            ].map((faq, idx) => (
              <details key={idx} className="group bg-card border border-border rounded-xl">
                <summary className="p-6 cursor-pointer font-medium flex justify-between items-center">
                  {faq.q}
                  <svg className="w-5 h-5 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="px-6 pb-6 text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
