// app/sitemap.ts
import { MetadataRoute } from 'next'

// ✅ 실제 배포 도메인으로 교체하세요
const siteUrl = 'https://your-marketing-company.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date()

  return [
    {
      url: siteUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    // ✅ 추가 페이지가 있다면 여기에 추가하세요
    // {
    //   url: `${siteUrl}/about`,
    //   lastModified: currentDate,
    //   changeFrequency: 'monthly',
    //   priority: 0.8,
    // },
    // {
    //   url: `${siteUrl}/services`,
    //   lastModified: currentDate,
    //   changeFrequency: 'weekly',
    //   priority: 0.9,
    // },
    // {
    //   url: `${siteUrl}/blog`,
    //   lastModified: currentDate,
    //   changeFrequency: 'daily',
    //   priority: 0.7,
    // },
    // {
    //   url: `${siteUrl}/contact`,
    //   lastModified: currentDate,
    //   changeFrequency: 'monthly',
    //   priority: 0.6,
    // },
  ]
}
