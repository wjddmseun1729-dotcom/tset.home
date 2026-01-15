# 🤖 Voiceflow AI 챗봇 통합 가이드

이 가이드는 마케팅 랜딩페이지에 Voiceflow AI 챗봇을 통합하는 방법을 설명합니다.

## 📋 준비사항

1. **Voiceflow 계정 생성**
   - https://www.voiceflow.com 접속
   - 무료 계정 생성
   - 새 프로젝트 생성

2. **프로젝트 ID 확인**
   - Voiceflow 대시보드에서 프로젝트 선택
   - Settings > Project ID 복사

## 🎯 챗봇 시나리오 설계

### 1. 환영 메시지
```
안녕하세요! 👋 MarketingPro AI 어시스턴트입니다.

무엇을 도와드릴까요?

🎯 서비스 소개
💰 가격 문의
📊 성공 사례
📞 상담 신청
❓ 자주 묻는 질문
```

### 2. 대화 흐름

#### A. 서비스 소개 선택 시
```
MarketingPro는 AI 기반 마케팅 자동화 솔루션입니다.

주요 서비스:
✅ AI 마케팅 자동화
✅ 실시간 데이터 분석
✅ 타겟 고객 발굴
✅ 24/7 고객 응대
✅ 전환율 최적화

어떤 서비스에 대해 더 알고 싶으신가요?

1️⃣ AI 마케팅 자동화
2️⃣ 데이터 분석
3️⃣ 타겟 고객 발굴
4️⃣ 상담 신청하기
```

#### B. 가격 문의 선택 시
```
합리적인 가격으로 최고의 성과를 제공합니다! 💰

📦 스타터 플랜
- 월 99만원
- 기본 AI 자동화
- 월간 리포트
- 이메일 지원

🚀 프로 플랜 (추천)
- 월 299만원
- 고급 AI 자동화
- 실시간 대시보드
- 1:1 전담 매니저
- 24/7 지원

🏆 엔터프라이즈 플랜
- 맞춤 견적
- 완전 맞춤형 솔루션
- 전담 팀 배정
- 우선 지원

지금 신청하시면 첫 달 50% 할인! 🎁

상담을 신청하시겠어요?
👍 네, 신청할게요
📧 이메일로 받아볼게요
```

#### C. 상담 신청 선택 시
```
상담 신청을 도와드리겠습니다! 😊

몇 가지 정보만 알려주세요:

1️⃣ 회사명을 알려주세요
```
→ 사용자 입력 대기

```
2️⃣ 담당자님 성함은?
```
→ 사용자 입력 대기

```
3️⃣ 연락 가능한 이메일 주소를 알려주세요
```
→ 사용자 입력 대기

```
4️⃣ 전화번호를 알려주세요 (선택사항)
```
→ 사용자 입력 대기

```
✅ 신청이 완료되었습니다!

{{name}}님, 감사합니다!
48시간 내에 {{email}}로 맞춤 제안서를 보내드리겠습니다.

추가로 궁금한 점이 있으신가요?
```

#### D. 자주 묻는 질문
```
자주 묻는 질문입니다:

❓ 계약 기간은 어떻게 되나요?
→ 최소 3개월부터 가능하며, 중도 해지 시 위약금은 없습니다.

❓ 어떤 업종에 적합한가요?
→ 이커머스, 교육, SaaS, 서비스업 등 모든 온라인 비즈니스에 적합합니다.

❓ 설정은 얼마나 걸리나요?
→ 기본 설정은 1주일, 완전한 커스터마이징은 2-3주 소요됩니다.

❓ 데이터는 안전한가요?
→ 네, 모든 데이터는 암호화되며 GDPR을 준수합니다.

❓ 환불이 가능한가요?
→ 30일 이내 100% 환불 보장해드립니다.

다른 질문이 있으신가요? 💬
```

## 💻 Voiceflow 설정 단계

### Step 1: Start 블록 설정
1. Voiceflow 캔버스에서 "Start" 블록 더블클릭
2. "Text" 블록 추가
3. 환영 메시지 입력

### Step 2: Choice 블록 추가
1. "Buttons" 블록 추가
2. 5개 옵션 설정:
   - 서비스 소개
   - 가격 문의
   - 성공 사례
   - 상담 신청
   - FAQ

### Step 3: 각 경로 설정
각 버튼에 대한 응답 플로우 생성

#### 상담 신청 플로우 예시:
1. "Text" 블록: "회사명을 알려주세요"
2. "Capture" 블록: {company} 변수에 저장
3. "Text" 블록: "담당자님 성함은?"
4. "Capture" 블록: {name} 변수에 저장
5. "Text" 블록: "이메일 주소를 알려주세요"
6. "Capture" 블록: {email} 변수에 저장
7. "API" 블록: 데이터를 서버로 전송 (선택사항)
8. "Text" 블록: 완료 메시지

