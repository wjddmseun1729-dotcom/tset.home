# SEO 최적화 가이드

## 📋 완료된 작업

### ✅ 1. 메타데이터 설정
- **위치**: `app/layout.tsx`
- **포함 내용**:
  - 페이지 제목 및 설명
  - Open Graph (Facebook, LinkedIn)
  - Twitter Card
  - 키워드
  - 언어 설정 (한국어)

### ✅ 2. robots.txt
- **위치**: `public/robots.txt`
- **기능**:
  - 모든 검색엔진 크롤러 허용
  - 사이트맵 경로 지정
  - 네이버(Yeti), 다음(Daumoa) 포함

### ✅ 3. sitemap.xml
- **위치**: `app/sitemap.ts`
- **기능**:
  - 동적 사이트맵 생성
  - 우선순위 및 갱신 주기 설정
  - 자동 배포 URL 반영

---

## 🚀 배포 전 체크리스트

### 1️⃣ 환경 변수 업데이트

**app/layout.tsx** (6번째 줄)
```typescript
const siteUrl = "https://your-marketing-company.com"; // ✅ 실제 도메인으로 교체
```

**app/sitemap.ts** (5번째 줄)
```typescript
const siteUrl = 'https://your-marketing-company.com' // ✅ 실제 도메인으로 교체
```

**public/robots.txt** (2번째 줄)
```
# https://your-marketing-company.com/robots.txt  # ✅ 실제 도메인으로 교체
Sitemap: https://your-marketing-company.com/sitemap.xml
```

### 2️⃣ OG 이미지 교체

**현재 상태**:
- ⚠️ `public/og-image.png` - 다른 브랜드 로고

