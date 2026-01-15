# Vercel 배포 가이드

## 🚀 Vercel CLI로 배포하기

### 1️⃣ Vercel 로그인

터미널에서 다음 명령어 실행:

```bash
vercel login
```

- 이메일 주소 입력
- 이메일로 받은 인증 링크 클릭

### 2️⃣ 프로젝트 배포

프로젝트 폴더에서 실행:

```bash
cd marketing-landing-nextjs
vercel
```

**첫 배포 시 질문**:
1. **Set up and deploy?** → `Y` (Yes)
2. **Which scope?** → 본인 계정 선택
3. **Link to existing project?** → `N` (No, 새 프로젝트)
4. **What's your project's name?** → `growthlab-marketing` (원하는 이름)
5. **In which directory is your code located?** → `./` (Enter)
6. **Want to override the settings?** → `N` (No)

### 3️⃣ 프로덕션 배포

개발 환경이 아닌 프로덕션으로 배포:

```bash
vercel --prod
```

### 4️⃣ 환경 변수 설정

**방법 1: Vercel 대시보드**
1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. 프로젝트 선택
3. Settings → Environment Variables
4. 추가:
   - Name: `NEXT_PUBLIC_GOOGLE_SCRIPT_URL`
   - Value: `https://script.google.com/macros/s/AKfycbzGS5TYQHxvFPZtA9Wp6au6VmQbT7wLvbzPcwNdXz0XX9XRX_VgcmxsC_-cZa9-HUYQhA/exec`
   - Environment: Production, Preview, Development (모두 선택)

**방법 2: CLI로 추가**
```bash
vercel env add NEXT_PUBLIC_GOOGLE_SCRIPT_URL production
# 값 입력 후 Enter
```

### 5️⃣ 재배포 (환경 변수 적용)

환경 변수 추가 후 재배포:

```bash
vercel --prod
```

---

## 📋 배포 후 작업

### 1. 도메인 URL 업데이트

배포 완료 후 받은 URL (예: `growthlab-marketing.vercel.app`)을 다음 파일에 반영:

**app/layout.tsx** (6번째 줄)
```typescript
const siteUrl = "https://growthlab-marketing.vercel.app";
```

**app/sitemap.ts** (5번째 줄)
```typescript
const siteUrl = 'https://growthlab-marketing.vercel.app'
```

**public/robots.txt** (2, 10번째 줄)
```
# https://growthlab-marketing.vercel.app/robots.txt
Sitemap: https://growthlab-marketing.vercel.app/sitemap.xml
```

### 2. 재배포 (URL 반영)

```bash
vercel --prod
```

### 3. 커스텀 도메인 연결 (선택사항)

**Vercel 대시보드에서**:
1. 프로젝트 선택
2. Settings → Domains
3. "Add Domain" 클릭
4. 도메인 입력 (예: `growthlab.co.kr`)
5. DNS 설정 안내에 따라 도메인 제공업체에서 설정

**일반적인 DNS 설정**:
```
Type: CNAME
Name: www (또는 @)
Value: cname.vercel-dns.com
```

---

## 🔄 자동 배포 설정

### GitHub 연동으로 자동 배포

**1단계: GitHub 저장소 생성**
```bash
cd marketing-landing-nextjs
git init
git add .
git commit -m "Initial commit: Marketing landing page"
```

**2단계: GitHub에 푸시**
```bash
# GitHub에서 새 저장소 생성 후
git remote add origin https://github.com/your-username/growthlab-marketing.git
git branch -M main
git push -u origin main
```

**3단계: Vercel과 GitHub 연동**
1. [Vercel Dashboard](https://vercel.com/dashboard)
2. "Import Project" 클릭
3. "Import Git Repository" 선택
4. GitHub 저장소 선택
5. "Import" 클릭

**자동 배포 동작**:
- `main` 브랜치에 푸시 → 자동으로 프로덕션 배포
- 다른 브랜치에 푸시 → 자동으로 프리뷰 배포
- Pull Request 생성 → 자동으로 프리뷰 URL 생성

---

## 📊 배포 명령어 정리

```bash
# 개발 환경 미리보기
vercel

# 프로덕션 배포
vercel --prod

# 배포 로그 확인
vercel logs

# 배포 목록 확인
vercel ls

# 환경 변수 추가
vercel env add VARIABLE_NAME production

# 환경 변수 목록
vercel env ls

# 프로젝트 제거
vercel remove [deployment-url]

# 도메인 추가
vercel domains add your-domain.com

# 도메인 목록
vercel domains ls
```

---

## 🐛 문제 해결

### 빌드 실패

**오류**: `Module not found` 또는 `Cannot find module`
```bash
# 로컬에서 빌드 테스트
npm run build

# node_modules 재설치
rm -rf node_modules .next
npm install
npm run build
```

### 환경 변수가 적용되지 않음

**해결 방법**:
1. Vercel 대시보드에서 환경 변수 확인
2. `NEXT_PUBLIC_` 접두사 확인 (클라이언트 사이드 변수)
3. 재배포: `vercel --prod`

### 404 에러 (페이지를 찾을 수 없음)

**해결 방법**:
- `app/` 폴더 구조 확인
- `page.tsx` 파일명 확인 (소문자)
- 재배포

### 도메인 연결 실패

**해결 방법**:
1. DNS 전파 대기 (최대 48시간)
2. DNS 설정 재확인
3. Vercel DNS 사용 (권장)

---

## ✅ 배포 체크리스트

### 배포 전
- [ ] 로컬 빌드 테스트 (`npm run build`)
- [ ] 환경 변수 확인 (.env.local)
- [ ] 불필요한 콘솔 로그 제거
- [ ] OG 이미지 확인

### 배포 후
- [ ] 사이트 접속 확인
- [ ] 리드 폼 제출 테스트
- [ ] 구글 시트 연동 확인
- [ ] robots.txt 접근 확인 (`/robots.txt`)
- [ ] sitemap.xml 확인 (`/sitemap.xml`)
- [ ] 모바일 반응형 확인
- [ ] 페이지 속도 테스트 ([PageSpeed Insights](https://pagespeed.web.dev/))

### SEO 설정
- [ ] layout.tsx의 siteUrl 업데이트
- [ ] sitemap.ts의 siteUrl 업데이트
- [ ] robots.txt의 Sitemap URL 업데이트
- [ ] Google Search Console 등록
- [ ] 네이버 웹마스터 도구 등록

---

## 🎯 성능 최적화

### Vercel Analytics 설정 (선택사항)

**1단계: 대시보드에서 활성화**
1. 프로젝트 → Analytics → Enable

**2단계: 코드 추가** (선택사항)
```bash
npm install @vercel/analytics
```

`app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Speed Insights 설정

```bash
npm install @vercel/speed-insights
```

`app/layout.tsx`:
```typescript
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

---

## 📚 참고 링크

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Vercel CLI 문서](https://vercel.com/docs/cli)
- [환경 변수 설정](https://vercel.com/docs/environment-variables)

---

완료! 🚀
