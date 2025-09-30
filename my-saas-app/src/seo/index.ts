// Replace the content of this file with your site's metadata
export const siteConfig = {
  name: 'My SaaS App',
  description:
    'A sample SaaS application built with Fastly - Next.js starter template for modern web applications.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  image: '/og-image.webp',
  logo: '/icon.png',
  keywords: [
    'SaaS',
    'Sample App',
    'Next.js',
    'Tailwind CSS',
    'Fastly',
    'Template',
    'Demo',
  ],
  twitterHandle: '@khairnabin',

  authors: [
    {
      name: 'Nabin Khair',
      url: 'https://nabinkhair.com.np',
    },
  ],

  creator: 'Nabin Khair',

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    site_name: 'My SaaS App',
  },

  twitter: {
    cardType: 'summary_large_image',
    site: '@khairnabin',
    creator: '@khairnabin',
    image: '/og-image.webp',
    description:
      'A sample SaaS application built with Fastly - Next.js starter template for modern web applications.',
  },
};

export function generateSitemap() {
  const baseUrl = siteConfig.url;
  const routes = [
    '', // Homepage
    '/log-in',
    '/create-account',
    '/forgot-password',
    '/reset-password',
    '/email-verification',
    '/dashboard',
    '/settings',
    '/settings/account',
    '/settings/edit-profile',
    '/settings/change-password',
  ];

  return routes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' ? ('daily' as const) : ('weekly' as const),
    priority: route === '' ? 1 : route.startsWith('/dashboard') ? 0.6 : 0.8,
  }));
}
