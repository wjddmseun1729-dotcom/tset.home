# 현재 HTML 프로젝트에 Spline 3D 통합 가이드

현재 프로젝트는 순수 HTML/CSS/JavaScript로 구성되어 있으므로, React 컴포넌트를 직접 사용할 수 없습니다.

대신 Spline의 **Web Embed** 방식으로 3D 로봇을 추가할 수 있습니다.

## 방법 1: iframe을 사용한 간단한 통합

### HTML에 추가:

```html
<!-- Hero Section에 3D 배경 추가 -->
<section class="hero">
    <div class="container">
        <!-- 3D Background -->
        <div class="spline-container">
            <iframe
                src='https://my.spline.design/PyzDhpQ9E5f1E3MT'
                frameborder='0'
                width='100%'
                height='100%'
                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: auto;">
            </iframe>
        </div>

        <!-- 기존 Hero Content -->
        <div class="hero-content">
            <h1>
                AI 마케팅으로<br>
                <span class="highlight">매출 3배 성장</span>을 경험하세요
            </h1>
            <p>5,000개 기업이 선택한 데이터 기반 마케팅 솔루션.</p>
        </div>
    </div>
</section>
```

### CSS 스타일 추가:

```css
.hero {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
}

.spline-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    opacity: 0.3; /* 배경으로 사용시 투명도 조절 */
}

.hero-content {
    position: relative;
    z-index: 10;
    padding-top: 120px;
}
```

## 방법 2: Spline Viewer 라이브러리 사용 (권장)

### 1. HTML `<head>`에 스크립트 추가:

```html
<script type="module" src="https://unpkg.com/@splinetool/viewer@1.0.42/build/spline-viewer.js"></script>
```

### 2. HTML에 Spline Viewer 추가:

```html
<section class="hero">
    <div class="container">
        <!-- 3D Viewer -->
        <spline-viewer
            url="https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode"
            class="spline-viewer">
        </spline-viewer>

        <div class="hero-content">
            <h1>AI 마케팅으로 매출 3배 성장</h1>
        </div>
    </div>
</section>
```

### 3. CSS 스타일:

```css
.spline-viewer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
}

.hero {
    position: relative;
    min-height: 100vh;
}

.hero-content {
    position: relative;
    z-index: 10;
}
```

---

## 옵션 2: 새로운 Next.js 프로젝트 생성

React 컴포넌트를 사용하려면 새 프로젝트를 만들어야 합니다.

### 1. Next.js + shadcn 프로젝트 생성:

```bash
# Next.js 프로젝트 생성
npx create-next-app@latest marketing-landing-nextjs --typescript --tailwind --app

cd marketing-landing-nextjs

# shadcn 초기화
npx shadcn-ui@latest init

# 선택사항:
# - TypeScript: Yes
# - Tailwind: Yes
# - App Router: Yes
# - components path: @/components
# - utils path: @/lib/utils
```

### 2. 필요한 패키지 설치:

```bash
npm install @splinetool/react-spline
npx shadcn-ui@latest add card
```

### 3. 컴포넌트 생성:

**`components/ui/interactive-3d-robot.tsx`**

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
        <div className={`w-full h-full flex items-center justify-center bg-gray-900 text-white ${className}`}>
          <svg className="animate-spin h-5 w-5 text-white mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2-2.647z"></path>
          </svg>
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  );
}
```

### 4. 페이지에서 사용:

**`app/page.tsx`**

```tsx
'use client';

import { InteractiveRobotSpline } from '@/components/ui/interactive-3d-robot';

export default function Home() {
  const ROBOT_SCENE_URL = "https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode";

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-900">
      {/* 3D Background */}
      <InteractiveRobotSpline
        scene={ROBOT_SCENE_URL}
        className="absolute inset-0 z-0 opacity-30"
      />

      {/* Hero Content */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="text-center text-white max-w-4xl px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            AI 마케팅으로
            <br />
            <span className="text-blue-500">매출 3배 성장</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            5,000개 기업이 선택한 데이터 기반 마케팅 솔루션
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all">
            무료 상담 신청
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 추천 방법

**현재 HTML 프로젝트를 유지**하고 싶다면:
→ **방법 2 (Spline Viewer)** 사용

**React/Next.js로 마이그레이션**하고 싶다면:
→ **옵션 2** 새 프로젝트 생성

---

## 현재 프로젝트에 바로 적용할 코드

`marketing-landing.html`에 추가할 수 있는 완성된 코드입니다:

```html
<!-- head 섹션에 추가 -->
<script type="module" src="https://unpkg.com/@splinetool/viewer@1.0.42/build/spline-viewer.js"></script>

<!-- Hero Section 수정 -->
<section class="hero">
    <div class="container">
        <!-- 3D Robot Background -->
        <spline-viewer
            url="https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode"
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.2; z-index: 0;">
        </spline-viewer>

        <!-- 기존 Hero Content (z-index 추가) -->
        <div class="hero-content" style="position: relative; z-index: 10;">
            <h1>
                AI 마케팅으로<br>
                <span class="highlight">매출 3배 성장</span>을 경험하세요
            </h1>
            <p>5,000개 기업이 선택한 데이터 기반 마케팅 솔루션.</p>
        </div>
    </div>
</section>
```

어떤 방법을 선호하시나요?
