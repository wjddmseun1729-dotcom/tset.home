'use client';

import { useEffect, useState } from 'react';

// Voiceflow 챗봇 컴포넌트 속성
interface VoiceflowChatbotProps {
  projectId: string;        // Voiceflow 프로젝트 ID
  primaryColor?: string;    // 주요 색상 (기본값: 파란색)
}

// 전역 Window 객체에 Voiceflow 타입 선언
declare global {
  interface Window {
    voiceflow?: {
      chat: {
        load: (config: VoiceflowConfig) => void;   // 챗봇 로드
        open: () => void;                           // 챗봇 열기
        close: () => void;                          // 챗봇 닫기
        hide: () => void;                           // 챗봇 숨기기
        show: () => void;                           // 챗봇 보이기
      };
    };
  }
}

// Voiceflow 설정 인터페이스
interface VoiceflowConfig {
  verify: { projectID: string };    // 프로젝트 ID 인증
  url: string;                       // Voiceflow 런타임 URL
  versionID: string;                 // 버전 ID (production 또는 development)
  launch?: {
    event: {
      type: string;                  // 시작 이벤트 타입
    };
  };
  assistant?: {
    title?: string;                  // 챗봇 헤더 제목
    description?: string;            // 챗봇 설명
    image?: string;                  // 챗봇 아바타 이미지
    color?: string;                  // 주요 색상
    stylesheet?: string;             // 커스텀 CSS 스타일
    watermark?: boolean;             // Voiceflow 워터마크 표시 여부
  };
  render?: {
    mode?: string;
  };
  autostart?: boolean;
}

