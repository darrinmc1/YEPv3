import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://yourexitplans.com'

  return {
    rules: [
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/privacy', '/terms', '/t&c'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/privacy', '/terms', '/t&c'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/privacy', '/terms', '/t&c'],
      },
      {
        userAgent: 'CCBot',
        allow: '/',
        disallow: ['/privacy', '/terms', '/t&c'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/privacy', '/terms', '/t&c'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/privacy', '/terms', '/t&c'],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/private/',
          '/privacy',
          '/terms',
          '/t&c',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
