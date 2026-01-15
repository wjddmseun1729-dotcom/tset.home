# Vercel 수동 배포 가이드

## ⚠️ CLI 로그인 오류 발생

한글 사용자 이름으로 인해 Vercel CLI 로그인에 오류가 발생했습니다.

**오류 메시지**:
```
Error: An unexpected error occurred in login: TypeError: 곽명근 @ vercel 50.4.0 node-v24.12.0 win32 (x64) is not a legal HTTP header value
```

---

## 🌐 웹 대시보드를 통한 배포 (권장)

### 방법 1: GitHub 연동 (가장 쉬운 방법) ✅

#### 1단계: GitHub 저장소 생성

**GitHub에서**:
1. [GitHub](https://github.com) 로그인
2. "New repository" 클릭
3. 저장소 이름: `growthlab-marketing`
4. Public 또는 Private 선택
5. "Create repository" 클릭

#### 2단계: Git 초기화 및 푸시

**터미널에서**:
```bash
cd "c:\Users\mgk88\Desktop\test)3\BSD_claude_skills\marketing-landing-nextjs"

# Git 초기화
git init

# 모든 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit: Marketing landing page with 3D robot"

# 원격 저장소 연결 (GitHub에서 제공한 URL 사용)
git remote add origin https://github.com/YOUR_USERNAME/growthlab-marketing.git

# 메인 브랜치로 변경
git branch -M main

# GitHub에 푸시
git push -u origin main
```

#### 3단계: Vercel과 GitHub 연동

**Vercel 대시보드에서**:
1. [Vercel](https://vercel.com) 회원가입/로그인
2. "Add New" → "Project" 클릭
3. "Import Git Repository" 선택
4. GitHub 계정 연결 (처음이면 권한 부여)
5. 방금 생성한 저장소 선택 (`growthlab-marketing`)
6. "Import" 클릭

**프로젝트 설정**:
- Framework Preset: Next.js (자동 감지)
- Root Directory: `./`
- Build Command: `npm run build` (기본값)
- Output Directory: `.next` (기본값)
- Install Command: `npm install` (기본값)

#### 4단계: 환경 변수 설정

배포 전 환경 변수 추가:

1. "Environment Variables" 섹션 펼치기
2. 추가:
   - **Name**: `NEXT_PUBLIC_GOOGLE_SCRIPT_URL`
   - **Value**: `https://script.google.com/macros/s/AKfycbzGS5TYQHxvFPZtA9Wp6au6VmQbT7wLvbzPcwNdXz0XX9XRX_VgcmxsC_-cZa9-HUYQhA/exec`
   - **Environment**: Production, Preview, Development (모두 체크)
3. "Add" 클릭

#### 5단계: 배포 시작

"Deploy" 버튼 클릭!

**배포 진행 상황**:
- Building... (빌드 중)
- Deploying... (배포 중)
- Success! (완료)

배포 완료 후 URL 확인:
```
https://growthlab-marketing.vercel.app
```

---

### 방법 2: 드래그 앤 드롭 배포

GitHub를 사용하지 않는 경우:

#### 1단계: 프로젝트 빌드

```bash
cd "c:\Users\mgk88\Desktop\test)3\BSD_claude_skills\marketing-landing-nextjs"
npm run build
```

#### 2단계: Vercel 대시보드

1. [Vercel Dashboard](https://vercel.com/dashboard)
2. "Add New" → "Project"
3. 빌드된 `.next` 폴더를 드래그 앤 드롭

⚠️ **주의**: 이 방법은 자동 배포가 안 되므로 GitHub 연동을 권장합니다.

---

## 🔄 자동 배포 설정 (GitHub 연동 후)

### 자동으로 배포되는 경우

1. **메인 브랜치에 푸시**
   ```bash
   git add .
   git commit -m "Update landing page"
   git push
   ```
   → 자동으로 프로덕션 배포

2. **다른 브랜치에 푸시**
   ```bash
   git checkout -b feature/new-section
   git add .
   git commit -m "Add new section"
   git push origin feature/new-section
   ```
   → 자동으로 프리뷰 배포 (고유 URL 생성)

3. **Pull Request 생성**
   → 자동으로 프리뷰 URL 생성 (PR 코멘트에 표시)

---

## 📝 배포 후 필수 작업

### 1. 배포 URL 확인

Vercel에서 제공한 URL (예시):
```
https://growthlab-marketing.vercel.app
```

### 2. 사이트 URL 업데이트

다음 파일들을 수정:

**app/layout.tsx** (6번째 줄):
```typescript
const siteUrl = "https://growthlab-marketing.vercel.app";
```

**app/sitemap.ts** (5번째 줄):
```typescript
const siteUrl = 'https://growthlab-marketing.vercel.app'
```

**public/robots.txt** (2, 10번째 줄):
```
# https://growthlab-marketing.vercel.app/robots.txt
Sitemap: https://growthlab-marketing.vercel.app/sitemap.xml
```

### 3. 변경사항 재배포

**GitHub 연동된 경우**:
```bash
git add .
git commit -m "Update site URLs"
git push
```

**드래그 앤 드롭 사용한 경우**:
- 다시 빌드: `npm run build`
- Vercel에서 다시 드래그 앤 드롭

---

## 🎯 배포 확인 체크리스트

### 기본 확인
- [ ] 사이트 접속 확인
- [ ] 3D 로봇 로딩 확인
- [ ] 네비게이션 동작 확인
- [ ] "무료 상담 신청하기" 버튼 클릭 → 폼으로 스크롤

### 리드 폼 테스트
- [ ] 폼 필드 입력
- [ ] "무료 진단 받기" 제출
- [ ] 성공 메시지 표시 확인
- [ ] 구글 시트에 데이터 저장 확인

### SEO 확인
- [ ] `/robots.txt` 접근 확인
- [ ] `/sitemap.xml` 접근 확인
- [ ] 페이지 소스보기(Ctrl+U) → 메타 태그 확인

### 모바일 확인
- [ ] 모바일 브라우저에서 확인
- [ ] 반응형 레이아웃 확인
- [ ] 터치 스크롤 확인

---

## 🔧 문제 해결

### 빌드 실패

**로컬에서 빌드 테스트**:
```bash
npm run build
```

**오류가 있다면**:
1. 콘솔 오류 메시지 확인
2. TypeScript 오류 수정
3. 누락된 패키지 설치: `npm install`

### 환경 변수가 적용되지 않음

**확인 사항**:
1. Vercel 대시보드 → Settings → Environment Variables
2. `NEXT_PUBLIC_` 접두사 확인
3. Production 환경에 추가되었는지 확인
4. 재배포 필요 (환경 변수 변경 후)

### 구글 시트 연동 실패

**확인 사항**:
1. 브라우저 개발자 도구(F12) → Console 탭
2. 네트워크 오류 확인
3. Apps Script URL 재확인
4. Apps Script "모든 사용자" 권한 확인

---

## 🌟 커스텀 도메인 연결

### 1. Vercel에서 도메인 추가

**Vercel 대시보드**:
1. 프로젝트 → Settings → Domains
2. "Add" 클릭
3. 도메인 입력 (예: `growthlab.co.kr`)
4. DNS 설정 안내 확인

### 2. DNS 설정

**도메인 제공업체에서** (가비아, 카페24 등):

**A 레코드 방식**:
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**CNAME 방식** (권장):
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

### 3. SSL 인증서

Vercel이 자동으로 무료 SSL 인증서 발급 (Let's Encrypt)
- HTTPS 자동 적용
- 갱신 자동 처리

---

## 💡 유용한 팁

### Git 기초 명령어

```bash
# 현재 상태 확인
git status

# 변경사항 추가
git add .

# 커밋
git commit -m "커밋 메시지"

# 푸시
git push

# 브랜치 생성
git checkout -b feature/new-feature

# 브랜치 목록
git branch

# 브랜치 전환
git checkout main
```

### Vercel 대시보드 주요 기능

- **Deployments**: 배포 히스토리 및 로그
- **Analytics**: 방문자 통계
- **Logs**: 실시간 로그 확인
- **Settings**: 프로젝트 설정
- **Domains**: 도메인 관리
- **Environment Variables**: 환경 변수 관리

---

## 📞 지원

### Vercel 관련
- [Vercel 공식 문서](https://vercel.com/docs)
- [Vercel 커뮤니티](https://github.com/vercel/vercel/discussions)

### Next.js 관련
- [Next.js 공식 문서](https://nextjs.org/docs)
- [Next.js GitHub](https://github.com/vercel/next.js)

---

완료! 이제 GitHub 연동으로 배포를 진행하세요! 🚀
