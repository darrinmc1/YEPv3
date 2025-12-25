import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://yourexitplans.com'
  
  const routes = [
    '',
    '/explore-ideas',
    '/validate-idea',
    '/checkout',
    '/login',
    '/waitlist',
    '/faq',
    '/t&c',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))
}
