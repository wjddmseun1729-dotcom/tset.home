import { NextResponse } from 'next/server';

// RSS 피드에서 뉴스 기사 가져오기
export async function GET() {
  try {
    const RSS_URL = 'http://www.yonhapnewstv.co.kr/browse/feed/';

    const response = await fetch(RSS_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      next: { revalidate: 3600 }, // 1시간 캐시
    });

    if (!response.ok) {
      throw new Error(`RSS fetch failed: ${response.status}`);
    }

    const xmlText = await response.text();

    // XML 파싱 (간단한 정규식 사용)
    const items: NewsItem[] = [];
    const itemMatches = xmlText.match(/<item>([\s\S]*?)<\/item>/g) || [];

    // 마케팅 관련 키워드
    const marketingKeywords = ['마케팅', '광고', '브랜드', '소비자', '매출', '판매', '홍보', '기업', '비즈니스', '경제', '시장', '투자', 'SNS', '온라인', '디지털', 'AI', '트렌드', '전략', '성장', '스타트업'];

    for (const itemXml of itemMatches) {
      const title = extractTag(itemXml, 'title');
      const link = extractTag(itemXml, 'link');
      const description = extractTag(itemXml, 'description');
      const pubDate = extractTag(itemXml, 'pubDate');

      // 썸네일 이미지 추출 (media:thumbnail 또는 enclosure 또는 description 내 img)
      let thumbnail = extractAttribute(itemXml, 'media:thumbnail', 'url') ||
                      extractAttribute(itemXml, 'enclosure', 'url') ||
                      extractImageFromDescription(description);

      // 마케팅 관련 기사 필터링
      const isMarketingRelated = marketingKeywords.some(keyword =>
        title.includes(keyword) || description.includes(keyword)
      );

      if (title && link) {
        items.push({
          title: cleanText(title),
          link,
          description: cleanText(description).slice(0, 150) + '...',
          thumbnail: thumbnail || '/placeholder-news.jpg',
          pubDate,
          isMarketingRelated,
        });
      }
    }

    // 마케팅 관련 기사 우선, 최신순 정렬, 6개만 반환
    const marketingNews = items.filter(item => item.isMarketingRelated);
    const otherNews = items.filter(item => !item.isMarketingRelated);
    const sortedNews = [...marketingNews, ...otherNews].slice(0, 6);

    return NextResponse.json({
      success: true,
      articles: sortedNews,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('RSS Fetch Error:', error);

    // 에러 시 기본 뉴스 반환
    return NextResponse.json({
      success: false,
      articles: getDefaultNews(),
      lastUpdated: new Date().toISOString(),
      error: 'RSS 피드를 가져오는데 실패했습니다.',
    });
  }
}

interface NewsItem {
  title: string;
  link: string;
  description: string;
  thumbnail: string;
  pubDate: string;
  isMarketingRelated: boolean;
}

// XML 태그 내용 추출
function extractTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
  return match ? (match[1] || match[2] || '').trim() : '';
}

// XML 속성 추출
function extractAttribute(xml: string, tag: string, attr: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*${attr}=["']([^"']+)["']`));
  return match ? match[1] : '';
}

// description 내 이미지 URL 추출
function extractImageFromDescription(desc: string): string {
  const imgMatch = desc.match(/<img[^>]+src=["']([^"']+)["']/);
  return imgMatch ? imgMatch[1] : '';
}

// HTML 엔티티 및 태그 제거
function cleanText(text: string): string {
  return text
    .replace(/<!\[CDATA\[|\]\]>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

// 기본 뉴스 데이터 (RSS 실패 시)
function getDefaultNews(): NewsItem[] {
  return [
    {
      title: 'AI 마케팅 자동화로 매출 300% 성장한 기업들',
      link: 'https://www.yonhapnewstv.co.kr/',
      description: '인공지능 기반 마케팅 자동화 솔루션을 도입한 중소기업들이 매출 급성장을 기록하고 있다...',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      pubDate: new Date().toISOString(),
      isMarketingRelated: true,
    },
    {
      title: '2024 디지털 마케팅 트렌드 분석',
      link: 'https://www.yonhapnewstv.co.kr/',
      description: '올해 디지털 마케팅 시장에서 주목받는 트렌드와 전략을 분석해본다...',
      thumbnail: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=300&fit=crop',
      pubDate: new Date().toISOString(),
      isMarketingRelated: true,
    },
    {
      title: 'SNS 마케팅 성공 사례와 노하우',
      link: 'https://www.yonhapnewstv.co.kr/',
      description: '소셜미디어를 활용한 마케팅으로 브랜드 인지도를 높인 기업들의 성공 비결...',
      thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
      pubDate: new Date().toISOString(),
      isMarketingRelated: true,
    },
    {
      title: '스타트업 투자 시장 동향 분석',
      link: 'https://www.yonhapnewstv.co.kr/',
      description: '올해 스타트업 투자 시장의 주요 트렌드와 유망 분야를 살펴본다...',
      thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=300&fit=crop',
      pubDate: new Date().toISOString(),
      isMarketingRelated: true,
    },
    {
      title: '소비자 행동 변화와 기업 대응 전략',
      link: 'https://www.yonhapnewstv.co.kr/',
      description: '급변하는 소비자 트렌드에 맞춰 기업들이 취해야 할 마케팅 전략...',
      thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
      pubDate: new Date().toISOString(),
      isMarketingRelated: true,
    },
    {
      title: '브랜드 가치 높이는 콘텐츠 마케팅',
      link: 'https://www.yonhapnewstv.co.kr/',
      description: '효과적인 콘텐츠 마케팅으로 브랜드 가치를 높이는 방법과 사례...',
      thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop',
      pubDate: new Date().toISOString(),
      isMarketingRelated: true,
    },
  ];
}