**권장 사항**:
1. 새 이미지 제작 (1200 x 630px)
2. 내용:
   - 회사 로고/이름
   - "그로스랩 | 데이터 기반 마케팅"
   - 배경: 단색 블루 (#3b82f6)
3. `public/og-image.png`로 저장

**디자인 툴**:
- [Canva](https://www.canva.com/) (무료)
- [Figma](https://www.figma.com/) (무료)
- Photoshop

### 3️⃣ Favicon 추가 (선택사항)

**필요한 파일**:
```
public/
  ├── favicon.ico (32x32 또는 16x16)
  ├── favicon-32.png (32x32)
  ├── favicon-192.png (192x192)
  └── apple-touch-icon.png (180x180)
```

**생성 방법**:
- [Favicon Generator](https://www.favicon-generator.org/)
- [RealFaviconGenerator](https://realfavicongenerator.net/)

생성 후 `app/layout.tsx`에서 주석 해제:
```typescript
icons: {
  icon: [
    { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
  ],
  shortcut: "/favicon.ico",
  apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
},
```

---

## 🔍 배포 후 작업

### 1. Google Search Console 등록

**1단계: 속성 추가**
1. [Google Search Console](https://search.google.com/search-console) 접속
2. "속성 추가" 클릭
3. 도메인 입력

**2단계: 소유권 확인**
- HTML 태그 방법 선택
- 인증 코드 복사

**3단계: 코드 추가**
`app/layout.tsx` 수정:
```typescript
verification: {
  google: "your-google-verification-code", // ✅ 주석 해제 및 코드 입력
},
```

**4단계: 사이트맵 제출**
1. Search Console → 사이트맵
2. URL 입력: `https://your-domain.com/sitemap.xml`
3. 제출

### 2. 네이버 웹마스터 도구 등록

**1단계: 사이트 등록**
1. [네이버 웹마스터 도구](https://searchadvisor.naver.com/) 접속
2. 사이트 추가

**2단계: 소유권 확인**
- HTML 태그 방법 선택
- 인증 코드 복사

**3단계: 코드 추가**
`app/layout.tsx` 수정:
```typescript
verification: {
  google: "your-google-verification-code",
  other: {
    "naver-site-verification": "your-naver-verification-code", // ✅ 추가
  },
},
```

**4단계: 사이트맵 제출**
1. 요청 → 사이트맵 제출
2. URL: `https://your-domain.com/sitemap.xml`

### 3. 소셜 미디어 테스트

**Facebook Sharing Debugger**
1. [Debugger](https://developers.facebook.com/tools/debug/) 접속
2. URL 입력 후 "디버그" 클릭
3. "다시 스크래핑" 클릭 (캐시 갱신)

**Twitter Card Validator**
1. [Card Validator](https://cards-dev.twitter.com/validator) 접속
2. URL 입력 후 "Preview card" 클릭

**LinkedIn Post Inspector**
1. [Inspector](https://www.linkedin.com/post-inspector/) 접속
2. URL 입력 후 "검사" 클릭

---

## 📊 SEO 성능 모니터링

### 주요 지표

**Google Search Console**
- 검색 노출수
- 클릭수
- CTR (클릭률)
- 평균 순위

**Google Analytics** (설정 필요)
1. GA4 계정 생성
2. 추적 코드 추가
3. 전환 이벤트 설정

### 권장 도구

- [Google PageSpeed Insights](https://pagespeed.web.dev/) - 페이지 속도 분석
- [GTmetrix](https://gtmetrix.com/) - 성능 분석
- [Ahrefs](https://ahrefs.com/) - 백링크 및 키워드 분석
- [SEMrush](https://www.semrush.com/) - 경쟁사 분석

---

## 🎯 추가 최적화 권장사항

### 1. 구조화된 데이터 (Schema.org)

**조직 정보 추가**
```typescript
// app/layout.tsx 또는 별도 컴포넌트
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "그로스랩",
      "url": "https://your-domain.com",
      "logo": "https://your-domain.com/logo.png",
      "description": "데이터 기반 통합 마케팅 에이전시",
      "sameAs": [
        "https://www.facebook.com/yourpage",
        "https://www.instagram.com/yourpage",
        "https://www.linkedin.com/company/yourpage"
      ]
    })
  }}
/>
```

### 2. 성능 최적화

**이미지 최적화**
- Next.js Image 컴포넌트 사용
- WebP 포맷 사용
- Lazy loading 적용

**코드 분할**
- 동적 import 사용
- 번들 크기 최소화

**캐싱**
- CDN 사용
- 정적 파일 캐싱

### 3. 콘텐츠 전략

**블로그 섹션 추가**
- 마케팅 팁 및 트렌드
- 성공 사례
- 업계 인사이트

**정기 업데이트**
- 최소 주 1회 콘텐츠 발행
- 키워드 연구 기반 작성

---

## 📝 체크리스트

### 배포 전
- [ ] siteUrl 업데이트 (layout.tsx, sitemap.ts, robots.txt)
- [ ] OG 이미지 교체
- [ ] Favicon 생성 및 추가
- [ ] 메타 설명 검토

### 배포 후
- [ ] Google Search Console 등록
- [ ] 네이버 웹마스터 도구 등록
- [ ] 사이트맵 제출 (Google, Naver)
- [ ] 소셜 미디어 미리보기 테스트
- [ ] robots.txt 접근 확인 (`/robots.txt`)
- [ ] sitemap.xml 생성 확인 (`/sitemap.xml`)

### 지속 관리
- [ ] 주간 검색 성능 모니터링
- [ ] 월간 키워드 순위 체크
- [ ] 정기 콘텐츠 업데이트
- [ ] 백링크 모니터링

---

## 🆘 문제 해결

### sitemap.xml이 생성되지 않음
- Next.js 빌드 확인: `npm run build`
- `/sitemap.xml` 접근 확인
- 브라우저 캐시 삭제 후 재시도

### robots.txt 접근 불가
- `public/robots.txt` 파일 존재 확인
- 배포 후 파일 업로드 확인
- 대소문자 정확히 입력 (`robots.txt`)

### OG 이미지가 표시되지 않음
- 이미지 크기 확인 (1200x630 권장)
- 파일 경로 확인 (`/og-image.png`)
- 소셜 미디어 디버거로 캐시 갱신

---

완료! 🎉