### Step 4: GPT 통합 (선택사항)
1. "AI Set" 블록 추가
2. 시스템 프롬프트 설정:
```
당신은 MarketingPro의 친절한 AI 어시스턴트입니다.
다음 역할을 수행합니다:

1. 고객의 마케팅 고민을 경청하고 공감합니다
2. MarketingPro의 서비스가 어떻게 도움이 될 수 있는지 설명합니다
3. 항상 정중하고 프로페셔널한 태도를 유지합니다
4. 고객이 상담 신청을 하도록 자연스럽게 유도합니다
5. 답변은 3-4문장으로 간결하게 작성합니다

서비스 정보:
- AI 마케팅 자동화
- 데이터 분석 및 인사이트
- 타겟 고객 발굴
- 24/7 고객 응대
- 전환율 최적화

가격: 스타터 99만원/월, 프로 299만원/월
특별 혜택: 첫 달 50% 할인
```

### Step 5: Knowledge Base 추가
1. Settings > Knowledge Base 클릭
2. 다음 정보를 문서로 업로드:
   - 서비스 상세 설명
   - FAQ
   - 가격 정책
   - 고객 후기

## 🔗 웹사이트 통합

### HTML에 Voiceflow 스크립트 추가

`marketing-landing.html` 파일의 `</body>` 태그 직전에 다음 코드를 추가:

```html
<!-- Voiceflow Chatbot Widget -->
<script type="text/javascript">
  (function(d, t) {
      var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
      v.onload = function() {
        window.voiceflow.chat.load({
          verify: { projectID: 'YOUR_PROJECT_ID_HERE' }, // 여기에 프로젝트 ID 입력
          url: 'https://general-runtime.voiceflow.com',
          versionID: 'production',
          // 커스텀 설정
          launch: {
            event: {
              type: "launch"
            }
          },
          // 다크모드 테마 커스터마이징
          assistant: {
            stylesheet: `
              .vfrc-chat {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              }
              .vfrc-widget--launcher {
                display: none; /* 우리가 만든 커스텀 버튼 사용 */
              }
              .vfrc-chat-window {
                background-color: #1a1a24;
                border: 1px solid #2d2d3a;
              }
              .vfrc-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
              }
              .vfrc-message--user {
                background-color: #6366f1;
              }
              .vfrc-message--assistant {
                background-color: #13131a;
                color: #f1f5f9;
                border: 1px solid #2d2d3a;
              }
              .vfrc-button {
                background-color: #6366f1;
                border: none;
                border-radius: 8px;
                padding: 10px 16px;
                margin: 4px;
              }
              .vfrc-button:hover {
                background-color: #4f46e5;
              }
              .vfrc-input {
                background-color: #13131a;
                border: 1px solid #2d2d3a;
                color: #f1f5f9;
                border-radius: 8px;
              }
              .vfrc-input:focus {
                border-color: #6366f1;
                outline: none;
              }
            `
          }
        });
      }
      v.src = "https://cdn.voiceflow.com/widget/bundle.mjs";
      v.type = "text/javascript";
      s.parentNode.insertBefore(v, s);
  })(document, 'script');
</script>
```

### 커스텀 챗봇 버튼 연결

기존 `openChatbot()` 함수를 다음과 같이 수정:

```javascript
function openChatbot() {
    if (window.voiceflow && window.voiceflow.chat) {
        window.voiceflow.chat.open();
    } else {
        console.error('Voiceflow가 아직 로드되지 않았습니다.');
        // 로딩 중 메시지 표시
        alert('챗봇을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
    }
}
```

## 📊 리드 데이터 수집

### Voiceflow에서 CRM으로 데이터 전송

#### API 블록 설정
1. Voiceflow에서 "API" 블록 추가
2. 다음과 같이 설정:

```
Method: POST
URL: https://your-backend.com/api/leads
Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_API_KEY

Body:
{
  "company": "{company}",
  "name": "{name}",
  "email": "{email}",
  "phone": "{phone}",
  "source": "chatbot",
  "timestamp": "{timestamp}"
}
```

### Google Sheets 연동 (간단한 방법)

1. Zapier 또는 Make.com 사용
2. Trigger: Voiceflow Lead Captured
3. Action: Add Row to Google Sheets

또는 직접 Google Sheets API 사용:

```javascript
// API 블록에서 사용
Method: POST
URL: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

Body:
{
  "company": "{company}",
  "name": "{name}",
  "email": "{email}",
  "phone": "{phone}"
}
```

## 🎨 다크모드 테마 완전 커스터마이징

### 고급 스타일링

