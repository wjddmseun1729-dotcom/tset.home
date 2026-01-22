'use client';

import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

// 메시지 타입 정의
interface Message {
  id: number;
  type: 'user' | 'bot' | 'system';
  content: string;
  buttons?: ChatButton[];
}

// 버튼 타입 정의
interface ChatButton {
  label: string;
  value: string;
}

// 시스템 프롬프트 (MarketingPro 컨텍스트)
const SYSTEM_PROMPT = `당신은 MarketingPro의 친절한 AI 마케팅 상담 어시스턴트입니다.

## 회사 정보
- 회사명: MarketingPro
- 서비스: AI 기반 마케팅 자동화 솔루션
- 고객: 5,000개 이상의 기업 파트너

## 주요 서비스
1. AI 마케팅 자동화 - 고객 분석, 캠페인 최적화, 24시간 자동 운영
2. 데이터 분석 & 인사이트 - 실시간 대시보드, ROI 측정, A/B 테스트
3. 타겟 고객 발굴 - AI 기반 세분화, 리타겟팅, 리드 스코어링
4. 24/7 고객 응대 - 자동 문의 응대, 실시간 리드 수집
5. 전환율 최적화 - 랜딩페이지 최적화, 평균 250% 향상

## 가격 정책
- 스타터 플랜: 월 99만원 (기본 AI 자동화, 월간 리포트, 이메일 지원)
- 프로 플랜: 월 299만원 (고급 AI 자동화, 실시간 대시보드, 1:1 전담 매니저, 24/7 지원) ⭐추천
- 엔터프라이즈: 맞춤 견적 (완전 맞춤형 솔루션, 전담 팀 배정)

## 특별 혜택
- 첫 달 50% 할인
- 무료 AI 챗봇 설정
- 30일 100% 환불 보장

## 성공 사례
- A사(이커머스): 매출 280% 증가, 광고비 45% 절감
- B사(온라인 교육): 수강생 등록률 320% 증가
- C사(SaaS): 리드 전환율 250% 향상

## 응답 규칙
1. 항상 친절하고 전문적인 톤으로 응답하세요
2. 한국어로 응답하세요
3. 답변은 간결하게 3-5문장으로 작성하세요
4. 적절한 이모지를 사용하세요
5. 고객이 상담 신청을 하도록 자연스럽게 유도하세요
6. 마케팅 관련 질문에 전문적으로 답변하세요
7. 모르는 내용은 상담 신청을 안내하세요`;

