import { MetadataRoute } from 'next';

const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/static/',
          '/dashboard/',
          '/settings/',
          '/oauth-callback/',
          '/email-verification/',
          '/reset-password/',
        ],
      },
    ],
    sitemap: `${APP_BASE_URL}/sitemap.xml`,
    host: APP_BASE_URL,
  };
}
