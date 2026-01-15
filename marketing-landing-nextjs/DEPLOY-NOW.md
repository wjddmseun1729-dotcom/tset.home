# 🚀 즉시 배포 가이드

## Vercel 계정: parkjeongeuns-projects
https://vercel.com/parkjeongeuns-projects

---

## 방법 1: ZIP 파일 업로드 (가장 빠름) ⚡

### 1단계: .gitignore 생성 (이미 있을 수 있음)

프로젝트에 `.gitignore` 파일이 있는지 확인하고, 없으면 생성:

```bash
cd "c:\Users\mgk88\Desktop\test)3\BSD_claude_skills\marketing-landing-nextjs"
```

`.gitignore` 파일 생성/확인:
```
node_modules
.next
.env*.local
.vercel
*.log
```

### 2단계: 프로젝트 압축

**Windows 탐색기에서**:
1. `c:\Users\mgk88\Desktop\test)3\BSD_claude_skills\marketing-landing-nextjs` 폴더 열기
2. 폴더 내의 모든 파일/폴더 선택 (Ctrl+A)
3. 우클릭 → "압축" → "ZIP 파일"
4. 파일명: `marketing-landing.zip`

### 3단계: Vercel에서 배포

1. **https://vercel.com/parkjeongeuns-projects** 접속
2. "Add New..." → "Project" 클릭
3. "Browse" 또는 드래그 앤 드롭
4. `marketing-landing.zip` 파일 선택/드롭

### 4단계: 프로젝트 설정

**Configure Project 화면에서**:

- **Project Name**: `growthlab-marketing` (원하는 이름)
- **Framework Preset**: Next.js (자동 감지됨)
- **Root Directory**: `./` (기본값)
- **Build Command**: `npm run build` (기본값)
- **Output Directory**: `.next` (기본값)
- **Install Command**: `npm install` (기본값)

### 5단계: 환경 변수 설정

**Environment Variables 섹션**:

1. "Add" 클릭
2. 입력:
   - **Name**: `NEXT_PUBLIC_GOOGLE_SCRIPT_URL`
   - **Value**: `https://script.google.com/macros/s/AKfycbzGS5TYQHxvFPZtA9Wp6au6VmQbT7wLvbzPcwNdXz0XX9XRX_VgcmxsC_-cZa9-HUYQhA/exec`
   - **Environments**: Production, Preview, Development (모두 체크)

### 6단계: 배포 시작

**"Deploy" 버튼 클릭!**

배포 진행 상황:
- ⏳ Queued...
- 📦 Building...
- 🚀 Deploying...
- ✅ Ready!

---

## 방법 2: GitHub 연동 (추천, 자동 배포) 🔄

### 1단계: GitHub 저장소 생성

1. **https://github.com** 로그인
2. "+" → "New repository"
3. 저장소 이름: `growthlab-marketing`
4. Public 선택
5. "Create repository"

### 2단계: Git 초기화 및 푸시

```bash
cd "c:\Users\mgk88\Desktop\test)3\BSD_claude_skills\marketing-landing-nextjs"

# Git 초기화
git init

# .gitignore 확인 (중요!)
# 다음 내용이 있는지 확인:
# node_modules
# .next
# .env*.local

# 모든 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit: GrowthLab marketing landing page"

# GitHub에 연결 (아래 URL을 본인 저장소로 변경)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/growthlab-marketing.git

# 메인 브랜치 설정
git branch -M main

# GitHub에 푸시
git push -u origin main
```

### 3단계: Vercel과 GitHub 연동

1. **https://vercel.com/parkjeongeuns-projects** 접속
2. "Add New..." → "Project"
3. "Import Git Repository" 선택
4. GitHub 권한 부여 (처음이면)
5. `growthlab-marketing` 저장소 선택
6. "Import" 클릭

### 4단계: 환경 변수 추가

배포 전 환경 변수 설정:

