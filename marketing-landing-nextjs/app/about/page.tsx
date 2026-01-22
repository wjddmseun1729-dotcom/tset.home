'use client';

import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import Link from 'next/link';

export default function AboutPage() {
  const team = [
    { name: '김대표', role: 'CEO', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face' },
    { name: '이기술', role: 'CTO', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face' },
    { name: '박마케팅', role: 'CMO', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face' },
    { name: '최영업', role: 'CSO', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face' },
  ];

  const milestones = [
    { year: '2020', title: '회사 설립', desc: 'AI 마케팅 자동화 솔루션 개발 시작' },
    { year: '2021', title: '시리즈 A 투자 유치', desc: '50억원 투자 유치, 팀 확장' },
    { year: '2022', title: '1,000개 기업 돌파', desc: '고객사 1,000개 달성, 해외 진출 준비' },
    { year: '2023', title: '글로벌 서비스 런칭', desc: '일본, 동남아 시장 진출' },
    { year: '2024', title: '5,000개 기업 파트너', desc: '업계 1위 마케팅 자동화 플랫폼' },
  ];

  const values = [
    { icon: '🎯', title: '고객 중심', desc: '모든 의사결정의 중심에는 고객이 있습니다.' },
    { icon: '🚀', title: '혁신', desc: '끊임없는 기술 혁신으로 시장을 선도합니다.' },
    { icon: '🤝', title: '신뢰', desc: '투명한 소통과 약속 이행으로 신뢰를 쌓습니다.' },
    { icon: '📈', title: '성장', desc: '고객과 함께 성장하는 파트너가 되겠습니다.' },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
            About Us
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            데이터로 비즈니스를<br />성장시키는 파트너
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            MarketingPro는 AI 기반 마케팅 자동화 솔루션으로 5,000개 이상의 기업이
            매출 성장을 달성할 수 있도록 돕고 있습니다.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-2">5,000+</h2>
              <p className="text-muted-foreground">파트너 기업</p>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-2">98%</h2>
              <p className="text-muted-foreground">고객 만족도</p>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-2">50+</h2>
              <p className="text-muted-foreground">전문가 팀</p>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-2">3개국</h2>
              <p className="text-muted-foreground">글로벌 서비스</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">우리의 미션</h2>
              <p className="text-lg text-muted-foreground mb-6">
                모든 기업이 데이터 기반의 스마트한 마케팅을 할 수 있도록
                기술의 장벽을 낮추고, 누구나 쉽게 사용할 수 있는
                마케팅 자동화 플랫폼을 제공합니다.
              </p>
              <p className="text-lg text-muted-foreground">
                우리는 기업의 성장이 곧 우리의 성장이라고 믿습니다.
                고객의 성공을 위해 끊임없이 혁신하고,
                최고의 기술과 서비스를 제공하겠습니다.
              </p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6">핵심 가치</h3>
              <div className="grid grid-cols-2 gap-4">
                {values.map((value, idx) => (
                  <div key={idx} className="p-4 bg-secondary/50 rounded-xl">
                    <span className="text-3xl mb-2 block">{value.icon}</span>
                    <h4 className="font-bold mb-1">{value.title}</h4>
                    <p className="text-sm text-muted-foreground">{value.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">우리의 여정</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border hidden md:block"></div>
            <div className="space-y-8">
              {milestones.map((milestone, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="bg-card border border-border rounded-xl p-6 inline-block">
                      <span className="text-primary font-bold text-lg">{milestone.year}</span>
                      <h3 className="font-bold text-xl mt-2">{milestone.title}</h3>
                      <p className="text-muted-foreground mt-1">{milestone.desc}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex w-4 h-4 bg-primary rounded-full z-10"></div>
                  <div className="flex-1 hidden md:block"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">리더십 팀</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            다양한 분야의 전문가들이 함께 최고의 마케팅 솔루션을 만들어갑니다.
          </p>
          <div className="grid md:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="text-center group">
                <div className="relative w-40 h-40 mx-auto mb-4 overflow-hidden rounded-full border-4 border-border group-hover:border-primary transition-colors">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center text-primary-foreground">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            함께 성장할 준비가 되셨나요?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            지금 바로 무료 상담을 신청하고, 맞춤형 마케팅 전략을 받아보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#leadForm"
              className="px-8 py-4 bg-white text-primary rounded-lg font-bold text-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              무료 상담 신청
            </Link>
            <Link
              href="/products"
              className="px-8 py-4 bg-white/10 border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white/20 transition-all"
            >
              상품 둘러보기
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
