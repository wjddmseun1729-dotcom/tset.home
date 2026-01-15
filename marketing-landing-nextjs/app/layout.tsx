// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

// ✅ 실제 배포 도메인으로 교체하세요
const siteUrl = "https://your-marketing-company.com";

// ✅ 회사 정보 - 실제 정보로 교체하세요
const companyName = "그로스랩"; // 회사명
const companyNameEn = "GrowthLab"; // 영문 회사명

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${companyName} | 데이터 기반 통합 마케팅 에이전시`,
    template: `%s | ${companyName}`,
  },
  description:
    "데이터가 증명하는 마케팅, 성장이 답입니다. 퍼포먼스 마케팅, 브랜딩, SNS 마케팅, 웹사이트 제작까지. 500+ 브랜드와 함께한 검증된 마케팅 파트너.",
  alternates: {
    canonical: siteUrl,
    languages: { ko: `${siteUrl}/` },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      maxSnippet: -1,
      maxImagePreview: "large",
      maxVideoPreview: -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: `${companyName} | 데이터 기반 통합 마케팅 에이전시`,
    description:
      "퍼포먼스 마케팅부터 브랜딩까지, 전략부터 실행까지 원스톱 마케팅 솔루션. 무료 마케팅 진단을 받아보세요.",
    siteName: companyName,
    locale: "ko_KR",
    images: [
      {
        url: `${siteUrl}/og-image.png`, // public/og-image.png (1200x630 권장)
        width: 1200,
        height: 630,
        alt: `${companyName} - 데이터 기반 마케팅 에이전시`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${companyName} | 데이터 기반 마케팅`,
    description:
      "500+ 브랜드와 함께한 검증된 마케팅 파트너. 무료 마케팅 진단 받아보세요.",
    images: [`${siteUrl}/og-image.png`],
    creator: "@growthlab", // ✅ 실제 트위터 핸들로 교체
  },
  keywords: [
    "마케팅 대행사",
    "퍼포먼스 마케팅",
    "브랜딩 에이전시",
    "SNS 마케팅",
    "디지털 마케팅",
    "광고 대행",
    "콘텐츠 마케팅",
    "SEO 최적화",
    companyName,
  ],
  // icons: {
  //   icon: [
  //     { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
  //     { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
  //   ],
  //   shortcut: "/favicon.ico",
  //   apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  // },
  authors: [{ name: companyName, url: siteUrl }],
  creator: companyName,
  publisher: companyName,
  category: "marketing",
  verification: {
    // ✅ Google Search Console 인증 코드 (설정 후 주석 해제)
    // google: "your-google-verification-code",
    // ✅ 네이버 웹마스터 도구 인증 코드
    // other: {
    //   "naver-site-verification": "your-naver-verification-code",
    // },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* ✅ 추가 메타 태그 (필요시) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Pretendard 폰트 */}
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
          rel="stylesheet"
        />
      </head>
      <body className="font-pretendard antialiased">{children}</body>
    </html>
  );
}