```css
/* Voiceflow 완전 커스텀 다크모드 */
.vfrc-chat-window {
  background-color: #0a0a0f !important;
  border: 1px solid #2d2d3a !important;
  border-radius: 16px !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5) !important;
}

.vfrc-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  padding: 20px !important;
  border-radius: 16px 16px 0 0 !important;
}

.vfrc-header-title {
  color: white !important;
  font-weight: 700 !important;
}

.vfrc-message--user .vfrc-message-content {
  background-color: #6366f1 !important;
  color: white !important;
  border-radius: 12px 12px 4px 12px !important;
}

.vfrc-message--assistant .vfrc-message-content {
  background-color: #1a1a24 !important;
  color: #f1f5f9 !important;
  border: 1px solid #2d2d3a !important;
  border-radius: 12px 12px 12px 4px !important;
}

.vfrc-button {
  background-color: #6366f1 !important;
  color: white !important;
  border: none !important;
  border-radius: 8px !important;
  padding: 12px 20px !important;
  margin: 6px 4px !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
}

.vfrc-button:hover {
  background-color: #4f46e5 !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4) !important;
}

.vfrc-input-container {
  background-color: #13131a !important;
  border-top: 1px solid #2d2d3a !important;
  padding: 16px !important;
}

.vfrc-input {
  background-color: #1a1a24 !important;
  border: 1px solid #2d2d3a !important;
  color: #f1f5f9 !important;
  border-radius: 8px !important;
  padding: 12px !important;
}

.vfrc-input:focus {
  border-color: #6366f1 !important;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1) !important;
}

.vfrc-send-button {
  background-color: #6366f1 !important;
  color: white !important;
  border-radius: 8px !important;
}

.vfrc-send-button:hover {
  background-color: #4f46e5 !important;
}

/* 스크롤바 커스터마이징 */
.vfrc-chat-window ::-webkit-scrollbar {
  width: 8px;
}

.vfrc-chat-window ::-webkit-scrollbar-track {
  background: #13131a;
}

.vfrc-chat-window ::-webkit-scrollbar-thumb {
  background: #2d2d3a;
  border-radius: 4px;
}

.vfrc-chat-window ::-webkit-scrollbar-thumb:hover {
  background: #3d3d4a;
}
```

## 📈 성과 측정

### Voiceflow Analytics에서 확인할 수 있는 지표:

1. **대화 수**: 총 챗봇 대화 건수
2. **완료율**: 상담 신청까지 완료한 비율
3. **이탈 지점**: 사용자가 가장 많이 이탈하는 단계
4. **인기 질문**: 가장 많이 선택된 메뉴/질문
5. **평균 대화 시간**: 사용자당 평균 대화 길이

### Google Analytics 통합

```javascript
// 챗봇 오픈 이벤트 추적
function openChatbot() {
    // GA4 이벤트 전송
    if (typeof gtag !== 'undefined') {
        gtag('event', 'chatbot_open', {
            'event_category': 'engagement',
            'event_label': 'Voiceflow Chat Opened'
        });
    }

    if (window.voiceflow && window.voiceflow.chat) {
        window.voiceflow.chat.open();
    }
}

// 상담 신청 완료 이벤트 (Voiceflow에서 전송)
window.addEventListener('voiceflow.chat.interaction', function(event) {
    if (event.detail.type === 'lead_captured') {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'generate_lead', {
                'event_category': 'conversion',
                'event_label': 'Chatbot Lead',
                'value': 1
            });
        }
    }
});
```

## ✅ 체크리스트

배포 전 확인사항:

- [ ] Voiceflow 프로젝트 ID 정확히 입력
- [ ] 모든 대화 경로 테스트 완료
- [ ] 다크모드 스타일 정상 작동
- [ ] 리드 데이터 수집 테스트
- [ ] 모바일에서 정상 작동 확인
- [ ] 로딩 속도 최적화
- [ ] 개인정보처리방침 챗봇에 명시
- [ ] CRM/이메일 연동 테스트

## 🚀 배포 후 최적화

### A/B 테스트 아이디어:

1. **환영 메시지 변형**
   - 버전 A: 공식적인 톤
   - 버전 B: 친근한 톤

2. **CTA 버튼 문구**
   - "상담 신청하기" vs "무료 진단 받기"

3. **응답 속도**
   - 즉시 응답 vs 약간의 딜레이 (타이핑 효과)

### 지속적인 개선:

1. 매주 Analytics 리뷰
2. 사용자 피드백 수집
3. 자주 묻는 질문 업데이트
4. GPT 프롬프트 최적화

---

## 💡 추가 팁

### 리드 품질 향상:

1. **자격 확인 질문 추가**
   ```
   "월 마케팅 예산이 어느 정도이신가요?"
   - 100만원 미만
   - 100-300만원
   - 300-500만원
   - 500만원 이상
   ```

2. **긴급성 추가**
   ```
   "지금 신청하시면 48시간 내 맞춤 제안서를 보내드려요!"
   ```

3. **사회적 증거**
   ```
   "이번 주에만 23개 기업이 상담을 신청했어요! 🔥"
   ```

---

이 가이드를 따라하면 완전히 작동하는 다크모드 AI 챗봇 랜딩페이지를 구축할 수 있습니다! 🎉
