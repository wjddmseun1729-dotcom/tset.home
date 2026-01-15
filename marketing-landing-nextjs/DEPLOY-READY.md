# 🚀 배포 준비 완료!

## ✅ 완료된 작업

1. **프로젝트 생성 완료**
   - Next.js 16.1.2 설치
   - Tailwind CSS v4 설정
   - shadcn/ui 컴포넌트 구성
   - Spline 3D 로봇 통합

2. **기능 구현 완료**
   - 다크모드 단색 블루 테마
   - 리드 수집 폼 (7개 필드)
   - Google Sheets 연동
   - 한국어 업종 옵션

3. **SEO 최적화 완료**
   - 메타데이터 (layout.tsx)
   - sitemap.xml
   - robots.txt
   - Open Graph 이미지

4. **Git 커밋 완료**
   - 모든 파일 커밋됨
   - 커밋 ID: 83e5c6d

---

## 🎯 지금 바로 배포하기

### 방법 1: ZIP 파일 업로드 (가장 빠름) ⚡

#### 1단계: 프로젝트 압축

**Windows 탐색기에서**:
1. 이 폴더로 이동:
   ```
   c:\Users\mgk88\Desktop\test)3\BSD_claude_skills\marketing-landing-nextjs
   ```

2. 폴더 내의 **모든 파일/폴더** 선택 (Ctrl+A)
   - ⚠️ 중요: 폴더 자체가 아닌, 폴더 **안의 내용**을 선택하세요!

3. 우클릭 → "압축" → "ZIP 파일"

4. 파일명: `growthlab-marketing.zip`

#### 2단계: Vercel에 업로드

1. **https://vercel.com/parkjeongeuns-projects** 접속 및 로그인

2. "Add New..." 버튼 클릭 → "Project" 선택

3. "Browse" 또는 드래그 앤 드롭 영역에 `growthlab-marketing.zip` 업로드

4. **Configure Project** 화면:
   - **Project Name**: `growthlab-marketing` (원하는 이름으로 변경 가능)
   - **Framework Preset**: Next.js (자동 감지)
   - **Root Directory**: `./` (기본값 유지)
   - **Build Command**: `npm run build` (기본값 유지)
   - **Output Directory**: `.next` (기본값 유지)

#### 3단계: 환경 변수 설정 ⚠️ 중요!

**Environment Variables** 섹션에서:

1. "Add" 클릭

2. 다음 정보 입력:
   ```
   Name: NEXT_PUBLIC_GOOGLE_SCRIPT_URL
   Value: https://script.google.com/macros/s/AKfycbzGS5TYQHxvFPZtA9Wp6au6VmQbT7wLvbzPcwNdXz0XX9XRX_VgcmxsC_-cZa9-HUYQhA/exec
   Environment: Production, Preview, Development (모두 체크)
   ```

3. "Add" 클릭하여 저장

#### 4단계: 배포 시작!

**"Deploy" 버튼 클릭!**

배포 진행 상황:
- ⏳ Queued... (대기 중)
- 📦 Building... (빌드 중, 약 2-3분)
- 🚀 Deploying... (배포 중)
- ✅ Ready! (완료)

완료되면 URL이 표시됩니다:
```
https://growthlab-marketing.vercel.app
```
또는
```
https://growthlab-marketing-abc123.vercel.app
```

---

### 방법 2: GitHub 연동 (자동 배포)

현재 프로젝트가 `https://github.com/kyuhyi/BSD_claude_skills.git` 저장소에 연결되어 있습니다.

#### 옵션 A: 기존 저장소 사용

```bash
cd "c:\Users\mgk88\Desktop\test)3\BSD_claude_skills"
git push origin main
```

그 다음:
1. https://vercel.com/parkjeongeuns-projects 접속
2. "Add New..." → "Project"
3. "Import Git Repository" 선택
4. GitHub 저장소 `kyuhyi/BSD_claude_skills` 선택
5. **Root Directory** 설정: `marketing-landing-nextjs`
6. 환경 변수 추가 (위와 동일)
7. "Deploy" 클릭

#### 옵션 B: 새 전용 저장소 생성

더 깔끔한 관리를 원한다면:

1. GitHub에서 새 저장소 생성 (예: `growthlab-marketing`)
2. 프로젝트 폴더만 따로 push
3. Vercel과 연동

---

## 📋 배포 후 필수 작업

### 1. 배포 URL 확인

Vercel에서 받은 실제 URL (예시):
```
https://growthlab-marketing.vercel.app
```

### 2. 사이트 URL 업데이트 (중요!)

다음 **3개 파일**을 수정해야 합니다:

#### ① app/layout.tsx (6번째 줄)
```typescript
const siteUrl = "https://growthlab-marketing.vercel.app"; // 실제 URL로 교체
```

#### ② app/sitemap.ts (5번째 줄)
```typescript
const siteUrl = 'https://growthlab-marketing.vercel.app' // 실제 URL로 교체
```

#### ③ public/robots.txt (2, 10번째 줄)
```
# https://growthlab-marketing.vercel.app/robots.txt
Sitemap: https://growthlab-marketing.vercel.app/sitemap.xml
```

### 3. 재배포

**ZIP 업로드 방식 사용했다면**:
- 위 파일들 수정
- 다시 ZIP 압축
- Vercel에서 "Redeploy" 또는 새로 업로드

**GitHub 연동 사용했다면**:
```bash
git add .
git commit -m "Update site URLs with deployed domain"
git push
```
→ 자동으로 재배포됨!

---

## ✅ 배포 확인 체크리스트

### 즉시 확인
- [ ] 사이트 접속: https://your-url.vercel.app
- [ ] 3D 로봇 로딩 확인
- [ ] "무료 상담 신청하기" 버튼 → 폼으로 스크롤
- [ ] 폼 작성 및 제출 테스트
- [ ] 성공 메시지 표시 확인

### Google Sheets 확인
- [ ] 구글 시트 열기: https://docs.google.com/spreadsheets/d/1AnB3ogO3JXggy39OTYKsLtWfmEva68OjjdqGh9EnLxk/edit
- [ ] 테스트 데이터가 정상적으로 저장되었는지 확인
- [ ] 모든 필드가 제대로 매핑되었는지 확인

### SEO 확인
- [ ] `/robots.txt` 접속: https://your-url.vercel.app/robots.txt
- [ ] `/sitemap.xml` 접속: https://your-url.vercel.app/sitemap.xml
- [ ] 페이지 소스보기 (Ctrl+U) → 메타 태그 확인

### 모바일 확인
- [ ] 모바일 브라우저에서 접속
- [ ] 반응형 레이아웃 확인
- [ ] 폼 입력 및 제출 테스트

---

## 🎨 선택적 개선 사항

### OG 이미지 교체
현재 `public/og-image.png`는 다른 브랜드의 이미지입니다.

**권장 사항**:
1. 1200 x 630px 이미지 제작
2. 내용: 그로스랩 로고 + "데이터 기반 마케팅"
3. 배경: 블루 (#3b82f6)
4. `public/og-image.png`로 교체

**디자인 툴**:
- Canva (무료): https://www.canva.com/
- Figma (무료): https://www.figma.com/

---

## 🐛 문제 해결

### 빌드 실패
```bash
cd "c:\Users\mgk88\Desktop\test)3\BSD_claude_skills\marketing-landing-nextjs"
npm run build
```
로컬에서 빌드 테스트 후 오류 확인

### 환경 변수 미적용
- Vercel → 프로젝트 → Settings → Environment Variables 확인
- `NEXT_PUBLIC_` 접두사 확인
- 재배포 필요

### 구글 시트 저장 안 됨
- F12 → Console 탭에서 오류 확인
- Apps Script URL 재확인
- Apps Script 권한 확인 ("모든 사용자" 설정)

---

## 📞 추가 도움말

더 자세한 가이드:
- [DEPLOY-NOW.md](./DEPLOY-NOW.md) - 상세 배포 가이드
- [SEO-GUIDE.md](./SEO-GUIDE.md) - SEO 최적화 가이드
- [README.md](./README.md) - 프로젝트 설명서

---

**지금 바로 배포를 시작하세요!** 🚀

**추천**: ZIP 업로드 방식으로 먼저 빠르게 배포한 후, 나중에 GitHub 연동으로 전환하면 편리합니다.