// 퀵 버튼 데이터
const quickButtons: ChatButton[] = [
  { label: '🎯 서비스 소개', value: '서비스에 대해 알려주세요' },
  { label: '💰 가격 문의', value: '가격이 어떻게 되나요?' },
  { label: '📊 성공 사례', value: '성공 사례를 알려주세요' },
  { label: '📞 상담 신청', value: '상담 신청하고 싶어요' },
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 스크롤 자동 이동
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 로컬스토리지에서 API 키 불러오기
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setIsApiKeySet(true);
    }
  }, []);

  // 챗봇 열기 시 초기 메시지
  useEffect(() => {
    if (isOpen && messages.length === 0 && isApiKeySet) {
      addBotMessage(`안녕하세요! 👋 MarketingPro AI 어시스턴트입니다.

무엇이든 물어보세요! 마케팅 관련 질문, 서비스 문의, 가격 상담 등 도움이 필요하시면 말씀해주세요.`);
    }
  }, [isOpen, messages.length, isApiKeySet]);

  // API 키 저장
  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      setIsApiKeySet(true);
      addBotMessage(`안녕하세요! 👋 MarketingPro AI 어시스턴트입니다.

Gemini AI가 연결되었습니다! 무엇이든 물어보세요.`);
    }
  };

  // API 키 삭제
  const handleClearApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    setIsApiKeySet(false);
    setMessages([]);
  };

  // 봇 메시지 추가
  const addBotMessage = (content: string, buttons?: ChatButton[]) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: 'bot',
        content,
        buttons,
      },
    ]);
  };

  // Gemini API 호출 (Google GenAI SDK 사용)
  const callGeminiAPI = async (userMessage: string): Promise<string> => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (!savedKey) {
      return 'API 키가 설정되지 않았습니다. 상단에서 Gemini API 키를 입력해주세요.';
    }

    try {
      // Google GenAI 클라이언트 생성
      const ai = new GoogleGenAI({ apiKey: savedKey });

      // 대화 히스토리 구성 (최근 10개만 유지하여 토큰 절약)
      const recentMessages = messages.slice(-10);
      const conversationHistory = recentMessages
        .filter((m) => m.type !== 'system')
        .map((m) => `${m.type === 'user' ? '사용자' : 'AI'}: ${m.content}`)
        .join('\n\n');

      // 프롬프트 구성
      const fullPrompt = conversationHistory
        ? `${SYSTEM_PROMPT}\n\n이전 대화:\n${conversationHistory}\n\n사용자: ${userMessage}\n\nAI:`
        : `${SYSTEM_PROMPT}\n\n사용자: ${userMessage}\n\nAI:`;

      // Gemini API 호출
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: fullPrompt,
      });

      // 응답 텍스트 추출
      const text = response.text;
      if (text) {
        return text;
      }

      return '응답을 생성하지 못했습니다. 다시 시도해주세요.';
    } catch (error: unknown) {
      console.error('Gemini API Error:', error);

      const errorMessage = error instanceof Error ? error.message : String(error);

      if (errorMessage.includes('API_KEY') || errorMessage.includes('API key')) {
        return '❌ API 키가 유효하지 않습니다. Google AI Studio에서 올바른 키를 발급받아 입력해주세요.';
      }
      if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('rate')) {
        return '⏳ API 요청 한도를 초과했습니다.\n\n약 1분 후에 다시 시도해주세요. (무료: 분당 15회 제한)';
      }
      if (errorMessage.includes('403') || errorMessage.includes('permission')) {
        return '🚫 API 키 권한이 없습니다. Google AI Studio에서 Gemini API를 활성화했는지 확인해주세요.';
      }
      if (errorMessage.includes('SAFETY')) {
        return '죄송합니다. 해당 질문에는 답변드리기 어렵습니다. 다른 질문을 해주세요.';
      }

      return `오류가 발생했습니다: ${errorMessage}\n\n잠시 후 다시 시도해주세요.`;
    }
  };

  // 사용자 메시지 전송
  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();

    // 사용자 메시지 추가
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: 'user',
        content: userMessage,
      },
    ]);

    setInputValue('');
    setIsTyping(true);

    // Gemini API 호출
    const botResponse = await callGeminiAPI(userMessage);

    setIsTyping(false);
    addBotMessage(botResponse);
  };

  // 퀵 버튼 클릭 처리
  const handleQuickButtonClick = (value: string) => {
    if (value === 'scroll_form') {
      setIsOpen(false);
      document.getElementById('leadForm')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setInputValue(value);
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  // Enter 키 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isApiKeySet) {
        handleSend();
      } else {
        handleSaveApiKey();
      }
    }
  };

  return (
    <>
      {/* 챗봇 윈도우 */}
      {isOpen && (
        <div className="fixed bottom-28 right-8 w-[400px] h-[600px] bg-background border border-border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
          {/* 헤더 */}
          <div className="bg-primary px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-white"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-base">MarketingPro AI</h3>
                <p className="text-white/80 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Gemini AI 연동
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGuide(true)}
                className="text-white/80 hover:text-white transition-colors p-1"
                title="API 키 가이드"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          {/* API 키 입력 영역 */}
          <div className="px-4 py-3 bg-secondary/50 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  type={isApiKeySet ? 'password' : 'text'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Gemini API 키를 입력하세요"
                  disabled={isApiKeySet}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
                />
                {isApiKeySet && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                )}
              </div>
              {isApiKeySet ? (
                <button
                  onClick={handleClearApiKey}
                  className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-medium rounded-lg transition-colors"
                >
                  초기화
                </button>
              ) : (
                <button
                  onClick={handleSaveApiKey}
                  disabled={!apiKey.trim()}
                  className="px-3 py-2 bg-primary hover:opacity-90 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-all"
                >
                  저장
                </button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              API 키는 브라우저에만 저장되며 서버로 전송되지 않습니다
            </p>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/30">
            {!isApiKeySet && messages.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <h4 className="font-bold text-lg mb-2">Gemini AI 챗봇</h4>
                <p className="text-muted-foreground text-sm mb-4">
                  상단에 Gemini API 키를 입력하면<br />AI 상담이 시작됩니다.
                </p>
                <button
                  onClick={() => setShowGuide(true)}
                  className="text-primary text-sm font-medium hover:underline"
                >
                  API 키 발급 방법 보기 →
                </button>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.type === 'user'
                      ? 'bg-primary text-white rounded-br-md'
                      : 'bg-card border border-border text-foreground rounded-bl-md'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))}

            {/* 타이핑 인디케이터 */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1 items-center">
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="text-xs text-muted-foreground ml-2">AI가 답변 중...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 퀵 버튼 */}
          {isApiKeySet && messages.length <= 1 && (
            <div className="px-4 py-2 border-t border-border bg-background/50">
              <div className="flex flex-wrap gap-2">
                {quickButtons.map((btn, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickButtonClick(btn.value)}
                    className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium rounded-full transition-colors border border-primary/20"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 입력 영역 */}
          <div className="p-4 border-t border-border bg-background">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isApiKeySet ? "메시지를 입력하세요..." : "먼저 API 키를 입력해주세요"}
                disabled={!isApiKeySet || isTyping}
                className="flex-1 px-4 py-2.5 bg-secondary border border-input rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || !isApiKeySet || isTyping}
                className="px-4 py-2.5 bg-primary hover:opacity-90 disabled:opacity-50 text-white rounded-lg transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API 키 가이드 모달 */}
      {showGuide && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={() => setShowGuide(false)}>
          <div className="bg-background border border-border rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Gemini API 키 발급 가이드</h3>
                <button onClick={() => setShowGuide(false)} className="text-muted-foreground hover:text-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="space-y-4 text-sm">
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <p className="font-medium text-primary mb-2">💡 Gemini API는 무료로 사용 가능합니다!</p>
                  <p className="text-muted-foreground">Google AI Studio에서 무료 API 키를 발급받을 수 있습니다.</p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold">📋 발급 방법</h4>

                  <div className="flex gap-3">
                    <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</span>
                    <div>
                      <p className="font-medium">Google AI Studio 접속</p>
                      <a
                        href="https://aistudio.google.com/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-xs"
                      >
                        https://aistudio.google.com/apikey →
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</span>
                    <div>
                      <p className="font-medium">Google 계정으로 로그인</p>
                      <p className="text-muted-foreground text-xs">Gmail 계정이 있다면 바로 로그인 가능</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</span>
                    <div>
                      <p className="font-medium">&quot;Create API Key&quot; 클릭</p>
                      <p className="text-muted-foreground text-xs">새 프로젝트 생성 또는 기존 프로젝트 선택</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">4</span>
                    <div>
                      <p className="font-medium">API 키 복사</p>
                      <p className="text-muted-foreground text-xs">생성된 키를 복사하여 위 입력란에 붙여넣기</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <p className="font-medium text-yellow-600 mb-2">⚠️ 주의사항</p>
                  <ul className="text-muted-foreground text-xs space-y-1">
                    <li>• API 키는 타인과 공유하지 마세요</li>
                    <li>• 무료 사용량: 분당 15회 요청</li>
                    <li>• 키는 브라우저 로컬에만 저장됩니다</li>
                  </ul>
                </div>

                <button
                  onClick={() => {
                    window.open('https://aistudio.google.com/apikey', '_blank');
                  }}
                  className="w-full py-3 bg-primary hover:opacity-90 text-white font-bold rounded-lg transition-all"
                >
                  Google AI Studio 열기 →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 챗봇 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-primary hover:opacity-90 rounded-full flex items-center justify-center text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-110 z-50 group"
        aria-label="챗봇 문의"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}

        {/* 툴팁 */}
        {!isOpen && (
          <span className="absolute right-20 bg-card border border-border px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
            AI에게 물어보세요!
          </span>
        )}

        {/* 알림 뱃지 */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse"></span>
        )}
      </button>
    </>
  );
}
