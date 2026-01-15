# Next.js + 3D Robot 프로젝트 설정 가이드

이 가이드는 단색 블루 테마의 마케팅 랜딩페이지를 Next.js로 마이그레이션하고 3D 로봇을 통합하는 방법입니다.

## 🚀 1단계: Next.js 프로젝트 생성

```bash
# 프로젝트 폴더로 이동
cd c:\Users\mgk88\Desktop\test)3\BSD_claude_skills

# Next.js 프로젝트 생성
npx create-next-app@latest marketing-landing-nextjs --typescript --tailwind --app --no-src-dir --import-alias "@/*"

# 프로젝트 폴더로 이동
cd marketing-landing-nextjs
```

### 설치 중 선택사항:
```
✔ Would you like to use TypeScript? → Yes
✔ Would you like to use ESLint? → Yes
✔ Would you like to use Tailwind CSS? → Yes
✔ Would you like to use `src/` directory? → No
✔ Would you like to use App Router? → Yes
✔ Would you like to customize the default import alias? → Yes (@/*)
```

## 🎨 2단계: shadcn/ui 설치

```bash
npx shadcn-ui@latest init
```

### 설치 중 선택사항:
```
✔ Which style would you like to use? › Default
✔ Which color would you like to use as base color? › Slate
✔ Would you like to use CSS variables for colors? › Yes
```

## 📦 3단계: 필요한 패키지 설치

```bash
# Spline 3D 라이브러리
npm install @splinetool/react-spline

# shadcn card 컴포넌트 (선택사항)
npx shadcn-ui@latest add card
```

## 🎯 4단계: 프로젝트 구조 생성

다음 구조로 파일을 생성합니다:

```
marketing-landing-nextjs/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ui/
│       └── interactive-3d-robot.tsx
├── public/
├── package.json
└── tailwind.config.ts
```

## ⚙️ 5단계: Tailwind 설정 (단색 블루 테마)

**`tailwind.config.ts`** 파일을 다음과 같이 수정:

\`\`\`typescript
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
\`\`\`

## 🎨 6단계: Global CSS 설정

**`app/globals.css`** 파일을 다음과 같이 수정:

\`\`\`css
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
\`\`\`

## 🤖 7단계: 3D Robot 컴포넌트 생성

**`components/ui/interactive-3d-robot.tsx`** 파일 생성:

\`\`\`tsx
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
        <div className={\`w-full h-full flex items-center justify-center bg-background-dark text-white \${className}\`}>
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
\`\`\`

## 📄 8단계: Layout 설정

**`app/layout.tsx`** 파일:

\`\`\`tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "디지털 마케팅 솔루션 | 당신의 비즈니스 성장 파트너",
  description: "데이터 기반 마케팅 자동화로 매출 3배 증가. 무료 컨설팅 신청하고 맞춤 전략을 받아보세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
\`\`\`

## 🏠 9단계: 메인 페이지 생성

**`app/page.tsx`** 파일을 생성하세요. 다음 메시지에서 전체 코드를 제공하겠습니다.

## ▶️ 10단계: 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속

## 📦 11단계: 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 🚀 배포 옵션

### Vercel (가장 쉬움, 무료)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

---

## 다음 단계

1. ✅ 프로젝트 생성 완료
2. ⬜ `app/page.tsx` 파일 작성 (다음 메시지에서 제공)
3. ⬜ Voiceflow 챗봇 통합
4. ⬜ 폼 백엔드 연동
5. ⬜ Google Analytics 설정

준비되면 `app/page.tsx` 코드를 제공하겠습니다!