export function VoiceflowChatbot({ projectId, primaryColor = '#3b82f6' }: VoiceflowChatbotProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Voiceflow 스크립트 로드
    const loadVoiceflow = () => {
      const script = document.createElement('script');
      script.src = 'https://cdn.voiceflow.com/widget/bundle.mjs';
      script.type = 'text/javascript';
      script.onload = () => {
        if (window.voiceflow) {
          window.voiceflow.chat.load({
            verify: { projectID: projectId },
            url: 'https://general-runtime.voiceflow.com',
            versionID: 'production',
            render: {
              mode: 'embedded',
            },
            autostart: false,
            launch: {
              event: {
                type: 'launch',
              },
            },
            assistant: {
              title: 'MarketingPro 상담봇',
              description: '무엇이든 물어보세요! 24시간 상담 가능합니다.',
              image: '',
              color: primaryColor,
              watermark: false,
              stylesheet: `
                /* 기본 위젯 런처 숨기기 - 커스텀 버튼 사용 */
                .vfrc-widget--launcher {
                  display: none !important;
                }

                /* 채팅 윈도우 스타일 */
                .vfrc-chat {
                  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif !important;
                }

                .vfrc-chat-window {
                  background-color: #0f172a !important;
                  border: 1px solid #334155 !important;
                  border-radius: 16px !important;
                  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
                  right: 24px !important;
                  bottom: 100px !important;
                }

                /* 헤더 스타일 */
                .vfrc-header {
                  background: ${primaryColor} !important;
                  padding: 16px 20px !important;
                  border-radius: 16px 16px 0 0 !important;
                  border: none !important;
                }

                .vfrc-header-title {
                  color: white !important;
                  font-weight: 700 !important;
                  font-size: 16px !important;
                }

                .vfrc-header-close {
                  color: white !important;
                }

                /* 메시지 스타일 */
                .vfrc-message--user .vfrc-message-content {
                  background-color: ${primaryColor} !important;
                  color: white !important;
                  border-radius: 12px 12px 4px 12px !important;
                }

                .vfrc-message--assistant .vfrc-message-content {
                  background-color: #1e293b !important;
                  color: #f1f5f9 !important;
                  border: 1px solid #334155 !important;
                  border-radius: 12px 12px 12px 4px !important;
                }

                /* 버튼 스타일 */
                .vfrc-button {
                  background-color: ${primaryColor} !important;
                  color: white !important;
                  border: none !important;
                  border-radius: 8px !important;
                  padding: 10px 16px !important;
                  margin: 4px !important;
                  font-weight: 600 !important;
                  font-size: 14px !important;
                  transition: all 0.2s ease !important;
                }

                .vfrc-button:hover {
                  opacity: 0.9 !important;
                  transform: translateY(-1px) !important;
                }

                /* 입력창 스타일 */
                .vfrc-input-container {
                  background-color: #0f172a !important;
                  border-top: 1px solid #334155 !important;
                  padding: 12px 16px !important;
                  border-radius: 0 0 16px 16px !important;
                }

                .vfrc-input {
                  background-color: #1e293b !important;
                  border: 1px solid #334155 !important;
                  color: #f1f5f9 !important;
                  border-radius: 8px !important;
                  padding: 12px !important;
                  font-size: 14px !important;
                }

                .vfrc-input::placeholder {
                  color: #94a3b8 !important;
                }

                .vfrc-input:focus {
                  border-color: ${primaryColor} !important;
                  box-shadow: 0 0 0 2px ${primaryColor}33 !important;
                  outline: none !important;
                }

                /* 전송 버튼 */
                .vfrc-send-button {
                  background-color: ${primaryColor} !important;
                  color: white !important;
                  border-radius: 8px !important;
                  padding: 8px 12px !important;
                }

                .vfrc-send-button:hover {
                  opacity: 0.9 !important;
                }

                /* 메시지 영역 */
                .vfrc-chat-messages {
                  background-color: #0f172a !important;
                }

                /* 스크롤바 */
                .vfrc-chat-window ::-webkit-scrollbar {
                  width: 6px;
                }

                .vfrc-chat-window ::-webkit-scrollbar-track {
                  background: #0f172a;
                }

                .vfrc-chat-window ::-webkit-scrollbar-thumb {
                  background: #334155;
                  border-radius: 3px;
                }

                .vfrc-chat-window ::-webkit-scrollbar-thumb:hover {
                  background: #475569;
                }

                /* 타이핑 인디케이터 */
                .vfrc-typing-indicator {
                  background-color: #1e293b !important;
                  border: 1px solid #334155 !important;
                  border-radius: 12px !important;
                }

                /* 아바타 */
                .vfrc-avatar {
                  background-color: ${primaryColor} !important;
                }

                /* 입력창 placeholder 한국어로 변경 */
                .vfrc-input::placeholder {
                  color: #94a3b8 !important;
                }

                /* 푸터/워터마크 숨기기 */
                .vfrc-footer,
                .vfrc-watermark {
                  display: none !important;
                }

                /* 시스템 메시지 스타일 */
                .vfrc-system-response {
                  color: #94a3b8 !important;
                  font-size: 13px !important;
                }
              `,
            },
          });
          setIsLoaded(true);
        }
      };
      document.body.appendChild(script);
    };

    loadVoiceflow();

    return () => {
      // 클린업: 스크립트 제거
      const scripts = document.querySelectorAll('script[src*="voiceflow"]');
      scripts.forEach((script) => script.remove());
    };
  }, [projectId, primaryColor]);

  // 챗봇 열기/닫기 토글 함수
  const toggleChat = () => {
    if (window.voiceflow?.chat) {
      if (isOpen) {
        window.voiceflow.chat.close();
      } else {
        window.voiceflow.chat.open();
      }
      setIsOpen(!isOpen);
    }
  };

  return (
    <button
      onClick={toggleChat}
      className="fixed bottom-8 right-8 w-16 h-16 bg-primary hover:opacity-90 rounded-full flex items-center justify-center text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-110 z-50 group"
      aria-label="챗봇 문의"
    >
      {isOpen ? (
        // 닫기 아이콘 (X)
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      ) : (
        // 채팅 아이콘
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      )}

      {/* 툴팁 */}
      {!isOpen && (
        <span className="absolute right-20 bg-card border border-border px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
          무엇이든 물어보세요!
        </span>
      )}

      {/* 알림 뱃지 */}
      {!isOpen && isLoaded && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse"></span>
      )}
    </button>
  );
}
