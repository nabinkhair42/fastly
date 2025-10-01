// Replace the content of this file with your site's metadata
export const siteConfig = {
  name: 'Fastly',
  description:
    'A starter template for SaaS applications built with Next.js and Tailwind CSS.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  image: '/og-image.webp',
  logo: '/icon.png',
  keywords: ['SaaS', 'Starter', 'Next.js', 'Tailwind CSS', 'Template'],
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
    site_name: 'Fastly',
  },

  twitter: {
    cardType: 'summary_large_image',
    site: '@khairnabin',
    creator: '@khairnabin',
    image: '/og-image.webp',
    description:
      'A starter template for SaaS applications built with Next.js and Tailwind CSS.',
  },
};

export function generateSitemap() {
  const baseUrl = siteConfig.url;
  const routes = ['/', '/changelog', '/docs'];

  return routes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' ? ('daily' as const) : ('weekly' as const),
    priority: route === '' ? 1 : route.startsWith('/dashboard') ? 0.6 : 0.8,
  }));
}
