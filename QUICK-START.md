# 🚀 빠른 시작 가이드

3D 로봇이 포함된 Next.js 마케팅 랜딩페이지를 5분 안에 실행하세요!

## ⚡ 빠른 실행 (명령어만)

```bash
# 1. 프로젝트 생성
cd c:\Users\mgk88\Desktop\test)3\BSD_claude_skills
npx create-next-app@latest marketing-landing-nextjs --typescript --tailwind --app --no-src-dir --import-alias "@/*"

# 2. 프로젝트 폴더로 이동
cd marketing-landing-nextjs

# 3. shadcn 초기화
npx shadcn-ui@latest init

# 4. Spline 설치
npm install @splinetool/react-spline

# 5. 필요한 파일 복사 (아래 파일들을 직접 생성)
# - tailwind.config.ts
# - app/globals.css
# - components/ui/interactive-3d-robot.tsx
# - app/page.tsx

# 6. 개발 서버 실행
npm run dev
```

브라우저에서 http://localhost:3000 접속!

---

## 📁 생성할 파일 목록

### 1. `tailwind.config.ts` (루트 폴더)

위치: `marketing-landing-nextjs/tailwind.config.ts`

파일 내용은 `NEXTJS-SETUP-GUIDE.md`의 5단계 참조

### 2. `app/globals.css`

위치: `marketing-landing-nextjs/app/globals.css`

파일 내용은 `NEXTJS-SETUP-GUIDE.md`의 6단계 참조

### 3. `components/ui/interactive-3d-robot.tsx`

위치: `marketing-landing-nextjs/components/ui/interactive-3d-robot.tsx`

파일 내용은 `NEXTJS-SETUP-GUIDE.md`의 7단계 참조

### 4. `app/page.tsx`

위치: `marketing-landing-nextjs/app/page.tsx`

파일 내용은 `nextjs-page-code.tsx` 파일 전체 복사

---

## 🎯 단계별 상세 가이드

### Step 1: Next.js 프로젝트 생성

```bash
cd c:\Users\mgk88\Desktop\test)3\BSD_claude_skills
npx create-next-app@latest marketing-landing-nextjs --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```

### Step 2: shadcn/ui 초기화

```bash
cd marketing-landing-nextjs
npx shadcn-ui@latest init
```

선택사항:
- Style: **Default**
- Color: **Slate**
- CSS variables: **Yes**

### Step 3: Spline 라이브러리 설치

```bash
npm install @splinetool/react-spline
```

### Step 4: Tailwind 설정 파일 수정

`tailwind.config.ts` 파일을 열고 다음 내용으로 교체:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3b82f6",
          dark: "#2563eb",
          light: "#60a5fa",
        },
        background: {
          dark: "#0f172a",
          secondary: "#1e293b",
          card: "#1e293b",
        },
        text: {
          primary: "#f1f5f9",
          secondary: "#94a3b8",
          muted: "#64748b",
        },
        border: "#334155",
        success: "#10b981",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

### Step 5: Global CSS 수정

`app/globals.css` 파일을 열고 다음 내용으로 교체:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background-dark text-text-primary;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

### Step 6: 컴포넌트 폴더 생성

```bash
mkdir -p components/ui
```

### Step 7: 3D Robot 컴포넌트 생성

`components/ui/interactive-3d-robot.tsx` 파일 생성:

```tsx
'use client';

import { Suspense, lazy } from 'react';
const Spline = lazy(() => import('@splinetool/react-spline'));

interface InteractiveRobotSplineProps {
  scene: string;
  className?: string;
}

export function InteractiveRobotSpline({ scene, className }: InteractiveRobotSplineProps) {
  return (
    <Suspense
      fallback={
        <div className={`w-full h-full flex items-center justify-center bg-background-dark text-white ${className}`}>
          <svg
            className="animate-spin h-8 w-8 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2-2.647z"
            />
          </svg>
          <span className="ml-3 text-text-secondary">로딩 중...</span>
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  );
}
```

### Step 8: 메인 페이지 작성

`app/page.tsx` 파일을 `nextjs-page-code.tsx` 내용으로 교체하세요.

### Step 9: 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속!

---

## ✅ 체크리스트

설치가 제대로 되었는지 확인:

- [ ] Next.js 프로젝트 생성 완료
- [ ] shadcn/ui 초기화 완료
- [ ] @splinetool/react-spline 설치 완료
- [ ] tailwind.config.ts 수정 완료
- [ ] app/globals.css 수정 완료
- [ ] components/ui/interactive-3d-robot.tsx 생성 완료
- [ ] app/page.tsx 생성 완료
- [ ] npm run dev 실행 성공
- [ ] localhost:3000에서 페이지 확인

---

## 🎨 주요 특징

### 1. 3D 인터랙티브 배경
- Spline 3D 로봇이 히어로 섹션 배경으로 표시됩니다
- 사용자가 마우스로 조작 가능
- 투명도 20%로 텍스트 가독성 유지

### 2. 단색 블루 테마
- Primary: #3b82f6 (밝은 파랑)
- Dark Background: #0f172a (다크 슬레이트)
- 모든 그라데이션 제거
- AI 아이콘 없음 (텍스트 아이콘 사용)

### 3. 리드 수집 폼
- 7개 필드 (회사명, 담당자명, 이메일, 연락처, 업종, 예산, 문의내용)
- 실시간 폼 유효성 검사
- LocalStorage 자동 저장
- 성공 메시지 표시

### 4. 반응형 디자인
- 모바일, 태블릿, 데스크톱 완벽 대응
- Tailwind CSS 유틸리티 활용
- 터치 친화적 UI

---

## 🚀 다음 단계

### 1. Voiceflow 챗봇 통합

챗봇 버튼 클릭 시 Voiceflow 열리도록 설정:

```tsx
// app/page.tsx에서 챗봇 버튼 수정
<button
  onClick={() => {
    if (window.voiceflow && window.voiceflow.chat) {
      window.voiceflow.chat.open();
    }
  }}
  className="fixed bottom-8 right-8..."
>
  문의
</button>
```

그리고 `app/layout.tsx`의 `<head>`에 Voiceflow 스크립트 추가.

### 2. 폼 백엔드 연동

`app/page.tsx`의 `handleSubmit` 함수에서:

```tsx
// API 호출 추가
await fetch('/api/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});
```

그리고 `app/api/leads/route.ts` 파일 생성.

### 3. Google Analytics 설정

`app/layout.tsx`에 GA4 스크립트 추가.

### 4. Vercel 배포

```bash
npm install -g vercel
vercel
```

---

## 🐛 문제 해결

### 3D 로봇이 안 보여요
- Spline URL이 올바른지 확인
- 인터넷 연결 확인
- 브라우저 콘솔에서 에러 확인

### 스타일이 안 먹혀요
- `npm run dev` 재시작
- 브라우저 캐시 삭제
- tailwind.config.ts 파일 확인

### TypeScript 에러
- `npm install` 재실행
- `node_modules` 삭제 후 재설치

---

## 📞 지원

문제가 발생하면:
1. `npm run build`로 빌드 에러 확인
2. 브라우저 개발자 도구 콘솔 확인
3. GitHub Issues 또는 BSD 커뮤니티에 문의

---

**축하합니다! 🎉**

3D 로봇이 포함된 Next.js 마케팅 랜딩페이지가 준비되었습니다!
