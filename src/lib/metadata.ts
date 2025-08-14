import type { Metadata } from 'next';

export const siteConfig = {
  name: 'SaaS Starter - Modern SaaS Foundation',
  description:
    'A comprehensive SaaS starter kit built with Next.js, TypeScript, and modern UI components. Features authentication, user management, and more.',
  url: 'https://starter.nabinkhair.com.np',
  ogImage: 'https://starter.nabinkhair.com.np/og-image.webp',
  links: {
    github: 'https://github.com/nabinkhair42/saas-starter',
    twitter: 'https://twitter.com/khairnabin',
  },
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'SaaS',
    'Starter Kit',
    'Next.js',
    'TypeScript',
    'Authentication',
    'User Management',
    'Modern UI',
    'React',
    'Tailwind CSS',
    'OAuth',
    'JWT',
    'MongoDB',
    'UploadThing',
    'React Hook Form',
    'Zod',
  ],
  authors: [
    {
      name: 'Nabin Khair',
      url: 'https://nabinkhair.com.np',
    },
  ],
  creator: 'Nabin Khair',
  publisher: 'Nabin Khair',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@nabinkhair42',
    site: '@nabinkhair42',
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'technology',
  classification: 'SaaS Starter Kit',
  referrer: 'origin-when-cross-origin',
};