- **Name**: `NEXT_PUBLIC_GOOGLE_SCRIPT_URL`
- **Value**: `https://script.google.com/macros/s/AKfycbzGS5TYQHxvFPZtA9Wp6au6VmQbT7wLvbzPcwNdXz0XX9XRX_VgcmxsC_-cZa9-HUYQhA/exec`
- **Environments**: 모두 체크

### 5단계: 배포

"Deploy" 클릭!

---

## 📋 배포 후 작업

### 1. 배포 URL 확인

배포 완료 후 받은 URL (예시):
```
https://growthlab-marketing-abc123.vercel.app
```

또는 커스텀 도메인:
```
https://growthlab-marketing.vercel.app
```

### 2. 파일 업데이트 (중요!)

배포된 URL을 다음 파일에 반영:

#### app/layout.tsx (6번째 줄)
```typescript
const siteUrl = "https://growthlab-marketing.vercel.app";
```

#### app/sitemap.ts (5번째 줄)
```typescript
const siteUrl = 'https://growthlab-marketing.vercel.app'
```

#### public/robots.txt (2, 10번째 줄)
```
# https://growthlab-marketing.vercel.app/robots.txt
Sitemap: https://growthlab-marketing.vercel.app/sitemap.xml
```

### 3. 재배포

**GitHub 연동한 경우**:
```bash
git add .
git commit -m "Update site URLs"
git push
```
→ 자동으로 재배포됨!

**ZIP 업로드한 경우**:
- 파일 수정 후 다시 ZIP 압축
- Vercel에서 다시 업로드

---

## ✅ 배포 확인

### 기본 확인
- [ ] https://your-url.vercel.app 접속
- [ ] 3D 로봇 로딩 확인
- [ ] "무료 상담 신청하기" 버튼 클릭

### 리드 폼 테스트
- [ ] 폼 작성 및 제출
- [ ] 성공 메시지 표시
- [ ] 구글 시트에 데이터 저장 확인
  - https://docs.google.com/spreadsheets/d/1AnB3ogO3JXggy39OTYKsLtWfmEva68OjjdqGh9EnLxk/edit

### SEO 확인
- [ ] `https://your-url.vercel.app/robots.txt`
- [ ] `https://your-url.vercel.app/sitemap.xml`
- [ ] 페이지 소스보기 (Ctrl+U) - 메타 태그 확인

---

## 🐛 문제 해결

### 빌드 실패

**로컬에서 테스트**:
```bash
npm run build
```

오류 발생 시:
- 오류 메시지 확인
- 누락된 패키지 설치: `npm install`
- TypeScript 오류 수정

### 환경 변수 적용 안 됨

1. Vercel 대시보드 → 프로젝트 → Settings → Environment Variables
2. 변수 확인
3. 재배포 (Settings → General → Redeploy)

### 구글 시트 저장 안 됨

1. 브라우저 F12 → Console 탭
2. 네트워크 오류 확인
3. Apps Script URL 재확인

---

## 🎯 다음 단계

### 커스텀 도메인 연결

**도메인이 있다면**:

1. Vercel 프로젝트 → Settings → Domains
2. "Add" 클릭
3. 도메인 입력 (예: `growthlab.co.kr`)
4. DNS 설정:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### SEO 등록

**배포 후**:
- [ ] Google Search Console 등록
- [ ] 네이버 웹마스터 도구 등록
- [ ] Facebook/Twitter 미리보기 테스트

---

## 💡 GitHub 연동의 장점

- ✅ **자동 배포**: Push만 하면 자동 배포
- ✅ **프리뷰**: PR마다 고유 URL 생성
- ✅ **롤백**: 이전 버전으로 쉽게 복구
- ✅ **협업**: 팀원과 함께 작업 가능
- ✅ **히스토리**: 모든 변경사항 추적

---

지금 바로 배포하세요! 🚀

**추천 순서**:
1. ZIP 파일로 먼저 빠르게 배포 ⚡
2. 확인 후 GitHub 연동으로 전환 🔄
