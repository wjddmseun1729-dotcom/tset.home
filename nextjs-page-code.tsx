// app/page.tsx
'use client';

import { useState } from 'react';
import { InteractiveRobotSpline } from '@/components/ui/interactive-3d-robot';

export default function Home() {
  const ROBOT_SCENE_URL = "https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode";
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    email: '',
    phone: '',
    industry: '',
    budget: '',
    message: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 폼 데이터 처리
    console.log('Form submitted:', formData);

    // LocalStorage에 저장 (데모용)
    const leads = JSON.parse(localStorage.getItem('leads') || '[]');
    leads.push({ ...formData, timestamp: new Date().toISOString() });
    localStorage.setItem('leads', JSON.stringify(leads));

    // 성공 메시지 표시
    setShowSuccess(true);
    setFormData({
      company: '',
      name: '',
      email: '',
      phone: '',
      industry: '',
      budget: '',
      message: ''
    });

    // 5초 후 성공 메시지 숨기기
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const scrollToForm = () => {
    document.getElementById('leadForm')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <main className="min-h-screen bg-background-dark text-text-primary">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background-dark/90 backdrop-blur-lg border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-primary">MarketingPro</div>
            <button
              onClick={scrollToForm}
              className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold transition-all hover:-translate-y-0.5"
            >
              무료 상담 신청
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with 3D Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* 3D Robot Background */}
        <div className="absolute inset-0 opacity-20">
          <InteractiveRobotSpline
            scene={ROBOT_SCENE_URL}
            className="w-full h-full"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
            마케팅 자동화로
            <br />
            <span className="text-primary">매출 3배 성장</span>을 경험하세요
          </h1>
          <p className="text-xl md:text-2xl text-text-secondary mb-12 max-w-3xl mx-auto">
            5,000개 기업이 선택한 데이터 기반 마케팅 솔루션.
            <br />
            무료 컨설팅으로 맞춤 전략을 받아보세요.
          </p>

          {/* Lead Form */}
          <div
            id="leadForm"
            className="max-w-2xl mx-auto bg-background-card border border-border rounded-2xl p-8 shadow-2xl"
          >
            <h3 className="text-2xl font-bold mb-2">무료 마케팅 진단 신청</h3>
            <p className="text-text-secondary mb-6">48시간 내 전문가가 맞춤 전략을 보내드립니다</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-text-secondary mb-1">
                  회사명 *
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="예: ABC마케팅"
                  className="w-full px-4 py-3 bg-background-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">
                  담당자명 *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="홍길동"
                  className="w-full px-4 py-3 bg-background-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">
                  이메일 *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@company.com"
                  className="w-full px-4 py-3 bg-background-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-text-secondary mb-1">
                  연락처 *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="010-1234-5678"
                  className="w-full px-4 py-3 bg-background-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-text-secondary mb-1">
                    업종
                  </label>
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">선택해주세요</option>
                    <option value="ecommerce">이커머스</option>
                    <option value="education">교육/강의</option>
                    <option value="saas">SaaS/IT</option>
                    <option value="consulting">컨설팅</option>
                    <option value="manufacturing">제조업</option>
                    <option value="service">서비스업</option>
                    <option value="other">기타</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-text-secondary mb-1">
                    월 마케팅 예산
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">선택해주세요</option>
                    <option value="under-100">100만원 미만</option>
                    <option value="100-300">100만원 ~ 300만원</option>
                    <option value="300-500">300만원 ~ 500만원</option>
                    <option value="500-1000">500만원 ~ 1,000만원</option>
                    <option value="over-1000">1,000만원 이상</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-text-secondary mb-1">
                  문의 내용
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="관심있는 마케팅 서비스나 현재 겪고 있는 문제를 알려주세요"
                  className="w-full px-4 py-3 bg-background-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary resize-vertical"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold text-lg transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                무료 진단 받기
              </button>

              {showSuccess && (
                <div className="bg-success text-white p-4 rounded-lg text-center">
                  신청이 완료되었습니다! 48시간 내 연락드리겠습니다.
                </div>
              )}

              <p className="text-sm text-text-muted text-center mt-4">
                신청 시 <a href="#" className="text-primary hover:underline">개인정보처리방침</a>에 동의하는 것으로 간주됩니다.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-background-secondary border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h2 className="text-5xl font-bold text-primary mb-2">5,000+</h2>
              <p className="text-text-secondary">파트너 기업</p>
            </div>
            <div>
              <h2 className="text-5xl font-bold text-primary mb-2">300%</h2>
              <p className="text-text-secondary">평균 매출 증가율</p>
            </div>
            <div>
              <h2 className="text-5xl font-bold text-primary mb-2">98%</h2>
              <p className="text-text-secondary">고객 만족도</p>
            </div>
            <div>
              <h2 className="text-5xl font-bold text-primary mb-2">24/7</h2>
              <p className="text-text-secondary">자동화 시스템</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4">왜 MarketingPro를 선택해야 할까요?</h2>
          <p className="text-xl text-text-secondary text-center mb-12">데이터 기반 마케팅으로 확실한 성과를 만듭니다</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '자동화',
                title: '마케팅 자동화',
                description: '최신 AI 기술로 고객 분석부터 캠페인 최적화까지 자동으로 처리합니다. 24시간 쉬지 않고 최상의 성과를 만들어냅니다.'
              },
              {
                icon: '분석',
                title: '데이터 분석 & 인사이트',
                description: '실시간 데이터 분석으로 고객 행동을 정확히 파악하고, 즉시 실행 가능한 인사이트를 제공합니다.'
              },
              {
                icon: '타겟',
                title: '타겟 고객 발굴',
                description: '정교한 타겟팅으로 우리 제품/서비스에 관심 있는 고객만 집중 공략하여 광고비를 최대 40% 절감합니다.'
              },
              {
                icon: '응대',
                title: '24시간 고객 응대',
                description: '자동화 시스템이 24/7 고객 문의를 응대하고, 리드를 실시간으로 수집합니다.'
              },
              {
                icon: '최적화',
                title: '전환율 최적화',
                description: 'A/B 테스트와 지속적인 개선으로 랜딩페이지 전환율을 평균 250% 향상시킵니다.'
              },
              {
                icon: '통합',
                title: '옴니채널 통합',
                description: '웹, 모바일, SNS, 이메일 등 모든 채널을 하나로 연결하여 일관된 고객 경험을 제공합니다.'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-background-card border border-border rounded-xl p-6 hover:border-primary transition-all hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-white text-xs font-bold mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-text-secondary leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-2xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">지금 시작하면 특별 혜택!</h2>
            <p className="text-xl mb-8 opacity-90">
              첫 달 50% 할인 + 무료 AI 챗봇 설정
              <br />
              선착순 50개 기업 한정
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={scrollToForm}
                className="px-8 py-4 bg-white text-primary rounded-lg font-bold text-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                무료 상담 신청하기
              </button>
              <button className="px-8 py-4 bg-white/10 border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white/20 transition-all">
                챗봇으로 문의하기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background-secondary border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">MarketingPro</h3>
              <p className="text-text-secondary">
                데이터 기반 마케팅 자동화로
                <br />
                비즈니스 성장을 가속화합니다.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">서비스</h3>
              <ul className="space-y-2 text-text-secondary">
                <li><a href="#" className="hover:text-primary transition-colors">마케팅 자동화</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">데이터 분석</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">SEO 최적화</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">SNS 마케팅</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">회사</h3>
              <ul className="space-y-2 text-text-secondary">
                <li><a href="#" className="hover:text-primary transition-colors">회사 소개</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">고객 사례</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">블로그</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">채용</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">문의</h3>
              <ul className="space-y-2 text-text-secondary">
                <li><a href="mailto:contact@marketingpro.com" className="hover:text-primary transition-colors">contact@marketingpro.com</a></li>
                <li><a href="tel:02-1234-5678" className="hover:text-primary transition-colors">02-1234-5678</a></li>
                <li className="mt-2">평일 09:00 - 18:00</li>
              </ul>
            </div>
          </div>
          <div className="text-center text-text-muted border-t border-border pt-8">
            <p>&copy; 2024 MarketingPro. All rights reserved. | <a href="#" className="hover:text-primary">개인정보처리방침</a> | <a href="#" className="hover:text-primary">이용약관</a></p>
          </div>
        </div>
      </footer>

      {/* Chatbot Trigger */}
      <button
        className="fixed bottom-8 right-8 w-16 h-16 bg-primary hover:bg-primary-dark rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all hover:scale-110 z-50"
        aria-label="챗봇 문의"
      >
        문의
      </button>
    </main>
  );
}
