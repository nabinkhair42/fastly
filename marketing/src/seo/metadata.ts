import type { Metadata } from "next";

export const siteConfig = {
  name: "Fastly - Modern SaaS Foundation",
  description:
    "A comprehensive Fastly kit built with Next.js, TypeScript, and modern UI components. Features authentication, user management, and more.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://starter.nabinkhair.com.np",
  ogImage: `${process.env.NEXT_PUBLIC_APP_URL || "https://starter.nabinkhair.com.np"}/og-image.webp`,
  links: {
    github: "https://github.com/nabinkhair42/saas-starter",
    twitter: "https://twitter.com/khairnabin",
  },
  author: "Nabin Khair",
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "SaaS",
    "Starter Kit",
    "Next.js",
    "TypeScript",
    "Authentication",
    "User Management",
    "Modern UI",
    "React",
    "Tailwind CSS",
    "OAuth",
    "JWT",
    "MongoDB",
    "UploadThing",
    "React Hook Form",
    "Zod",
    "Full Stack",
    "Open Source",
    "Developer Tools",
    "Web Application",
    "Dashboard",
    "SaaS Template",
    "Boilerplate",
  ],
  authors: [
    {
      name: "Nabin Khair",
      url: "https://nabinkhair.com.np",
    },
  ],
  creator: "Nabin Khair",
  publisher: "Nabin Khair",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
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
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@nabinkhair42",
    site: "@nabinkhair42",
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/icon.png",
    apple: [{ url: "/icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
      noimageindex: false,
      notranslate: false,
    },
  },
  verification: {
    // Add verification IDs when available
    // google: 'your-google-verification-id',
    // yandex: 'your-yandex-verification-id',
    // bing: 'your-bing-verification-id',
  },
  category: "technology",
  classification: "Fastly Kit",
  referrer: "origin-when-cross-origin",
  applicationName: "Fastly",
  generator: "Next.js",
  abstract: "Modern Fastly kit with authentication and user management",
  archives: [siteConfig.links.github],
  assets: [siteConfig.url],
  bookmarks: [siteConfig.url],
};
