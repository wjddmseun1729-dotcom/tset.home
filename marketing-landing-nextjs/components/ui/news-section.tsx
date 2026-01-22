'use client';

import { useState, useEffect } from 'react';

interface NewsArticle {
  title: string;
  link: string;
  description: string;
  thumbnail: string;
  pubDate: string;
}

interface NewsResponse {
  success: boolean;
  articles: NewsArticle[];
  lastUpdated: string;
}

export function NewsSection() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // 뉴스 가져오기
  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news');
      const data: NewsResponse = await response.json();

      if (data.articles && data.articles.length > 0) {
        setArticles(data.articles);
        setLastUpdated(data.lastUpdated);
      }
    } catch (error) {
      console.error('뉴스 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 초기 로딩
    fetchNews();

    // 1시간마다 자동 새로고침 (3600000ms = 1시간)
    const interval = setInterval(() => {
      fetchNews();
    }, 3600000);

    return () => clearInterval(interval);
  }, []);

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', {
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  // 로딩 스켈레톤
  if (loading) {
    return (
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-muted rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
                <div className="h-48 bg-muted"></div>
                <div className="p-5">
                  <div className="h-5 bg-muted rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
            마케팅 뉴스
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            최신 마케팅 트렌드 & 인사이트
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            마케팅 업계의 최신 뉴스와 트렌드를 확인하세요. 성공적인 마케팅 전략 수립에 도움이 됩니다.
          </p>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground mt-2">
              마지막 업데이트: {formatDate(lastUpdated)}
            </p>
          )}
        </div>

        {/* 뉴스 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <a
              key={index}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              {/* 썸네일 */}
              <div className="relative h-48 overflow-hidden bg-muted">
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* 외부 링크 아이콘 */}
                <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-gray-700"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </div>
              </div>

              {/* 콘텐츠 */}
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                  {article.description}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    {formatDate(article.pubDate)}
                  </span>
                  <span className="text-primary font-medium group-hover:underline">
                    자세히 보기 →
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* 더보기 버튼 */}
        <div className="text-center mt-10">
          <a
            href="http://www.yonhapnewstv.co.kr/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-border hover:border-primary text-foreground hover:text-primary rounded-full transition-all"
          >
            <span>연합뉴스TV에서 더 많은 뉴스 보기</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
